import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function TrainingStatus() {
  const [trainingMetrics, setTrainingMetrics] = useState([])
  const [currentEpoch, setCurrentEpoch] = useState(0)
  const [status, setStatus] = useState('idle') // idle, training, paused, completed

  // Simulate real-time training data
  useEffect(() => {
    if (status === 'training') {
      const interval = setInterval(() => {
        setCurrentEpoch(prev => {
          if (prev >= 100) {
            setStatus('completed')
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })

        setTrainingMetrics(prev => [
          ...prev,
          {
            epoch: currentEpoch,
            loss: Math.random() * 0.5,
            accuracy: 0.5 + Math.random() * 0.4,
            valLoss: Math.random() * 0.6,
            valAccuracy: 0.4 + Math.random() * 0.4
          }
        ])
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [status, currentEpoch])

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Training Status</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Current Progress: Epoch {currentEpoch}/100
          </p>
        </div>
        <div className="flex space-x-3">
          {status === 'idle' && (
            <button
              onClick={() => setStatus('training')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start Training
            </button>
          )}
          {status === 'training' && (
            <>
              <button
                onClick={() => setStatus('paused')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
              >
                Pause
              </button>
              <button
                onClick={() => setStatus('idle')}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Stop
              </button>
            </>
          )}
          {status === 'paused' && (
            <button
              onClick={() => setStatus('training')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Resume
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${(currentEpoch / 100) * 100}%` }}
        />
      </div>

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loss Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Loss Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="loss" stroke="#3B82F6" name="Training Loss" />
                <Line type="monotone" dataKey="valLoss" stroke="#EF4444" name="Validation Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Accuracy Metrics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trainingMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#10B981" name="Training Accuracy" />
                <Line type="monotone" dataKey="valAccuracy" stroke="#F59E0B" name="Validation Accuracy" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
