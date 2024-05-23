const { executeStep } = require('../../tests/utils/utils')
require('dotenv').config();

exports.CheckoutPage = class CheckoutPage {
    constructor(test,page) {
        this.test = test;
        this.page = page;
        this.cartLink = page.locator("//a[@class='shopping_cart_link']");
        this.checkoutButton = page.locator("//button[@id='checkout']");
        this.firstnameInput = page.locator("//input[@id='first-name']");
        this.lastnameInput = page.locator("//input[@id='last-name']");
        this.postalcodeInput = page.locator("//input[@id='postal-code']");
        this.continueButton = page.locator("//input[@id='continue']");
        this.finishButton = page.locator("//button[@id='finish']");
        this.orderConfirmationMsg = page.locator("//h2[@class='complete-header']");
        this.backToProductsButton = page.locator("//button[@id='back-to-products']");
    }

    async checkoutFunctionality(firstname,lastname,postalcode) {
        await executeStep(this.test,this.cartLink,"click","Click on Cart in the home page");
        await executeStep(this.test,this.checkoutButton,"click","Click on checkout button in add to cart page");
        await executeStep(this.test,this.firstnameInput,"fill","Enter firstname of a user",firstname);
        await executeStep(this.test,this.lastnameInput,"fill","Enter the lastname of a user",lastname);
        await executeStep(this.test,this.postalcodeInput,"fill","Enter the postalcode of a user",postalcode);
        await executeStep(this.test,this.continueButton,"click","Click on continue button in checkout page");
        await executeStep(this.test,this.finishButton,"click","Click on finish button");
    }

    async clickOnBackToHomeButton() {
        await executeStep(this.test,this.backToProductsButton,"click","Click on Back to home button");
    }
}