import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/outline';

export default function InputArea({ onSend, isProcessing, isListening }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-4 pr-24 rounded-lg border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 resize-none overflow-hidden"
        rows="1"
        disabled={isProcessing}
      />
      
      <div className="absolute right-2 bottom-2 flex space-x-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full ${
            isListening 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
          aria-label="Toggle voice input"
        >
          <MicrophoneIcon className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={!input.trim() || isProcessing}
          className={`p-2 rounded-full ${
            input.trim() && !isProcessing
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
          }`}
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5 transform rotate-90" />
        </motion.button>
      </div>
    </form>
  );
}
