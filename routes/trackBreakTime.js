const express = require('express');
const user = require('../../login/BACKEND/models/user');
const router = express.Router();
const UserLoggerTrack = require('../models/userLoggerTrack');

const { google } = require('googleapis');
const keys = require('../client_secret.json');
const sheets = require('../sheets');

router.post('/:token', (req, res, next) => {
    let timer = 0, breakTime = 0;
    UserLoggerTrack.findOne({ token: req.params.token })
    .exec()
    .then(data => {
        timer = data.breakTime;
    })
    .catch(err => res.status(500).json({
        message: err
    }))
        if(req.body.timer >= 3600) {
            timer += req.body.timer;
            const hour = (timer/3600).toFixed(2);
            const min = (timer%3600).toFixed(2);
            breakTime = `${hour} hr ${min} min`
        } else if(req.body.timer <= 60) {
            timer += req.body.timer;
            breakTime = `${timer} sec`;
        } else {
            timer += req.body.timer;
            breakTime = `${(timer/60).toFixed(2)} min`;
        }
        UserLoggerTrack.update({token: req.params.token}, { $set: { breakTime: breakTime } })
        .exec()
        .then(result => {
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
                    console.log('connected');
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
                const appendResult = await gsapi.spreadsheets.values.update(update);
                res.status(200).json({
                    message: 'Status Changed'
                })
                }
            })
            .catch(err => res.status(500).json({
                message: err
            }))  
        })
    
});

module.exports = router;