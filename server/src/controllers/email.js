
const nodemailer = require('nodemailer');
const client = require('../database/connection');
require('dotenv').config();

const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
};

const transporter = nodemailer.createTransport(emailConfig);

// Use an object to store OTPs associated with email addresses
const otpStore = {};

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(email, otp, name) {
    const mailOptions = {
        from: process.env.EMAIL, // Use the configured email
        to: email,
        subject: 'UniProFin Account Verification OTP',
        text: `Dear ${name},

Thank you for registering with UniProFin!

To complete your registration, please use the following One-Time Password (OTP) for verification:
OTP: ${otp}

This OTP is valid for a limited time. Do not share it with anyone for security reasons.

Welcome to UniProFin! If you did not initiate this registration, please contact our support immediately at support@uniprofin.com or visit our [Contact Support](https://uniprofin.com/contact) page.

Best regards,
UniProFin Team`,
    };
    
    const deleteEmailVerification = `
        DELETE FROM email_verification WHERE email_address = $1
    `;
    client.query(deleteEmailVerification, [email])



    const createEmailVerification = `
        INSERT INTO email_verification(email_address, otp)
        VALUES($1, $2)
    `;

    // Use client.query with promises
    client.query(createEmailVerification, [email, otp])


    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                // Store the OTP associated with the email address
                otpStore[email] = otp;
                resolve(info);
                setTimeout(() => {
                    const deleteEmail = `
                    DELETE FROM email_verification WHERE email_address = $1
                `;
                    // Use client.query with promises for deletion
                    client.query(deleteEmail, [email])
                        .then(() => console.log(`Record for ${email} deleted from the database`))
                        .catch(deleteError => console.error('Error deleting record:', deleteError));
                }, 120000); // 1 minute delay
            }
        });
    });
}


function resetPasswordOTP(email, otp) {
    const mailOptions = {
        from: process.env.EMAIL, // Use the configured email
        to: email,
        subject: 'UniProFin Password Reset OTP',
        text: `Dear ${email},

We received a request to reset your password for your UniProFin account.

To proceed with the password reset, please use the following One-Time Password (OTP):
OTP: ${otp}

This OTP is valid for a limited time. Do not share it with anyone for security reasons.

If you did not initiate this password reset, please ignore this email.

For any assistance, please contact our support at support@uniprofin.com or visit our [Contact Support](https://uniprofin.com/contact) page.

Best regards,
UniProFin Team`,
    };


    const deleteEmailVerification = `
        DELETE FROM email_verification WHERE email_address = $1
    `;
    client.query(deleteEmailVerification, [email])


    const createEmailVerification = `
        INSERT INTO email_verification(email_address, otp)
        VALUES($1, $2)
    `;

    // Use client.query with promises
    client.query(createEmailVerification, [email, otp])


    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                // Store the OTP associated with the email address
                otpStore[email] = otp;
                resolve(info);
                setTimeout(() => {
                    const deleteEmail = `
                    DELETE FROM email_verification WHERE email_address = $1
                `;
                    // Use client.query with promises for deletion
                    client.query(deleteEmail, [email])
                        .then(() => console.log(`Record for ${email} deleted from the database`))
                        .catch(deleteError => console.error('Error deleting record:', deleteError));
                }, 120000); // 1 minute delay
            }
        });
    });
}


const verifyOtp = async (req, res) => {
    const { email_address, otp } = req.body;

    if (!email_address || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const getEmail = `
            SELECT otp FROM email_verification WHERE email_address = $1
        `;

        const { rows } = await client.query(getEmail, [email_address]);
        const storedOTP = rows[0] ? String(rows[0].otp) : undefined;
        if (storedOTP === String(otp)) {
            const deleteEmail = `
                    DELETE FROM email_verification WHERE email_address = $1
                `;
            // Use client.query with promises for deletion
            client.query(deleteEmail, [email_address])
            res.json({ message: 'OTP verification successful' });
        } else {
            res.status(401).json({ error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error during OTP verification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    generateOTP,
    sendOTP,
    verifyOtp,
    resetPasswordOTP
};
