// Import necessary modules
const express = require('express');
const router = express.Router();
const dummyUserController = require('../controllers/dummy_users');
const { authenticate } = require('../middlewares/middleware');

const multer = require('multer');

// Use memory storage to get the file buffer in req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Define API routes
router.post('/', authenticate(['ADMIN']), dummyUserController.createDummyUser);
router.post('/from-excel', authenticate(['ADMIN']), upload.single('file'), dummyUserController.createDummyUsersFromExcel);
router.get('/', authenticate(['ADMIN']), dummyUserController.getAllDummyUsers);
router.get('/:id', authenticate(['ADMIN']), dummyUserController.getDummyUserById);
router.put('/:id', authenticate(['ADMIN']), dummyUserController.updateDummyUser);
router.put('/status/:id', authenticate(['ADMIN']), dummyUserController.updateStatus);
router.delete('/:id', authenticate(['ADMIN']), dummyUserController.deleteDummyUser);

// Export the router for use in your main application file
module.exports = router;
