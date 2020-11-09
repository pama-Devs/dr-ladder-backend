const User = require('../models/user');

exports.getUserData = (query) => {
        return User.findOne(query)
        .exec();
}