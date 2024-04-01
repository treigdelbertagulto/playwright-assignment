import { BrowserContext, expect, Page, test } from "@playwright/test";
import ENV from "../utils/setup/env";
import LoginPageObject from "../utils/modules/login-pageObject";
import NewsFeedPageObject from "../utils/modules/newsFeed-pageObject";

test.describe("News Feed Page UI Automation", () => {
  const envUtil = new ENV();
  let page: Page;
  let loginPageObject: LoginPageObject;
  let newsFeedPageObject: NewsFeedPageObject;
  let context: BrowserContext;

  test.beforeEach(async ({browser}) => {context = await browser.newContext({
      httpCredentials: {
        username: envUtil.getHttpCredentialsUsername(),
        password: envUtil.getHttpCredentialsPassword(),
      },
    });
    page = await context.newPage();
    loginPageObject = new LoginPageObject(page);
    await loginPageObject.loginAs(envUtil.getUserToken());

    await test.step("Given I am on the News Feed Page", async () => {
      await page.goto(`${envUtil.getBaseUrl()}/news-feed`);
      newsFeedPageObject = new NewsFeedPageObject(page)
    })
  });

  test("I should be able to create a scheduled post", async () => {
    const postContent = `${Math.random()}`

    await test.step("Given the Create Post Modal is open", async () => {
      await newsFeedPageObject.openCreatePostModal();
    });

    await test.step("When I enter a text on the Create Post Modal field", async () => {
      await newsFeedPageObject.enterPostContent(postContent);
    });

    await test.step("When I click on the Schedule icon and I select a future time", async () => {
      await newsFeedPageObject.setPostSchedule();
    });

    await test.step("When I click on the Schedule Post button", async () => {
      await newsFeedPageObject.post();
    });

    // #confirmationMessage
    // Scheduled post successfully set
    await test.step("Then Confirmation Message should be displayed, #confirmationMessage", async () => {
      await expect(page.getByText(newsFeedPageObject.alert_successfulSchedulingMessage_text)).toBeVisible();
    });

    await test.step("Scheduled Post should be created successfully", async () => {
      await newsFeedPageObject.navigateToScheduledPosts();
      await expect(page.getByText(postContent)).toBeVisible();
    });
  });

  test("Scheduled Posts Tab should displayed correctly on the News Feed Page", async () => {
    const postContents = [`${Math.random()}`, `${Math.random()}`];

    await test.step("Given we have some dummy content", async () => {
      for (let i = postContents.length - 1; i >= 0; i--) {
        await newsFeedPageObject.openCreatePostModal();
        await newsFeedPageObject.enterPostContent(postContents[i]);
        await newsFeedPageObject.setPostSchedule();
        await newsFeedPageObject.post();
      }
    });

    await test.step("When I click on the Scheduled Posts Tab", async () => {
      await newsFeedPageObject.navigateToScheduledPosts();
    });

    await test.step("Then Scheduled Posts Tab should be displayed", async () => {
      const scheduledPostsTab = page.getByText(newsFeedPageObject.tab_scheduledPosts_text);
      const scheduledPostsTabAriaSelected = await scheduledPostsTab.getAttribute("aria-selected");
      expect(scheduledPostsTabAriaSelected).toBe("true");
    });

    await test.step("Scheduled Posts Tab elements should be displayed correctly", async () => {
      for (let i = 0; i < postContents.length; i++) {
        await expect(page.locator(newsFeedPageObject.img_scheduledPostUserImage).nth(i)).toBeVisible();
        await expect(page.locator(newsFeedPageObject.span_scheduledPostUserName).nth(i)).toBeVisible();
        await expect(page.locator(newsFeedPageObject.span_scheduledPostTime).nth(i)).toBeVisible();

        const postContent = page.locator(newsFeedPageObject.p_scheduledPostContent).nth(i);
        await expect(postContent).toBeVisible();
        await expect(postContent).toHaveText(postContents[i]);

        await expect(page.getByText(newsFeedPageObject.p_willBePosted_text).nth(i)).toBeVisible();
      }
    });
  });

  test("I should be able to create a text with a photo post", async () => {
    const albumTitle = `Fashion ${Math.random()}`
    const imageFilename = "./test-data/sample_image.jpg"

    await test.step("Given Create Post Modal is open", async () => {
      await newsFeedPageObject.openCreatePostModal();
    });

    await test.step("I enter a a text on the Create Post Modal field", async () => {
      await newsFeedPageObject.enterPostContent(albumTitle);
    });

    await test.step("When I click on the Attach Photo icon", async () => {
      await newsFeedPageObject.openImageUploadArea();
    });

    await test.step("Then Add photo should be displayed on the modal", async () => {
      await expect(page.locator(newsFeedPageObject.span_addPhotoLabel)).toHaveText("Add photo");
    });

    await test.step("When I add a photo", async () => {
      await newsFeedPageObject.attachImage(imageFilename);
    });

    await test.step("When I click on the Post button", async () => {
      await newsFeedPageObject.post();
    });

    await test.step("When I create the album for the photo", async () => {
      await newsFeedPageObject.createAlbum(albumTitle);
    });

    await test.step("Created text with a photo post should be displayed on the News Feed Page", async () => {
      await expect(page.locator(newsFeedPageObject.p_newsFeedPostContent).nth(0)).toContainText(albumTitle);
      await expect(page.locator(newsFeedPageObject.img_newsFeedPostImage).nth(0)).toBeVisible();
    });
  })
});