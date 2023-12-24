const client = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
const userRegistration = async (req, res) => {
    const {
        first_name,
        last_name,
        email_address,
        contact_number,
        password,
    } = req.body;

    try {
        // Check if the user_logins table exists, create it if not
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_name = 'user_logins'
            ) AS table_exists;
        `;
        const tableCheckResult = await client.query(checkTableQuery);

        if (!tableCheckResult.rows[0].table_exists) {
            // Table doesn't exist, create it
            const createTableQuery = `
                CREATE TABLE user_logins (
                    user_id SERIAL PRIMARY KEY,
                    first_name VARCHAR(255),
                    last_name VARCHAR(255),
                    email_address VARCHAR(255) UNIQUE,
                    contact_number VARCHAR(20),
                    password VARCHAR(255),
                    role VARCHAR(50),
                    status VARCHAR(50),
                    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    updated_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                    created_by VARCHAR(255),
                    updated_by VARCHAR(255)
                );
            `;
            await client.query(createTableQuery);
        }

        // Hash the password before saving it in the database
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Continue with user registration logic
        const role = 'CUSTOMER';
        const status = 'ACTIVE';

        const insertUserQuery = `
            INSERT INTO user_logins (first_name, last_name, email_address, contact_number, password, role, status, created_on, updated_on, created_by, updated_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING user_id
        `;
        const values = [
            first_name,
            last_name,
            email_address,
            contact_number,
            hashedPassword,
            role,
            status,
            new Date(),
            new Date(),
            first_name,
            first_name
        ];

        const result = await client.query(insertUserQuery, values);
        res.status(201).json({ success: true, message: 'User registered successfully', user_id: result.rows[0].user_id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error registering user' });
    }
};


const editPassword = async (req, res) => {
    const { email_address, new_password } = req.body;

    try {
        // Check if the user exists based on the provided email
        const checkUserQuery = `
            SELECT *
            FROM user_logins
            WHERE email_address = $1;
        `;
        const userResult = await client.query(checkUserQuery, [email_address]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Hash the new password before updating it in the database
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedNewPassword = await bcrypt.hash(new_password, salt);

        // Update the user's password
        const updatePasswordQuery = `
            UPDATE user_logins
            SET password = $1, updated_on = $2, updated_by = $3
            WHERE email_address = $4
            RETURNING user_id;
        `;
        const values = [hashedNewPassword, new Date(), 'admin', email_address];
        const result = await client.query(updatePasswordQuery, values);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            user_id: result.rows[0].user_id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Error updating password' });
    }
};


// Adding Staff by admin
const addStaff = async (req, res) => {
    const {
        created_by,
        first_name,
        last_name,
        email_address,
        contact_number,
        password,
        secret_code
    } = req.body;

    try {
        // Check if the user already exists
        const existingUserQuery = 'SELECT user_id FROM user_logins WHERE email_address = $1';
        const existingUserResult = await client.query(existingUserQuery, [email_address]);

        if (existingUserResult.rows.length > 0) {
            // A user with the same email address already exists
            return res.status(400).json({ success: false, error: 'User with this email address already exists' });
        }

        // Hash the password before saving it in the database
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Continue with staff addition logic
        const role = 'STAFF';
        const status = 'ACTIVE';

        const query = `
            INSERT INTO user_logins (first_name, last_name, email_address, contact_number, password, role, status, created_on, updated_on, created_by, updated_by, secret_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING user_id
        `;
        const values = [
            first_name,
            last_name,
            email_address,
            contact_number,
            hashedPassword,
            role,
            status,
            new Date(),
            new Date(),
            created_by,
            created_by,
            secret_code
        ];

        const result = await client.query(query, values);
        res.status(201).json({ success: true, message: 'Staff added successfully', user_id: result.rows[0].user_id });
    } catch (error) {
        console.error('Error adding staff:', error);
        res.status(500).json({ success: false, error: 'Error adding staff' });
    }
};


// user login
const userLogin = async (req, res) => {
    const { email_address, password } = req.body;

    try {
        const query = 'SELECT * FROM user_logins WHERE email_address = $1';

        const result = await client.query(query, [email_address]);

        if (result.rows.length !== 1) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const user = result.rows[0];

        // Compare the password using a secure method like bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // User authenticated, create a token with role
        const token = jwt.sign({ user_id: user.user_id, role: user.role }, 'your-secret-key');

        res.header('x-auth-token', token).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const query = 'SELECT * FROM user_logins';
        const result = await client.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get a user by id
const getUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const query = 'SELECT * FROM user_logins WHERE user_id = $1';
        const result = await client.query(query, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update user by user_id
const updateUserById = async (req, res) => {
    const id = req.params.id;
    const {
        updated_by,
        first_name,
        last_name,
        email_address,
        contact_number,
    } = req.body;
    const updatedOn = new Date().toISOString();

    try {
        // Check if the user already exists (excluding the current user's ID)
        const existingUserQuery = 'SELECT user_id FROM user_logins WHERE email_address = $1 AND user_id <> $2';
        const existingUserResult = await client.query(existingUserQuery, [email_address, id]);

        if (existingUserResult.rows.length > 0) {
            // A user with the same email address already exists
            return res.status(400).json({ error: 'User with this email address already exists' });
        }

        // Build the query to update the user's information
        const queryParams = [
            `first_name = '${first_name}'`,
            `last_name = '${last_name}'`,
            `contact_number = '${contact_number}'`,
            `status = 'ACTIVE'`,
            `updated_on = '${updatedOn}'`,
            `updated_by = '${updated_by}'`,
        ];

        // Include email update in the query only if it has changed
        if (email_address) {
            queryParams.push(`email_address = '${email_address}'`);
        }

        const query = `
            UPDATE user_logins
            SET
            ${queryParams.join(', ')}
            WHERE
            user_id = $1
            RETURNING *;  -- Fetch the updated user details
        `;

        const result = await client.query(query, [id]);

        // Check if any rows were affected
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = result.rows[0];

        res.json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete a user by user_id
const deleteUserById = async (req, res) => {
    const id = req.params.id;

    try {
        const userQuery = 'SELECT * FROM user_logins WHERE user_id = $1';
        const userResult = await client.query(userQuery, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deleteQuery = 'DELETE FROM user_logins WHERE user_id = $1';
        await client.query(deleteQuery, [id]);
        res.status(204).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.log('Error', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllStaffAssignedClients = async (req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM user_logins ul
            JOIN staff_customer_assignments sca ON ul.user_id = sca.client_id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllStaffUnAssignedClients = async (req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM user_logins ul
            WHERE NOT EXISTS (
                SELECT 1
                FROM staff_customer_assignments sca
                WHERE ul.user_id = sca.client_id
            )
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Error executing SQL query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


function validatePassword(password) {
    // password validation logic here
    return password.length >= 8;
}


// Get users by journey status
const getUsersByCurrentStatus = async (req, res) => {
    const currentStep = req.params.current_step;

    try {
        const query = `
            SELECT *
            FROM user_logins
            WHERE current_step = $1;
        `;
        const result = await client.query(query, [currentStep]);

        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Update current_step by user_id
// const updateCurrentStatusById = async (req, res) => {
//     const id = req.params.id;
//     const { current_step, user } = req.body;

//     const updated_by = user.first_name
//     const updated_on = new Date().toISOString(); // Convert to ISO format

//     try {
//         const query = `
//             UPDATE user_logins
//             SET current_step = $1, updated_by = $2, updated_on = $3
//             WHERE user_id = $4;
//         `;
//         await client.query(query, [current_step, updated_by, updated_on, id]);

//         res.send('Current Step updated successfully');
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };




//  -------------  |||  --------------  //


const assignClientToStaff = async (staff_id, client_id) => {
    const created_at = new Date().toISOString();
    try {
        // Delete existing assignment for the client
        await client.query('DELETE FROM staff_customer_assignments WHERE client_id = $1', [client_id]);

        // Insert a new assignment
        const { rows } = await client.query('INSERT INTO staff_customer_assignments (staff_id, client_id, created_at) VALUES ($1, $2, $3) RETURNING *', [staff_id, client_id, created_at]);

        // Return the newly created assignment
        return rows[0];
    } catch (error) {
        console.error('Error creating assignment:', error);
        // You might want to throw an error or handle it appropriately
        throw new Error('Internal Server Error');
    }
};


const updateCurrentStatusById = async (req, res) => {
    const client_id = req.params.id;
    const { current_step, user } = req.body;

    const updated_by = user.first_name;
    const updated_on = new Date().toISOString(); // Convert to ISO format

    try {
        if (current_step) {
            // Check if any staff with the specified team is available
            const availableStaffQuery = `
                SELECT user_id
                FROM user_logins
                WHERE role = 'STAFF' AND staff_team = $1;
            `;
            const availableStaffResult = await client.query(availableStaffQuery, [current_step]);
            const availableStaffIds = availableStaffResult.rows.map((row) => row.user_id);

            if (availableStaffIds.length > 0) {
                // Your logic to assign the specific client to an available staff member here
                const staffId = availableStaffIds.pop(); // Assign to the next available staff

                // Call your function to assign the client to staff here
                await assignClientToStaff(staffId, client_id);

                // Update the current step
                const updateQuery = `
                    UPDATE user_logins
                    SET current_step = $1, updated_by = $2, updated_on = $3
                    WHERE user_id = $4;
                `;
                await client.query(updateQuery, [current_step, updated_by, updated_on, client_id]);

                res.status(201).send('Current Step updated successfully');
            } else {
                res.status(400).json({ error: `No staff with the ${current_step} team is available` });
            }
        } else {
            res.send('Current Step updated successfully');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//  -------------  |||  --------------  //



// Update staff_team by user_id
const updateStaffTeamById = async (req, res) => {
    const id = req.params.id;
    const { staff_team, user } = req.body;

    const updated_by = user.first_name + " " + user.last_name;
    const updated_on = new Date(); // Get the current date

    try {
        const query = `
            UPDATE user_logins
            SET staff_team = $1, updated_by = $2, updated_on = $3
            WHERE user_id = $4;
        `;
        const result = await client.query(query, [staff_team, updated_by, updated_on, id]);

        res.send('Staff team updated successfully');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getMyStaffDetails = async (req, res) => {
    const id = req.params.id;

    try {
        const getClientQuery = `
            SELECT * FROM staff_customer_assignments 
            JOIN user_logins ON user_logins.user_id = staff_customer_assignments.client_id
            WHERE staff_customer_assignments.client_id = $1
        `;

        const getClientResult = await client.query(getClientQuery, [id]);

        // Check if there's a valid result
        if (getClientResult.rows.length > 0) {
            const staffId = getClientResult.rows[0].staff_id;

            const getStaffQuery = `
                SELECT * FROM user_logins WHERE user_id = $1
            `;

            const getStaffResult = await client.query(getStaffQuery, [staffId]);

            // Check if there's a valid staff result
            if (getStaffResult.rows.length > 0) {
                res.json(getStaffResult.rows);
            } else {
                res.status(404).json({ error: 'Staff details not found.' });
            }
        } else {
            res.status(404).json({ error: 'Client assignment not found.' });
        }
    } catch (error) {
        console.error('Error fetching staff details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get Customer response
const getCustomerResponse = async (req, res) => {
    const id = req.params.id;

    try {
        const getResponseQuery = `
      SELECT * FROM user_logins
      JOIN customer_response ON user_logins.user_id = customer_response.client_id
      WHERE customer_response.client_id = $1
    `;

        const response = await client.query(getResponseQuery, [id]);
        res.status(200).json(response.rows);
    } catch (error) {
        console.error('Error fetching customer response:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
};

module.exports = getCustomerResponse;


module.exports = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    userRegistration,
    userLogin,
    addStaff,
    getAllStaffAssignedClients,
    getUsersByCurrentStatus,
    updateCurrentStatusById,
    updateStaffTeamById,
    getAllStaffUnAssignedClients,
    editPassword,
    getMyStaffDetails,
    getCustomerResponse
};
