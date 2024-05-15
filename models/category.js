const mongoose = require('mongoose')
//models for category lets add id, name, color, icon, image
const categorySchema = mongoose.Schema({
    id: {
        type: String,
    },
    name: {
        type: String
    },
    color: {
        type: String
    },
    icon: {
        type: String
    },
    image: {
        type: String
    },
})

exports.Category = mongoose.model('Category', categorySchema)
