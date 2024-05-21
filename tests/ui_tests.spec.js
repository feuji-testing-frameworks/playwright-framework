const { test, expect } = require('@playwright/test')
require('dotenv').config();
const indexPage = require('../pages/ui_pages/indexpage')
const data = require('../data/ui_data.json')

var loginPage,homePage,checkoutPage
test.beforeEach("Launch URL" , async ({ page }) => {
    loginPage = new indexPage.LoginPage(test,page);
    homePage = new indexPage.HomePage(test,page);
    checkoutPage = new indexPage.CheckoutPage(test,page);
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

test("Testing the add to cart functionality" , async ({ page }) => {
    await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
    await expect(await loginPage.appTitle).toHaveText(data.applogoText);
    await homePage.addProductsToCart();
    await expect(parseInt(await homePage.cartCount.textContent())).toBeGreaterThan(0);
    await loginPage.logoutFunctionality();
})

test("Testing the checkout functionality", async({ page }) => {
    await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
    await expect(await loginPage.appTitle).toHaveText(data.applogoText);
    await homePage.addProductsToCart();
    await checkoutPage.checkoutFunctionality(data.firstname,data.lastname,data.postalcode);
    await expect(await checkoutPage.orderConfirmationMsg).toHaveText(data.orderConfirmationMsg);
    await checkoutPage.clickOnBackToHomeButton();
    await loginPage.logoutFunctionality();
})
