const express = require('express');
const router = express.Router();
const multer = require('multer');
// work with sheets //

const { google } = require('googleapis');
const keys = require('../client_secret.json');
const sheets = require('../sheets');
const { response } = require('express');

//work with sheet
const upload = multer({
    dest: 'uploads/'
})

router.get('/:tab', upload.single(''), (req, res, next) => {
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
            getSheet(client, req.params.tab);
        }
    })

    async function  getSheet(client, tab) {
        //run gsrun
        const gsapi = google.sheets({
            version: "v4",
            auth: client
        });

    // get values
        const options = {
            spreadsheetId: '1pd3jVZU2dEtDC0rc_03E5AcXYQbeGoJvhwB7uy-xxGg',
            range: tab
        }
        const result = await gsapi.spreadsheets.values.get(options);
        res.status(200).json({
            message: 'sheets fetched',
            values: result.data.values
        })
    }
});

module.exports = router;