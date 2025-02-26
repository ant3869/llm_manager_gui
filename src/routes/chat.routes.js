import { Router } from 'express';
import { runQuery, getQuery } from '../database/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Create new conversation
router.post('/conversations', async (req, res) => {
  try {
    const conversationId = Date.now().toString();
    const title = req.body.title || 'New Conversation';
    const userId = req.body.userId || 'anonymous';
    
    await runQuery(
      'INSERT INTO conversations (id, title, user_id) VALUES (?, ?, ?)',
      [conversationId, title, userId]
    );
    
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
    
    const messageId = Date.now().toString();
    const tokens = content.length / 4; // Simple estimation
    
    await runQuery(
      'INSERT INTO messages (id, conversation_id, role, content, tokens) VALUES (?, ?, ?, ?, ?)',
      [messageId, conversationId, role, content, tokens]
    );
    
    // Update conversation timestamp
    await runQuery(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [conversationId]
    );
    
    // If this is a user message, we would typically generate an AI response here
    // For now, we'll just return the message ID
    
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
    
    // Get conversation details
    const conversation = await getQuery(
      'SELECT * FROM conversations WHERE id = ?',
      [conversationId]
    );
    
    if (conversation.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Get messages
    const messages = await getQuery(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );
    
    res.json({ 
      conversation: conversation[0],
      messages 
    });
  } catch (error) {
    logger.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Get all conversations
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await getQuery(
      'SELECT * FROM conversations ORDER BY updated_at DESC'
    );
    
    res.json({ conversations });
  } catch (error) {
    logger.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Delete conversation
router.delete('/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Delete messages first (foreign key constraint)
    await runQuery(
      'DELETE FROM messages WHERE conversation_id = ?',
      [conversationId]
    );
    
    // Delete conversation
    await runQuery(
      'DELETE FROM conversations WHERE id = ?',
      [conversationId]
    );
    
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

export default router;
