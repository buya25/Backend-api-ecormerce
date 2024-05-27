const express = require('express')
const reviewRoute = express.Router()
const isLogin = require('../helper/isLogin')
const { Product } = require('../models/product')
const { Review } = require('../models/reviews')

// Endpoint to create a review for a product
reviewRoute.post('/:productId', isLogin, async (req, res) => {
    //get the ratings and the comment from the user
    const { rating, comment } = req.body
    //getting the productId
    const productId = req.params.productId
    const userId = req.userAuth

    try {
        // Check if the product exists and populate producte name
        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        // Create the review
        const review = new Review({
            rating: rating,
            comment: comment,
            user: userId,
        })

        // Save the review
        const savedReview = await review.save()

        // Save the review
        product.reviews.push(savedReview)
        await product.save()

        res.json({ message: 'Review created successfully', review })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//update the the review in for the product
reviewRoute.put('/:productId/:reviewId', isLogin, async (req, res) => {
    //get the ratings and the comment from the user
    const { rating, comment } = req.body
    //getting the productId
    const productId = req.params.productId
    const reviewId = req.params.reviewId

    try {
        // Check if the product exists and populate producte name
        const product = await Product.findById(productId)
        const review = await Review.findById(reviewId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }
        //update the review
        review.rating = rating
        review.comment = comment
        await review.save()
        res.json({ message: 'Review updated successfully', review })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//delete the review
reviewRoute.delete('/:productId/:reviewId', isLogin, async (req, res) => {
    //getting the productId
    const productId = req.params.productId
    const reviewId = req.params.reviewId
    try {
        // Check if the product exists and populate producte name
        const product = await Product.findById(productId)
        const review = await Review.findById(reviewId)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        if (!review) {
            return res.status(404).json({ message: 'Review not found' })
        }
        //delete the review
        await review.remove()
        res.json({ message: 'Review deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = reviewRoute
