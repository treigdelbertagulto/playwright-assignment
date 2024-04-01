import ENV from "../setup/env";
import { expect, request } from "@playwright/test";

const envUtil = new ENV();

interface EmployeeInfo {
  systemId: number,
  employeeId: string,
  firstName: string,
  lastName: string,
  birthdate: string,
  trEmail: string,
  currentPosition: string,
  department: string,
  contact: string,
  status: string,
}

export default class EmployeeApi {
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getEmployeeById(employeeId: string) {
    const apiRequest = await request.newContext();

    const url = `${envUtil.getApiBaseUrl()}/twisthrm/api/v1/employee/${employeeId}`;
    const response = await apiRequest.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    expect(response.status()).toBe(200);
    const responseJson: EmployeeInfo[] = await response.json();
    return responseJson;
  }
}