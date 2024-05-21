const mongoose = require('mongoose')
/*I want to Add this values to users id, name, email, passwordHash, street, apartment,
city, zip, country, phone, isAdmin*/
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        hashedPassword: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            default: '',
        },
        apartment: {
            type: String,
            default: '',
        },
        city: {
            type: String,
            default: '',
        },
        zip: {
            type: String,
            default: '',
        },
        country: {
            type: String,
            default: '',
        },
        phone: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isFarmer: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

//make the _id to id
userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

//send data to json file
userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
