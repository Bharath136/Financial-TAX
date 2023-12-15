const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();
const { createTaxReturnPayment, executeTaxReturnPayment } = require('../controllers/paypalPayment');

// Middleware for generic error handling
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', success: false });
};

// Define your API routes
router.post('/create-payment',  createTaxReturnPayment);
router.get('/execute-payment', authenticate(['STAFF', 'CUSTOMER']), executeTaxReturnPayment);

// Apply the error handling middleware
router.use(errorHandler);

// Export the router
module.exports = router;
