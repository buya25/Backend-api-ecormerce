const express = require('express')
const { Product } = require('../models/product')
const { Category } = require('../models/category')
const productRouter = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const { User } = require('../models/user')
const isLogin = require('../helper/isLogin')
const { populate } = require('../models/loginStats')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')
        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-')
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const uploadOptions = multer({ storage: storage })

/*ADD a Product with values name, description, richDescription, image, brand, price,
category, countInStock, rating, numReviews, isFeatured*/
productRouter.post(`/`, uploadOptions.single('image'), async (req, res) => {
    try {
        //validat objectId mongoose
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
        }
        //find category first before you ADD a new product
        const category = await Category.findById(req.body.category)
        if (!category) return res.status(400).send('Invalid Category')

        const file = req.file
        if (!file) return res.status(400).send('Invalid Category')

        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads`

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        })

        const detproduct = await product.save()

        if (!detproduct)
            return res.status(400).send('The product cannot be created!')

        res.send(product)
    } catch (error) {
        //respond to the error
        res.status(500).json({ error: error.message })
    }
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

    const product = await Product.findById(req.params.id).populate('category').populate({ path: 'reviews'});
    
    if (!product) {
        return res.status(404).send({ message: 'Product not found' })
    }

    //when the product is found i would like when the user clicks on the products its added to views
    product.numviews = product.numviews + 1
    const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        product,
        { new: true }
    )
    res.send(updatedProduct)
});

// Endpoint to purchase a product
productRouter.post('/purchase/:id', isLogin, async (req, res) => {
    try {

        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        //check if the product exist in the DB
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Increment the purchases field
        product.purchases += 1;
        await product.save();

        res.json({ message: 'Purchase successful', product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/*GET ALL the PRODUCTS*/
productRouter.get('/', async (req, res) => {
    //filter products using category
    //localhost:3000/api/v1/products?categories=23456,234556
    let filter = {}
    if (req.query.categories) {
        filter = { category: { $in: req.query.categories.split(',') } }
    }
    //sort products
    const productList = await Product.find(filter).populate('category')

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
})

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

//upload images in the system
productRouter.put(
    `/gallery-images/:id`,
    uploadOptions.array('images', 10),
    async (req, res) => {
        //validat objectId mongoose
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
        }

        const files = req.files
        let imagesPaths = []
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads`

        if (files) {
            files.map((file) => {
                imagesPaths.push(`${basePath}/${file.filename}`)
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths,
            },
            {
                new: true,
            }
        )
        if (!product) {
            return res.status(500).send('The product cannot be updated!')
        }
        res.send(product)
    }
)
//delete images in the system
productRouter.delete(`/gallery-images/:id`, async (req, res) => {
    //validat objectId mongoose
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Product Id')
    }
    const product = await Product.findById(req.params.id)
    if (!product) {
        return res.status(500).send('The product cannot be updated!')
    }
    product.images.pop()
    product.save()
    res.send(product)
})

module.exports = productRouter
