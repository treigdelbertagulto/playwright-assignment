import ENV from "../setup/env";
import { expect, request } from "@playwright/test";

const envUtil = new ENV();

export default class LoginApi {
  async login(userToken: String) {
    const apiRequest = await request.newContext();

    const response = await apiRequest.post(`${envUtil.getApiBaseUrl()}/twisthrm/api/v1/user/login`, {
      data: { token: userToken },
    });

    expect(response.status()).toBe(200);
    const responseJson: { accessToken: string } = await response.json();
    expect(responseJson.accessToken).toBeTruthy();
    return responseJson.accessToken;
  }
}
