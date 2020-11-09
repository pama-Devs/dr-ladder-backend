const JoinUsForm = require('../models/joinUs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const TemplateService = require('../services/template.service');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({
    storage: storage
});

router.post('/', upload.single('resume'), (req, res, next) => {
    if(req.file) {
        const form = new JoinUsForm({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact: req.body.contact,
            preferrable_location: req.body.preferrable_location,
            position: req.body.position,
            resume: req.file.filename
        });
        form.save()
        .then(result => {
            TemplateService.joinUsFormTemplate(result.email);
            res.status(200).json({
                message: 'form submitted succefully',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: `Error: ${err}`
            })
        })
    } else {
        const form = new JoinUsForm({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            contact: req.body.contact,
            preferrable_location: req.body.preferrable_location,
            position: req.body.position
        });
        form.save()
        .then(result => {
            TemplateService.joinUsFormTemplate(result.email);
            res.status(200).json({
                message: 'form submitted succefully',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: `Error: ${err}`
            })
        })
    }
})

module.exports = router;