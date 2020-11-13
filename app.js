const express = require('express');
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//connecting to mongoDB
const uri = 'mongodb+srv://minhaj:' + process.env.DB_PASSWORD + '@node-api-shop.5wrjk.mongodb.net/test?retryWrites=true&w=majority';
 mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
    }, () => console.log("connected to mongodb atlas..."));


const loginRouter = require('./routes/login')
const signUpRouter = require('./routes/signup')
const logoutRouter = require('./routes/logout');
const sheetsUpdateRouter = require('./routes/sheetsBatchUpdate');
const sheetsEditRouter = require('./routes/spreadsheetEdit');
const sheetsFetchRouter = require('./routes/spreadsheetFetch');
const userLoggerTrack = require('./routes/userLoggerTrack');
const resendOTPRouter = require('./routes/resendOTP');
const verifyNewOTPRouter = require('./routes/verifyNewOTP');
const passwordResetRouter = require('./routes/passwordReset');
const hireFormRouter = require('./routes/hireForm')
const joinUsFormRouter = require('./routes/joinUs');
const adminCreateRouter = require('./routes/adminCreate');
const adminLoginRouter = require('./routes/adminLogin');
const adminLogoutRouter = require('./routes/adminLogout');
const adminResendOtpRouter = require('./routes/adminResendOTP');
const adminVerifyNewOTPRouter = require('./routes/adminVerifyNewOTP');
const adminPasswordResetRouter = require('./routes/adminPasswordReset');
const trackBreakTimeRouter = require('./routes/trackBreakTime');


app.use(cors());

app.use('/login', loginRouter);
app.use('/signup', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/sheets-batch-update', sheetsUpdateRouter);
app.use('/sheets-edit', sheetsEditRouter);
app.use('/sheets-fetch', sheetsFetchRouter);
app.use('/user-logger-track', userLoggerTrack);
app.use('/resend-otp', resendOTPRouter);
app.use('/verify-otp', verifyNewOTPRouter);
app.use('/reset-password', passwordResetRouter);
app.use('/hire-form', hireFormRouter);
app.use('/join-us', joinUsFormRouter);
app.use('/admin-create', adminCreateRouter);
app.use('/admin-login', adminLoginRouter);
app.use('/admin-logout', adminLogoutRouter);
app.use('/admin-resend-otp', adminResendOtpRouter);
app.use('/admin-verify-new-otp', adminVerifyNewOTPRouter);
app.use('/admin-reset-password', adminPasswordResetRouter)
app.use('/track-break-time', trackBreakTimeRouter)

module.exports = app;