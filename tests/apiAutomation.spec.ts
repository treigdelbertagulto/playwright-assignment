import { expect, request, test } from "@playwright/test";
import ENV from "../utils/setup/env";
import LoginApi from "../utils/api/login-api";
import SkillApi from "../utils/api/skill-api";
import EmployeeApi from "../utils/api/employee-api";

test.describe("Skill API Automation", () => {
  const envUtil = new ENV();
  const postLoginApi = new LoginApi();
  let skillApi: SkillApi;

  test.beforeEach(async () => {
    await test.step("Fetch auth token from Login API", async () => {
      const accessToken = await postLoginApi.login(envUtil.getUserToken());
      skillApi = new SkillApi(accessToken);
    });
  });

  test("As an Admin, I should be able to add skills upon passing valid token", async () => {
    const skill = `Skill ${Math.random()}`
    const response = await skillApi.postAddSkills([skill]);
    expect(response.message).toBe("Successfully saved!");
    expect(response.affectedRows).toBe(1);
  });

  test("As an Admin, search result must be related to the search keyword", async () => {
    let skill: string;

    await test.step("Add a sample skill", async () => {
      skill = `Skill ${Math.random()}`
      await skillApi.postAddSkills([skill]);
    });

    const searchResults = await skillApi.getSearchSkills(skill);
    expect(searchResults.totalRecords).toBe(1);
    expect(searchResults.skills[0].name).toBe(skill);
  });
});

test.describe("Employee API Automation", async () => {
  const envUtil = new ENV();
  const postLoginApi = new LoginApi();
  let employeeApi: EmployeeApi;

  test.beforeEach(async () => {
    await test.step("Fetch auth token from Login API", async () => {
      const accessToken = await postLoginApi.login(envUtil.getUserToken());
      employeeApi = new EmployeeApi(accessToken);
    });
  });

  test("As an HR Personnel, I should be able to fetch a specific employee using a valid token", async () => {
    const employees = await employeeApi.getEmployeeById("2714");
    expect(employees.length).toBe(1);
    const employee = employees[0];
    expect(employee.systemId).toBe(2714);
    expect(employee.employeeId).toBe("013124-091");
    expect(employee.firstName).toBe("Eigdelbert Hamuel");
    expect(employee.lastName).toBe("AGULTO");
    expect(employee.birthdate).toBe("2002-12-12T00:00:00.000Z");
    expect(employee.trEmail).toBe("eigdelbert.agulto@tooltwist.com");
    expect(employee.currentPosition).toBe("Intern");
    expect(employee.department).toBe("Interns");
    expect(employee.contact).toBe("639979112907");
    expect(employee.status).toBe("OJT");
  });
});