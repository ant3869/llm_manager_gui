import { useState } from 'react'
import TrainingStatus from './TrainingStatus'
import TrainingHistory from './TrainingHistory'
import TrainingConfig from './TrainingConfig'
import DataCleaningSection from './DataCleaningSection'

export default function TrainingDashboard() {
  const [activeSection, setActiveSection] = useState('cleaning')
  const [dataReady, setDataReady] = useState(false)

  const sections = [
    { id: 'cleaning', label: 'Data Preparation' },
    { id: 'config', label: 'Model Configuration' },
    { id: 'status', label: 'Training Status' },
    { id: 'history', label: 'Training History' }
  ]

  const handleDataReady = () => {
    setDataReady(true)
    setActiveSection('config')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Model Training
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Prepare data and train your model
        </p>
      </div>

      {/* Section Navigation */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            disabled={!dataReady && section.id !== 'cleaning'}
            className={`
              px-4 py-2 text-sm font-medium rounded-t-lg
              ${activeSection === section.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}
              ${!dataReady && section.id !== 'cleaning' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="mt-6">
        {activeSection === 'cleaning' && (
          <DataCleaningSection onDataReady={handleDataReady} />
        )}
        {activeSection === 'config' && dataReady && (
          <TrainingConfig />
        )}
        {activeSection === 'status' && dataReady && (
          <TrainingStatus />
        )}
        {activeSection === 'history' && dataReady && (
          <TrainingHistory />
        )}
      </div>
    </div>
  )
}
