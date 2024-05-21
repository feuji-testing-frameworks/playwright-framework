exports.DeleteBooking = class DeleteBooking{
    constructor(request){
        this.request = request
    }

    async deleteBookingById(authToken,URL){
        const deleteresponse = await this.request.delete(URL, {
        headers: {
          Cookie : `token=${authToken}`,
        }
      });
     
      return deleteresponse;
    }
}