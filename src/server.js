import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupDatabase } from './database/index.js';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket/index.js';
import { logger } from './utils/logger.js';
import { initializeMonitoring } from './monitoring/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize components
async function startServer() {
  try {
    await setupDatabase();
    setupRoutes(app);
    setupWebSocket(wss);
    initializeMonitoring();

    // Error handling middleware
    app.use((err, req, res, next) => {
      logger.error(err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    const PORT = process.env.PORT || 3001; // Changed to 3001
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();
