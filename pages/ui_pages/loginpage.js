const { executeStep } = require('../../tests/utils/utils')
require('dotenv').config();

exports.LoginPage = class LoginPage {
    constructor(test,page) {
        this.test = test;
        this.page = page;
        this.usernameInput = page.locator("//input[@id='user-name']");
        this.passwordInput = page.locator("//input[@id='password']");
        this.loginButton = page.locator("//input[@id='login-button']");
        this.errorMsg = page.locator("//h3[text()='Epic sadface: Sorry, this user has been locked out.']");
        this.appTitle = page.locator("//div[@class='app_logo']");
        this.openMenuButton = page.locator("//button[@id='react-burger-menu-btn']");
        this.logoutButton = page.locator("//a[@id='logout_sidebar_link']");
    }

    async launchUrl(url) {
        await this.page.goto(url);
    }

    async loginFunctionality(username,password) {
        await executeStep(this.test,this.usernameInput,"fill","Enter the username",username);
        await executeStep(this.test,this.passwordInput,"fill","Enter the password",password);
        await executeStep(this.test,this.loginButton,"click","Click on the login button");
    }

    async logoutFunctionality() {
        await executeStep(this.test,this.openMenuButton,"click","Enter the open menu button");
        await executeStep(this.test,this.logoutButton,"click","Click on logout button");
    }
}