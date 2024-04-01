import ENV from "../setup/env";
import { expect, Page, request } from "@playwright/test";

const envUtil = new ENV();

export default class LoginPageObject {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async loginAs(userToken: string) {
    const token = await this.postLoginAndFetchUserAccessToken(userToken);
    await this.page.addInitScript((value: string) => {
      window.localStorage.setItem("auth-token", value);
    }, token);
    return token;
  }

  async postLoginAndFetchUserAccessToken(userToken: string) {
    const apiRequest = await request.newContext();
    const loginResponse = await apiRequest
      .post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/user/login`, { data: { token: userToken } });

    expect(loginResponse.status()).toBe(200);
    const responseJSON: { accessToken: string } = await loginResponse.json();
    return responseJSON.accessToken;
  }
}