exports.BookingById = class BookingById{
    constructor(request){
        this.request = request
    }

    async getBookingsById(URL){
        const getOneResponse = await this.request.get(URL)
        return getOneResponse;
    }
    async getBookingIds(URL){
        const getResponse = await this.request.get(URL)
        return getResponse;
    }
}