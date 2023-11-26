const express = require('express');
const { authenticate } = require('../middlewares/middleware');
const router = express.Router();

const { 
    getAllUsers,
    getUserById,
    userRegistration, 
    updateUserById, 
    deleteUserById, 
    userLogin,
    addStaff
} = require('../controllers/user');

// Register a new user api
router.post('/register', userRegistration)

// Login a registered user api
router.post('/login', userLogin)

// Add Staff by admin
router.post('/add-staff',authenticate(['ADMIN']), addStaff)

// Authorized user api
router.get('/',authenticate(['STAFF', 'ADMIN']), getAllUsers);

// Authorized user api
router.route("/:id")
    .get(authenticate(['CUSTOMER','ADMIN','STAFF']), getUserById)
    .put(authenticate(['CUSTOMER','STAFF','ADMIN']), updateUserById)
    .delete(authenticate(['CUSTOMER']), deleteUserById);


module.exports = router;
