const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { createCustomerNewTaxComment, getCustomerAllComments, updateCustomerComments, getCustomerCommentById, deleteCustomerCommentById } = require('../controllers/customerTaxComments')


router.post('/create',createCustomerNewTaxComment)

router.get('/', getCustomerAllComments)

// Authorized user api
router.route("/:id")
    .get(getCustomerCommentById)
    .put( updateCustomerComments)
    .delete( deleteCustomerCommentById);

module.exports = router