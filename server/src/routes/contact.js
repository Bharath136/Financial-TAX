const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { createMessage, getMessage, deleteMessageById } = require('../controllers/contact')

// API endpoint to create a new message
router.post('/message', createMessage);

// API endpoint to get messages (only for admins)
router.get('/message', authenticate(['ADMIN']), getMessage);

// API endpoint to get messages (only for admins)
router.delete('/message/:id', authenticate(['ADMIN']), deleteMessageById);

module.exports = router;
