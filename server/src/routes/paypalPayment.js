const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();
const { createPayment, executePayment } = require('../controllers/paypalPayment');

// Define your API routes
router.post('/create-payment', createPayment);
router.post('/execute-payment', executePayment);

// Export the router
module.exports = router;