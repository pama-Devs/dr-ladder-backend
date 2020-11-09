const mongoose = require('mongoose');

const hireFormSchema = mongoose.Schema({
    name: { type: String },
    email: 
        {   
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    subject: { type: String },
    message: { type: String }
});

module.exports = mongoose.model('HireForm', hireFormSchema);