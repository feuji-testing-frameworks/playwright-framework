# Playwright JavaScript Project

## Overview
This project is a test automation framework built using [Playwright](https://playwright.dev/) for end-to-end testing of web applications. It aims to provide a robust and scalable solution for testing web applications across different browsers and platforms.

## Features
- Cross-browser testing (Chromium, Firefox, WebKit)
- Easy setup and configuration
- Detailed test reports
- Support for modern web testing practices

## Prerequisites
Before you begin, ensure you have met the following requirements:
- [Node.js](https://nodejs.org/) (>=14.x)
- [npm](https://www.npmjs.com/) (>=6.x)

## Getting Started

### Installation
1. **Clone the repository:**
    ```bash
   https://github.com/feuji-testing-frameworks/playwright-framework.git
    cd playwright-js-project
    ```

2. **Install dependencies:**
    ```bash
    npm install @playwright/test
    npm install allure-playwright allure-commandline
    ```

### Configuration
Configure your Playwright settings in the `playwright.config.js` file.

### Running Tests
1. **Run all tests:**
    ```bash
    npx playwright test
    ```

2. **Run a specific test:**
    ```bash
    npx playwright test path/to/test.spec.js
    ```

3. **Generate and view test reports:**
    ```bash
    npx playwright show-report
    ```
4. **Generate and view allure reports :**
    ```
    allure generate allure-results -o allure-report --clean

    allure open allure-report
    ```
