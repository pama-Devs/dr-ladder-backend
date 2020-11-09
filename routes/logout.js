const express = require('express');
const router = express();
const User = require('../models/user');
const UserLoggerTrack = require('../models/userLoggerTrack')

router.post('/:token', (req, res, next) => {
    // User.update({ token: req.params.token }, { $set: { isLoggedIn: false, token: '' } })
    // .exec();
    User.updateOne({ token: req.params.token }, { $set: {isLoggedIn: false } })
    .exec();
        User.findOne({token: req.params.token})
        .exec()
        .then(result => {
            //set time
            const dateObj = new Date();
            const userLogDetails = {
                date: dateObj.getDate(),
                day: dateObj.getDate(),
                month: findMonth(dateObj.getMonth()),
                year: dateObj.getFullYear(),
                hours: dateObj.getHours(),
                min: dateObj.getMinutes()
            }
            function findMonth(month) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for(let i = 1; i <= months.length; i++) {
                    if(i == month) {
                        return months[i];
                    }
                }
            }

            UserLoggerTrack.updateOne({userEmailId: result.email, date: `${userLogDetails.date} ${userLogDetails.month} ${userLogDetails.year}`}, { $set: { outTime:  `${userLogDetails.hours}:${userLogDetails.min}`}})
            .exec()
            .then(doSomething => {
                UserLoggerTrack.findOne({userEmailId: result.email, date: `${userLogDetails.date} ${userLogDetails.month} ${userLogDetails.year}`})
                .exec()
                .then(finalResult => {
                    console.log('outTime', finalResult.outTime);
                    res.status(200).json({
                        message: 'Logged Out Successfully',
                        result: finalResult
                    })
                    console.log('finalresult', finalResult)
                })
            });
    })
    .catch(err => {
        res.status(500).json({
            message: err
        })
    })
})

module.exports = router;

