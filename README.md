# DemoQA Book Store Automation (Playwright + JavaScript)

Hybrid framework: Page Object Model (structure/reusability) + JSON test data
(data-driven) + Playwright Test runner (execution/assertions/reporting).

## Prerequisite (manual, per task instructions)
Before running the suite, manually register a user on the Book Store app:
1. Go to https://demoqa.com/login and click **New User**.
2. Register with:
   - Username: `rrhits`
   - Password: `Rohit@2026`

This is a one-time manual step — registration is intentionally NOT automated.

## Project structure
```
demoqa-bookstore-automation/
├── pages/
│   ├── BasePage.js        # shared helpers (click/fill/getText/etc.)
│   ├── LoginPage.js        # /login page
│   ├── ProfilePage.js      # /profile page (username, logout, "Book Store" nav)
│   └── BookStorePage.js    # /books page (search, results, book details)
├── tests/
│   └── bookstore.spec.js   # the end-to-end test, in Playwright test.step()s
├── testdata/
│   └── testData.json       # credentials + book to search (edit here, not in tests)
├── utils/
│   └── fileWriter.js       # writes Title/Author/Publisher to output/bookDetails.txt
├── output/                 # generated at runtime — bookDetails.txt lands here
├── playwright.config.js
└── package.json
```

## Setup
```bash
npm install
npx playwright install --with-deps chromium
```

## Run
```bash
npm test              # headless
npm run test:headed   # see the browser
npm run test:debug    # step through with the Playwright inspector
npm run report        # open the HTML report after a run
```

## What the test does
1. Opens https://demoqa.com/login
2. Logs in with the manually created user (`rrhits` / `Rohit@2026`)
3. Validates the logged-in username and the presence of the **Log out** button
4. Clicks **Book Store**
5. Searches `Learning JavaScript Design Patterns`
6. Validates the book is present in the search results
7. Reads Title, Author, Publisher from the result row and writes them to
   `output/bookDetails.txt`
8. Logs out

## Notes / things to double check on your machine
- DemoQA's markup shifts occasionally. If a selector doesn't match, the most
  likely spots to fix are in `LoginPage.js` (`#userName`, `#password`, `#login`)
  and `BookStorePage.js` (`#searchBox`, `.rt-tbody .rt-tr-group`, `.rt-td`
  column order). Everything is centralized in the page objects, so a locator
  fix in one place covers every test that uses it.
- I couldn't execute this against the live site from here (no network access
  to demoqa.com in this environment), so run it locally and adjust any
  locator that doesn't match your DOM.
