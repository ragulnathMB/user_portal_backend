const { app, initializeApp } = require('./src/app');
const { closeDatabase } = require('./src/config/database');

const PORT = process.env.PORT || 3002;

const startServer = async () => {
  try {
    await initializeApp();
    
    const server = app.listen(PORT, () => {
      console.log(`✅ User Portal Server running at http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed');
        await closeDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
