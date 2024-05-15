const express = require('express')
const { Category } = require('../models/category')
const categoryRouter = express.Router()

//create a new category
categoryRouter.post(`/`, async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    })

    category = await category.save()

    if (!category) {
        return res.status(404).send({ message: 'Category not found' })
    }

    res.send(category)
})

//update a specific category using an /:id
categoryRouter.put('/:id', async (req, res) => {
    let category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true }
    )
    if (!category) {
        return res.status(404).send({ message: 'Category not found' })
    }
    res.send(category)
})

//http://localhost:3000/api/v1/order
//get all the category
categoryRouter.get(`/`, async (req, res) => {
    let category = await Category.find()

    if (!category) {
        return res.status(404).send({ message: 'Category not found' })
    }

    res.send(category)
})

//get a single category just like searching for a specific category using an id
categoryRouter.get('/:id', async (req, res) => {
    let category = await Category.findById(req.params.id)
    if (!category) {
        return res.status(404).send({ message: 'Category not found' })
    }
    res.send(category)
})

//delete a category using the :id
categoryRouter.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'The category has been deleted!',
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'The category has not been found!',
                })
            }
        })
        .catch((err) => {
            return res.status(400).json({ success: false, error: err })
        })
})

module.exports = categoryRouter
