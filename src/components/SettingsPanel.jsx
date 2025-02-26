import { useState } from 'react';

export default function SettingsPanel({ settings, setSettings }) {
  const updateSettings = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  return (
    <div className="h-full p-4 bg-white dark:bg-gray-800 overflow-y-auto">
      <div className="space-y-6">
        {/* System Prompt Section */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            System Prompt
          </h3>
          <textarea
            value={settings.systemPrompt}
            onChange={(e) => setSettings(prev => ({ ...prev, systemPrompt: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
          />
        </section>

        {/* Text-to-Speech Settings */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Text-to-Speech
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Enable TTS</label>
              <input
                type="checkbox"
                checked={settings.tts.enabled}
                onChange={(e) => updateSettings('tts', 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Speech Rate
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.tts.rate}
                onChange={(e) => updateSettings('tts', 'rate', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Speech-to-Text Settings */}
        <section>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Speech-to-Text
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700 dark:text-gray-300">Enable STT</label>
              <input
                type="checkbox"
                checked={settings.stt.enabled}
                onChange={(e) => updateSettings('stt', 'enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={settings.stt.language}
                onChange={(e) => updateSettings('stt', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
