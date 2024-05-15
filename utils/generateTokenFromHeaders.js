const getTokenFromHeaders = req => {
    //Get token from headers
    const headerObj = req.headers;

    const token =  headerObj['authorization'].split(" ")[1];

    if(token !== undefined){
        return token
    }else{
        return{
            status: 403,
            message:"No token provided"
        };
    }
}

module.exports = getTokenFromHeaders;