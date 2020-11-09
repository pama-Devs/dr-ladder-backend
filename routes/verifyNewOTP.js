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
    User.findOne({otp: req.body.otp})
    .exec()
    .then(result => {
        User.update({email: result.email}, {$set: {token: jwt.sign({
            email: result.email,
            password: result.password
        }, process.env.SECRET_KEY,
        {
            expiresIn: '1d'
        })
     }}).exec().then(resultUpdate => {
         User.findOne({email: result.email})
         .exec()
         .then(finalResult => {
             res.status(200).json({
                 message: 'verified',
                 token: finalResult.token,
                 newOTPverified: true
             })
         })
     })
    })
    .catch(err => res.status(500).json({
        message: `Error ${err}`
    }))
});

module.exports = router;