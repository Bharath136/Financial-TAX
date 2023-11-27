const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();
const multer = require('multer');

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
    createCustomerNewTaxDocument,
    getCustomerAllDocuments,
    getCustomerDocumentById,
    getCustomerDocumentByUserId,
    updateCustomerDocument,
    updateDocumentAssignedStatus,
    deleteCustomerDocumentById,
    updateDocumentReviewStatus,
    downloadDocument
} = require('../controllers/customerTaxDocuments');


// Endpoint to download a document
router.get('/download/:id', downloadDocument)


router.post('/upload', upload.single('file'), authenticate(['CUSTOMER']), createCustomerNewTaxDocument);

router.get('/', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerAllDocuments);

router.get('/customer/:id', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerDocumentByUserId);

router.put('/review-status/:id', authenticate(['ADMIN', 'STAFF']), updateDocumentReviewStatus);
router.put('/assigned-status/:id', authenticate(['ADMIN']), updateDocumentAssignedStatus);

router
    .route('/:id')
    .get(authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerDocumentById)
    .put(authenticate(['CUSTOMER']), updateCustomerDocument)
    .delete(authenticate(['CUSTOMER', 'ADMIN']), deleteCustomerDocumentById);

module.exports = router;
