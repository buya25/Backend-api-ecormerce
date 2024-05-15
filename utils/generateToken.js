const jwt = require('jsonwebtoken');

const generateToken =  (user) => {
    return jwt.sign({ user }, process.env.SECRETE, { expiresIn: '7d' });
}

module.exports = generateToken;