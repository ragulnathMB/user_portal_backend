const userService = require('../services/user.service');
const { successResponse, errorResponse } = require('../utils/response');

class UserController {
  async createUser(req, res) {
    try {
      const result = await userService.createUser(req.body);
      successResponse(res, result, 'User created successfully', 201);
    } catch (error) {
      console.error('Create user error:', error);
      errorResponse(res, error.message, 500);
    }
  }

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await userService.updateUser(userId, req.body);
      successResponse(res, result, 'User updated successfully');
    } catch (error) {
      console.error('Update user error:', error);
      errorResponse(res, error.message, 500);
    }
  }

  async deleteUsers(req, res) {
    try {
      const result = await userService.deleteUsers(req.body.userIds);
      successResponse(res, result, 'Users deleted successfully');
    } catch (error) {
      console.error('Delete users error:', error);
      errorResponse(res, error.message, error.message.includes('required') ? 400 : 500);
    }
  }

  async enableUsers(req, res) {
    try {
      const result = await userService.updateUserStatus(req.body.userIds, 'Enabled');
      successResponse(res, result, 'Users enabled successfully');
    } catch (error) {
      console.error('Enable users error:', error);
      errorResponse(res, error.message, error.message.includes('required') ? 400 : 500);
    }
  }

  async disableUsers(req, res) {
    try {
      const result = await userService.updateUserStatus(req.body.userIds, 'Disabled');
      successResponse(res, result, 'Users disabled successfully');
    } catch (error) {
      console.error('Disable users error:', error);
      errorResponse(res, error.message, error.message.includes('required') ? 400 : 500);
    }
  }

  async getUsersByTenant(req, res) {
    try {
      const { tenantId } = req.params;
      const users = await userService.getUsersByTenant(tenantId);
      successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      console.error('Get users by tenant error:', error);
      errorResponse(res, error.message, 500);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      console.error('Get all users error:', error);
      errorResponse(res, error.message, 500);
    }
  }

  async importUsers(req, res) {
    try {
      const { tenantId } = req.params;
      const result = await userService.importUsers(tenantId, req.body);
      successResponse(res, result, 'Users imported successfully');
    } catch (error) {
      console.error('Import users error:', error);
      errorResponse(res, error.message, error.message.includes('Invalid') ? 400 : 500);
    }
  }

  async getUsersByTenantId(req, res) {
    try {
      const { tenantID } = req.params;
      const users = await userService.getUsersByTenantId(tenantID);
      successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
      console.error('Get users by tenant ID error:', error);
      errorResponse(res, 'Failed to fetch users', 500);
    }
  }
}

module.exports = new UserController();
