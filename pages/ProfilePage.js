const { BasePage } = require('./BasePage');

/**
 * ProfilePage - https://demoqa.com/profile
 * This is where the user lands after a successful login.
 * Header nav (present on Profile + Book Store pages once logged in) has
 * "Book Store" and "Log out" buttons, which is why we expose both here.
 */
class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: /Logout/i });
    this.bookStoreButton = page.getByRole('button', { name: /Book Store/i });
  }

  async waitForLoad() {
    await this.userNameValue.waitFor({ state: 'visible' });
  }

  async getLoggedInUsername() {
    return this.getText(this.userNameValue);
  }

  async isLogoutButtonVisible() {
    return this.isVisible(this.logoutButton);
  }

  async goToBookStore() {
    await this.click(this.bookStoreButton);
  }

  async logout() {
    await this.click(this.logoutButton);
  }
}

module.exports = { ProfilePage };
