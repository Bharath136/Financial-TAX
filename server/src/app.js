const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 8000;
const userRouter = require('./routes/user');
const staffCustomerAssignmentsRouter = require('./routes/staffCustomerAssignments');
const customerTaxCommentsRouter = require('./routes/customerTaxComments');
const customerTaxDocumentsRouter = require('./routes/customerTaxDocuments');
const customerTaxInputs = require('./routes/customerTaxInputs');
const taxInputs = require('./routes/taxInputs');
const taxDocuments = require('./routes/taxDocuments');
const taxReturnDocuments = require('./routes/taxReturnDocuments')
const paypalPayment = require('./routes/paypalPayment')
const contact = require('./routes/contact')
const client = require('./database/connection');

app.use(express.urlencoded({ extended: true }));

app.use(express.json())

app.use(cors());

// File Uploading with multer
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

app.use('/uploads', express.static('uploads'));


// Error handling middleware with the `err` parameter
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', success: false });
    // Remove the next() call here
});

// Mount the user router
app.use('/user', userRouter);

// Mount the customer tax comment router
app.use('/customer-tax-comment', customerTaxCommentsRouter);

// Mount the customer tax comment router
app.use('/customer-tax-document', customerTaxDocumentsRouter);

// Mount the customer tax inputs router
app.use('/customer-tax-inputs', customerTaxInputs);

// Mount the tax inputs router
app.use('/tax-inputs', taxInputs);

// Mount the tax documents router
app.use('/tax-documents', taxDocuments);

// Mount the staff customer assignments router
app.use('/staff-customer-assignments', staffCustomerAssignmentsRouter)

// Mount the tax return documents router
app.use('/tax-return-document', taxReturnDocuments)

// Mount the paypal payment gateway
app.use('/paypal', paypalPayment)

// Mount the contact
app.use('/contact', contact)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
