const client = require('../database/connection')

const createTaxInput = async (req, res) => {
    const { input_name } = req.body;

    try {
        const query = `
      INSERT INTO tax_inputs (input_name)
      VALUES ($1)
      RETURNING input_id;
    `;

        const result = await client.query(query, [input_name]);
        res.json({ input_id: result.rows[0].input_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating tax input' });
    }
};


const getAllTaxInputs = async (req, res) => {
    try {
        const query = 'SELECT * FROM tax_inputs';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching tax inputs' });
    }
};


const getTaxInputById = async (req, res) => {
    const input_id = req.params.input_id;

    try {
        const query = 'SELECT * FROM tax_inputs WHERE input_id = $1';
        const result = await client.query(query, [input_id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Tax input not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching tax input' });
    }
};


const updateTaxInputById = async (req, res) => {
    const input_id = req.params.input_id;
    const { input_name } = req.body;

    try {
        const query = 'UPDATE tax_inputs SET input_name = $1 WHERE input_id = $2';
        await client.query(query, [input_name, input_id]);
        res.send('Tax input updated successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating tax input' });
    }
};


const deleteTaxInputById = async (req, res) => {
    const input_id = req.params.input_id;

    try {
        const query = 'DELETE FROM tax_inputs WHERE input_id = $1';
        await client.query(query, [input_id]);
        res.send('Tax input deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting tax input' });
    }
};

module.exports = {
    createTaxInput,
    getAllTaxInputs,
    getTaxInputById,
    updateTaxInputById,
    deleteTaxInputById
}