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

  async getUserWorkingCompanies(req, res) {
    try {
      const usersWorkingCompanies = await userService.getUserWorkingCompanies(req.body.userID);
      successResponse(res, usersWorkingCompanies, 'Users retrieved successfully');
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
  async validateUser(req, res) {
    try {
      const userID = req.body.userID;  // userID in URL
   

      const data = await userService.validateUser(userID);

      // Use a secure and unique value in production (e.g., a JWT)
      const cookieValue = data;

      
      res.cookie('MyAppSession', cookieValue, {
        httpOnly: true,
        secure: true,            // Required for SameSite=None
        sameSite: 'None',        // Allow cookie with cross-site requests
        maxAge: 60 * 24 * 60 * 60 * 1000 // 2 months
      });
      res.status(200).json({ message: 'User validated successfully' });

    } catch (error) {
      if (error.statusCode === 404) {
        return errorResponse(res, error.message, 404);
      }
      console.error('Validate user error:', error);
      errorResponse(res, error.message || 'Server error', 500);
    }
  }

}

module.exports = new UserController();
