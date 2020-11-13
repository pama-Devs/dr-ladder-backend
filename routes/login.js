const express = require('express')
const User = require('../models/user')
const UserLoggerTrack = require('../models/userLoggerTrack')
const bcrypt = require('bcrypt');
const router = express.Router()
const jwt = require('jsonwebtoken');

router.post('/', (req, res, next) => {
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(user) {
            bcrypt.compare(req.body.password, user.password, 
            (err, result) => {
                if(result) {
                    if(user.verified) {
                        //update token
                        User.update({ email: user.email }, {$set: {token: jwt.sign({
                            email: user.email,
                            password: user.password
                        }, process.env.SECRET_KEY,
                        {
                            expiresIn: '1d'
                        })
                     }}).exec();
                     //update log status
                        User.update({ email: user.email }, {$set: {isLoggedIn: true }}).exec()
                        .then();
                        User.findOne({email: user.email})
                        .exec()
                        .then(userData => {
    
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
                            let totalSec = 19800 + (userLogDetails.hours * 3600) + (userLogDetails.min * 60);
                            let hh = Math.floor(totalSec/3600);
                            totalSec %= 3600;
                            let mm = Math.floor(totalSec/60);
                            const time = `${hh}:${mm}`;
                            function findMonth(month) {
                                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                for(let i = 1; i <= months.length; i++) {
                                    if(i == month) {
                                        return months[i];
                                    }
                                }
                            }

                            if(!userData.isLogOutFailure) {
                                const loggerTrack = new UserLoggerTrack({
                                    userEmailId: user.email,
                                    date: `${userLogDetails.date} ${userLogDetails.month} ${userLogDetails.year}`,
                                    inTime: `${time}`,
                                    outTime: '',
                                    breakTime: '',
                                    token: jwt.sign({ userEmailId: user.email }, 'secret', { expiresIn: '1d'})
                                })
                                loggerTrack.save()
                                .then(userResult => {
                                    res.status(200).json({
                                        message: 'Logged In Successfully',
                                        verified: userData.verified,
                                        isLoggedIn: userData.isLoggedIn,
                                        token: userData.token,
                                        breakToken: userResult.token
                                    })
                                })
                            }
                        })
                    } else {
                        return res.status(201).json({
                            message: 'User Not Verified'
                        })
                    }
                } else {
                        return res.status(401).json({
                            message: 'Auth failed'
                        })
                }
            })
        } else {
            return res.status(500).json({
                message: 'Auth failed'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message: err
        })
    })
});

module.exports = router;