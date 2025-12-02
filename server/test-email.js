require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing Email Configuration...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);

    if (!process.env.SMTP_HOST) {
        console.error('❌ Error: SMTP_HOST is not defined.');
        return;
    }

    const port = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '',
        },
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection Successful! Your credentials are correct.');
    } catch (error) {
        console.error('❌ SMTP Connection Failed:', error);
        console.log('Tip: If using Gmail, make sure you are using an App Password, not your login password.');
    }
};

testEmail();
