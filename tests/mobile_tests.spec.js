const { test,expect } = require('@playwright/test');
const { _android: android } = require('playwright');
const { LoginPage } = require('../pages/mobile_pages/loginpage');
require('dotenv').config()
const data = require('../data/mobile_data.json');
const { AddToCartPage } = require('../pages/mobile_pages/addToCartpage');
const { CheckoutPage } = require('../pages/mobile_pages/checkoutpage');
const { SideBarValidation } = require('../pages/mobile_pages/sidebarvalidation');

let context,device,page;
let loginPage,addToCartPage,checkoutPage,sideBarValidation

test.beforeAll('Launch Emulator', async () => {
  [device] = await android.devices();
  await device.shell('pm clear com.android.chrome');
  await device.shell('am force-stop com.android.chrome');
});

test.beforeEach('Launch Browser', async () => {
  test.setTimeout(60000);
  context = await device.launchBrowser();
  page = await context.newPage();
  await page.goto(process.env.mobileBaseUrl);
  await device.shell('input keyevent 4'); 
  loginPage = new LoginPage(test,page)
  addToCartPage = new AddToCartPage(test,page)
  checkoutPage = new CheckoutPage(test,page)
  sideBarValidation = new SideBarValidation(test,page)
});

test("Testing the login functionality with Valid credentials", async () => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await loginPage.loginFunctionality(process.env.standarduser, process.env.password)
  expect(await loginPage.appTitle).toHaveText(data.applogoText);
});

test("Testing the logout functionality" , async () => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  expect(await loginPage.appTitle).toHaveText(data.applogoText);
  await loginPage.logoutFunctionality();
})

test("Testing the add to cart functionality" , async () => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
  expect(await loginPage.appTitle).toHaveText(data.applogoText);
  await addToCartPage.addProductsToCart();
  expect(parseInt(await addToCartPage.cartCount.textContent())).toBeGreaterThan(0);
  await loginPage.logoutFunctionality();
})

test("Testing the checkout functionality", async() => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
  expect(await loginPage.appTitle).toHaveText(data.applogoText);
  await addToCartPage.addProductsToCart();
  await checkoutPage.checkoutFunctionality(data.firstname,data.lastname,data.postalcode);
  expect(await checkoutPage.orderConfirmationMsg).toHaveText(data.orderConfirmationMsg);
  await checkoutPage.clickOnBackToHomeButton();
  await loginPage.logoutFunctionality();
})

test("Testing the elements present in the side bar" , async () => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
  expect(await loginPage.appTitle).toHaveText(data.applogoText);
  await sideBarValidation.clickOnSideBarButton();
  for (var element of data.sideBarIds) {
      expect(sideBarValidation.sideBarElement(element)).toBeVisible();
  }
  await sideBarValidation.clickOnCloseButton();
  await page.waitForTimeout(parseInt(process.env.small_timeout))
  await loginPage.logoutFunctionality();
})

test.afterEach('Close Context', async () => { 
  
    await page.close();
    await context.close();
    await device.shell('pm clear com.android.chrome');
});

test.afterAll('Close Emulator', async () => {
    await device.close();
});

