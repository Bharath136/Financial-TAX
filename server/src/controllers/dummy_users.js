const client = require('../database/connection');
const pgp = require('pg-promise')();


const createDummyUser = async (req, res) => {
    const { first_name, last_name, email_address, contact_number, alt_contact_number } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO dummy_users (first_name, last_name, email_address, contact_number, alt_contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email_address, contact_number, alt_contact_number]
        );

        res.status(201).json({ success: true, message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error creating user' });
    }
};

const createDummyUsersFromExcel = async (req, res) => {
    const userDetailsArray = req.body;
    console.log(userDetailsArray)
    try {
        const cs = new pgp.helpers.ColumnSet([
            'first_name',
            'last_name',
            'email_address',
            'contact_number',
            'alt_contact_number'
        ], { table: 'dummy_users' });

        const values = userDetailsArray.map((userDetails) => ({
            first_name: userDetails.first_name,
            last_name: userDetails.last_name,
            email_address: userDetails.email_address,
            contact_number: userDetails.contact_number,
            alt_contact_number: userDetails.alt_contact_number
        }));

        const query = pgp.helpers.insert(values, cs) + ' RETURNING *';
        const result = await db.query(query);

        res.status(201).json({ success: true, message: 'Users created successfully', users: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error creating users' });
    }
};

const getAllDummyUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM dummy_users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error fetching users' });
    }
};

const updateDummyUser = async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, email_address, contact_number, alt_contact_number } = req.body;

    try {
        const result = await client.query(
            'UPDATE dummy_users SET first_name=$1, last_name=$2, email_address=$3, contact_number=$4, alt_contact_number=$5 WHERE user_id=$6 RETURNING *',
            [first_name, last_name, email_address, contact_number, alt_contact_number, userId]
        );

        res.status(200).json({ success: true, message: 'User updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error updating user' });
    }
};

const deleteDummyUser = async (req, res) => {
    const userId = req.params.id;

    try {
        await client.query('DELETE FROM dummy_users WHERE user_id=$1', [userId]);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error deleting user' });
    }
};

module.exports = {
    createDummyUser,
    createDummyUsersFromExcel,
    getAllDummyUsers,
    updateDummyUser,
    deleteDummyUser,
};
