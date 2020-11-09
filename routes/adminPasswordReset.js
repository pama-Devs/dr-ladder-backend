const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');
const crypto = require('crypto-random-string');

router.post('/:token', (req, res, next) => {
    Admin.findOne({token: req.params.token})
    .exec()
    .then(user => {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err) {
                res.status(401).json({
                    message: err
                });
            } else {
               Admin.update({email: user.email}, {$set: { password: hash }})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Admin Password Changed successfully',
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

