const client = require('../database/connection')


// Create New Customer Tax Input
const createCustomerTaxInput = async(req, res) => {
    const {
        user_id,
        customer_id,
        input_value
    } = req.body

    try{

        const userQuery = 'SELECT first_name, last_name FROM user_logins WHERE user_id = $1';
        const userResult = await client.query(userQuery, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { first_name, last_name } = userResult.rows[0];
        const created_by = `${first_name} ${last_name}`;
        const updated_by = `${first_name} ${last_name}`;
        const created_on = new Date();
        const updated_on = new Date();

        const taxInputQuery = `
            INSERT INTO customer_tax_inputs(customer_id, input_value, created_by, updated_by, created_on, updated_on)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING input_id
        `;

        const values = [customer_id, input_value, created_by, updated_by, created_on, updated_on];

        const result = await client.query(taxInputQuery, values);
        const inputId = result.rows[0].input_id;
        
        res.status(201).json({ message: 'Tax input created successfully', input_id: inputId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating tax input' });
    }
};


// Update Customer Tax Input

const updateCustomerTaxInput = async(req, res) => {
    const id = req.params.id;
    const { input_value, updated_by } = req.body; // Assuming you want to update input_value and updated_by

    try {
        const updateQuery = `
            UPDATE customer_tax_inputs
            SET input_value = $1, updated_by = $2, updated_on = NOW()
            WHERE input_id = $3
        `;

        await client.query(updateQuery, [input_value, updated_by, id]);
        res.send('Tax input updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating tax input' });
    }
};



const getCustomerTaxInputById = async(req, res) => {
    const customer_id = req.params.id;

    try {
        const query = 'SELECT * FROM customer_tax_inputs WHERE customer_id = $1';
        const result = await client.query(query, [customer_id]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching tax inputs' });
    }
};


const getCustomerTaxInputs = async(req, res) => {
    try{
        const inputQuery = 'SELECT * FROM customer_tax_inputs'
        const result = await client.query(inputQuery)

        res.send(result.rows)
    }catch(error){
        console.log(error)
        res.status(500).json({error: 'Error geting tax inputs'})
    }
};


const deleteCustomerTaxInputById = async (req, res) => {
    const input_id = req.params.id;

    try {
        const query = 'DELETE FROM customer_tax_inputs WHERE input_id = $1';
        await client.query(query, [input_id]);
        res.send('Tax input deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting tax input' });
    }
};





module.exports = {
    createCustomerTaxInput,
    updateCustomerTaxInput,
    getCustomerTaxInputById,
    deleteCustomerTaxInputById,
    getCustomerTaxInputs
}