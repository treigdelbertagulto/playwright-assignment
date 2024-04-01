import ENV from "../setup/env";
import { expect, request } from "@playwright/test";

const envUtil = new ENV();

interface PostAddSkillResponse {
  message: string,
  affectedRows: number,
}

interface GetSearchSkillsResponse {
  skills: [
    {
      id: number,
      name: string,
      isDeleted: number,
    }
  ],
  page: number,
  totalRecords: number,
  pageSize: number,
}

export default class SkillApi {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async postAddSkills(skills: string[]) {
    const apiRequest = await request.newContext();

    const response = await apiRequest.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/skill/create`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
      data: { name : skills },
    });

    expect(response.status()).toBe(200);
    const responseJson: PostAddSkillResponse = await response.json();
    return responseJson;
  }

  async getSearchSkills(keyword: string) {
    const apiRequest = await request.newContext();

    const url = `${envUtil.getApiBaseUrl()}/twisthrm/api/v1/skill?keyword=${keyword}&page=1&pageSize=10&sort=name ASC`;
    const response = await apiRequest.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseJson: GetSearchSkillsResponse = await response.json();
    return responseJson;
  }
}