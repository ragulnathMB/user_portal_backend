const sql = require('mssql');

const userDBConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
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
    console.error('Continuing without database connection');
    return null;
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
