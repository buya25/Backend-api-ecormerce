const express = require('express')
const { Product } = require('../models/product')
const { Category } = require('../models/category')
const product_statsRouter = express.Router()
const mongoose = require('mongoose')

//check the number of views of the product
product_statsRouter.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        product.views = product.views + 1
        await product.save()
        res.send(product)
    } catch (error) {
        res.sendStatus(500).json(error)
    }
})
// Get the number of views of the product
product_statsRouter.get('/views/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.sendStatus(404); // If the product is not found, send a 404 status code
        }
        res.json({ views: product.views });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).json({ error: 'Internal Server Error' }); // Send a 500 status code with an error message
    }
});

// Get the most bought product
product_statsRouter.get('/most-bought', async (req, res) => {
    try {
        const mostBoughtProduct = await Product.findOne().sort({ purchases: -1 }).limit(1);
        if (!mostBoughtProduct) {
            return res.status(404).json({ message: 'No products found' });
        }
        res.json(mostBoughtProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = product_statsRouter
