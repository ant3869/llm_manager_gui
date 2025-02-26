import { logger } from '../utils/logger.js';
import { updateRequestMetrics } from '../monitoring';

const CHUNK_SIZE = 1024;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function setupWebSocket(wss) {
  wss.on('connection', (ws) => {
    logger.info('New WebSocket connection established');
    let streamBuffer = '';
    let messageQueue = [];
    let processingQueue = false;

    const processMessageQueue = async () => {
      if (processingQueue || messageQueue.length === 0) return;
      
      processingQueue = true;
      const startTime = Date.now();
      
      try {
        const message = messageQueue.shift();
        await handleMessage(ws, message, streamBuffer);
        
        // Update metrics
        const processingTime = Date.now() - startTime;
        updateRequestMetrics(message.length, processingTime);
      } catch (error) {
        logger.error('Message processing error:', error);
      } finally {
        processingQueue = false;
        if (messageQueue.length > 0) {
          processMessageQueue();
        }
      }
    };

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        messageQueue.push(data);
        processMessageQueue();
      } catch (error) {
        logger.error('WebSocket message parsing error:', error);
        ws.send(JSON.stringify({ 
          type: 'error',
          error: 'Invalid message format'
        }));
      }
    });

    ws.on('close', () => {
      logger.info('WebSocket connection closed');
      streamBuffer = '';
      messageQueue = [];
    });

    // Heartbeat to keep connection alive
    const heartbeat = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.ping();
      }
    }, 30000);

    ws.on('close', () => clearInterval(heartbeat));
  });
}

async function handleMessage(ws, data, streamBuffer) {
  const startTime = Date.now();
  
  try {
    switch (data.type) {
      case 'chat':
        await handleChatMessage(ws, data);
        break;
        
      case 'stream':
        await handleStreamMessage(ws, data, streamBuffer);
        break;
        
      case 'status':
        sendStatusUpdate(ws);
        break;
        
      default:
        throw new Error('Unknown message type');
    }
    
    // Log performance metrics
    const processingTime = Date.now() - startTime;
    logger.info(`Message processed in ${processingTime}ms`, {
      type: data.type,
      size: JSON.stringify(data).length
    });
    
  } catch (error) {
    handleError(ws, error);
  }
}

async function handleChatMessage(ws, data) {
  const { message, options = {} } = data;
  
  try {
    // Process chat message
    const response = await processChatMessage(message, options);
    
    ws.send(JSON.stringify({
      type: 'chat-response',
      content: response,
      timestamp: Date.now()
    }));
  } catch (error) {
    throw new Error(`Chat processing failed: ${error.message}`);
  }
}

async function handleStreamMessage(ws, data, streamBuffer) {
  const { content, isComplete = false } = data;
  
  try {
    if (content) {
      streamBuffer += content;
      
      while (streamBuffer.length >= CHUNK_SIZE) {
        const chunk = streamBuffer.slice(0, CHUNK_SIZE);
        streamBuffer = streamBuffer.slice(CHUNK_SIZE);
        
        await sendChunk(ws, chunk, false);
      }
    }
    
    if (isComplete && streamBuffer.length > 0) {
      await sendChunk(ws, streamBuffer, true);
      streamBuffer = '';
    }
  } catch (error) {
    throw new Error(`Stream processing failed: ${error.message}`);
  }
}

async function sendChunk(ws, chunk, isComplete, retryCount = 0) {
  try {
    ws.send(JSON.stringify({
      type: 'stream-chunk',
      content: chunk,
      isComplete
    }));
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return sendChunk(ws, chunk, isComplete, retryCount + 1);
    }
    throw error;
  }
}

function sendStatusUpdate(ws) {
  ws.send(JSON.stringify({
    type: 'status',
    timestamp: Date.now(),
    status: 'healthy'
  }));
}

function handleError(ws, error) {
  logger.error('WebSocket error:', error);
  ws.send(JSON.stringify({
    type: 'error',
    error: error.message,
    timestamp: Date.now()
  }));
}

async function processChatMessage(message, options) {
  // Simulate chat processing
  await new Promise(resolve => setTimeout(resolve, 100));
  return `Processed: ${message}`;
}
