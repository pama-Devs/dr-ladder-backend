const express = require('express');
const router = express.Router();
const UserLoggerTrack = require('../models/userLoggerTrack');
// work with sheets //

const { google } = require('googleapis');
const keys = require('../client_secret.json');
const sheets = require('../sheets');


router.get('/', (req, res, next) => {
    UserLoggerTrack.find({})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'users login status fetched successfully',
            result: result
        })
    })
    .catch()
})

//write data to sheet
router.post('/', (req, res, next) => {
    UserLoggerTrack.find({})
    .select('userEmailId date inTime outTime breakTime')
    .exec()
    .then(result => {
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
            editSheet(client);
        }
    });

   async function editSheet(client) {
        const gsapi = google.sheets({
            version: "v4",
            auth: client
        });

        // append rows
        const updateData = [];
        for(let item of result) {
                const data = [item.userEmailId, item.date, item.inTime, item.outTime, item.breakTime];
                updateData.push(data);
        }
        const update = {
            spreadsheetId: '1pd3jVZU2dEtDC0rc_03E5AcXYQbeGoJvhwB7uy-xxGg',
            range: `login_details!A2`,
            valueInputOption: 'RAW',
            resource: {
                values: updateData
            }
        };
        const updateResult = await gsapi.spreadsheets.values.update(update);
        res.status(200).json({
            message: 'attendace form submitted'
        })
        }
    })
    .catch(err => res.status(500).json({
        message: err
    }))
})

router.delete('/', (req, res, next) => {
    if(req.body.email) {
        UserLoggerTrack.deleteMany({ userEmailId: req.body.email })
        .then(result => {
            res.status(200).json({
                message: 'document deleted'
            })
        })
        .catch(err => res.status(500).json({
            message: 'err'
        }))
    } else {
        UserLoggerTrack.remove({})
        .then(result => {
            res.status(200).json({
                message: 'document deleted'
            })
        })
        .catch(err => res.status(500).json({
            message: 'err'
        }))
    }
})

router.delete

module.exports = router;