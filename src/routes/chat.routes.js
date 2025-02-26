import { Router } from 'express';
import { getDb } from '../database/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Create new conversation
router.post('/conversations', async (req, res) => {
  try {
    const db = getDb();
    const conversationId = Date.now().toString();
    
    db.prepare('INSERT INTO conversations (id) VALUES (?)').run(conversationId);
    
    res.json({ conversationId });
  } catch (error) {
    logger.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

// Send message
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, role } = req.body;
    const db = getDb();
    
    const messageId = Date.now().toString();
    
    db.prepare(
      'INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)'
    ).run(messageId, conversationId, role, content);
    
    // Implement AI response generation here
    
    res.json({ messageId });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get conversation history
router.get('/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const db = getDb();
    
    const messages = db.prepare(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
    ).all(conversationId);
    
    res.json({ messages });
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

export default router;
