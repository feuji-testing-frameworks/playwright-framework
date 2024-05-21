exports.CreateBookingPage = class CreateBookingPage{

    constructor(request){
        this.request = request
    }
    async createbooking(authToken,fakeData,URL){
        const postResponse = await this.request.post(URL,{
        headers : {
          Cookie : `token=${authToken}`
        },
        data : fakeData
        })
      return postResponse;
    }
}