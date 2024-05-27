const express = require('express');
const { Order } = require('../models/order');
const OrderItem = require('../models/order-items');
const isLogin = require('../helper/isLogin');
const { Product } = require('../models/product');
const orderRouter = express.Router()

//http://localhost:3000/api/v1/order
orderRouter.get(`/`, async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name')
        .sort({ dateOrdered: -1 })

    if (!orders) {
        return res.status(404).send({ message: 'Orders not found' })
    } else {
        res.send(orders)
    }
});
//Get a specific order using /:id
orderRouter.get(`/:id`, async (req, res) => {
    //find the order using the id
    const orders = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        })

    //check if the order exist
    if (!orders) {
        return res.status(404).send({ message: 'Orders not found' })
    } else {
        res.send(orders)
    }
});

/*
I want to make an order
*/
orderRouter.post(`/`, isLogin, async (req, res) => {

    //try catch error
    try {
        const orderItemsId = await Promise.all(
            req.body.orderItems.map(async (orderitems) => {
                let newOrderItem = new OrderItem({
                    quantity: orderitems.quantity,
                    product: orderitems.product,
                })
                //save the orderItemsId and add it to newOrderItem
                newOrderItem = await newOrderItem.save();

                // Decrement the product stock
            const product = await Product.findById(orderitems.product);
            if (product) {
                product.countInStock -= orderitems.quantity;
                await product.save();
            }

                return newOrderItem._id
            })
        );

        //calculate the totalPrice of the order
        const totalPrice = await Promise.all(
            orderItemsId.map(async (orderItemsId) => {
                const orderItem = await OrderItem.findById(
                    orderItemsId
                ).populate('product', 'price')
                const totalPrice = orderItem.product.price * orderItem.quantity
                return totalPrice
            })
        );

        const totalPrices = totalPrice.reduce((a, b) => a + b, 0)

        const order = new Order({
            orderItems: orderItemsId,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrices,
            user: req.body.user,
            dateOrdered: req.body.dateOrdered,
        })

        const createdOrder = await order.save();

        //check if the order is created
        if (!createdOrder) {
            return res
                .status(400)
                .send({ message: 'The order cannot be created' })
        }

        res.send(createdOrder)
    } catch (error) {
        //respond
        res.status(500).json({ message: error.message })
    }
});

//update a specific order using an /:id
orderRouter.put('/:id', async (req, res) => {
    let order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status,
        },
        { new: true }
    )
    if (!order) {
        return res.status(404).send({ message: 'order not found' })
    }
    res.send(order)
})

//delete a Order using the :id
orderRouter.delete('/:id', (req, res) => {
    Order.findByIdAndDelete(req.params.id)
        .then(async (order) => {
            if (order) {
                //remove the orderItem
                await order.orderItems.map(async (orderItem) => {
                    await OrderItem.findByIdAndDelete(orderItem)
                })
                return res.status(200).json({
                    success: true,
                    message: 'The order has been deleted!',
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'The order has not been found!',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err });
        })
});

//get total sales
orderRouter.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
    ]).catch((err) => {
        return res.status(400).json({ success: false, error: err });
    })
    if (!totalSales) {
        return res.status(400).json({ success: false, error: err });
    }
    res.send({ totalSales: totalSales.pop().totalSales });
});

/*Order Count*/
orderRouter.get(`/get/count`, async (req, res) => {
    const orderCount = await Order.countDocuments()

    if (!orderCount) {
        return res.status(404).send({ message: 'Product not found' })
    }
    res.send({
        orderCount: orderCount,
    })
});

orderRouter.get(`/get/userorders/:userid`, async (req, res) => {
    const orders = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
             path: 'product', populate: 'category'}})
        .sort({ dateOrdered: -1 });

        //check if the orders[] is empty


        if (orders.length > 0) {
            res.send(orders);
        } else {
            return res.status(404).send({ message: 'Orders not found' });
        }        
});

module.exports = orderRouter
