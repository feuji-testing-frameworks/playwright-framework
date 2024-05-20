const { test, expect } = require('@playwright/test')
require('dotenv').config();
const indexPage = require('../pages/ui_pages/indexpage')
const data = require('../data/ui_data.json')

var loginPage
test.beforeEach("Launch URL" , async ({ page }) => {
    loginPage = new indexPage.LoginPage(test,page);
    await loginPage.launchUrl(process.env.baseUrl);
    await page.waitForTimeout(parseInt(process.env.small_timeout));
})

test("Testing the login functionality with Valid credentials" , async ({ page }) => {
    await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
    await expect(await loginPage.appTitle).toHaveText(data.applogoText);
})

test("Testing the login functionality with locked user and password" , async ({ page }) => {
    await loginPage.loginFunctionality(process.env.lockedUser,process.env.password);
    await expect(await loginPage.errorMsg).toBeVisible();
})

test("Testing the logout functionality" , async ({ page }) => {
    await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
    await expect(await loginPage.appTitle).toHaveText(data.applogoText);
    await loginPage.logoutFunctionality();
})
