const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const crypto = require('crypto-random-string');
const TemplateService = require('../services/template.service')


router.post('/:token', (req, res, next) => {
    User.findOne({token: req.params.token})
    .exec()
    .then(user => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                res.status(401).json({
                    message: err
                });
            } else {
               User.update({email: user.email}, {$set: { password: hash }})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Password Changed successfully',
                        passwordChanged: true
                    });
                })
                .catch(err => res.status(500).json({
                    message: `Error ${err}`
                }))
            }
        })
    })
})
    

module.exports = router;

