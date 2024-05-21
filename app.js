const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv/config')
const api = process.env.API_URL
const { join } = require('node:path')
const errorHandler = require('./utils/errorHandler')
const startWebSocketServer = require('./server/websocketServer')
const { Server } = require('socket.io')
const isLogin = require('./helper/isLogin')

const app = express()
const server = http.createServer(app)

//MIDDLEWARE
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())
app.options('*', cors())
app.use(errorHandler)

//ROUTERS
const productRouter = require('./routes/productRoute')
const userRoute = require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute')
const orderRoute = require('./routes/orderRoute')
const loginStatsRoute = require('./routes/loginStatsRoute')
const farmerRouter = require('./routes/farmersRouter')
const connectToDatabase = require('./db/db-connect')

app.use(`${api}/products`, productRouter)
app.use(`${api}/loginStats`, loginStatsRoute)
app.use(`${api}/users`, userRoute)
app.use(`${api}/farmers`, farmerRouter)
app.use(`${api}/categories`, categoryRoute)
app.use(`${api}/orders`, orderRoute)

// Specify paths that are exempt from JWT token verification


// Verify JWT token for all requests
app.use((req, res, next) => {
    const path = req.path
    if (exemptPaths.includes(path)) {
        return next()
    }
    if (!isLogin(req)) {
        return res.status(401).json({
            status: 'error',
            message: 'You are not logged in',
        })
    }
    next()
});

//connecting to mongoose database add the name of the database
connectToDatabase()
const WebSocket = require('ws')
const LoginStats = require('./models/loginStats')
const wss = new WebSocket.Server({ server })

app.get('/', (req, res) => {
    res.send('Hellow world')
    // res.sendFile(join(__dirname, 'index.html'));
})

// Call the WebSocket server function and pass the HTTP server
// startWebSocketServer(server);

app.listen(3000, () => {
    //Display a response incase the post is successful
    console.log('Server is running on port 3000')
})
