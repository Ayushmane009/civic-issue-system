const nodemailer = require('nodemailer');

/**
 * Reusable Email Service for Civic Issue System
 * Uses Gmail OAuth2 for production-ready reliability
 */

const sendEmail = async ({ to, subject, type, location, title }) => {
    try {
        // 1. Create a transporter using OAuth2
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL_USER,
                clientId: process.env.EMAIL_CLIENT_ID,
                clientSecret: process.env.EMAIL_CLIENT_SECRET,
                refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            },
        });

        // 2. Define the email content
        const mailOptions = {
            from: `"Civic Issue System" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #3b82f6;">Complaint Submitted Successfully</h2>
                    <p>Hello,</p>
                    <p>Your civic issue has been recorded in our system. Here are the details:</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Issue Title:</strong> ${title}</p>
                        <p><strong>Issue Type:</strong> ${type}</p>
                        <p><strong>Location:</strong> ${location}</p>
                    </div>
                    <p>Our team will review your report and update the status shortly.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.8rem; color: #666;">This is an automated message, please do not reply.</p>
                </div>
            `,
        };

        // 3. Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw to handle in the controller
    }
};

module.exports = { sendEmail };
