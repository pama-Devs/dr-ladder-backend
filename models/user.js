const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    verified: {
        type: Boolean
    },
    otp: {
        type: Number
    },
    isLoggedIn: {
        type: Boolean
    },
    isLogOutFailure: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', userSchema);