/**
 * BasePage
 * Holds reusable, generic actions that every Page Object can inherit.
 * Keeping these here avoids duplicating waits/click/type logic in every page class.
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async click(locator) {
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async fill(locator, value) {
    await locator.click();
    await locator.fill(value);
  }

  async getText(locator) {
    return (await locator.innerText()).trim();
  }

  async isVisible(locator) {
    return locator.isVisible();
  }
}

module.exports = { BasePage };
