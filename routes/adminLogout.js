const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const { JsonWebTokenError } = require('jsonwebtoken');

router.post('/:token', (req, res, next) => {
    Admin.update({ token: req.params.token }, { $set: { isLoggedIn: false}})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Logged out successfully',
            isLoggedIn: false
        })
    })
    .catch(err => res.status(500).json({
        message: err
    }))
})

module.exports = router;