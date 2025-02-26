import { useState, useEffect } from 'react';
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

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;
    
    const startTime = Date.now();
    setIsProcessing(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { 
      id: Date.now(),
      role: 'user', 
      content: message 
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      setMessages(prev => [...prev, { 
        id: Date.now() + 1,
        role: 'assistant', 
        content: `This is a simulated response to: ${message}` 
      }]);
      
      setMetrics(prev => ({
        tokens: prev.tokens + message.length / 4,
        responseTime
      }));
      
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex-1 flex">
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
