const { test, expect } = require('@playwright/test');
const { FakerDataPage } = require('../pages/api_pages/faker_data');
const logger = require('../tests/utils/logger');

var authToken = 'mocked-token';
var booking_id;

// Mocking function
async function mockApiResponses(page) {
  // Mocking token generation
  await page.route('**/auth', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: authToken })
    });
  });

  // Mocking create booking
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

  // Mocking get booking by ID
  await page.route(`**/booking/${booking_id}`, route => {
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
  });

  await page.route(`**/booking/${booking_id}`, route => {
    if (route.request().method() === 'PUT') {
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
    }
  });
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
  logger.info('New booking created successfully, Booking ID:', booking_id);
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

// test('Mock API PUT Request - Updating the created Booking data', async ({ page }) => {
//     const fakerDataPage = new FakerDataPage();
//     const fakeData = fakerDataPage.fakerData();
//     const response = await page.request.put(process.env.api_base_url + 'booking/' + booking_id, {
//       headers: {
//         'Authorization': `Bearer ${authToken}`
//       },
//       data: fakeData
//     });
//     if (response.status() !== 200) {
//       console.error('PUT request failed with status:', response.status());
//       console.error('Response body:', await response.text());
//     }
//     expect(response.status()).toBe(200);
//     logger.info('Booking data updated successfully for Booking ID:', booking_id, 'Status Code:', response.status());
//   });
  
//   test('Mock API PATCH Request - Partial Updating the created Booking data', async ({ page }) => {
//     const fakerDataPage = new FakerDataPage();
//     const fakeData = fakerDataPage.fakerData();
//     const response = await page.request.patch(process.env.api_base_url + 'booking/' + booking_id, {
//       headers: {
//         'Authorization': `Bearer ${authToken}`
//       },
//       data: fakeData
//     });
//     if (response.status() !== 200) {
//       console.error('PATCH request failed with status:', response.status());
//       console.error('Response body:', await response.text());
//     }
//     expect(response.status()).toBe(200);
//     logger.info('Booking data partially updated successfully for Booking ID:', booking_id, 'Status Code:', response.status());
//   });
  
//   test('Mock API DELETE Request - Deleting the Updated data', async ({ page }) => {
//     const response = await page.request.delete(process.env.api_base_url + 'booking/' + booking_id, {
//       headers: {
//         'Authorization': `Bearer ${authToken}`
//       }
//     });
//     if (response.status() !== 201) {
//       console.error('DELETE request failed with status:', response.status());
//       console.error('Response body:', await response.text());
//     }
//     expect(response.status()).toBe(201);
//     logger.info('Booking data deleted successfully for Booking ID:', booking_id, 'Status Code:', response.status());
//   });