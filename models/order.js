const mongoose = require('mongoose')
/*
order values are orderItems, shippingAddress1, shippingAddress2, city, zip,
country, phone, status, totalprice, user, dateOrdered
*/
const orderSchema = mongoose.Schema(
    {
        orderItems: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'OrderItems',
                required: true,
            },
        ],
        shippingAddress1: {
            type: String,
            required: true,
        },
        shippingAddress2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Pending',
        },
        totalPrice: {
            type: Number,
            default: 0.0,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
        },
        dateOrdered: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

//change the _id to id using virtual
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
})
;
//respond in json file
orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);
