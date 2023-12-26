const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');

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

// Mount the customer tax inputs router
const customerTaxInputs = require('./routes/customerTaxInputs');
app.use('/customer-tax-inputs', customerTaxInputs);

// Mount the tax inputs router
const taxInputs = require('./routes/taxInputs');
app.use('/tax-inputs', taxInputs);

// Mount the tax documents router
const taxDocuments = require('./routes/taxDocuments');
app.use('/tax-documents', taxDocuments);

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
const client = require('./database/connection');
app.use('/email', emailRoutes);

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']; // Adjust as needed
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});


app.post('/excel-uploader', upload.single('file'), async (req, res) => {

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Assuming your table in PostgreSQL is named 'contacts'
        const query = {
            text: 'INSERT INTO contacts(first_name, last_name, email_address, contact_number, alt_contact_number) VALUES($1, $2, $3, $4, $5)',
        };

        for (const row of data) {
            const values = Object.values(row);
            await pool.query({ ...query, values });
        }

        res.status(200).send('File uploaded and data inserted successfully');
    } catch (error) {
        console.error('Error processing file and inserting data:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
