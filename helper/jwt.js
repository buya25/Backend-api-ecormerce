// Import the expressjwt function from the "express-jwt" module
const { expressjwt } = require('express-jwt')
const { User } = require('../models/user')

// Retrieve the API base URL from environment variables
const api = process.env.API_URL

// Define a function called authJwt
function authJwt() {
    // Retrieve the JWT secret key from environment variables
    const secret = process.env.SECRET
    // Return a middleware function that validates JWT tokens
    return expressjwt({
        secret, // Secret key used for JWT verification
        algorithms: ['HS256'], // Specify the algorithms used to sign the JWT tokens
    }).unless({
        // Specify paths that are exempt from JWT token verification
        path: [
            // Paths for retrieving product and category data (GET requests and OPTIONS requests)
            { url: `/\/api\/v1\/products(.*)`, methods: ['GET', 'OPTIONS'] },
            { url: `/\/api\/v1\/categories(.*)`, methods: ['GET', 'OPTIONS'] },
            { url: `/\/api\/v1\/oders(.*)`, methods: ['GET', 'OPTIONS'] },
            { url: `/\/api\/v1\/loginStats(.*)`, methods: ['GET', 'OPTIONS'] },
            { url: `/\/api\/v1\/farmers(.*)`, methods: ['GET', 'OPTIONS'] },
            // Paths for user authentication (login and registration)
            `${api}/users/login`,
            `${api}/users/register`,
        ],
    })
}




// Export the authJwt function so it can be used in other parts of the application
module.exports = authJwt
