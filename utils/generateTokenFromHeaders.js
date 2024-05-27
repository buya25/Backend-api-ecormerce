const getTokenFromHeaders = (req, res) => {
    //Get token from headers
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        throw new Error('Token not found');
    }
    return token;
}

module.exports = getTokenFromHeaders;