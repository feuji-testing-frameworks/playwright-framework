const { test, expect } = require('@playwright/test');
const { FakerDataPage } = require('../pages/api_pages/faker_data');
const faker = require('faker');
const logger = require('../tests/utils/logger');
var authToken = 'mocked-token';
var booking_id;

// Mocking function
async function mockApiResponses(page) {
    await page.route('**/auth', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ token: authToken })
        });
    });

    await page.route('**/booking', route => {
        if (route.request().method() === 'POST') {
            booking_id = faker.datatype.uuid();
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ bookingid: booking_id })
            });
        } else if (route.request().method() === 'GET') {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ bookingid: booking_id }])
            });
        }
    });

    await page.route(`**/booking/${booking_id}`, route => {
        if (route.request().method() === 'GET') {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    firstname: 'John',
                    lastname: 'Doe',
                    totalprice: 123,
                    depositpaid: true,
                    bookingdates: {
                        checkin: '2021-01-01',
                        checkout: '2021-01-02'
                    },
                    additionalneeds: 'Breakfast'
                })
            });
        } else if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
            const headers = route.request().headers();
            if (headers['authorization'] === `Bearer ${authToken}`) {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Booking updated successfully' })
                });
            } else {
                route.fulfill({
                    status: 403,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Forbidden' })
                });
            }
        } else if (route.request().method() === 'DELETE') {
            route.fulfill({
                status: 201,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Booking data deleted successfully' })
            });
        }
    });
    // await page.route(`**/booking/${id}`, route => {
    //     if (route.request().method() === 'PUT') {

    //     }
    // });
}
test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await mockApiResponses(page);
});

test('Mock API POST Request - Creating new Booking', async ({ page }) => {
    const fakerDataPage = new FakerDataPage();
    const fakeData = fakerDataPage.fakerData();
    const response = await page.request.post(process.env.api_base_url + 'booking', {
        data: fakeData
    });
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.bookingid).not.toBeNull();
    booking_id = responseBody.bookingid;
    logger.info("create booking successful")
});

test('Mock API GET Request - Booking by Ids', async ({ page }) => {
    const response = await page.request.get(process.env.api_base_url + 'booking');
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.length).toBeGreaterThanOrEqual(1);
    logger.info('Booking IDs response body:', responseBody);
});

test('Mock API GET Request - Get Booking Data', async ({ page }) => {
    const response = await page.request.get(process.env.api_base_url + 'booking/' + booking_id);
    expect(response.status()).toBe(200);
    logger.info('Booking data fetched successfully for Booking ID:', booking_id, 'Status Code:', response.status());
});

test("Mock API PUT Request - Update the booking data based on booking id", async ({ page }) => {
    await page.route(`**/booking/${booking_id}` , async route => {
        const json = { "bookingid" : booking_id , "firstname" : "James", "lastname" : "Bond", "totalprice" : 111,
        "depositpaid" : true,
        "bookingdates" : {
            "checkin" : "2018-01-01",
            "checkout" : "2019-01-01"
        },
        "additionalneeds" : "Breakfast"}
        await route.fulfill({
            status : 200,
            json })
    })
 
    await page.goto(`${process.env.api_base_url}/booking/${booking_id}`);
    const data = await page.textContent('body')
    const jsonData = JSON.parse(data)
    console.log(jsonData);
    logger.info("updated booking details successful")
    expect(jsonData.firstname).toBe("James");
    expect(jsonData.lastname).toBe("Bond");
    expect(jsonData.bookingid).toBe(booking_id);

})

test("Mock API Request- Update partial booking data", async ({ page }) => {
    await page.route(`**/booking/${booking_id}`, async route => {
        const json = { "firstname" : "Ghost", "lastname" : "Rider"}
        await route.fulfill({ json })
    })
    await page.goto(`${process.env.api_base_url}/booking/${booking_id}`);
    const data = await page.textContent('body');
    const jsonData = JSON.parse(data);
    expect(jsonData.firstname).toBe("Ghost")
    expect(jsonData.lastname).toBe("Rider")
    logger.info("upated partial booking data")
})
test("Mock API Request - Delete data with booking id", async ({ page }) => {
    await page.route(`**/booking/${booking_id}`, async route => {
        const json = { "message" : "Booking data is deleted successfully"}
        await route.fulfill({ json })
    })
    await page.goto(`${process.env.api_base_url}/booking/${booking_id}`);
    const data = await page.textContent('body');
    const jsonData = JSON.parse(data)
    expect(jsonData.message).toBe("Booking data is deleted successfully");
    logger.info("deleted booking details by booking id")
})
