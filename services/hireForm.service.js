const HireForm = require('../models/hireForm');

exports.getHireForm = (query) => {
        return HireForm.findOne(query)
        .exec();
}