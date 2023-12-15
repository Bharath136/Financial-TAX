const express = require('express');
const router = express.Router();
const {
    createCustomerResponse,
    getAllCustomerResponses,
    getCustomerResponseById,
    updateCustomerResponse,
    deleteCustomerResponse,
} = require('../controllers/customerResponse');

// Create a new customer response
router.post('/', createCustomerResponse);

// Get all customer responses
router.get('/', getAllCustomerResponses);

// Get customer response by ID
router.route('/:id')
    .get(getCustomerResponseById)
    .put(updateCustomerResponse)
    .delete(deleteCustomerResponse)


module.exports = router;
