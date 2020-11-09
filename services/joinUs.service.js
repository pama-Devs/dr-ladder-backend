const JoinUs = require('../models/joinUs');

exports.getJoinUsForm = (query) => {
        return JoinUs.findOne(query)
        .exec();
}