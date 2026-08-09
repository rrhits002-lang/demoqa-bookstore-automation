const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

/**
 * BookStorePage - https://demoqa.com/books
 * Handles searching the catalogue and reading Title/Author/Publisher
 * out of the results table (a react-table grid).
 */
class BookStorePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchBox = page.locator('#searchBox');
    this.resultRows = page.locator('table tbody tr');
    this.logoutButton = page.getByRole('button', { name: /log out/i });
  }

  async waitForLoad() {
    await this.searchBox.waitFor({ state: 'visible' });
    await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
  }

  async searchBook(title) {
    await this.fill(this.searchBox, title);
    await this.page.waitForTimeout(500);
  }


  getRowByTitle(title) {
    return this.resultRows.filter({ hasText: title });
  }

  async isBookPresentInResults(title) {
    const row = this.getRowByTitle(title).first();
    try {
      // Auto-retrying wait (up to 15s) instead of a one-shot count() check
      await expect(row).toBeVisible({ timeout: 15000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reads Title, Author, Publisher for the row matching the given title.
   * Column order in the results grid is: Title | Author | Publisher
   */
  async getBookDetails(title) {
    const row = this.getRowByTitle(title).first();
    await expect(row).toBeVisible({ timeout: 15000 });

    const cells = row.locator('td');
    const bookTitle = (await cells.nth(1).innerText()).trim();
    const author = (await cells.nth(2).innerText()).trim();
    const publisher = (await cells.nth(3).innerText()).trim();

    return { title: bookTitle, author, publisher };
  }

  async logout() {
    await this.click(this.logoutButton);
  }
}

module.exports = { BookStorePage };