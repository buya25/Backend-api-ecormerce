const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { Product } = require('./models/product');
const cors = require('cors');
require("dotenv/config");
const api = process.env.API_URL;
const authJwt = require('./helper/jwt');
const errorHandler = require('./utils/errorHandler');


//MIDDLEWARE
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());
app.use(authJwt());
app.use(errorHandler);


//ROUTERS
const productRouter = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const categoryRoute = require('./routes/categoryRoute');
const orderRoute = require('./routes/orderRoute');


app.use(`${api}/products`, productRouter)
app.use(`${api}/users`, userRoute)
app.use(`${api}/categories`, categoryRoute)
app.use(`${api}/orders`, orderRoute)



//connecting to mongoose database
mongoose.connect(process.env.DB_CONNECT_STRING_URL)
.then(()=>{
    console.log('connected to the database')
})
.catch
((err)=>{console.error(err)})

app.listen(3000, ()=> {
    //Display a response incase the post is successful
    console.log("Server is running on port 3000");
})