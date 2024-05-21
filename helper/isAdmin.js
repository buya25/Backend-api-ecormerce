const { User } = require("../models/user");
const getTokenFromHeaders = require("../utils/generateTokenFromHeaders");
const verifyToken = require("../utils/verifyToken");

const isAdmin =async (req, res, next) => {
    //get the token from the header
    const token  = getTokenFromHeaders(req);
    
    //verify the token
    const  verified_user = verifyToken(token);

    req.userAuth = verified_user.userId;

    // console.log(verified_user);
    //Find the user in DB
    const user = await User.findById(verified_user.userId);
    //Check if user is Admin
    if(!user.isAdmin){
        //return a json response
        res.json({
            status: "fail",
            message:"You are not authorized to perform this action"
        });
    }else{
        return next();
    }

}

module.exports = isAdmin;