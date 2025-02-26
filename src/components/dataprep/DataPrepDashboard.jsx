import { useState } from 'react'
import FileUpload from './FileUpload'
import CleaningPipeline from './CleaningPipeline'
import DataPreview from './DataPreview'
import OperationControls from './OperationControls'

export default function DataPrepDashboard() {
  const [activeStep, setActiveStep] = useState('upload')
  const [dataset, setDataset] = useState(null)
  const [cleaningConfig, setCleaningConfig] = useState({
    missingValues: 'mean',
    outlierThreshold: 3,
    normalization: 'minmax',
    encoding: 'label'
  })

  const steps = [
    { id: 'upload', label: 'Data Import' },
    { id: 'preview', label: 'Data Preview' },
    { id: 'clean', label: 'Cleaning Pipeline' },
    { id: 'validate', label: 'Validation' }
  ]

  const handleFileUpload = (files) => {
    // Handle file upload logic
    setDataset(files)
    setActiveStep('preview')
  }

  const handleConfigChange = (key, value) => {
    setCleaningConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Data Preparation
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Clean and prepare your dataset for training
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full
              ${activeStep === step.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
            `}>
              {index + 1}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="w-20 h-1 mx-4 bg-gray-200 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {activeStep === 'upload' && (
          <FileUpload onUpload={handleFileUpload} />
        )}
        
        {activeStep === 'preview' && (
          <DataPreview 
            dataset={dataset}
            onNext={() => setActiveStep('clean')}
            onBack={() => setActiveStep('upload')}
          />
        )}
        
        {activeStep === 'clean' && (
          <CleaningPipeline
            dataset={dataset}
            config={cleaningConfig}
            onConfigChange={handleConfigChange}
            onNext={() => setActiveStep('validate')}
            onBack={() => setActiveStep('preview')}
          />
        )}
        
        {activeStep === 'validate' && (
          <OperationControls
            dataset={dataset}
            config={cleaningConfig}
            onBack={() => setActiveStep('clean')}
          />
        )}
      </div>
    </div>
  )
}
