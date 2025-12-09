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

    const port = Number(process.env.SMTP_PORT) || 465;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '',
        },
    });

    try {
        // Verify connection configuration
        await transporter.verify();
        console.log('✅ SMTP Connection verified successfully');

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
        if (error.code === 'ETIMEDOUT') {
            console.error('👉 Tip: Check if your network blocks port ' + port + '. Try using port 465 with secure: true if supported.');
        }
        return null;
    }
};

module.exports = { sendMail };
