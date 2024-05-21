const mongoose = require('mongoose')

/*
    order items values are quantity, and product
*/
const orderItemsSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
})

//exports
module.exports = mongoose.model('OrderItems', orderItemsSchema);
