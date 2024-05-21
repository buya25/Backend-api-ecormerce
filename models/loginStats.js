const mongoose = require('mongoose');

// Define the schema for the LoginStats collection
const loginStatsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    loginTime: {
        type: Date,
        default: Date.now,
        format: '%Y-%m-%d %H:%M:%S' 
    }
});

//create a virtual id for userId
loginStatsSchema.virtual('id').get(function() {
    return this._id.toHexString();
    });

// Create the LoginStats model
const LoginStats = mongoose.model('LoginStats', loginStatsSchema);

module.exports = LoginStats;
