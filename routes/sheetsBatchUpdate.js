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

router.post('/:tab', (req, res, next) => {

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
        console.log(req.body.datas)
        let batchData = [];
        let datas = req.body.datas;
        for(let data of datas) {
            if(data.value) {
                const cellData = {
                    range: `${req.params.tab}!${data.range}`,
                    values: [[data.value]]
                }
                batchData.push(cellData);
            }
        }
        const batch = {
            spreadsheetId: '1pd3jVZU2dEtDC0rc_03E5AcXYQbeGoJvhwB7uy-xxGg',
            resource: {
                valueInputOption: 'RAW',
                data: [...batchData]
            }
        };
        const result = await gsapi.spreadsheets.values.batchUpdate(batch);
        res.status(200).json({
            message: 'sheet updated'
        })
    }
    
});

module.exports = router;