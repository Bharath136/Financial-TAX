const client = require('../database/connection');
const path = require('path');
const fs = require('fs');
const { sendDocumentNotification } = require('./email')

// Create a new tax return document
const createTaxReturnDocument = async (req, res, next) => {
    try {
        // Check if the tax_return_documents table exists, create it if not
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = 'tax_return_documents'
            ) AS table_exists;
        `;
        const tableCheckResult = await client.query(checkTableQuery);

        if (!tableCheckResult.rows[0].table_exists) {
            // Table doesn't exist, create it
            const createTableQuery = `
                CREATE TABLE tax_return_documents (
                    taxreturn_id SERIAL PRIMARY KEY,
                    customer_id INT,
                    staff_id INT,
                    payment_amount NUMERIC,
                    payment_status VARCHAR(50),
                    document_path VARCHAR(255),
                    financial_year INT,
                    document_name VARCHAR(255),
                    document_type VARCHAR(50),
                    review_status VARCHAR(50),
                    created_by VARCHAR(255),
                    updated_by VARCHAR(255),
                    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    updated_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
                );
            `;
            await client.query(createTableQuery);
        }

        // Continue with document creation logic
        if (!req.file) {
            return res.status(400).json({
                status: false,
                data: "File Not Found :(",
            });
        }

        // Store additional information about the uploaded file
        const fileInfo = {
            filename: req.file.filename,
            path: req.file.path,
        };
        const {
            customer_id,
            staff_id,
            payment_amount,
            financial_year,
            document_name,
            document_type
        } = req.body;


        const user = await client.query(`
            SELECT * FROM user_logins WHERE user_id = $1
        `, [customer_id])

        const customer = user.rows[0]

        try {
            const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
            const resultUser = await client.query(updatedUserQuery, [staff_id]);

            if (resultUser.rows.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }
            const document_path = fileInfo.path;
            const updated_by = `${resultUser.rows[0].first_name} ${resultUser.rows[0].last_name}`;

            const payment_status = 'Pending';

            const documentQuery = `
                INSERT INTO tax_return_documents(
                    customer_id,
                    staff_id,
                    payment_amount,
                    payment_status,
                    document_path,
                    financial_year,
                    document_name,
                    document_type,
                    review_status,
                    created_by,
                    updated_by
                )
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING taxreturn_id
            `;

            const review_status = 'Pending';

            const values = [
                customer_id,
                staff_id,
                payment_amount,
                payment_status,
                document_path,
                financial_year,
                document_name,
                document_type,
                review_status,
                updated_by,
                updated_by,
            ];
            const result = await client.query(documentQuery, values);

            sendDocumentNotification(customer.email_address, customer.first_name,document_name,'https://uniprofin.com/user/tax-return-review')
            
            res.status(201).json({ message: 'Document created successfully.', taxreturn_id: result.rows[0].taxreturn_id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error adding document.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding document.' });
    }
};

// Directory where uploaded files are stored
const UPLOADS_DIR = path.join(__dirname, '../..');

// Download a document
const downloadDocument = async (req, res) => {
    const documentId = req.params.id;

    // Fetch document details from the database based on the documentId
    const getDocumentQuery = 'SELECT * FROM tax_return_documents WHERE taxreturn_id = $1';

    const documentResult = await client.query(getDocumentQuery, [documentId]);

    if (documentResult.rows.length === 0) {
        return res.status(404).json({ error: 'Document not found' });
    }

    // For example, assuming you have the document path in the database
    const documentPath = documentResult.rows[0].document_path;

    const documentFullPath = path.join(UPLOADS_DIR, documentPath);

    // Check if the file exists
    if (fs.existsSync(documentFullPath)) {
        // Set the appropriate headers for the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${path.basename(documentPath)}`);

        // Create a read stream from the file and pipe it to the response
        const fileStream = fs.createReadStream(documentFullPath);
        fileStream.pipe(res);
    } else {
        res.status(404).json({ error: 'Document not found' });
    }
};

// Get all documents for a customer
const getCustomerAllDocuments = async (req, res) => {
    try {
        const documentsQuery = 'SELECT * FROM tax_return_documents';
        const result = await client.query(documentsQuery);
        res.status(200).json({ documents: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error retrieving documents' });
    }
};

const getCustomerTaxReturnDocumentById = async (req, res) => {
    try {
        const taxReturnId = req.params.id; // Assuming customer ID is in the request parameters

        const documentsQuery = 'SELECT * FROM tax_return_documents WHERE taxreturn_id = $1';
        const result = await client.query(documentsQuery, [taxReturnId]);

        res.status(200).json({ documents: result.rows });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error retrieving documents' });
    }
};


// Update a tax return document
const updateTaxreturnDocument = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            customer_id,
            staff_id,
            document_path,
            financial_year,
            review_status,
            updated_by,
            payment_status,
            payment_amount
        } = req.body;

        const result = await client.query(
            'UPDATE tax_return_documents SET customer_id = $1, staff_id = $2, document_path = $3, financial_year = $4, review_status = $5, updated_by = $6, payment_status = $7, payment_amount = $8, updated_on = CURRENT_TIMESTAMP WHERE taxreturn_id = $9 RETURNING *',
            [customer_id, staff_id, document_path, financial_year, review_status, updated_by, payment_status, payment_amount, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax return document not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating tax return document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const updateTaxreturnDocumentPaymentStatus = async (id, updated_by, payment_status) => {
    try {
        const result = await client.query(
            'UPDATE tax_return_documents SET updated_by = $1, payment_status = $2, updated_on = CURRENT_TIMESTAMP WHERE taxreturn_id = $3 RETURNING *',
            [updated_by, payment_status, id]
        );

        if (result.rows.length === 0) {
            return { error: 'Tax return document not found' };
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error updating tax return document:', error);
        return { error: 'Internal Server Error' };
    }
};




module.exports = {
    createTaxReturnDocument,
    downloadDocument,
    updateTaxreturnDocument,
    getCustomerAllDocuments,
    getCustomerTaxReturnDocumentById,
    updateTaxreturnDocumentPaymentStatus
};
