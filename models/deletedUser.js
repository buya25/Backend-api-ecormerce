const mongoose = require('mongoose');

const deletedUserSchema = new mongoose.Schema({
    deletedUserName: {
        type: String,
        required: true
    },
    deletedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    deletionTime: {
        type: Date,
        default: Date.now
    },
    deletionTime: {
        type: Date,
        default: Date.now,
        // Create a TTL index for automatic deletion after 30 days
        expires: 30 * 24 * 60 * 60 // TTL index in seconds (30 days)
    }
});

const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);

module.exports = DeletedUser;
