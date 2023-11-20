const client = require('../database/connection');

// Create  new tax document
const createNewDocument = async (req, res) => {
    const { document_name } = req.body;

    try {
        const query = `
      INSERT INTO tax_documents (document_name)
      VALUES ($1)
      RETURNING document_id;
    `;

        const result = await client.query(query, [document_name]);
        res.json({ document_id: result.rows[0].document_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating tax document' });
    }
};



// Get all tax documents
const getTaxDocuments = async (req, res) => {
    try {
        const query = 'SELECT * FROM tax_documents';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching tax documents' });
    }
};



// Get document by id
const getTaxDocumentById = async (req, res) => {
    const document_id = req.params.document_id;

    try {
        const query = 'SELECT * FROM tax_documents WHERE document_id = $1';
        const result = await client.query(query, [document_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Tax document not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching tax document' });
    }
};


// Update document by id
const updateTaxDocumentById = async (req, res) => {
    const document_id = req.params.document_id;
    const { document_name } = req.body;

    try {
        const query = 'UPDATE tax_documents SET document_name = $1 WHERE document_id = $2';
        await client.query(query, [document_name, document_id]);
        res.send('Tax document updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating tax document' });
    }
};


// Delete document by id
const deleteTaxDocumentById = async (req, res) => {
    const document_id = req.params.document_id;

    try {
        const query = 'DELETE FROM tax_documents WHERE document_id = $1';
        await client.query(query, [document_id]);
        res.send('Tax document deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting tax document' });
    }
};



module.exports = {
    createNewDocument,
    getTaxDocuments,
    getTaxDocumentById,
    updateTaxDocumentById,
    deleteTaxDocumentById
}