import { useState } from 'react'

export default function CleaningPipeline({ dataset, config, onConfigChange, onNext, onBack }) {
  const [activeOperation, setActiveOperation] = useState(null)
  const [operationStatus, setOperationStatus] = useState({})

  const operations = [
    {
      id: 'missing',
      label: 'Missing Values',
      options: [
        { value: 'mean', label: 'Replace with Mean' },
        { value: 'median', label: 'Replace with Median' },
        { value: 'mode', label: 'Replace with Mode' },
        { value: 'remove', label: 'Remove Rows' }
      ]
    },
    {
      id: 'outliers',
      label: 'Outlier Detection',
      options: [
        { value: '2', label: '2 Standard Deviations' },
        { value: '3', label: '3 Standard Deviations' },
        { value: '4', label: '4 Standard Deviations' }
      ]
    },
    {
      id: 'normalize',
      label: 'Normalization',
      options: [
        { value: 'minmax', label: 'Min-Max Scaling' },
        { value: 'standard', label: 'Standard Scaling' },
        { value: 'robust', label: 'Robust Scaling' }
      ]
    },
    {
      id: 'encode',
      label: 'Feature Encoding',
      options: [
        { value: 'label', label: 'Label Encoding' },
        { value: 'onehot', label: 'One-Hot Encoding' },
        { value: 'target', label: 'Target Encoding' }
      ]
    }
  ]

  const handleOperationStart = (operationId) => {
    setActiveOperation(operationId)
    setOperationStatus(prev => ({
      ...prev,
      [operationId]: 'running'
    }))

    // Simulate operation progress
    setTimeout(() => {
      setOperationStatus(prev => ({
        ...prev,
        [operationId]: 'completed'
      }))
      setActiveOperation(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {operations.map(operation => (
          <div 
            key={operation.id}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {operation.label}
              </h3>
              <div className="flex items-center space-x-4">
                <select
                  value={config[operation.id]}
                  onChange={(e) => onConfigChange(operation.id, e.target.value)}
                  className="rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
                >
                  {operation.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleOperationStart(operation.id)}
                  disabled={activeOperation || operationStatus[operation.id] === 'completed'}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium
                    ${operationStatus[operation.id] === 'completed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
                  `}
                >
                  {operationStatus[operation.id] === 'completed' ? 'Completed' : 'Run'}
                </button>
              </div>
            </div>

            {activeOperation === operation.id && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Processing...</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!Object.values(operationStatus).some(status => status === 'completed')}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Continue to Validation
        </button>
      </div>
    </div>
  )
}
