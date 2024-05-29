// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [ ['html'] , [
    "allure-playwright",
    {
      detail: true,
      outputFolder: "allure-results",
      suiteTitle: false,
    },
  ],],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless : false,
    timeout: 5 * 60 * 1000,
    expect: {
      timeout: 5 * 60 * 1000,
    },
  },

  /* Configure projects for major browsers */
  projects: [
     // UI Testing
     {
      name: 'UI Tests',
      use: {
        // Add your UI-specific configuration here
        browserName: 'chromium', // or 'firefox', 'webkit'
        // Add any additional UI-specific settings here
      },
      testMatch: 'tests/ui_tests.spec.js'
    },

    // API Testing
    {
      name: 'API Tests',
      use: {
        // Add your API-specific configuration here
        // For example, you might use Axios or another HTTP library for API testing
      },
      testMatch: 'tests/api_tests.spec.js'
    },

    // Mobile Testing
    {
      name: 'Mobile Tests',
      use: { ...devices['Pixel 4'] }, // or any other mobile device configuration
      testMatch : 'tests/mobile_tests.spec.js'
    },

    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
  

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 4'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

