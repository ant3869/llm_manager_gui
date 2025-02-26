import { Router } from 'express';
import modelRoutes from './model.routes.js';
import chatRoutes from './chat.routes.js';
import monitoringRoutes from './monitoring.routes.js';
import configRoutes from './config.routes.js';

export function setupRoutes(app) {
  const router = Router();

  router.use('/api/models', modelRoutes);
  router.use('/api/chat', chatRoutes);
  router.use('/api/monitoring', monitoringRoutes);
  router.use('/api/config', configRoutes);

  app.use(router);
}
