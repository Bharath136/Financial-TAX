const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const {
    createCustomerNewTaxComment,
    getCustomerAllComments,
    updateCustomerComments,
    getCustomerCommentById,
    deleteCustomerCommentById,
    getCommentsByDocId,
    updateCommentStatus
} = require('../controllers/customerTaxComments')

// Get comments for a specific document by ID
router.get('/get-comments/:id', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCommentsByDocId);

// Update comment status by ID (only for staff and admin)
router.put('/comment-status/:id', authenticate(['STAFF', 'ADMIN']), updateCommentStatus)

// Create a new tax comment (only for customers)
router.post('/create', authenticate(['CUSTOMER']), createCustomerNewTaxComment)

// Get all comments for a customer or staff
router.get('/', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerAllComments)

// CRUD operations for a specific comment by ID
router
    .route("/:id")
    .get(authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerCommentById)
    .put(authenticate(['CUSTOMER']), updateCustomerComments)
    .delete(authenticate(['CUSTOMER', 'ADMIN']), deleteCustomerCommentById);

module.exports = router;
