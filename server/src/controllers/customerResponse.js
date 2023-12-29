const client = require('../database/connection');

const createCustomerResponse = async (req, res) => {
    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS customer_response (
            id SERIAL PRIMARY KEY,
            client_id INT,
            staff_id INT,
            response TEXT,
            created_by VARCHAR(255),
            updated_by VARCHAR(255),
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await client.query(createTableQuery);
        const { client_id, staff_id, response, created_by, updated_by } = req.body;
        const result = await client.query(
            'INSERT INTO customer_response (client_id, staff_id, response, created_by, updated_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [client_id, staff_id, response, created_by, updated_by]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error creating customer response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getAllCustomerResponses = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM customer_response');
        res.json(result.rows);
    } catch (error) {
        console.error('Error getting all customer responses:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getCustomerResponseById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.query('SELECT * FROM customer_response WHERE id = $1', [id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error getting customer response by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateCustomerResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { client_id, staff_id, response, created_by, updated_by } = req.body;
        const result = await client.query(
            'UPDATE customer_response SET client_id = $1, staff_id = $2, response = $3, created_by = $4, updated_by = $5, updated_on = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [client_id, staff_id, response, created_by, updated_by, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating customer response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteCustomerResponse = async (req, res) => {
    try {
        const { id } = req.params;
        await client.query('DELETE FROM customer_response WHERE id = $1', [id]);
        res.json({ message: 'Customer response deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    createCustomerResponse,
    getAllCustomerResponses,
    getCustomerResponseById,
    updateCustomerResponse,
    deleteCustomerResponse
}