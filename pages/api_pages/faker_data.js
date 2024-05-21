const faker = require('faker')

exports.FakerDataPage = class FakerDataPage{

    fakerData(){
        const data = {
            firstname : faker.name.firstName(),
            lastname : faker.name.lastName(),
            totalprice : faker.datatype.number(),
            depositpaid : faker.datatype.boolean(),
            bookingdates : {
                checkin : faker.date.past().toISOString(),
                checkout : faker.date.future().toISOString(),
            },
            additionalneeds : faker.random.words()
        }
        return data;
    }
}