const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();
const { createTaxReturnPayment, executeTaxReturnPayment, paymentDetails, getAllPaymentDetails, getPaymentDetailsByUserId } = require('../controllers/paypalPayment');

// Middleware for generic error handling
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', success: false });
};

// Define your API routes
router.post('/create-payment',  createTaxReturnPayment);
router.get('/execute-payment', executeTaxReturnPayment);
router.post('/payment-details', authenticate(['CUSTOMER']), paymentDetails);
router.get('/payment-details', authenticate(['CUSTOMER', 'ADMIN']), getAllPaymentDetails)
router.get('/payment-details/:id', authenticate(['CUSTOMER', 'ADMIN']), getPaymentDetailsByUserId)

// Apply the error handling middleware
router.use(errorHandler);

// Export the router
module.exports = router;
