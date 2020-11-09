const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    contact_number: {
        type: Number
    },
    dob: {
        type: String
    },
    interested_in: {
        type: String
    },
    qualification: {
        type: String
    },
    company: {
        type: String
    },
    designation: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    last_month_sal: {
        type: String
    },
    expected_monthly_sal: {
        type: String
    },
    possible_month_of_joining: {
        type: String
    },
    additional_info: {
        type: String
    },
    resume: {
        type: String
    },
    photo: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);