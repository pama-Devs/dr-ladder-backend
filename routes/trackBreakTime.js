const express = require('express');
const user = require('../../login/BACKEND/models/user');
const router = express.Router();
const UserLoggerTrack = require('../models/userLoggerTrack');

const { google } = require('googleapis');
const keys = require('../client_secret.json');
const sheets = require('../sheets');

router.post('/:token', (req, res, next) => {
    let timer = 0, breakTime = 0, timerSec = 0, timerMin = 0, timerHour = 0, inputTimer = 0;
    UserLoggerTrack.findOne({ token: req.params.token })
    .exec()
    .then(data => {
        timer = data.breakTime;
        inputTimer = req.body.timer;
        if(inputTimer <= 60) {
            if(timer.includes("sec")) {
                inputTimer += Number(timer.split(" ")[0]);
                breakTime = `${inputTimer} sec`;
            }
            if(timer.includes("min") && !timer.includes("hr")) {
                inputTimer += Number(timer.split(" ")[0]) * 60;
                let resultInMin = (inputTimer / 60);
                if(resultInMin >= 60) {
                    breakTime = `${(resultInMin/60).toFixed(0)} hr`
                } else {
                    breakTime = `${resultInMin} min`;
                }
            }
            if(timer.includes("hr")) {
                let hour = Number(timer.split(" ")[0]);
                let min = Number(timer.split(" ")[2]);
                if(min >= 60) {
                    hour += 1;
                }
                let hh = (hour * 3600);
                let mm = (min * 60);
                let result = hh + mm + inputTimer;
                let HH = (result/3600).toFixed(3);
                let hhh = HH.split(".")[0];
                let mmm = HH.split(".")[1].split("")[1];
                breakTime = `${hhh} hr ${mmm} min`;
            }
            else {
                breakTime = `${inputTimer} sec`;
            }
        }
        if(inputTimer >= 60 && inputTimer < 3600) {
            if(timer.includes("sec")) {
                inputTimer += Number(timer.split(" ")[0]);
            }
            if(timer.includes("min") && !timer.includes("hr")) {
                inputTimer += Number(timer.split(" ")[0]);
            }
            if(timer.includes("hr")) {
                let hour = Number(timer.split(" ")[0]);
                let min = Number(timer.split(" ")[2]);
                if(min >= 60) {
                    hour += 1;
                }
                let hh = (hour * 3600);
                let mm = (min * 60);
                let result = hh + mm + inputTimer;
                let HH = (result/3600).toFixed(3);
                let hhh = HH.split(".")[0];
                let mmm = HH.split(".")[1].split("")[1];
                breakTime = `${hhh} hr ${mmm} min`;
            }
            inputTimer = (inputTimer/60).toFixed(0);
            breakTime = `${inputTimer} min`;
        }
        if(inputTimer >= 3600) {
            if(timer.includes("hr")) {
                let hh = Number(timer.split(" ")[0]) * 3600;
                let mm = Number(timer.split(" ")[2]) * 60;
                let result = (hh + mm + inputTimer);
                let HH = (result/3600).toFixed(3);
                let hhh = HH.split(".")[0];
                let mmm = HH.split(".")[1].split("")[1];
                if(mmm >= 60) {
                    hhh += 1;
                }
                breakTime = `${hhh} hr ${mmm} min`;
            }
                let HH = (inputTimer/3600).toFixed(3);
                let hh = HH.split(".")[0];
                let mm = HH.split(".")[1].split("")[1];
                breakTime = `${hh} hr ${mm} min`;
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
                    message: 'Status Changed to Active'
                })
                }
            })
            .catch(err => res.status(500).json({
                message: err
            }))  
        })
    })
    
});

module.exports = router;