const mongoose = require('mongoose');

//model for the products
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    images: [
        {
            type: String,
        },
    ],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        require: true
    }],
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    purchases: {
        type: Number,
        default: 0,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

//mark a virtual views from numviews
productSchema.virtual('views').get(function () {
    return this.numviews
})

productSchema.set('toJSON', {
    virtuals: true,
})

exports.Product = mongoose.model('Product', productSchema)
