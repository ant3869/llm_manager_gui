import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ResourceUtilization() {
  const [resources, setResources] = useState([
    { name: 'Memory', used: 8, total: 16 },
    { name: 'CPU', used: 60, total: 100 },
    { name: 'GPU', used: 4, total: 8 }
  ]);

  // Sample data for the area chart
  const data = [
    { time: '00:00', usage: 30 },
    { time: '01:00', usage: 45 },
    { time: '02:00', usage: 55 },
    { time: '03:00', usage: 40 },
    { time: '04:00', usage: 50 },
    { time: '05:00', usage: 65 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Resource Utilization
      </h2>
      
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.name} className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{resource.name}</span>
              <span>{resource.used}/{resource.total} ({Math.round(resource.used / resource.total * 100)}%)</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(resource.used / resource.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="usage" 
              stroke="#3b82f6" 
              fill="#3b82f6" 
              fillOpacity={0.2} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
