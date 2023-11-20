const client = require('../database/connection');


// Create customer new tax comment
const createCustomerNewTaxDocument = async (req, res, next) => {
    const {
        customer_id,
        document_path,
        financial_year,
        financial_quarter,
        financial_month
    } = req.body;

    try {
        const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const resultUser = await client.query(updatedUserQuery, [customer_id]);

        if (resultUser.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const updated_by = `${resultUser.rows[0].first_name} ${resultUser.rows[0].last_name}`;

        const documentQuery = `
            INSERT INTO customer_tax_documents(
                customer_id,
                document_path,
                financial_year,
                financial_quarter,
                financial_month,
                assigned_status,
                review_status,
                assigned_staff,
                created_by,
                updated_by,
                created_on,
                updated_on
            )
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING document_id
        `;

        const assigned_status = 'Pending';
        const review_status = 'Pending';

        const values = [
            customer_id,
            document_path,
            financial_year,
            financial_quarter,
            financial_month,
            assigned_status,
            review_status,
            2,  // You may want to set the default value for assigned_staff
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
        financial_month,
        financial_quarter
    } = req.body
 
    const updatedOn = new Date().toISOString();

    try {
        const updatedUserQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const result = await client.query(updatedUserQuery, [user_id])

        const updated_by = `${result.rows[0].first_name} ${result.rows[0].last_name}`;
        console.log(updated_by)
   
        const queryParams = [
            `document_path = '${document_path}'`,
            `financial_year = '${financial_year}'`,
            `financial_month = '${financial_month}'`,
            `financial_quarter = '${financial_quarter}'`,
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
        console.log(updated_by)

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
        console.log(updated_by)

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

        res.send('Document assigned updated successfully');
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
    console.log(id)

    try {
        const deleteDocumentQuery = 'SELECT * FROM customer_tax_documents WHERE customer_id = $1';
        const result = await client.query(deleteDocumentQuery, [id])
        console.log(result.rows)
        res.status(200).json(result.rows)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error document get' })
    }
}


// Delete document by id api
const deleteCustomerDocumentById = async (req,res) => {
    const id = req.params.id

    try{
        const deleteDocumentQuery = 'DELETE FROM customer_tax_documents WHERE document_id = $1';
        await client.query(deleteDocumentQuery, [id])
        res.status(204).send({message:'Document deleted successfully'})
        
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Error document delete'})
    }
}


module.exports = {
    createCustomerNewTaxDocument,
    getCustomerAllDocuments,
    updateCustomerDocument,
    getCustomerDocumentById,
    getCustomerDocumentByUserId,
    deleteCustomerDocumentById,
    updateDocumentAssignedStatus,
    updateDocumentReviewStatus
}