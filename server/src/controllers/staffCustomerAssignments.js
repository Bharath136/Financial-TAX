const client = require('../database/connection')
const { sendAssignmentEmail } = require('./email')

// Create Assignment
const assignClientToStaff = async (req, res) => {
    const { staff_id, client_id } = req.body;
    const created_at = new Date().toISOString();
    try {
        const createTableQuery = `
        CREATE TABLE IF NOT EXISTS staff_customer_assignments (
            assignment_id SERIAL PRIMARY KEY,
            staff_id INT REFERENCES user_logins(staff_id),
            client_id INT REFERENCES user_logins(client_id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_by VARCHAR(255)
        );
        `;
        await client.query(createTableQuery);
        const { rows } = await client.query('INSERT INTO staff_customer_assignments (staff_id, client_id, created_at) VALUES ($1, $2, $3) RETURNING *', [staff_id, client_id, created_at]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error creating assignment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//create assignments
const assignClientsToStaff = async (req, res) => {
    const { selectedStaff, selectedClients } = req.body;
    const created_at = new Date().toISOString();

    try {
        const assignments = [];

        for (const user of selectedClients) {
            
                const deleteQuery = `
                    DELETE FROM staff_customer_assignments WHERE client_id = $1
                `
                const response = await client.query(deleteQuery,[user.user_id])
            

                // Insert into staff_customer_assignments
                const assignmentResult = await client.query(
                    'INSERT INTO staff_customer_assignments (staff_id, client_id, created_at) VALUES ($1, $2, $3) RETURNING *',
                    [selectedStaff.user_id, user.user_id, created_at]
                );

                // // Update current_step for the client in the clients table (assuming such a table exists)
                await client.query(
                    'UPDATE user_logins SET current_step = $1 WHERE user_id = $2',
                    [selectedStaff.staff_team, user.user_id]
                );

                assignments.push(assignmentResult.rows[0]);

            // Send email to the assigned client
            const { first_name, email_address } = user; // Assuming you have 'username' and 'email' properties for each client
            await sendAssignmentEmail(first_name, email_address, selectedStaff.first_name, selectedStaff.email_address, selectedStaff.contact_number,);
            
        }

        // Respond with the list of newly created assignments
        res.json(assignments);
    } catch (error) {
        console.error('Error creating assignments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};




// Update Assignment
const updateAssignment = async (req, res) => {
    const assignment_id = parseInt(req.params.assignment_id);
    const { staff_id, client_id } = req.body;
    try {
        const { rows } = await client.query('UPDATE staff_customer_assignments SET staff_id = $1, client_id = $2 WHERE assignment_id = $3 RETURNING *', [staff_id, client_id, assignment_id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Delete Assignment
const deleteAssignment = async (req, res) => {
    const assignment_id = req.params.id;
    try {
        const { rows } = await client.query('DELETE FROM staff_customer_assignments WHERE assignment_id = $1 RETURNING *', [assignment_id]);
        if (rows.length > 0) {
            res.json({ message: 'Assignment deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Assignments
const getAssignments = async (req, res) => {
    try {
        const { rows } = await client.query('SELECT * FROM staff_customer_assignments');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Get All Assignments
const getStaffAssignments = async (req, res) => {
    const id = req.params.id
    try {
        const { rows } = await client.query('SELECT * FROM staff_customer_assignments WHERE staff_id = $1', [id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Get Assignment by ID
const getAssignmentById = async (req, res) => {
    const assignment_id = req.params.id;
    try {
        const { rows } = await client.query('SELECT * FROM staff_customer_assignments WHERE assignment_id = $1', [assignment_id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        console.error('Error fetching assignment by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Endpoint to assign clients to staff members
// const autoAssignClients = async (req, res) => {

//     try {
//         // Find available staff for a specific team
//         const team = 'Scheduling'; // Default to 'Scheduling' if not provided
//         const availableStaffQuery = `
//             SELECT user_id
//             FROM user_logins
//             WHERE role = 'STAFF' AND staff_team = $1
//         `;
//         const availableStaffResult = await client.query(availableStaffQuery, [team]);

//         // Find unassigned clients
//         const unassignedClientsQuery = `
//             SELECT user_id
//             FROM user_logins
//             WHERE role = 'CUSTOMER' AND current_step IS NULL
//         `;
//         const unassignedClientsResult = await client.query(unassignedClientsQuery);

//         const availableStaffIds = availableStaffResult.rows.map((row) => row.user_id);
//         const unassignedClientIds = unassignedClientsResult.rows.map((row) => row.user_id);

//         // Check if there are available staff and unassigned clients
//         if (availableStaffIds.length === 0 || unassignedClientIds.length === 0) {
//             return res.status(404).json({ success: false, error: 'No available staff or unassigned clients found.' });
//         }

//         // Start a database transaction
//         await client.query('BEGIN');

//         try {
//             // Assign clients to staff members
//             let staffIndex = 0;

//             for (const clientId of unassignedClientIds) {
//                 const staffId = availableStaffIds[staffIndex];

//                 // Get the current timestamp
//                 const createdAt = new Date();

//                 // Insert assignment into staff_customer_assignments table
//                 const insertAssignmentQuery = `
//                     INSERT INTO staff_customer_assignments (staff_id, client_id, created_at)
//                     VALUES ($1, $2, $3)
//                 `;
//                 await client.query(insertAssignmentQuery, [staffId, clientId, createdAt]);

//                 await sendAssignmentEmail(first_name, email_address, selectedStaff.first_name, selectedStaff.email_address, selectedStaff.contact_number,);

//                 staffIndex = (staffIndex + 1) % availableStaffIds.length;
//             }

//             // Update current_step to the assigned team for the assigned clients
//             const updateClientStepQuery = `
//                 UPDATE user_logins
//                 SET current_step = $1
//                 WHERE user_id = ANY($2)
//             `;
//             await client.query(updateClientStepQuery, [team, unassignedClientIds]);

//             // Commit the transaction
//             await client.query('COMMIT');

//             res.status(200).json({ success: true, message: 'Clients assigned and updated successfully' });
//         } catch (error) {
//             // Rollback the transaction in case of an error
//             await client.query('ROLLBACK');
//             throw error; // Rethrow the error for the outer catch block to handle
//         }
//     } catch (error) {
//         console.error('Error assigning clients:', error);
//         res.status(500).json({ success: false, error: 'Internal server error' });
//     } 
// };


const autoAssignClients = async (req, res) => {
    try {
        // Find available staff for a specific team
        const team = 'Scheduling'; // Default to 'Scheduling' if not provided
        const availableStaffQuery = `
            SELECT user_id
            FROM user_logins
            WHERE role = 'STAFF' AND staff_team = $1
        `;
        const availableStaffResult = await client.query(availableStaffQuery, [team]);

        // Find unassigned clients
        const unassignedClientsQuery = `
            SELECT user_id
            FROM user_logins
            WHERE role = 'CUSTOMER' AND current_step IS NULL
        `;
        const unassignedClientsResult = await client.query(unassignedClientsQuery);

        const availableStaffIds = availableStaffResult.rows.map((row) => row.user_id);
        const unassignedClientIds = unassignedClientsResult.rows.map((row) => row.user_id);

        // Check if there are available staff and unassigned clients
        if (availableStaffIds.length === 0 || unassignedClientIds.length === 0) {
            return res.status(404).json({ success: false, error: 'No available staff or unassigned clients found.' });
        }

        // Start a database transaction
        await client.query('BEGIN');

        try {
            // Assign clients to staff members
            let staffIndex = 0;

            for (const clientId of unassignedClientIds) {
                const staffId = availableStaffIds[staffIndex];

                // Get the current timestamp
                const createdAt = new Date();

                // Get client information
                const clientInfoQuery = `
                    SELECT first_name, email_address
                    FROM user_logins
                    WHERE user_id = $1
                `;
                const clientInfoResult = await client.query(clientInfoQuery, [clientId]);
                const { first_name, email_address } = clientInfoResult.rows[0];

                // Get staff information
                const staffInfoQuery = `
                    SELECT first_name, email_address, contact_number
                    FROM user_logins
                    WHERE user_id = $1
                `;
                const staffInfoResult = await client.query(staffInfoQuery, [staffId]);
                const selectedStaff = staffInfoResult.rows[0];

                // Insert assignment into staff_customer_assignments table
                const insertAssignmentQuery = `
                    INSERT INTO staff_customer_assignments (staff_id, client_id, created_at)
                    VALUES ($1, $2, $3)
                `;
                await client.query(insertAssignmentQuery, [staffId, clientId, createdAt]);

                // Send assignment email
                await sendAssignmentEmail({
                    clientFirstName: first_name,
                    clientEmail: email_address,
                    staffFirstName: selectedStaff.first_name,
                    staffEmail: selectedStaff.email_address,
                    staffContactNumber: selectedStaff.contact_number,
                });

                staffIndex = (staffIndex + 1) % availableStaffIds.length;
            }

            // Update current_step to the assigned team for the assigned clients
            const updateClientStepQuery = `
                UPDATE user_logins
                SET current_step = $1
                WHERE user_id = ANY($2)
            `;
            await client.query(updateClientStepQuery, [team, unassignedClientIds]);

            // Commit the transaction
            await client.query('COMMIT');

            res.status(200).json({ success: true, message: 'Clients assigned and updated successfully' });
        } catch (error) {
            // Rollback the transaction in case of an error
            await client.query('ROLLBACK');
            console.error('Error assigning clients:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error assigning clients:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};



module.exports = {
    getAssignments,
    assignClientToStaff,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getStaffAssignments,
    autoAssignClients,
    assignClientsToStaff
}