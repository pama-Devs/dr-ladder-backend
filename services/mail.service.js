const nodemailer = require('nodemailer');

exports.sendMail = (options) => {
    const   host = process.env.HOST,
            port = process.env.PORT,
            username = process.env.USERNAME,
            password = process.env.PASSWORD
    const   transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: '587',
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: 'minazuddin23@gmail.com',
                pass: 'uiux.1996.'
            }
    })
    return transport.sendMail(options);
}