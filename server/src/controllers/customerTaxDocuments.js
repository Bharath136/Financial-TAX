const client = require('../database/connection');
const path = require('path');
const fs = require('fs');


// Create customer new tax comment
const createCustomerNewTaxDocument = async (req, res, next) => {
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
            financial_year,
            document_name,
            document_type
        } = req.body;
        try {
            const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
            const resultUser = await client.query(updatedUserQuery, [customer_id]);

            if (resultUser.rows.length === 0) {
                return res.status(404).json({ error: 'User not found.' });
            }
            const document_path = fileInfo.path
            const updated_by = `${resultUser.rows[0].first_name} ${resultUser.rows[0].last_name}`;

            const documentQuery = `
            INSERT INTO customer_tax_documents(
                customer_id,
                document_path,
                financial_year,
                document_name,
                document_type,
                review_status,
                created_by,
                updated_by,
                created_on,
                updated_on
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING document_id
        `;

            const review_status = 'Pending';

            const values = [
                customer_id,
                document_path,
                financial_year,
                document_name,
                document_type,
                review_status,
                updated_by,
                updated_by,  // Updated_by was missing a closing quote
                new Date(),
                new Date(),
            ];

            const result = await client.query(documentQuery, values);
            res.status(201).json({ message: 'Document created successfully.', document_id: result.rows[0].document_id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error adding document.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding document.' });
    }
};

const UPLOADS_DIR = path.join(__dirname,'../..')
const downloadDocument = async (req, res) => {
    const documentId = req.params.id;
    // Fetch document details from the database based on the documentId
    const getDocumentQuery = 'SELECT * FROM customer_tax_documents WHERE document_id = $1';
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
        const documentsQuery = 'SELECT * FROM customer_tax_documents'
        const result = await client.query(documentsQuery)
        res.status(200).json({ documents: result.rows })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error documents' })
    }

}


// Update document
const updateCustomerDocument = async (req, res) => {
    const id = req.params.id

    const {
        user_id,
        document_path,
        financial_year,
    } = req.body

    const updatedOn = new Date().toISOString();

    try {
        const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const result = await client.query(updatedUserQuery, [user_id])

        const updated_by = `${result.rows[0].first_name} ${result.rows[0].last_name}`;

        const queryParams = [
            `document_path = '${document_path}'`,
            `financial_year = '${financial_year}'`,
            `updated_by = '${updated_by}'`,
            `updated_on = '${updatedOn}'`,
        ];
        const commentQuery = `
        UPDATE customer_tax_documents
        SET
        ${queryParams.join(', ')}
        WHERE
        document_id = $1;
        `;
        await client.query(commentQuery, [id]);

        res.send('Document updated successfully');
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error update comments' })
    }
}


// Update document assigned status by admin
const updateDocumentAssignedStatus = async (req, res) => {
    const id = req.params.id

    const {
        user_id,
        assigned_status,
        assigned_staff
    } = req.body

    const updatedOn = new Date().toISOString();

    try {
        const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const result = await client.query(updatedUserQuery, [user_id])

        const updated_by = `${result.rows[0].first_name} ${result.rows[0].last_name}`;

        const queryParams = [
            `assigned_status = '${assigned_status}'`,
            `assigned_staff = '${assigned_staff}'`,
            `updated_by = '${updated_by}'`,
            `updated_on = '${updatedOn}'`,
        ];
        const commentQuery = `
        UPDATE customer_tax_documents
        SET
        ${queryParams.join(', ')}
        WHERE
        document_id = $1;
        `;
        await client.query(commentQuery, [id]);

        res.send('Document assigned updated successfully');
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error update comments' })
    }
}


// Update document review status by admin
const updateDocumentReviewStatus = async (req, res) => {
    const id = req.params.id

    const {
        user_id,
        review_status
    } = req.body

    const updatedOn = new Date().toISOString();

    try {
        const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const result = await client.query(updatedUserQuery, [user_id])

        const updated_by = `${result.rows[0].first_name} ${result.rows[0].last_name}`;

        const queryParams = [
            `review_status = '${review_status}'`,
            `updated_by = '${updated_by}'`,
            `updated_on = '${updatedOn}'`,
        ];
        const commentQuery = `
        UPDATE customer_tax_documents
        SET
        ${queryParams.join(', ')}
        WHERE
        document_id = $1;
        `;
        await client.query(commentQuery, [id]);

        res.send('Document review status updated successfully');
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error update comments' })
    }
}



// Get document by id api
const getCustomerDocumentById = async (req, res) => {
    const id = req.params.id

    try {
        const deleteDocumentQuery = 'SELECT * FROM customer_tax_documents WHERE document_id = $1';
        const result = await client.query(deleteDocumentQuery, [id])
        res.status(200).json(result.rows[0])

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error document get' })
    }
}


// Get document by id api
const getCustomerDocumentByUserId = async (req, res) => {
    const id = req.params.id

    try {
        const deleteDocumentQuery = 'SELECT * FROM customer_tax_documents WHERE customer_id = $1';
        const result = await client.query(deleteDocumentQuery, [id])
        
        res.status(200).json(result.rows)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error document get' })
    }
}


// Delete document by id api
const deleteCustomerDocumentById = async (req, res) => {
    const id = req.params.id

    try {
        const deleteDocumentQuery = 'DELETE FROM customer_tax_documents WHERE document_id = $1';
        await client.query(deleteDocumentQuery, [id])
        res.status(204).send({ message: 'Document deleted successfully' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error document delete' })
    }
}



// API endpoint to execute the SQL query
const getStaffClientAssignedDocuments = async (req, res) => {
    try {
        const result = await client.query(`
        SELECT *
        FROM customer_tax_documents ctd
        JOIN user_logins ul ON ctd.customer_id = ul.user_id
        JOIN staff_customer_assignments sca ON ul.user_id = sca.client_id;
    `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getStaffClientAssignedDocumentsByUserID = async (req, res) => {
    try {
        const id = req.params.id; 
        const result = await client.query(
            `
        SELECT *
        FROM customer_tax_documents ctd
        JOIN user_logins ul ON ctd.customer_id = ul.user_id
        JOIN staff_customer_assignments sca ON ul.user_id = sca.client_id
        WHERE ul.user_id = $1;
      `,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = {
    createCustomerNewTaxDocument,
    getCustomerAllDocuments,
    updateCustomerDocument,
    getCustomerDocumentById,
    getCustomerDocumentByUserId,
    deleteCustomerDocumentById,
    updateDocumentAssignedStatus,
    updateDocumentReviewStatus,
    downloadDocument,
    getStaffClientAssignedDocuments,
    getStaffClientAssignedDocumentsByUserID
}