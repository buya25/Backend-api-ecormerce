const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: { 
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    comment: { 
        type: String,
        default: ''
    }
}, {
    timestamps: true
});


exports.Review = mongoose.model('Review', reviewSchema);
