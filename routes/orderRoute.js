const express = require('express');
const { Order } = require('../models/order');
const orderRouter = express.Router();

//http://localhost:3000/api/v1/order
orderRouter.get(`/`, async (req, res) => {
    const orders = await Order.find();

    if(!orders){
        return res.status(404).send({message:"Orders not found"});
    }

    res.send(orders);
});

module.exports = orderRouter;