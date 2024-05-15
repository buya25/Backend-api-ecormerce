const express = require('express')
const { Product } = require('../models/product')
const { Category } = require('../models/category')
const productRouter = express.Router()
const mongoose = require('mongoose')

/*ADD a Product with values name, description, richDescription, image, brand, price,
category, countInStock, rating, numReviews, isFeatured*/
productRouter.post(`/`, async (req, res) => {
    //find category first before you ADD a new product
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    });

    const detproduct = await product.save();

    if (!detproduct)
        return res.status(400).send('The product cannot be created!')

    res.send(product)
})

/*UPDATE the PRODUCT according*/
productRouter.put('/:id', async (req, res) => {
    //validate mongoose :id
    if (!mongoose.isValidObjectId(req.params.id))
        return res.status(400).send('Invalid Product Id')
    //find the category first
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )
    if (!product) {
        return res.status(404).send({ message: 'Product not found' })
    }
    res.send(product)
})

/*DELETE the PRODUCT according*/
productRouter.delete('/:id', async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
        return res.status(404).send({ message: 'Product not found' })
    }
    res.send({
        message: 'Product deleted successfully',
        data: product,
    })
})

/*GET only one PRODUCT */
productRouter.get('/:id', async (req, res) => {
    //validate mongoose :id
    if (mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }

    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(404).send({ message: 'Product not found' })
    }
    res.send(product)
})

/*GET ALL the PRODUCTS*/
productRouter.get('/', async (req, res) => {
    //filter products using category
    //localhost:3000/api/v1/products?categories=23456,234556
    let filter = {};
    if (req.query.categories) {
        filter = { category: { $in: req.query.categories.split(',') } }
        }
        //sort products
        const productList = await Product.find(filter).populate('category');
    

    if (!productList) {
        return res.status(404).send({ message: 'Product not found' })
    }
    res.send(productList)
})

/*Product Count*/
productRouter.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments()

    if (!productCount) {
        return res.status(404).send({ message: 'Product not found' })
    }
    res.send({
        productCount: productCount,
    })
});

//It is not working yet
/*Products that are isFeatured*/
productRouter.get(`/get/featured/:count`, async (req, res, next) => {
    try {
        const count = req.params.count ? req.params.count : 0 //if count is not passed then set it to 0
        const products = await Product.find().limit(+count)

        if (!products) {
            return res.status(404).send({ message: 'Product not found' })
        }
        res.send(products)
    } catch (error) {
        console.error(error)
    }
})

module.exports = productRouter
