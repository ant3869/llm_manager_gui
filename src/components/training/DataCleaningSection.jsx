import { useState } from 'react'

const DataCleaningSection = ({ onDataReady }) => {
  const [cleaningSteps, setCleaningSteps] = useState({
    validation: false,
    cleaning: false,
    transformation: false,
    splitting: false
  })
  const [activeStep, setActiveStep] = useState('validation')
  const [dataStats, setDataStats] = useState({
    totalSamples: 0,
    features: 0,
    missingValues: 0,
    outliers: 0
  })

  const steps = [
    {
      id: 'validation',
      title: 'Data Validation',
      description: 'Validate data quality and structure'
    },
    {
      id: 'cleaning',
      title: 'Data Cleaning',
      description: 'Handle missing values and outliers'
    },
    {
      id: 'transformation',
      title: 'Feature Engineering',
      description: 'Transform and encode features'
    },
    {
      id: 'splitting',
      title: 'Data Splitting',
      description: 'Split data into training and validation sets'
    }
  ]

  const handleStepComplete = (stepId) => {
    setCleaningSteps(prev => ({
      ...prev,
      [stepId]: true
    }))
    
    const nextStepIndex = steps.findIndex(step => step.id === stepId) + 1
    if (nextStepIndex < steps.length) {
      setActiveStep(steps[nextStepIndex].id)
    } else {
      onDataReady && onDataReady()
    }
  }

  const ValidationStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Samples</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataStats.totalSamples}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Features</h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataStats.features}</p>
        </div>
      </div>
      <button
        onClick={() => handleStepComplete('validation')}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Validate Data
      </button>
    </div>
  )

  const CleaningStep = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Missing Values Strategy</h4>
        <select className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700">
          <option value="mean">Replace with Mean</option>
          <option value="median">Replace with Median</option>
          <option value="mode">Replace with Mode</option>
          <option value="remove">Remove Rows</option>
        </select>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Outlier Detection</h4>
        <select className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700">
          <option value="zscore">Z-Score Method</option>
          <option value="iqr">IQR Method</option>
          <option value="isolation">Isolation Forest</option>
        </select>
      </div>
      <button
        onClick={() => handleStepComplete('cleaning')}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Apply Cleaning
      </button>
    </div>
  )

  const TransformationStep = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Feature Scaling</h4>
        <select className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700">
          <option value="standard">Standard Scaling</option>
          <option value="minmax">Min-Max Scaling</option>
          <option value="robust">Robust Scaling</option>
        </select>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Encoding Method</h4>
        <select className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700">
          <option value="onehot">One-Hot Encoding</option>
          <option value="label">Label Encoding</option>
          <option value="target">Target Encoding</option>
        </select>
      </div>
      <button
        onClick={() => handleStepComplete('transformation')}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Apply Transformations
      </button>
    </div>
  )

  const SplittingStep = () => (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Train-Test Split</h4>
        <input
          type="range"
          min="50"
          max="90"
          defaultValue="80"
          className="w-full mt-2"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Training: 80%</span>
          <span>Testing: 20%</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Validation Split</h4>
        <select className="mt-2 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700">
          <option value="holdout">Simple Holdout</option>
          <option value="kfold">K-Fold Cross Validation</option>
          <option value="stratified">Stratified K-Fold</option>
        </select>
      </div>
      <button
        onClick={() => handleStepComplete('splitting')}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Finalize Split
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${cleaningSteps[step.id] 
                ? 'bg-green-500 text-white' 
                : activeStep === step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}
            `}>
              {cleaningSteps[step.id] ? '✓' : index + 1}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{step.title}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-0.5 mx-2 bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </div>

      {/* Active Step Content */}
      <div className="mt-8">
        {activeStep === 'validation' && <ValidationStep />}
        {activeStep === 'cleaning' && <CleaningStep />}
        {activeStep === 'transformation' && <TransformationStep />}
        {activeStep === 'splitting' && <SplittingStep />}
      </div>
    </div>
  )
}

export default DataCleaningSection
