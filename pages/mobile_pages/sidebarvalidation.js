const { executeStep } = require('../../tests/utils/utils')
require('dotenv').config();

exports.SideBarValidation = class SideBarValidation {

    constructor(test,page) {
        this.test = test;
        this.page = page;
        this.sideBarButton = page.locator("//button[@id='react-burger-menu-btn']");
        this.sideBarElement = (element) => page.locator(`//a[@id='${element}']`);
        this.closeButton = page.locator("//button[@id='react-burger-cross-btn']");
    }

    async clickOnSideBarButton() {
        await executeStep(this.test,this.sideBarButton,"click","Click on Side bar button in the home page");
    }

    async clickOnCloseButton() {
        await executeStep(this.test,this.closeButton,"click","Click on close button in home page");
    }
}