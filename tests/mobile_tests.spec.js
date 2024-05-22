const { test,expect } = require('@playwright/test');
const { _android: android } = require('playwright');
const { LoginPage } = require('../pages/mobile_pages/loginpage');
require('dotenv').config()
const data = require('../data/mobile_data.json')

let context;
let device;
let page;
let loginPage

test.beforeAll('Launch Emulator', async () => {
  [device] = await android.devices();
  //await device.shell('am force-stop com.android.chrome');
});

test.beforeEach('Launch Browser', async () => {
  context = await device.launchBrowser();
  page = await context.newPage();
  loginPage = new LoginPage(test,page)
  await page.goto(process.env.mobileBaseUrl);
});

test("Testing the login functionality with Valid credentials", async () => {
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await loginPage.loginFunctionality(process.env.standarduser, process.env.password)
  await expect(await loginPage.appTitle).toHaveText(data.applogoText);
});

test("Testing the logout functionality" , async () => {
  await loginPage.loginFunctionality(process.env.standarduser,process.env.password);
  await page.waitForTimeout(parseInt(process.env.medium_timeout));
  await expect(await loginPage.appTitle).toHaveText(data.applogoText);
  await loginPage.logoutFunctionality();
})

test.afterEach('Close Context', async () => {
  if (context) {
    console.log('Closing context...');
    await page.close();
    await context.close();
    console.log('Context closed.');
  } else {
    console.log('No context to close.');
  }
});

test.afterAll('Close Emulator', async () => {
  if (device) {
    console.log('Closing emulator...');
    await device.shell('am force-stop com.android.chrome');
    await device.close();
    console.log('Emulator closed.');
  } else {
    console.log('No emulator to close.');
  }
});

