const client = require('../database/connection');

// Create (Insert) Contact
const createMessage = async (req, res) => {
    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            mobile_number VARCHAR(20),
            email_address VARCHAR(255),
            subject VARCHAR(255),
            message TEXT
        );
        `;
        await client.query(createTableQuery);
        const { name, mobile_number, email_address, subject, message } = req.body;
        const result = await client.query(
            'INSERT INTO contact (name, mobile_number, email_address, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, mobile_number, email_address, subject, message]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Read (Get) All Contacts
const getMessage = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM contact');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Read (Get) Contact by ID
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.query('SELECT * FROM contact WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Contact by ID
const updateMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile_number, email_address, subject, message } = req.body;
        const result = await client.query(
            'UPDATE contact SET name = $1, mobile_number = $2, email_address = $3, subject = $4, message = $5 WHERE id = $6 RETURNING *',
            [name, mobile_number, email_address, subject, message, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete Contact by ID
const deleteMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.query('DELETE FROM contact WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            res.json({ message: 'Contact deleted successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createMessage,
    getMessage,
    getMessageById,
    updateMessageById,
    deleteMessageById
}