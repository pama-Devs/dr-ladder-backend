const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const crypto = require('crypto-random-string');
const TemplateService = require('../services/template.service')

router.post('/', (req, res, next) => {
    const otp = crypto({length: 6, type: 'numeric'});
    User.update({email: req.body.email}, {$set: {otp: otp}})
    .exec()
    .then(result => {
        if(result.n >= 1) {
            TemplateService.userResendOtpTemplate(otp);
            res.status(200).json({
                message: 'OTP sent to admin',
                otp: otp,
                sent: true
            })
        }
    })
    .catch(err => res.status(500).json({
        message: `Error ${err}`
    }))
})

module.exports = router;