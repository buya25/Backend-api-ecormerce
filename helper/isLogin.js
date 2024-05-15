const getTokenFromHeaders = require("../utils/generateTokenFromHeaders");
const verifyToken = require("../utils/verifyToken");


const isLogin = (req, res, next) => {
    //get the token from the header
    const token  = getTokenFromHeaders(req);

    //verify the token
    const  verified_user = verifyToken(token);
    
    //get the user id of the token
    // console.log(verified_user);

    req.userAuth = verified_user.user;
    
    console.log(verified_user.user);

    // req.userAuth = userAuth._id;

    if(verified_user){
        next();
    } else {
        return res.status(403).json("Expired Token, please login back");
    }
    //save the user into req obj
}

module.exports = isLogin;