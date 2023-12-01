const client = require('../database/connection')
const path = require('path');
const fs = require('fs');

// Create customer new tax comment
const createTaxReturnDocument = async (req, res, next) => {
    console.log(req.body)
    try {
        if (!req.file) {
            return res.status(400).send({
                status: false,
                data: "File Not Found :(",
            });
        }

        // Store additional information about the uploaded file
        const fileInfo = {
            filename: req.file.filename,
            path: req.file.path,
            // Add other relevant information as needed
        };
        const {
            customer_id,
            staff_id,
            payment_amount,
            financial_year,
            financial_quarter,
            financial_month,
            document_name,
            document_type
        } = req.body;
        try {
            const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
            const resultUser = await client.query(updatedUserQuery, [staff_id]);

            if (resultUser.rows.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }
            const document_path = fileInfo.path
            const updated_by = `${resultUser.rows[0].first_name} ${resultUser.rows[0].last_name}`;

            const payment_status = 'Pending'

            const documentQuery = `
            INSERT INTO tax_return_documents(
                customer_id,
                staff_id,
                payment_amount,
                payment_status,
                document_path,
                financial_year,
                financial_quarter,
                financial_month,
                document_name,
                document_type,
                review_status,
                created_by,
                updated_by,
                created_on,
                updated_on
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
                financial_quarter,
                financial_month,
                document_name,
                document_type,
                review_status,
                updated_by,
                updated_by,  
                new Date(),
                new Date(),
            ];

            const result = await client.query(documentQuery, values);
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

const UPLOADS_DIR = path.join(__dirname, '../..')
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



// Get customer all comments
const getCustomerAllDocuments = async (req, res) => {
    try {
        const documentsQuery = 'SELECT * FROM tax_return_documents'
        const result = await client.query(documentsQuery)
        res.status(200).json({ documents: result.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error documents' })
    }

}


// PUT /tax-return-documents/:taxreturn_id
const updateTaxreturnDocument = async (req, res) => {
    try {
        const id = req.params.id;
        const {
            customer_id,
            staff_id,
            document_path,
            financial_year,
            financial_month,
            financial_quarter,
            review_status,
            updated_by,
            payment_status,
            payment_amount
        } = req.body;

        const result = await pool.query(
            'UPDATE tax_return_documents SET customer_id = $1, staff_id = $2, document_path = $3, financial_year = $4, financial_month = $5, financial_quarter = $6, review_status = $7, updated_by = $8, payment_status = $9, payment_amount = $10 updated_on = CURRENT_TIMESTAMP WHERE taxreturn_id = $11 RETURNING *',
            [customer_id, staff_id, document_path, financial_year, financial_month, financial_quarter, review_status, updated_by, payment_status, payment_amount, id]
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


module.exports = {
    createTaxReturnDocument,
    downloadDocument,
    updateTaxreturnDocument,
    getCustomerAllDocuments
}