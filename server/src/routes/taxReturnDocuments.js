const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();
const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

const {
    createTaxReturnDocument,
    downloadDocument,
    updateTaxreturnDocument,
    getCustomerAllDocuments,
    getCustomerTaxReturnDocumentById,
    updateTaxreturnDocumentPaymentStatus
} = require('../controllers/taxReturnDocuments');

// API endpoint for uploading tax return documents
router.post('/upload', upload.single('file'), authenticate(['STAFF']), createTaxReturnDocument);

// API endpoint for updating tax return payments status
router.put('/payment-status', updateTaxreturnDocumentPaymentStatus)

// API endpoint for downloading tax return documents
router.get('/download/:id', downloadDocument);

// API endpoint for getting all customer documents
router.get('/', authenticate(['STAFF', 'CUSTOMER']), getCustomerAllDocuments);

// API endpoit for getting document details 
router.get('/:id', authenticate(['STAFF', 'CUSTOMER']), getCustomerTaxReturnDocumentById);

module.exports = router;
