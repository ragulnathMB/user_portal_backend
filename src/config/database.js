const sql = require('mssql');

const userDBConfig = {
  user: process.env.DB_USER || 'testuser',
  password: process.env.DB_PASSWORD || '1234',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'UserDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let userDBPool;

const initializeDatabase = async () => {
  try {
    userDBPool = new sql.ConnectionPool(userDBConfig);
    await userDBPool.connect();
    console.log('User database pool initialized successfully');
    return userDBPool;
  } catch (err) {
    console.error('Error initializing user database pool:', err);
    process.exit(1);
  }
};

const getDBPool = () => {
  if (!userDBPool) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return userDBPool;
};

const closeDatabase = async () => {
  if (userDBPool) {
    await userDBPool.close();
    console.log('Database connection closed');
  }
};

module.exports = {
  initializeDatabase,
  getDBPool,
  closeDatabase,
  sql
};
