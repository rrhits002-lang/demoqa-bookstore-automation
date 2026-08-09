const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProfilePage } = require('../pages/ProfilePage');
const { BookStorePage } = require('../pages/BookStorePage');
const { writeBookDetailsToFile } = require('../utils/fileWriter');
const testData = require('../testdata/testData.json');

test.describe('DemoQA Book Store - E2E flow', () => {
  test('Login, search a book, validate result, save details, logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const bookStorePage = new BookStorePage(page);

    await test.step('Navigate to demoqa.com and open Book Store login', async () => {
      await loginPage.open();
    });

    await test.step('Login using the manually created user', async () => {
      await loginPage.login(testData.user.username, testData.user.password);
      await profilePage.waitForLoad();
    });

    await test.step('Validate username and logout button after login', async () => {
      const loggedInUsername = await profilePage.getLoggedInUsername();
      expect(loggedInUsername).toContain(testData.user.username);
      expect(await profilePage.isLogoutButtonVisible()).toBeTruthy();
    });

    await test.step('Click Book Store button', async () => {
      await profilePage.goToBookStore();
      await bookStorePage.waitForLoad();
    });

    await test.step(`Search "${testData.search.bookTitle}"`, async () => {
      await bookStorePage.searchBook(testData.search.bookTitle);
    });
    await test.step('Validate search result contains the book', async () => {
      expect(await bookStorePage.isBookPresentInResults(testData.search.bookTitle)).toBeTruthy();
    });

    await test.step('Print Title, Author, Publisher into a file', async () => {
      const details = await bookStorePage.getBookDetails(testData.search.bookTitle);
      console.log('Book Details:', details);

      expect(details.title).toContain(testData.search.bookTitle);
      expect(details.author).not.toBe('');
      expect(details.publisher).not.toBe('');

      const filePath = writeBookDetailsToFile(details);
      console.log(`Book details written to: ${filePath}`);
    });

    await test.step('Logout', async () => {
      await bookStorePage.logout();
    });
  });
});
