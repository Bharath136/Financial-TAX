const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();
const multer = require('multer')

const storage = multer.memoryStorage();

// const upload = multer({ storage: storage });
const upload = multer({ dest: "uploads/" })

const { createCustomerNewTaxDocument, 
    getCustomerAllDocuments, 
    getCustomerDocumentById, 
    getCustomerDocumentByUserId,
    updateCustomerDocument, 
    deleteCustomerDocumentById } = require('../controllers/customerTaxDocuments')

router.post('/upload', upload.single('documents', 12), createCustomerNewTaxDocument)

router.get('/', authenticate(['CUSTOMER', 'ADMIN']), getCustomerAllDocuments)

router.get('/customer/:id', getCustomerDocumentByUserId)

router.route('/:id')
    .get(authenticate(['CUSTOMER', 'ADMIN']), getCustomerDocumentById)
    .put(authenticate(['CUSTOMER']), updateCustomerDocument)
    .delete(authenticate(['CUSTOMER', 'ADMIN']), deleteCustomerDocumentById)

module.exports = router