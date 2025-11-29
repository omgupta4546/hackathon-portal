const nodemailer = require('nodemailer');

const sendMail = async ({ to, subject, html }) => {
    console.log('Preparing to send email...');
    console.log('SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER
    });

    if (!process.env.SMTP_HOST) {
        console.error('Error: SMTP_HOST is not defined in environment variables.');
        return null;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '',
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Hackathon Portal" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log('✉️  Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        return null;
    }
};

module.exports = { sendMail };
