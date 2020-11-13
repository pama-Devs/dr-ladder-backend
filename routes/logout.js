const express = require('express');
const router = express();
const User = require('../models/user');
const UserLoggerTrack = require('../models/userLoggerTrack')

// work with sheets //

const { google } = require('googleapis');
const keys = require('../client_secret.json');
const sheets = require('../sheets');

router.post('/:token', (req, res, next) => {
    // User.update({ token: req.params.token }, { $set: { isLoggedIn: false, token: '' } })
    // .exec();
    User.updateOne({ token: req.params.token }, { $set: {isLoggedIn: false } })
    .exec()
    .then((updateResult) => {
            User.findOne({token: req.params.token})
        .exec()
        .then(result => {
            //set time
            const dateObj = new Date();
            const userLogDetails = {
                date: dateObj.getDate(),
                day: dateObj.getDate(),
                month: findMonth(dateObj.getMonth()),
                year: dateObj.getFullYear(),
                hours: dateObj.getHours(),
                min: dateObj.getMinutes()
            }
            let totalSec = 19800 + (userLogDetails.hours * 3600) + (userLogDetails.min * 60);
            let hh = Math.floor(totalSec/3600);
            totalSec %= 3600;
            let mm = Math.floor(totalSec/60);
            const time = `${hh}:${mm}`;
            function findMonth(month) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                for(let i = 1; i <= months.length; i++) {
                    if(i == month) {
                        return months[i];
                    }
                }
            }

            UserLoggerTrack.updateOne({userEmailId: result.email, date: `${userLogDetails.date} ${userLogDetails.month} ${userLogDetails.year}`}, { $set: { outTime:  `${time}`}})
            .exec()
            .then(doSomething => {
                if(doSomething.n >= 1) {
                    UserLoggerTrack.findOne({userEmailId: result.email, date: `${userLogDetails.date} ${userLogDetails.month} ${userLogDetails.year}`})
                .exec()
                .then(finalResult => {
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
         
        
        }
        User.findOneAndUpdate({token: req.params.token}, { $set: { isLogOutFailure: false } }, { useFindAndModify: false })
        .exec()
        .then((result) => {
            res.status(200).json({
                message: 'Logged Out Successfully',
                isLoggedOut: true
            });
        })
    })

                })
            }
                
        });     
    })
    .catch(err => {
        if(err) {
            let result = User.findOneAndUpdate({token: req.params.token}, { $set: { isLogOutFailure: true } }, { useFindAndModify: false })
            .exec();
                res.status(500).json({
                    message: `Server error please login and logout`,
                    isLoggedOut: false
                })
        }
    })
        
    });
})

module.exports = router;

