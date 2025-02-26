import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_CHAIN_OF_THOUGHT_PROMPT = `Before providing solutions:
1. Analyze the problem thoroughly
2. Break down into clear steps
3. Consider edge cases
4. Plan implementation approach
5. Validate solution strategy`;

export default function ModelSettings() {
  const [settings, setSettings] = useState({
    temperature: 0.7,
    topP: 1,
    maxTokens: 2048,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: DEFAULT_CHAIN_OF_THOUGHT_PROMPT,
    ttsEnabled: false,
    sttEnabled: false
  });

  const [isSupported, setIsSupported] = useState({
    stt: false,
    tts: false
  });

  useEffect(() => {
    setIsSupported({
      stt: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      tts: 'speechSynthesis' in window
    });
  }, []);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      className="h-full w-80 bg-white dark:bg-gray-800 border-l dark:border-gray-700 shadow-lg overflow-y-auto"
    >
      <div className="p-4 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Model Settings</h2>

        <div className="space-y-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              System Prompt
            </label>
            <textarea
              value={settings.systemPrompt}
              onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
              rows="6"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              placeholder="Enter system prompt..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Top P: {settings.topP}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.topP}
              onChange={(e) => handleSettingChange('topP', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency Penalty: {settings.frequencyPenalty}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={settings.frequencyPenalty}
              onChange={(e) => handleSettingChange('frequencyPenalty', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Presence Penalty: {settings.presencePenalty}
            </label>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={settings.presencePenalty}
              onChange={(e) => handleSettingChange('presencePenalty', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Speech Options</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Text-to-Speech</span>
                <button
                  onClick={() => handleSettingChange('ttsEnabled', !settings.ttsEnabled)}
                  disabled={!isSupported.tts}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${settings.ttsEnabled ? 'bg-blue-500' : 'bg-gray-200'}
                    ${!isSupported.tts ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${settings.ttsEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Speech-to-Text</span>
                <button
                  onClick={() => handleSettingChange('sttEnabled', !settings.sttEnabled)}
                  disabled={!isSupported.stt}
                  className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${settings.sttEnabled ? 'bg-blue-500' : 'bg-gray-200'}
                    ${!isSupported.stt ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <span
                    className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                      ${settings.sttEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
