import nodemailer from 'nodemailer';
import { email_password, email_username } from './constants';

// Setup the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email_username,
        pass: email_password,
    },
    tls: {
        rejectUnauthorized: false, // Use with caution, especially in production
    },
});

export const admin_account_created_mail = (user: any) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Labpspace</title>
            <style>
                body {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    display: inline-block;
                    text-align: left;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin: 0 0 20px 0;
                }

                p {
                    color: #555;
                    line-height: 1.6;
                }

                a {
                    color: #0066cc;
                    text-decoration: none;
                }

                ul {
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to Labpspace, ${user.first_name}!</h1>
                <p>Your admin account has been successfully created. You can now log in and start managing tasks efficiently.</p>
                <p>If you need help, contact us at <a href="mailto:support@labpspace.com">support@labpspace.com</a>.</p>
                <p>Best regards,</p>
                <p>The Labpspace Team</p>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: { name: "Labpspace", address: 'support@labpspace.com' },
        to: user.email,
        subject: "Labpspace: Admin Account Created",
        html: htmlContent,
        text: 'Your admin account has been created.'
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        handle_email_response(error, info, user.email);
    });
};

export const user_account_created_mail = (user: any, password: string) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Account Created</title>
            <style>
                body {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    display: inline-block;
                    text-align: left;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin: 0 0 20px 0;
                }

                p {
                    color: #555;
                    line-height: 1.6;
                }

                a {
                    color: #0066cc;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to Labpspace, ${user.first_name}!</h1>
                <p>Your account has been created by the admin. Below are your login credentials:</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>We recommend changing your password immediately after logging in to ensure your account's security.</p>
                <p>For assistance, contact us at <a href="mailto:support@labpspace.com">support@labpspace.com</a>.</p>
                <p>Best regards,</p>
                <p>The Labpspace Team</p>
            </div>
        </body>
        </html>
    `;
    
    const mailOptions = {
        from: { name: "Labpspace", address: 'support@labpspace.com' },
        to: user.email,
        subject: "Labpspace: User Account Created",
        html: htmlContent,
        text: `Your account has been created. Email: ${user.email}, Password: ${password}`
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        handle_email_response(error, info, user.email);
    });
};

export const account_deactivated_mail = (user: any) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Deactivated</title>
            <style>
                body {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    display: inline-block;
                    text-align: left;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin: 0 0 20px 0;
                }

                p {
                    color: #555;
                    line-height: 1.6;
                }

                a {
                    color: #0066cc;
                    text-decoration: none;
                }

                ul {
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Account Deactivated</h1>
                <p>Hello ${user.first_name},</p>
                <p>Your account has been deactivated by the admin. If this was an error, please contact support at <a href="mailto:support@labpspace.com">support@labpspace.com</a>.</p>
                <p>Best regards,</p>
                <p>The Labpspace Team</p>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: { name: "Labpspace", address: 'support@labpspace.com' },
        to: user.email,
        subject: "Labpspace: Account Deactivated",
        html: htmlContent,
        text: 'Your account has been deactivated.'
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        handle_email_response(error, info, user.email);
    });
};

export const password_reset_otp_mail = (user: any, otp: string) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP</title>
            <style>
                body {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    display: inline-block;
                    text-align: left;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin: 0 0 20px 0;
                }

                p {
                    color: #555;
                    line-height: 1.6;
                }

                a {
                    color: #0066cc;
                    text-decoration: none;
                }

                ul {
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset OTP</h1>
                <p>Hello ${user.first_name},</p>
                <p>Use the OTP below to reset your password:</p>
                <strong>${otp}</strong>
                <p>This OTP expires in 20 minutes. If you did not request this, please secure your account immediately.</p>
                <p>Best regards,</p>
                <p>The Labpspace Team</p>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: { name: "Labpspace", address: 'support@labpspace.com' },
        to: user.email,
        subject: "Labpspace: Password Reset OTP",
        html: htmlContent,
        text: 'Your password reset OTP is included in the email.'
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        handle_email_response(error, info, user.email);
    });
};

export const password_reset_success_mail = (user: any) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Successful</title>
            <style>
                body {
                    text-align: center;
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    display: inline-block;
                    text-align: left;
                    margin: 20px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    max-width: 600px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    color: #333;
                    text-align: center;
                    margin: 0 0 20px 0;
                }

                p {
                    color: #555;
                    line-height: 1.6;
                }

                a {
                    color: #0066cc;
                    text-decoration: none;
                }

                ul {
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset Successful</h1>
                <p>Hello ${user.first_name},</p>
                <p>Your password has been successfully changed. If you did not perform this action, contact support immediately.</p>
                <p>Best regards,</p>
                <p>The Labpspace Team</p>
            </div>
        </body>
        </html>
    `;
    const mailOptions = {
        from: { name: "Labpspace", address: 'support@labpspace.com' },
        to: user.email,
        subject: "Labpspace: Password Reset Successful",
        html: htmlContent,
        text: 'Your password reset was successful.'
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        handle_email_response(error, info, user.email);
    });
};

// Add similar templates for tasks created, assigned, and other scenarios
const handle_email_response = (error: any, info: any, email: string) => {
    if (error) {
        console.error(`Failed to send email to ${email}:`, error);
    } else {
        console.log(`Email successfully sent to ${email}:`, info.response);
    }
};
