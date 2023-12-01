const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { createCustomerNewTaxComment,
     getCustomerAllComments, 
     updateCustomerComments, 
     getCustomerCommentById, 
     deleteCustomerCommentById,
     getCommentsByDocId } = require('../controllers/customerTaxComments')

router.get('/get-comments/:id', authenticate(['CUSTOMER']), getCommentsByDocId);

router.post('/create',authenticate(['CUSTOMER']), createCustomerNewTaxComment)

router.get('/', authenticate(['CUSTOMER', 'STAFF', 'ADMIN']), getCustomerAllComments)

// Authorized user api
router.route("/:id")
    .get(authenticate(['CUSTOMER', 'STAFF', 'ADMIN']),getCustomerCommentById)
    .put(authenticate(['CUSTOMER']), updateCustomerComments)
    .delete(authenticate(['CUSTOMER', 'ADMIN']), deleteCustomerCommentById);

module.exports = router