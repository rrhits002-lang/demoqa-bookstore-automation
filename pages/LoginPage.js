const { BasePage } = require('./BasePage');

/**
 * LoginPage - https://demoqa.com/login
 * NOTE: New user registration is done manually (per task instructions),
 * this page object only handles logging in with an already-created user.
 */
class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
    // Shown when login fails - useful for debugging, not asserted on happy path
    this.errorMessage = page.locator('#name');
  }

  async open() {
    await this.goto('/login');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }
}

module.exports = { LoginPage };
