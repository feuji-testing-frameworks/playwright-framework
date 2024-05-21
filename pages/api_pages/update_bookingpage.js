exports.UpdateBookingPage = class UpdateBookingPage{
    constructor(request){
        this.request = request
    }

    async updateTheBooking(authToken,fakeData,URL){
        const putResponse = await this.request.put(URL,{
        headers :{
          Cookie : `token=${authToken}`
        },
        data : fakeData
      })
      return putResponse;
    }
}