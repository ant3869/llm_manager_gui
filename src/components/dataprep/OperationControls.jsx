import { useState } from 'react'

export default function OperationControls({ dataset, config, onBack }) {
  const [isExporting, setIsExporting] = useState(false)
  const [savedTemplates, setSavedTemplates] = useState([
    { id: 1, name: 'Basic Cleaning', timestamp: '2023-06-10' },
    { id: 2, name: 'Full Pipeline', timestamp: '2023-06-15' }
  ])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      // Trigger download logic here
    }, 2000)
  }

  const handleSaveTemplate = () => {
    const newTemplate = {
      id: savedTemplates.length + 1,
      name: `Template ${savedTemplates.length + 1}`,
      timestamp: new Date().toISOString().split('T')[0]
    }
    setSavedTemplates([...savedTemplates, newTemplate])
  }

  return (
    <div className="space-y-8">
      {/* Operation Summary */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Operation Summary
        </h3>
        <div className="space-y-4">
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Templates */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Saved Templates
          </h3>
          <button
            onClick={handleSaveTemplate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Current
          </button>
        </div>
        <div className="space-y-4">
          {savedTemplates.map(template => (
            <div
              key={template.id}
              className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {template.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Saved on {template.timestamp}
                </p>
              </div>
              <button
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Load
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Back
        </button>
        <div className="space-x-4">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Export Dataset'}
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Start Training
          </button>
        </div>
      </div>
    </div>
  )
}
