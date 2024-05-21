exports.TokenGenerationPage = class TokenGenerationPage {
  
    constructor(request){
        this.request = request
    }
    async tokenGeneration(URL){
        let authToken;
        const response = await this.request.post(URL,{   
            data:{
                username : "admin",
                password : "password123"
            }
        });
        if (response.status() === 200) {
            const responseBody = await response.json();                                                             
            authToken = responseBody.token;     
        } else {
            console.error('Login failed:', response.status());        
        }
        return authToken;
    }
}