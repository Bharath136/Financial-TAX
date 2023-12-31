const client = require('../database/connection');
const pgp = require('pg-promise')();
const xlsx = require('xlsx');


const createDummyUser = async (req, res) => {
    const { first_name, last_name, email_address, contact_number, alt_contact_number } = req.body;

    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS dummy_users (
            user_id SERIAL PRIMARY KEY,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email_address VARCHAR(255) UNIQUE, -- Add UNIQUE constraint here
            contact_number VARCHAR(20),
            alt_contact_number VARCHAR(20),
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by INT
        );
        `;

        await client.query(createTableQuery);

        const result = await client.query(
            'INSERT INTO dummy_users (first_name, last_name, email_address, contact_number, alt_contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email_address, contact_number, alt_contact_number]
        );

        res.status(201).json({ success: true, message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Unique violation error code
            res.status(400).json({ success: false, error: 'Email address already exists' });
        } else {
            console.error(error);
            res.status(500).json({ success: false, error: 'Error creating user' });
        }
    }
};


const createDummyUsersFromExcel = async (req, res) => {
    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS dummy_users (
            user_id SERIAL PRIMARY KEY,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            email_address VARCHAR(255) UNIQUE, -- Add UNIQUE constraint here
            contact_number VARCHAR(20),
            alt_contact_number VARCHAR(20),
            created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by INT
        );
        `;

        await client.query(createTableQuery);

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Assuming your table in PostgreSQL is named 'dummy_users'
        const query = {
            text: 'INSERT INTO dummy_users(first_name, last_name, email_address, contact_number, alt_contact_number) VALUES($1, $2, $3, $4, $5)',
        };

        // for (const row of data) {
        //     // Assuming the first column is named 'full_name'
        //     const fullName = row['full_name'] || ''; 
        //     const contact = row['contact_number'] || '';
        //     const [contact_number, alt_contact_number] = contact.split('/');
        //     const [firstName, lastName] = fullName.split(' ');

        //     // Other columns from the sheet
        //     const email = row['email_address'] || '';

        //     const values = [firstName, lastName, email, contact_number, alt_contact_number];

        //     try {
        //         await client.query({ ...query, values });
        //     } catch (error) {
        //         if (error.code === '23505') { // Unique violation error code
        //             // Handle duplicate email_address
        //             console.error('Duplicate email_address:', email);
        //         } else {
        //             throw error; // Rethrow other errors
        //         }
        //     }
        // }


        for (const row of data) {
            // Assuming the first column is named 'full_name'
            const fullName = row['full_name'] || '';
            const contact = row['contact_number'] || '';
            const [contact_number, alt_contact_number] = contact.split('/');
            const [firstName, lastName] = fullName.split(' ');

            // Other columns from the sheet
            const email = row['email_address'] || '';

            const values = [firstName, lastName, email, contact_number, alt_contact_number];

            try {
                // Check if the email_address already exists in the database
                const checkEmailQuery = {
                    text: 'SELECT * FROM dummy_users WHERE email_address = $1',
                    values: [email],
                };

                const { rowCount } = await client.query(checkEmailQuery);

                if (rowCount === 0) {
                    // Email not found, proceed with the insert
                    await client.query({ ...query, values });
                } else {
                    // Email already exists, handle accordingly
                    console.error('Duplicate email_address:', email);
                }
            } catch (error) {
                // Handle other errors
                console.error('Error processing row:', error);
            }
        }

        res.status(200).send('File uploaded and data inserted successfully');
    } catch (error) {
        console.error('Error processing file and inserting data:', error);
        res.status(500).send('Internal Server Error');
    }
};


const getDummyUserById = async (req, res) => {
    const id = req.params.id

    try {
        const result = await client.query(`SELECT * FROM dummy_users WHERE user_id = $1`, [id]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error fetching users' });
    }
}

const getAllDummyUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM dummy_users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error fetching users' });
    }
};

const updateStatus = async (req, res) => {
    const userId = req.params.id;
    const {status} = req.body
    try {
        const result = await client.query('UPDATE dummy_users SET status = $1 WHERE user_id = $2', [status, userId]);
        res.json({ success: true, message: `Status updated to 'registered' for user with ID ${userId}` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

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
    getDummyUserById,
    updateStatus
};
