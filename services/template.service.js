const path = require('path');
const nunjucks = require('nunjucks');
const MailService = require('./mail.service');
const UserService = require('./user.service');

const HireFormService = require('./hireForm.service');
const JoinUsService = require('./joinUs.service');

const TEMPLATE_PATH = path.resolve(__dirname, "../templates"); 
nunjucks.configure(TEMPLATE_PATH, { autoescape: true });

exports.userOtpTemplate = async(userData) => {
    try {
        const data = await UserService.getUserData({ email: userData.email });
        console.log(`Sending Email to minhaj.pamanetwork@gmail.com`);
        const emailOptions = {
            from: process.env.SENDER_MAIL,
            to: 'connectprabhu01@gmail.com',
            subject: 'OTP EMAIL',
            html: TemplateForUserOtp(data.otp)
        }
        const sendMail = await MailService.sendMail(emailOptions);
        if(sendMail) {
            console.log(`Email Sent Successfully to connectprabhu01@gmail.com`);
        } 
    } catch(err) {
        console.log('Error', err);
    }
}

exports.userResendOtpTemplate = async(otp) => {
    try {
        console.log(`Sending Email to minhaj.pamanetwork@gmail.com`);
        const emailOptions = {
            from: process.env.SENDER_MAIL,
            to: 'connectprabhu01@gmail.com',
            subject: 'OTP EMAIL',
            html: TemplateForUserOtp(otp)
        }
        const sendMail = await MailService.sendMail(emailOptions);
        if(sendMail) {
            console.log(`Email Sent Successfully to connectprabhu01@gmail.com`);
        } 
    } catch(err) {
        console.log('Error', err);
    }
}

const TemplateForUserOtp = (otp) => {
    console.log('data', otp);
    return nunjucks.render('verification_template.html', {
        otp: otp
    });
}

exports.hireFormTemplate = async(userMail) => {
    try {
        const hireFormData = await HireFormService.getHireForm({ email: userMail });
        console.log(`Sending Email to minazuddin23@gmail.com`);
        const emailOptions = {
            from: process.env.SENDER_MAIL,
            to: 'varun@pamanetwork.com',
            subject: 'OTP EMAIL',
            html: TemplateForHireForm(hireFormData)
        }
        const sendMail = await MailService.sendMail(emailOptions);
        if(sendMail) {
            console.log(`Email Sent Successfully to varun@pamanetwork.com`);
        } 
    } catch(err) {
        console.log('Error', err);
    }
}

const TemplateForHireForm = (data) => {
    return nunjucks.render('hire_form_template.html', {
        form: {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message
        }
    });
}

exports.joinUsFormTemplate = async(userMail) => {
    try {
        const joinUsFormData = await JoinUsService.getJoinUsForm({ email: userMail });
        console.log(`Sending Email to minazuddin23@gmail.com`);
        const emailOptions = {
            from: process.env.SENDER_MAIL,
            to: 'varun@pamanetwork.com',
            subject: 'OTP EMAIL',
            html: TemplateForJoinUsForm(joinUsFormData)
        }
        const sendMail = await MailService.sendMail(emailOptions);
        if(sendMail) {
            console.log(`Email Sent Successfully to varun@pamanetwork.com`);
        } 
    } catch(err) {
        console.log('Error', err);
    }
}

const TemplateForJoinUsForm = (data) => {
    return nunjucks.render('join_form_template.html', {
        form: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            contact: data.contact,
            preferrable_location: data.preferrable_location,
            position: data.position
        }
    });
}

