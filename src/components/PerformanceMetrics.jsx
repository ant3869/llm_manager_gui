import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function PerformanceMetrics() {
  const [data, setData] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('all')

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          cpu: Math.floor(Math.random() * 30) + 40,
          memory: Math.floor(Math.random() * 20) + 50,
          inference: Math.floor(Math.random() * 40) + 100
        }]
        return newData.slice(-20)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { key: 'all', label: 'All Metrics' },
    { key: 'cpu', label: 'CPU Usage' },
    { key: 'memory', label: 'Memory' },
    { key: 'inference', label: 'Inference Time' }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Performance Metrics
        </h2>
        <div className="flex space-x-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time"
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#F3F4F6'
              }}
            />
            <Legend />
            {(selectedMetric === 'all' || selectedMetric === 'cpu') && (
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
                name="CPU %"
              />
            )}
            {(selectedMetric === 'all' || selectedMetric === 'memory') && (
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                name="Memory %"
              />
            )}
            {(selectedMetric === 'all' || selectedMetric === 'inference') && (
              <Line 
                type="monotone" 
                dataKey="inference" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
                name="Inference ms"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
