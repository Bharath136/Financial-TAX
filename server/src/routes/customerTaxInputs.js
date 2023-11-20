const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { createCustomerTaxInput,
    updateCustomerTaxInput,
    getCustomerTaxInputById,
    getCustomerTaxInputs,
    deleteCustomerTaxInputById } = require('../controllers/customerTaxInputs')


router.post('/create', createCustomerTaxInput)

router.get('/', getCustomerTaxInputs)

router.route('/:id')
    .get(getCustomerTaxInputById)
    .put(updateCustomerTaxInput)
    .delete(deleteCustomerTaxInputById)


module.exports = router
