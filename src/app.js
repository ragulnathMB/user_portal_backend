require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
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
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

module.exports = { app, initializeApp };
