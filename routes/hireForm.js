// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const HireForm = require('../models/hireForm')

// router.post('/', (req, res, next) => {
//     const form = new HireForm({
//         name: req.body.name,
//         email: req.body.email,
//         subject: req.body.subject,
//         message: req.body.message
//     });
//     form.save()
//     .then(result => {
//         res.status(200).json({
//             message: 'form submitted successfully'
//         })
//     })
//     .catch(err => {
//         res.status(500).json({
//             message: `Error: ${err}`
//         })
//     })
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HireForm = require('../models/hireForm')

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

router.post('/',upload.single(''), (req, res, next) => {
        const form = new HireForm({
            name: req.body.name,
            email: req.body.email,
            subject: req.body.subject,
            message: req.body.message
        });
        form.save()
        .then(result => {
            TemplateService.hireFormTemplate(result.email);
            res.status(200).json({
                message: 'form submitted successfully'
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })
        });
});

module.exports = router;