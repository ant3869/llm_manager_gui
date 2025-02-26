import { useState } from 'react'
import ModelProgress from './ModelProgress'

export default function Header({ darkMode, setDarkMode, toggleSidebar }) {
  const [isExporting, setIsExporting] = useState(false)
  const [modelRunning, setModelRunning] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo')

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => setIsExporting(false), 1000)
  }

  const toggleModel = () => {
    setModelRunning(!modelRunning)
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold text-gray-800 dark:text-white">LLM Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="local-model">Local Model</option>
          </select>

          <button
            onClick={toggleModel}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              modelRunning 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            {modelRunning ? 'Stop Model' : 'Start Model'}
          </button>

          <ModelProgress isRunning={modelRunning} />

          <button
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export Report'}
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  )
}
