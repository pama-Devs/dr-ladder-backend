const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HireUs = require('../models/hire_us');

const multer = require('multer');
const TemplateService = require('../services/template.service');

router.post('/', (req, res, next) => {
    const hireUs = new HireUs({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    });
    hireUs.save()
    .then(result => {
        TemplateService.hireUsFormTemplate('minazuddin23@gmail.com');
        res.status(200).json({
            message: "Form Submitted Successfully"
        })
    })
    .catch(err => res.status(500).json({
        message: err
    }))
})

module.exports = router;