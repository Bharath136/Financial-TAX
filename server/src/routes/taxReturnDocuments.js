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
        createTaxReturnDocument,
        downloadDocument,
        updateTaxreturnDocument,
        getCustomerAllDocuments
    } = require('../controllers/taxReturnDocuments')

router.post('/upload', upload.single('file'), authenticate(['STAFF']), createTaxReturnDocument)

router.get('/download/:id',  downloadDocument)

router.get('/', authenticate(['STAFF', 'CUSTOMER']), getCustomerAllDocuments)

module.exports = router