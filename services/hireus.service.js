const HireUs = require('../models/hire_us');

exports.getHireUsForm = (query) => {
        return HireUs.findOne(query)
        .exec();
}