import { Router } from 'express';
import osu from 'node-os-utils';
import { logger } from '../utils/logger.js';

const router = Router();

// Get system metrics
router.get('/metrics', async (req, res) => {
  try {
    const cpu = osu.cpu;
    const mem = osu.mem;
    
    const [cpuUsage, memInfo] = await Promise.all([
      cpu.usage(),
      mem.info()
    ]);
    
    res.json({
      cpu: cpuUsage,
      memory: memInfo,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get model status
router.get('/model-status', async (req, res) => {
  try {
    // Implement model status checking logic here
    res.json({
      status: 'active',
      uptime: process.uptime(),
      lastRequest: Date.now()
    });
  } catch (error) {
    logger.error('Error fetching model status:', error);
    res.status(500).json({ error: 'Failed to fetch model status' });
  }
});

export default router;
