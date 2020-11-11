const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const crypto = require('crypto-random-string');
const TemplateService = require('../services/template.service')

//sign up

router.post('/', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(result => {
        if(result.length >= 1) {
            return res.status(409).json({
                message: "Email Already exist!"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(401).json({
                        message: err
                    });
                } else {
                    const user = new User({
                        id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash,
                        token: jwt.sign({
                            email: req.body.email,
                            password: req.body.password
                        }, process.env.SECRET_KEY,
                        {
                            expiresIn: '1d'
                        }),
                        verified: false,
                        otp: crypto({length: 6, type: 'numeric'}),
                        isLoggedIn: false,
                        isLogOutFailure: false
                    });
                    user.save()
                    .then(result => {
                        TemplateService.userOtpTemplate(result);
                        res.status(200).json({
                            message: "Account Created Successfully, OTP sent to admin's email",
                            userDetails: {
                                email: result.email,
                                token: result.token
                            }
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err
                        });
                    });
                }
            });
        }
    });
});

router.post('/:token', (req, res, next) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.SECRET_KEY);
        if(decoded) {
                User.findOne({ otp: req.body.otp, email: req.body.email })
                .exec()
                .then(result => {
                    User.update({ email: result.email }, {$set: {verified: true}}).exec();
                    User.findOne({email: req. body.email})
                    .exec()
                    .then(user => res.status(200).json({

                        message: 'Account verified successfully',
                        verified: user.verified
                    }))
                })
                .catch(err => res.status(500).json({
                    message: 'Auth failed'
                }))
            }
    } catch(err) {
        res.status(401).json({
            message: 'Auth failed'
        });
    }
})


router.delete('/delete', (req, res, next) => {
    User.remove({})
    .then(result => {
        res.status(200).json({
            message: 'User Document deleted successfully'
        })
    })
    .catch(err => {
        res.status(500).json({
            message: `Error ${err}`
        })
    });
})

router.get('/', (req, res, next) => {
    User.find({})
    .select('email password token isLoggedIn')
    .exec()
    .then(users => {
        res.status(200).json({
            users: users
        })
    })
    .catch(err => res.status(500).json({
        message: 'error fetching data'
    }))
})



module.exports = router;