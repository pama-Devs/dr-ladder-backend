const path = require('path');
const nunjucks = require('nunjucks');
const MailService = require('./mail.service');
const UserService = require('./user.service');
const HireService = require('./hireus.service');

const TEMPLATE_PATH = path.resolve(__dirname, "../templates"); 
nunjucks.configure(TEMPLATE_PATH, { autoescape: true });

exports.contactFormTemplate = async(userMail) => {
    try {
        const userFormData = await UserService.getUserForm({ email: userMail });
        console.log(userFormData);
        console.log(`Sending Email to ${userMail}`);
        const emailOptions = {
            from: process.env.SENDER_MAIL,
            to: userMail,
            subject: 'Test Email',
            html: TemplateForm(userFormData)
        }
        const sendMail = await MailService.sendMail(emailOptions);
        if(sendMail) {
            console.log(`Email Sent Successfully to ${userMail}`);
        } 
    } catch(err) {
        console.log('Error', err);
    }
}

const TemplateForm = (data) => {
    console.log('data', data);
    const profile_pic = `http://localhost:5000/uploads/${data.photo}`;
    const resumeLink = `http://localhost:5000/uploads/${data.resume}`;
    return nunjucks.render('form_template.html', {
        data,
        resumeLink,
        profile_pic
    });
}

exports.hireUsFormTemplate = async(userMail) => {
    try {
        const hireUsFormData = await UserService.HireService({ email: userMail });
        console.log(userFormData);
        console.log(`Sending Email to ${userMail}`);
        const emailOptions = {
            from: process.env.SENDER_MAIL,
            to: userMail,
            subject: 'Test Email',
            html: HireUsTemplateForm(hireUsFormData)
        }
        const sendMail = await MailService.sendMail(emailOptions);
        if(sendMail) {
            console.log(`Email Sent Successfully to ${userMail}`);
        } 
    } catch(err) {
        console.log('Error', err);
    }
}

const HireUsTemplateForm = (data) => {
    const profile_pic = `http://localhost:5000/uploads/${data.photo}`;
    const resumeLink = `http://localhost:5000/uploads/${data.resume}`;
    return nunjucks.render('hire_us_form_template.html', {
        form: {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.subject
        }
    });
}
