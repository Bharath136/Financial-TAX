const client = require('../database/connection');

// Create customer new tax comment
const createCustomerNewTaxComment = async (req, res) => {
    const {
        customer_id,
        staff_id,
        document_id,
        comment,
        financial_year
    } = req.body;

    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS customer_tax_comments (
            comment_id SERIAL PRIMARY KEY,
            customer_id INT,
            staff_id INT,
            document_id INT,
            comment TEXT,
            financial_year VARCHAR(255),
            comment_status VARCHAR(50),
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await client.query(createTableQuery);
        const commentQuery = `
            INSERT INTO customer_tax_comments (customer_id, staff_id, document_id, comment, financial_year, comment_status, created_on, updated_on)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING document_id;
        `;
        const values = [
            customer_id,
            staff_id,
            document_id,
            comment,
            financial_year,
            'Pending',
            new Date(),
            new Date(),
        ];

        const result = await client.query(commentQuery, values);

        // The result object will contain the "document_id" returned by the RETURNING clause
        const createdDocumentId = result.rows[0].document_id;

        res.status(201).json({ message: 'Comment created successfully.', document_id: createdDocumentId });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Error Adding Comment' });
    }
};



// Get customer all comments
const getCustomerAllComments = async (req,res) => {
    try{
        const commentsQuery = 'SELECT * FROM customer_tax_comments'
        const result = await client.query(commentsQuery)
        res.status(200).json(result.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Error comments'})
    }

}


const updateCommentStatus = async (req, res) => {
    const comment_id = req.params.id
    const {
        comment_status,
        staff_id
    } = req.body;
    try {
        const updateStatusQuery = `
            UPDATE customer_tax_comments
            SET comment_status = $1, staff_id = $2, updated_on = $3
            WHERE comment_id = $4
            RETURNING comment_id;
        `;
        const values = [
            comment_status, // Use the provided new_status for updating comment_status
            staff_id,
            new Date(),
            comment_id,
        ];

        const result = await client.query(updateStatusQuery, values);

        // Check if any rows were affected by the update
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Comment not found.' });
        } else {
            res.status(200).json({ message: 'Comment status updated successfully.', comment_id });
        }
    } catch (error) {
        console.error('Error updating comment status:', error);
        res.status(500).json({ error: 'Error updating comment status.' });
    }
};

// Example usage:


const updateCustomerComments = async (req, res) => {
    const id = req.params.id;
    const {
        comment,
        financial_year,
    } = req.body;

    const updatedOn = new Date().toISOString();

    try {
        const queryParams = [
            `comment = '${comment}'`,
            `financial_year = '${financial_year}'`,
            `updated_on = '${updatedOn}'`,
        ];

        const commentQuery = `
        UPDATE customer_tax_comments
        SET
        ${queryParams.join(', ')}
        WHERE
        comment_id = $1;
        `;

        await client.query(commentQuery, [id]);

        res.send('Comment updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating comments' });
    }
}


//Delete comment
const getCustomerCommentById = async (req, res) => {
    const id = req.params.id

    try {
        const deleteQuery = 'SELECT * FROM customer_tax_comments WHERE comment_id = $1';
        const result = await client.query(deleteQuery, [id])
        res.status(200).json(result.rows[0])
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error get comment' })
    }
}


//Delete comment
const deleteCustomerCommentById = async(req, res) =>{
    const id = req.params.id

    try{
        const deleteQuery = 'DELETE FROM customer_tax_comments WHERE comment_id = $1';
        await client.query(deleteQuery, [id])
        res.status(204).json('Comment deleted successfully')
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Error delete comment'})
    }
}


const getCommentsByDocId = async (req,res) => {
    const id = req.params.id 
    try{
        const getQuery = `SELECT * FROM customer_tax_documents JOIN customer_tax_comments 
        ON customer_tax_documents.document_id =  customer_tax_comments.document_id
        WHERE customer_tax_comments.document_id = $1
        `
        const response = await client.query(getQuery, [id])
        res.status(200).json(response.rows)
    }catch(error){
        console.log(error)
    }
}


module.exports = {
    createCustomerNewTaxComment,
    getCustomerAllComments,
    updateCustomerComments,
    getCustomerCommentById,
    deleteCustomerCommentById,
    getCommentsByDocId,
    updateCommentStatus
}