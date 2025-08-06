const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
const errorHandler = require('./middleware/error_handler');
const { initializeDatabase } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize database
const initializeApp = async () => {
  try {
    await initializeDatabase();
    console.log('User Portal application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database, continuing without DB:', error);
  }
};

module.exports = { app, initializeApp };
