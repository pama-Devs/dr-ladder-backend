const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');

router.post('/', (req, res, next) => {
    Admin.find({email: req.body.email})
    .exec()
    .then(result => {
        if(result.length >= 1) {
            return res.status(409).json({
                message: 'Email already exists'
            })
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(401).json({
                        message: err
                    })
                } else {
                    const admin = new Admin({
                        email: req.body.email,
                        password: req.body.password,
                        token: '',
                        isLoggedIn: false,
                        otp: ''
                    });
                    admin.save()
                    .then(finalResult => {
                       res.status(200).json({
                        message: 'Admin account created successfully'
                       })
                    })
                }
            })
        }
    })
    .catch(err => res.status(500).json({
        message: err
    }))
})

router.delete('/delete', (req, res, next) => {
    Admin.remove({})
    .then(result => {
        res.status(200).json({
            message: 'Admin Document deleted successfully'
        })
    })
    .catch(err => {
        res.status(500).json({
            message: `Error ${err}`
        })
    });
})

module.exports = router;