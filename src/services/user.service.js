const { getDBPool, sql } = require('../config/database');
const axios = require('axios')
class UserService {
  async createUser(userData) {
    const { UserID, EmpID, TenentID, Name, Status } = userData;
    const pool = getDBPool();
    const password = '123456';
    
    await pool.request()
      .input('UserID', sql.VarChar(50), UserID)
      .input('EmpID', sql.VarChar(50), EmpID)
      .input('TenentID', sql.VarChar(50), TenentID)
      .input('Name', sql.VarChar(100), Name)
      .input('Password', sql.VarChar(50), password)
      .input('Status', sql.VarChar(20), Status)
      .query(`INSERT INTO Users (UserID, EmpID, TenentID, Name, Password, Status)
              VALUES (@UserID, @EmpID, @TenentID, @Name, @Password, @Status)`);
    
    return { message: 'User created successfully' };
  }

  async updateUser(userId, userData) {
    const { EmpID, TenantID, Name, Status } = userData;
    const pool = getDBPool();
    
    await pool.request()
      .input('UserID', sql.VarChar(50), userId)
      .input('EmpID', sql.VarChar(50), EmpID)
      .input('TenantID', sql.VarChar(50), TenantID)
      .input('Name', sql.VarChar(100), Name)
      .input('Status', sql.VarChar(20), Status)
      .query(`UPDATE Users SET EmpID=@EmpID, TenantID=@TenantID, Name=@Name, Status=@Status
              WHERE UserID=@UserID`);
    
    return { message: 'User updated successfully' };
  }

  async deleteUsers(userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error('userIds array is required');
    }
    
    const pool = getDBPool();
    const inClause = userIds.map(id => `'${id}'`).join(',');
    
    await pool.request()
      .query(`DELETE FROM Users WHERE UserID IN (${inClause})`);
    
    return { message: 'Users deleted successfully' };
  }

  async updateUserStatus(userIds, status) {
    if (!Array.isArray(userIds)) {
      throw new Error('userIds array required');
    }
    
    const pool = getDBPool();
    const inClause = userIds.map(id => `'${id}'`).join(',');
    
    await pool.request()
      .query(`UPDATE Users SET Status = '${status}' WHERE UserID IN (${inClause})`);
    
    return { message: `Users ${status.toLowerCase()} successfully` };
  }

  async getUsersByTenant(tenantId) {
    const pool = getDBPool();
    const result = await pool.request()
      .input('TenantID', sql.VarChar(50), tenantId)
      .query('SELECT * FROM Users WHERE TenantID = @TenantID');
    
    return result.recordset;
  }

  async getAllUsers() {
    const pool = getDBPool();
    const result = await pool.request()
      .query('SELECT * FROM Users');
    
    return result.recordset;
  }

  async importUsers(tenantId, users) {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error('Invalid or empty user list');
    }

    const pool = getDBPool();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      
      for (const user of users) {
        const UserID = user["User ID"];
        const EmpID = user["Employee ID"];
        const Name = user["Name"];
        const Status = user["Status"];
        const Password = user["Password"] || '123456';

        const request = new sql.Request(transaction);

        await request
          .input('UserID', sql.VarChar(50), UserID)
          .input('EmpID', sql.VarChar(50), EmpID)
          .input('TenentID', sql.VarChar(50), tenantId)
          .input('Name', sql.VarChar(100), Name)
          .input('Password', sql.VarChar(50), Password)
          .input('Status', sql.VarChar(20), Status)
          .query(`
            INSERT INTO Users (UserID, EmpID, TenentID, Name, Password, Status)
            VALUES (@UserID, @EmpID, @TenentID, @Name, @Password, @Status)
          `);
      }

      await transaction.commit();
      return { message: 'Users imported successfully' };

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async getUsersByTenantId(tenantId) {
    const pool = getDBPool();
    const result = await pool.request()
      .input('tenantID', sql.VarChar, tenantId)
      .query('SELECT * FROM Users WHERE TenentID = @tenantID');
    
    return result.recordset;
  }

  async getUserWorkingCompanies(userID) {
    try {
      const pool = await getDBPool();
      const result = await pool.request()
        .input('userID', sql.VarChar, userID)
        .query('SELECT CompanyId FROM UserCompanies WHERE UserId = @userID');

      const companyList = result.recordset.map(row => row.CompanyId);

      return companyList;
    } catch (err) {
      console.error('Error in getUserWorkingCompanies:', err);
      throw err;
    }
  }
  async validateUser(userID) {
    const pool = getDBPool();

    // Fetch the user with Status='Enabled'
    console.log(userID+'you');
    const result = await pool.request()
      .input('UserID', sql.VarChar(50), userID)
      .query(`SELECT EmpID, CompanyID, TenentID, Status FROM Users WHERE UserID = @UserID AND Status = 'Enabled'`);

    const user = result.recordset[0];

    if (!user) {
      const error = new Error('User not found or disabled');
      error.statusCode = 404;
      throw error;
    }

    // Make POST call to TenantPortal with TenentID in the payload/body
    const tenantApiUrl = `http://localhost:3001/api/login/userValidation`;

    let tenantCredentials;
    try {
      const response = await axios.post(tenantApiUrl, { TenantID: user.TenentID });
      tenantCredentials = response.data; // Should have { username, password }
    } catch (err) {
      const error = new Error('Failed to fetch tenant credentials');
      error.statusCode = 500;
      throw error;
    }

    // Return combined result
    return {
      context:{
        CompanyID: user.CompanyID,
        Language:'English'
      },
      EmpID: user.EmpID,
      TenentID: user.TenentID,
      tenantUsername: tenantCredentials.username,
      tenantPassword: tenantCredentials.password,
    };
  }
}

module.exports = new UserService();
