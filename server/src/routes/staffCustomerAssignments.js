const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getStaffAssignments } = require('../controllers/staffCustomerAssignments')

router.get('/',authenticate(['ADMIN','STAFF']), getAssignments)

router.get('/staff/:id', authenticate(['STAFF', 'ADMIN']), getStaffAssignments)

router.post('/assign', authenticate(['ADMIN']), createAssignment)

router.route('/:id')
    .get(authenticate(['STAFF', 'ADMIN']), getAssignmentById)
    .put(authenticate(['ADMIN']), updateAssignment)
    .delete(authenticate(['ADMIN']),deleteAssignment)



module.exports = router