const jwt = require('jsonwebtoken');


const verifyToken = token => {
    return jwt.verify(token, process.env.SECRET, (err, decoded)=> {
        if (err) throw err;
        else return decoded;
    });
}

module.exports = verifyToken;