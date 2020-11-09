const User = require('../models/user');

exports.getUserForm = (query) => {
        return User.findOne(query)
        .exec();
}