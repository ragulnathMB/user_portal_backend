const express = require('express');
const userController = require('../controllers/user.controller');
const { validateUserCreation, validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

// User CRUD operations
router.post('/users', validateUserCreation, userController.createUser);
router.put('/users/:userId', validateUserUpdate, userController.updateUser);
router.delete('/users', userController.deleteUsers);

// User status management
router.put('/userStatus/enable', userController.enableUsers);
router.put('/userStatus/disable', userController.disableUsers);

// Get users
router.get('/users', userController.getAllUsers);
router.get('/users/tenant/:tenantId', userController.getUsersByTenant);
router.get('/tenant/:tenantID/users', userController.getUsersByTenantId);

// Import users
router.post('/:tenantId/import-users', userController.importUsers);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'User Portal',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
