const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');

router.post('/', (req, res, next) => {
    Admin.findOne({email: req.body.email})
    .exec()
    .then(admin => {
        bcrypt.compare(req.body.password, admin.password, (err, result) => {
            if(result) {
                Admin.update({email: admin.email}, { $set: { token: jwt.sign({
                    email: admin.email,
                    password: admin.password
                },  process.env.SECRET_KEY,
                {
                    expiresIn: '1d'
                }
                )} })
                .exec()
                .then(doc => {
                    Admin.update({email: admin.email}, { $set: { isLoggedIn: true } })
                    .exec()
                    .then(adminDoc => {
                        Admin.findOne({email: admin.email})
                        .exec()
                        .then(finalResult => {
                            res.status(200).json({
                                message: 'Logged In Successfully',
                                result: finalResult,
                                token: finalResult.token,
                                isLoggedIn: finalResult.isLoggedIn
                            })
                        })
                    })
                })
            } else {
                res.status(409).json({
                    message: 'Auth failed'
                })
            }
        })
    })
    .catch(err => res.status(500).json({
        message: err
    }))
})


module.exports = router;