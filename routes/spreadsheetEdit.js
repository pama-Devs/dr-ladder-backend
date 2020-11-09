const express = require('express');
const router = express.Router();
const multer = require('multer');
// work with sheets //

const { google } = require('googleapis');
const keys = require('../client_secret.json');
const sheets = require('../sheets');

//work with sheet
const upload = multer({
    dest: 'uploads/'
})

router.post('/', upload.single(''), (req, res, next) => {
    const form = {
        date: req.body.date,
        recruiter_name: req.body.recruiter_name,
        college: req.body.college,
        speciality: req.body.speciality,
        post: req.body.post,
        candidate_name: req.body.candidate_name,
        qualification: req.body.qualification,
        mobile_number: req.body.mobile_number,
        experience: req.body.experience,
        current_sal: req.body.current_sal,
        current_location: req.body.current_location,
        languages_known: req.body.languages_known,
        expected_sal: req.body.expected_sal,
        preferable_loc: req.body.preferable_loc,
        family: req.body.family,
        notice_period: req.body.notice_period,
        feedback: req.body.feedback
    }
        //create client
        const client = new google.auth.JWT({
            email: keys.client_email,
            keyFile: null,
            key: keys.private_key,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

    //authorize client
    client.authorize((err, credentials) => {
        if(err) {
            console.log(err);
        } else {
            console.log('connected');
            editSheet(client, form);
        }
    });

   async function editSheet(client, form) {
        const gsapi = google.sheets({
            version: "v4",
            auth: client
        });

        // append rows
        const appendData = [['', form.date, form.recruiter_name, form.college, form.speciality, form.post,
            form.candidate_name, form.qualification, form.mobile_number, form.experience, form.current_sal,
            form.current_location, form.languages_known, form.expected_sal, form.preferable_loc,
            form.family, form.notice_period, form.doctorFeedback, form.clientFeedback
        ]];
        const append = {
            spreadsheetId: '1pd3jVZU2dEtDC0rc_03E5AcXYQbeGoJvhwB7uy-xxGg',
            range: `${form.recruiter_name}!A1`,
            valueInputOption: 'RAW',
            resource: {
                values: appendData
            }
        };
        const appendResult = await gsapi.spreadsheets.values.append(append);
        res.status(200).json({
            message: 'form submitted'
        })
    }
    
});

module.exports = router;