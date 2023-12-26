// api.js
const express = require('express');
const { generateOTP, sendOTP, verifyOtp } = require('../controllers/email');

const router = express.Router();

router.post('/send-otp', async (req, res) => {
    const { email_address } = req.body;
    if (!email_address) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const generatedOTP = generateOTP();

    // Save the OTP in a secure manner, such as a database, for verification later

    try {
        await sendOTP(email_address, generatedOTP);
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', verifyOtp)

module.exports = router;
