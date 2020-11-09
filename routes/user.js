const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');

const multer = require('multer');
const TemplateService = require('../services/template.service');

//fileFilter
// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         cb(null, true); // accept image
//     } else {
//         cb(null, false); // reject image
//     }
// }

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({
    storage: storage
});

// const upload = multer({dest: 'uploads/'});

//Create Post

router.post('/', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), (req, res, next) => {
    if(Object.keys(req.files).length >= 1) {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_number: req.body.contact_number,
            dob: req.body.dob,
            interested_in: req.body.interested_in,
            qualification: req.body.qualification,
            company: req.body.company,
            designation: req.body.designation,
            from: req.body.from,
            to: req.body.to,
            last_month_sal: req.body.last_month_sal,
            expected_monthly_sal: req.body.expected_monthly_sal,
            possible_month_of_joining: req.body.possible_month_of_joining,
            additional_info: req.body.additional_info,
            resume: req.files.resume[0].filename + req.files.resume[0].originalname,
            photo: req.files.photo[0].filename + req.files.photo[0].originalname
        });
        console.log(req.files);
        user.save()
        .then(result => {
            TemplateService.contactFormTemplate(result.email);
            res.status(200).json({
                message: 'form submitted successfully',
                userData: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        });
    } else {
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact_number: req.body.contact_number,
            dob: req.body.dob,
            interested_in: req.body.interested_in,
            qualification: req.body.qualification,
            company: req.body.company,
            designation: req.body.designation,
            from: req.body.from,
            to: req.body.to,
            last_month_sal: req.body.last_month_sal,
            expected_monthly_sal: req.body.expected_monthly_sal,
            possible_month_of_joining: req.body.possible_month_of_joining,
            additional_info: req.body.additional_info
        });
        user.save()
        .then(result => {
            TemplateService.contactFormTemplate(result.email);
            res.status(200).json({
                message: 'form submitted successfully',
                userData: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        });
    }
    
    
});

module.exports = router;