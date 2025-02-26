import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function ModelBehavior() {
  const [tokenUsage, setTokenUsage] = useState(0)
  const [responseQuality, setResponseQuality] = useState(0)
  const [safetyScore, setSafetyScore] = useState(0)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setTokenUsage(Math.floor(Math.random() * 1000) + 2000)
      setResponseQuality(Math.floor(Math.random() * 15) + 80)
      setSafetyScore(Math.floor(Math.random() * 10) + 90)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EF4444']

  const pieData = [
    { name: 'Prompt', value: 40 },
    { name: 'Response', value: 30 },
    { name: 'System', value: 20 },
    { name: 'Other', value: 10 }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
        Model Behavior
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Token Usage</span>
              <span className="text-sm text-gray-800 dark:text-gray-100">{tokenUsage} / 4,096</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${(tokenUsage / 4096) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Response Quality</span>
              <span className="text-sm text-gray-800 dark:text-gray-100">{responseQuality}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${responseQuality}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Safety Score</span>
              <span className="text-sm text-gray-800 dark:text-gray-100">{safetyScore}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className="bg-yellow-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${safetyScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
