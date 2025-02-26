import { Router } from 'express';
import { getDb } from '../database/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Get model configuration
router.get('/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const db = getDb();
    
    const config = db.prepare(
      'SELECT * FROM model_configs WHERE id = ?'
    ).get(modelId);
    
    res.json(config || {});
  } catch (error) {
    logger.error('Error fetching config:', error);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// Update model configuration
router.put('/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    const { temperature, top_p, max_tokens } = req.body;
    const db = getDb();
    
    db.prepare(`
      INSERT OR REPLACE INTO model_configs (id, temperature, top_p, max_tokens)
      VALUES (?, ?, ?, ?)
    `).run(modelId, temperature, top_p, max_tokens);
    
    res.json({ status: 'updated' });
  } catch (error) {
    logger.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

export default router;
