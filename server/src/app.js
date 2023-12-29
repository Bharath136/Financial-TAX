const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const port = 8000;
const app = express();

// Middleware for handling form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// File Uploading with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
// const upload = multer({ storage: storage });

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', success: false });
    // Avoid calling next() here to prevent execution of subsequent middleware
});

// Mount the user router
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// Mount the customer tax comment router
const customerTaxCommentsRouter = require('./routes/customerTaxComments');
app.use('/customer-tax-comment', customerTaxCommentsRouter);

// Mount the customer tax document router
const customerTaxDocumentsRouter = require('./routes/customerTaxDocuments');
app.use('/customer-tax-document', customerTaxDocumentsRouter);

// Mount the staff customer assignments router
const staffCustomerAssignmentsRouter = require('./routes/staffCustomerAssignments');
app.use('/staff-customer-assignments', staffCustomerAssignmentsRouter);

// Mount the tax return documents router
const taxReturnDocuments = require('./routes/taxReturnDocuments');
app.use('/tax-return-document', taxReturnDocuments);

// Mount the paypal payment gateway
const paypalPayment = require('./routes/paypalPayment');
app.use('/paypal', paypalPayment);

// Mount the contact router
const contact = require('./routes/contact');
app.use('/contact', contact);

// Mount the customer response routes
const customerResponseRoutes = require('./routes/customerResponse');
app.use('/customer-response', customerResponseRoutes);

// Use the routes in your application
const dummyUserRoutes = require('./routes/dummy_users')
app.use('/dummy-users', dummyUserRoutes);

// Email api routes
const emailRoutes = require('./routes/email');
app.use('/email', emailRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
