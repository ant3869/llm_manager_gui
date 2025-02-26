import { useState } from 'react';

export default function SystemPrompt() {
  const [prompt, setPrompt] = useState('');
  
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle prompt submission
    console.log('Prompt submitted:', prompt);
  };

  return (
    <div className="h-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        System Prompt Configuration
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="systemPrompt" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            System Prompt
          </label>
          <textarea
            id="systemPrompt"
            value={prompt}
            onChange={handlePromptChange}
            rows="12"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter system prompt..."
          />
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                     bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                     rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setPrompt('')}
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                     rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
