const mongoose = require('mongoose');

const joinUsSchema = mongoose.Schema({
    first_name: { type: String },
    last_name: { type: String },
    email: 
        {   
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    contact: { type: Number },
    preferrable_location: { type: String },
    position: { type: String },
    resume: { type: String }
});

module.exports = mongoose.model('JoinUs', joinUsSchema);