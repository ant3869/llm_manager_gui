import { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import ModelSettings from './ModelSettings';
import ResourceMonitor from './ResourceMonitor';
import ThinkingAnimation from './ThinkingAnimation';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [metrics, setMetrics] = useState({
    tokens: 0,
    responseTime: 0
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const wsRef = useRef(null);
  const conversationIdRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket();

    // Create a new conversation
    createConversation();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = 3001; // Backend server port
    const wsUrl = `${protocol}//${host}:${port}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connection established');
        setConnectionStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('error');
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setConnectionStatus('disconnected');
        
        // Try to reconnect after a delay
        setTimeout(() => {
          if (connectionStatus !== 'connected') {
            connectWebSocket();
          }
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setConnectionStatus('error');
    }
  };

  const createConversation = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
      
      const data = await response.json();
      conversationIdRef.current = data.conversationId;
      console.log('Conversation created:', data.conversationId);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const handleWebSocketMessage = (data) => {
    switch (data.type) {
      case 'chat-response':
        // Add AI response to messages
        setMessages(prev => [...prev, {
          id: Date.now(),
          role: 'assistant',
          content: data.content
        }]);
        setIsProcessing(false);
        
        // Update metrics
        setMetrics(prev => ({
          tokens: prev.tokens + (data.tokens || 0),
          responseTime: data.processingTime || prev.responseTime
        }));
        break;
        
      case 'stream-chunk':
        // Handle streaming response if implemented
        break;
        
      case 'error':
        console.error('Error from server:', data.error);
        setIsProcessing(false);
        break;
        
      case 'status':
        // Update connection status
        setConnectionStatus(data.status === 'healthy' ? 'connected' : 'error');
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim() || !wsRef.current || connectionStatus !== 'connected') return;
    
    const startTime = Date.now();
    setIsProcessing(true);
    
    // Add user message immediately
    const messageId = Date.now();
    setMessages(prev => [...prev, { 
      id: messageId,
      role: 'user', 
      content: message 
    }]);
    
    try {
      // Send message via WebSocket
      wsRef.current.send(JSON.stringify({
        type: 'chat',
        message,
        conversationId: conversationIdRef.current,
        timestamp: Date.now()
      }));
      
      // Also save to database via API
      if (conversationIdRef.current) {
        await fetch(`/api/chat/conversations/${conversationIdRef.current}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            content: message,
            role: 'user'
          })
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsProcessing(false);
      
      // Fallback to simulated response if WebSocket fails
      setTimeout(() => {
        const responseTime = Date.now() - startTime;
        setMessages(prev => [...prev, { 
          id: Date.now() + 1,
          role: 'assistant', 
          content: `[FALLBACK] This is a simulated response to: ${message}` 
        }]);
        
        setMetrics(prev => ({
          tokens: prev.tokens + message.length / 4,
          responseTime
        }));
        
        setIsProcessing(false);
      }, 2000);
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex-1 flex relative">
        {connectionStatus === 'disconnected' && (
          <div className="absolute top-0 left-0 right-0 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm p-2 text-center">
            Disconnected from server. Attempting to reconnect...
          </div>
        )}
        {connectionStatus === 'error' && (
          <div className="absolute top-0 left-0 right-0 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm p-2 text-center">
            Connection error. Please refresh the page.
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
            <MessageList messages={messages} />
            {isProcessing && (
              <div className="px-4">
                <ThinkingAnimation />
              </div>
            )}
          </div>
          <div className="border-t dark:border-gray-700">
            <div className="p-4">
              <InputArea 
                onSend={handleSendMessage}
                isProcessing={isProcessing}
                isListening={isListening}
              />
            </div>
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 flex items-center justify-between">
              <ResourceMonitor />
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Tokens: {Math.round(metrics.tokens)}</span>
                <span>Response: {metrics.responseTime}ms</span>
              </div>
            </div>
          </div>
        </div>
        <ModelSettings />
      </div>
    </div>
  );
}
