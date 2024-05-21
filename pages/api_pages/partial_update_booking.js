
exports.PartialUpdateBooking = class PartialUpdateBooking{
    constructor(request){
        this.request = request
    }

    async partialUpdateTheBooking(authToken,fakeData,URL){
        const updateResponse = await this.request.patch(URL,{
        headers :{
          Cookie : `token=${authToken}`
        },
        data : {
            firstname : fakeData.firstname,
            lastname : fakeData.lastname
        }
      })
      return updateResponse;
    }
}