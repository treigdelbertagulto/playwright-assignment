import { Page } from "@playwright/test";

export default class NewsFeedPageObject {
  page: Page;

  textField_createPost = '//div[@data-testid="create-post"]';
  textField_postContent = '//textarea[@data-testid="create-post-content"]';
  button_uploadImage = '//div[@aria-label="Attach Photo"]';
  span_addPhotoLabel = '//span[@data-testid="dropdown-area-add-media-text"]';
  input_mediaFileUpload = '//input[@id="mediaFileUpload"]';
  button_schedule = '//div[@aria-label="Schedule"]';
  button_openTimePicker = '//button[@aria-label="Open"]';
  button_post = '//button[@data-testid="create-new-post-button"]';

  input_albumTitle_text = "What's the title of the album?";
  button_createAlbum = '//button[@data-testid="new-album-post-button"]';

  p_newsFeedPostContent = '//p[@data-testid="news-feed-post-content"]';
  img_newsFeedPostImage = '//img[@data-testid="news-feed-post-image"]';

  alert_successfulSchedulingMessage_text = 'Scheduled post successfully set';

  tab_scheduledPosts_text = 'Scheduled Posts';
  img_scheduledPostUserImage = '//img[@data-testid="scheduledpost-post-user-image"]';
  span_scheduledPostUserName = '//span[@data-testid="scheduledpost-post-name"]';
  span_scheduledPostTime = '//span[@data-testid="scheduledpost-post-time"]';
  p_scheduledPostContent = '//p[@data-testid="scheduledpost-post-content"]';
  p_willBePosted_text = 'Will be posted';

  constructor(page: Page) {
    this.page = page;
  }

  async openCreatePostModal() {
    await this.page.locator(this.textField_createPost).click();
  }

  async enterPostContent(value: string) {
    await this.page.locator(this.textField_postContent).fill(value);
  }

  async openImageUploadArea() {
    await this.page.locator(this.button_uploadImage).click();
  }

  async attachImage(filename: string) {
    await this.page.locator(this.input_mediaFileUpload).setInputFiles(filename);
  }

  async setPostSchedule() {
    await this.page.locator(this.button_schedule).click();
    await this.page.locator(this.button_openTimePicker).click();
    await this.page.keyboard.press("ArrowUp");
    await this.page.keyboard.press("Enter");
  }

  async post() {
    await this.page.locator(this.button_post).click();
  }

  async createAlbum(albumLabel: string) {
    const albumFieldId = await this.page.getByText(this.input_albumTitle_text).nth(0).getAttribute("for");
    await this.page.locator(`//input[@id="${albumFieldId}"]`).fill(albumLabel);
    await this.page.keyboard.down("Escape");
    await this.page.locator(this.button_createAlbum).nth(1).click();
  }

  async navigateToScheduledPosts() {
    await this.page.getByText(this.tab_scheduledPosts_text).click();
  }
}