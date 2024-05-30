const { test, expect } = require('@playwright/test');
const { TokenGenerationPage } = require('../pages/api_pages/token_generation_page');
require("dotenv").config()
const{FakerDataPage}=require('../pages/api_pages/faker_data');
const { CreateBookingPage } = require('../pages/api_pages/createbookingpage');
const{BookingById}=require('../pages/api_pages/bookingby_id')
const{UpdateBookingPage}=require('../pages/api_pages/update_bookingpage')
const{PartialUpdateBooking}=require('../pages/api_pages/partial_update_booking')
const{DeleteBooking}=require('../pages/api_pages/deletebooking')
const logger = require('../tests/utils/logger');
var authToken;
var booking_id;

test.beforeAll('Token Generation', async({ request }) => {
  const tokengeneration = new TokenGenerationPage(request);
  authToken = await tokengeneration.tokenGeneration(process.env.api_base_url+"auth");
  expect(authToken).not.toBeUndefined();
  logger.info('Token generated successfully:', authToken);
});

test.beforeAll('Api POST Request - Creating new Booking', async({ request }) => {
    const createBooking = new CreateBookingPage(request)
    const fakerDataPage = new FakerDataPage();
    const fakeData =  fakerDataPage.fakerData()
    const postResponse = await createBooking.createbooking(authToken,fakeData,process.env.api_base_url+"booking");
    expect(postResponse.status()).toBe(200);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody.booking_id).not.toBeNull();
    booking_id = postResponseBody.bookingid;
    logger.info('New booking created successfully, Booking ID:', booking_id);
  })
  test(' Api GET request-Booking by Ids', async({ request }) => {
    const bookingIds = new BookingById(request);
    const getResponse = await bookingIds.getBookingIds(process.env.api_base_url+"booking");
    expect(getResponse.status()).toBe(200);
    console.log("----------------------", getResponse.status())
    const getResponseBody = await getResponse.json();
    expect(getResponseBody.length).toBeGreaterThanOrEqual(1);
    logger.info('Booking IDs response body:', getResponseBody);
  })
  test('Api GET request- get Booking Data', async({ request }) => {
    const bookingsById = new BookingById(request);
    const getOneResponse = await bookingsById.getBookingsById(process.env.api_base_url+"booking/"+booking_id);
    expect(getOneResponse.status()).toBe(200);
    logger.info('Booking data fetched successfully for Booking ID:', booking_id, 'Status Code:', getOneResponse.status());
  })
  test('Api PUT Request - Updating the created Booking data', async({ request }) => {
    const updateBooking = new UpdateBookingPage(request);
    const fakeDataPage = new FakerDataPage();
    const fakeData =  fakeDataPage.fakerData()
    const putResponse = await updateBooking.updateTheBooking(authToken,fakeData,process.env.api_base_url+"booking/"+booking_id);
    expect(putResponse.status()).toBe(200);
    logger.info('Booking data updated successfully for Booking ID:', booking_id, 'Status Code:', putResponse.status());
  })
  
  test('Api PATCH Request - Partial Updating the created Booking data', async({ request }) => {
    const partialUpdateBooking = new PartialUpdateBooking(request);
    const fakeDataPage = new FakerDataPage();
    const fakeData =  fakeDataPage.fakerData()
    const updateResponse = await partialUpdateBooking.partialUpdateTheBooking(authToken,fakeData,process.env.api_base_url+"booking/"+booking_id);
    expect(updateResponse.status()).toBe(200);
    logger.info('Booking data partially updated successfully for Booking ID:', booking_id, 'Status Code:', updateResponse.status());

  })
  
  test('Api Delete Request - Deleting the Updated data', async({ request }) => {
    const deleteBooking = new DeleteBooking(request);
    const deleteResponse = await deleteBooking.deleteBookingById(authToken,process.env.api_base_url+"booking/"+booking_id);
    expect(deleteResponse.status()).toBe(201);
    logger.info('Booking data deleted successfully for Booking ID:', booking_id, 'Status Code:', deleteResponse.status());

  })
