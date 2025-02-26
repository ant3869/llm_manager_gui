import { useState, useContext } from 'react';

export default function ModelControls() {
  const [systemPrompt, setSystemPrompt] = useState(
    "Think through this step-by-step:\n1. Understand the question\n2. Break down the components\n3. Form a detailed response"
  );

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto space-y-4">        
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Enter system prompt..."
          className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-sm resize-none"
          rows="3"
        />
      </div>
    </div>
  );
}
