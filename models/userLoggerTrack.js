const mongoose = require('mongoose');

const userLoggerTrackSchema = mongoose.Schema({
    userEmailId: {
        type: String
    },
    date: {
        type: String
    },
    inTime: {
        type: String
    },
    outTime: {
        type: String
    }
});

module.exports = mongoose.model('LoggerTrack', userLoggerTrackSchema);