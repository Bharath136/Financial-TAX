const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { createNewDocument,
    getTaxDocuments,
    getTaxDocumentById,
    updateTaxDocumentById,
    deleteTaxDocumentById } = require('../controllers/taxDocuments')


router.post('/create', createNewDocument)

router.get('/', getTaxDocuments)

router.route('/:id')
    .get(getTaxDocumentById)
    .put(updateTaxDocumentById)
    .delete(deleteTaxDocumentById)


module.exports = router
