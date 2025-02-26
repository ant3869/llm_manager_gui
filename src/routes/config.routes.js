import { Router } from 'express';
import { runQuery, getQuery } from '../database/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Default model settings
const DEFAULT_MODEL_SETTINGS = {
  temperature: 0.7,
  topP: 1,
  maxTokens: 2048,
  frequencyPenalty: 0,
  presencePenalty: 0,
  systemPrompt: `Before providing solutions:
1. Analyze the problem thoroughly
2. Break down into clear steps
3. Consider edge cases
4. Plan implementation approach
5. Validate solution strategy`,
  ttsEnabled: false,
  sttEnabled: false
};

// Get model settings
router.get('/model-settings', async (req, res) => {
  try {
    // Get the latest model config from the database
    const configs = await getQuery(
      'SELECT * FROM model_configs ORDER BY created_at DESC LIMIT 1'
    );
    
    if (configs.length === 0) {
      // If no config exists, return default settings
      return res.json({ settings: DEFAULT_MODEL_SETTINGS });
    }
    
    // Convert database model to frontend model
    const config = configs[0];
    const settings = {
      temperature: config.temperature,
      topP: config.top_p,
      maxTokens: config.max_tokens,
      frequencyPenalty: config.frequency_penalty,
      presencePenalty: config.presence_penalty,
      systemPrompt: config.system_prompt || DEFAULT_MODEL_SETTINGS.systemPrompt,
      ttsEnabled: config.tts_enabled === 1,
      sttEnabled: config.stt_enabled === 1
    };
    
    res.json({ settings });
  } catch (error) {
    logger.error('Error fetching model settings:', error);
    res.status(500).json({ error: 'Failed to fetch model settings' });
  }
});

// Save model settings
router.post('/model-settings', async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ error: 'Settings object is required' });
    }
    
    // Validate settings
    const temperature = parseFloat(settings.temperature);
    const topP = parseFloat(settings.topP);
    const maxTokens = parseInt(settings.maxTokens);
    const frequencyPenalty = parseFloat(settings.frequencyPenalty);
    const presencePenalty = parseFloat(settings.presencePenalty);
    
    if (isNaN(temperature) || temperature < 0 || temperature > 2) {
      return res.status(400).json({ error: 'Temperature must be between 0 and 2' });
    }
    
    if (isNaN(topP) || topP < 0 || topP > 1) {
      return res.status(400).json({ error: 'Top P must be between 0 and 1' });
    }
    
    if (isNaN(maxTokens) || maxTokens < 1) {
      return res.status(400).json({ error: 'Max tokens must be a positive integer' });
    }
    
    if (isNaN(frequencyPenalty) || frequencyPenalty < -2 || frequencyPenalty > 2) {
      return res.status(400).json({ error: 'Frequency penalty must be between -2 and 2' });
    }
    
    if (isNaN(presencePenalty) || presencePenalty < -2 || presencePenalty > 2) {
      return res.status(400).json({ error: 'Presence penalty must be between -2 and 2' });
    }
    
    // Create a new config entry
    const configId = Date.now().toString();
    const systemPrompt = settings.systemPrompt || DEFAULT_MODEL_SETTINGS.systemPrompt;
    const ttsEnabled = settings.ttsEnabled ? 1 : 0;
    const sttEnabled = settings.sttEnabled ? 1 : 0;
    
    // Check if we need to add system_prompt, tts_enabled, and stt_enabled columns
    try {
      await runQuery(`
        ALTER TABLE model_configs 
        ADD COLUMN system_prompt TEXT DEFAULT NULL
      `);
      
      await runQuery(`
        ALTER TABLE model_configs 
        ADD COLUMN tts_enabled INTEGER DEFAULT 0
      `);
      
      await runQuery(`
        ALTER TABLE model_configs 
        ADD COLUMN stt_enabled INTEGER DEFAULT 0
      `);
    } catch (error) {
      // Columns might already exist, which is fine
      logger.debug('Columns might already exist:', error.message);
    }
    
    await runQuery(
      `INSERT INTO model_configs (
        id, name, temperature, top_p, max_tokens, 
        presence_penalty, frequency_penalty, system_prompt,
        tts_enabled, stt_enabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        configId, 
        'Custom Config', 
        temperature, 
        topP, 
        maxTokens, 
        presencePenalty, 
        frequencyPenalty,
        systemPrompt,
        ttsEnabled,
        sttEnabled
      ]
    );
    
    res.json({ success: true, configId });
  } catch (error) {
    logger.error('Error saving model settings:', error);
    res.status(500).json({ error: 'Failed to save model settings' });
  }
});

// Get available model presets
router.get('/model-presets', async (req, res) => {
  try {
    const presets = [
      {
        id: 'creative',
        name: 'Creative',
        description: 'Higher temperature for more creative responses',
        settings: {
          temperature: 0.9,
          topP: 1,
          maxTokens: 2048,
          frequencyPenalty: 0.5,
          presencePenalty: 0.5
        }
      },
      {
        id: 'balanced',
        name: 'Balanced',
        description: 'Default settings for general use',
        settings: {
          temperature: 0.7,
          topP: 1,
          maxTokens: 2048,
          frequencyPenalty: 0,
          presencePenalty: 0
        }
      },
      {
        id: 'precise',
        name: 'Precise',
        description: 'Lower temperature for more deterministic responses',
        settings: {
          temperature: 0.3,
          topP: 0.9,
          maxTokens: 2048,
          frequencyPenalty: 0,
          presencePenalty: 0
        }
      }
    ];
    
    res.json({ presets });
  } catch (error) {
    logger.error('Error fetching model presets:', error);
    res.status(500).json({ error: 'Failed to fetch model presets' });
  }
});

export default router;
