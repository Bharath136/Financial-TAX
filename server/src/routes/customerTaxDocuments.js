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
    createCustomerNewTaxDocument,
    getCustomerAllDocuments,
    getCustomerDocumentById,
    getCustomerDocumentByUserId,
    updateCustomerDocument,
    updateDocumentAssignedStatus,
    deleteCustomerDocumentById,
    updateDocumentReviewStatus,
    downloadDocument,
    getStaffClientAssignedDocuments,
    getStaffClientAssignedDocumentsByUserID
} = require('../controllers/customerTaxDocuments');

// Endpoint to download a document
router.get('/download/:id', downloadDocument)

// Upload a new tax document for a customer
router.post('/upload', upload.single('file'), authenticate(['CUSTOMER']), createCustomerNewTaxDocument);

// Get all documents for a customer or staff
router.get('/', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerAllDocuments);

// Get documents assigned to staff for a specific client
router.get('/get-assigned-client-documents', authenticate(['STAFF', 'ADMIN']), getStaffClientAssignedDocuments)

// Get documents assigned to staff for a specific client by user ID
router.get('/get-assigned-client-documents/:id', authenticate(['STAFF', 'ADMIN']), getStaffClientAssignedDocumentsByUserID)

// Get documents for a specific customer by user ID
router.get('/customer/:id', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerDocumentByUserId);

// Update document review status by ID
router.put('/review-status/:id', authenticate(['ADMIN', 'STAFF']), updateDocumentReviewStatus);

// Update document assigned status by ID (only for admin)
router.put('/assigned-status/:id', authenticate(['ADMIN']), updateDocumentAssignedStatus);

// CRUD operations for a specific document by ID
router
    .route('/:id')
    .get(authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerDocumentById)
    .put(authenticate(['CUSTOMER']), updateCustomerDocument)
    .delete(authenticate(['CUSTOMER', 'ADMIN']), deleteCustomerDocumentById);

module.exports = router;
