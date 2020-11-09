const { google } = require('googleapis');

//run google sheets
exports.editSheet = async (client, form) => {
        const gsapi = google.sheets({
            version: "v4",
            auth: client
        });
    
       // append rows
        const appendData = [['', form.date, form.recruiter_name, form.college, form.speciality, form.post,
            form.candidate_name, form.qualification, form.mobile_number, form.experience, form.current_sal,
            form.current_location, form.languages_known, form.expected_sal, form.preferable_loc,
            form.family, form.notice_period, form.feedback
        ]];
        const append = {
            spreadsheetId: '1pd3jVZU2dEtDC0rc_03E5AcXYQbeGoJvhwB7uy-xxGg',
            range: `${form.recruiter_name}`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: appendData
            }
        }
        const appendResult = await gsapi.spreadsheets.values.append(append);
    
}

//run google sheets
exports.getSheet = async (client, tab) => {
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
    return result;

}