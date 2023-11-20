const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const {
    createTaxInput,
    getAllTaxInputs,
    getTaxInputById,
    updateTaxInputById,
    deleteTaxInputById
} = require('../controllers/taxInputs')


router.post('/create', createTaxInput)

router.get('/', getAllTaxInputs)

router.route('/:id')
    .get(getTaxInputById)
    .put(updateTaxInputById)
    .delete(deleteTaxInputById)


module.exports = router
