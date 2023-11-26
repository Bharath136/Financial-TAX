const client = require('../database/connection')



// Create Assignment
const createAssignment = async (req, res) => {
    const { staff_id, client_id } = req.body;
    const created_at = new Date().toISOString();
    try {
        const { rows } = await client.query('INSERT INTO staff_customer_assignments (staff_id, client_id, created_at) VALUES ($1, $2, $3) RETURNING *', [staff_id, client_id, created_at]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error creating assignment:', error);
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


module.exports = {
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentById,
    getStaffAssignments
}