// Import necessary modules
const express = require('express');
const router = express.Router();
const dummyUserController = require('../controllers/dummy_users');
const { authenticate } = require('../middlewares/middleware');

// Define API routes
router.post('/', authenticate(['ADMIN']), dummyUserController.createDummyUser);
router.post('/from-excel', authenticate(['ADMIN']), dummyUserController.createDummyUsersFromExcel);
router.get('/', authenticate(['ADMIN']), dummyUserController.getAllDummyUsers);
router.put('/:id', authenticate(['ADMIN']), dummyUserController.updateDummyUser);
router.delete('/:id', authenticate(['ADMIN']), dummyUserController.deleteDummyUser);

// Export the router for use in your main application file
module.exports = router;
