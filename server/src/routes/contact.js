const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const {createMessage,getMessage} = require('../controllers/contact')

router.post('/message', createMessage)

router.get('/message', authenticate(['ADMIN']), getMessage)

module.exports = router