const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const crypto = require('crypto-random-string');

router.post('/', (req, res, next) => {
    Admin.findOne({otp: req.body.otp})
    .exec()
    .then(result => {
        Admin.update({email: result.email}, {$set: {token: jwt.sign({
            email: result.email,
            password: result.password
        }, process.env.SECRET_KEY,
        {
            expiresIn: '1d'
        })
     }}).exec().then(resultUpdate => {
         Admin.findOne({email: result.email})
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