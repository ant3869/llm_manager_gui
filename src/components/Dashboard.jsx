import React from 'react';
import PerformanceMetrics from './PerformanceMetrics';
import ResourceUtilization from './ResourceUtilization';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ML Monitor Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceMetrics />
        <ResourceUtilization />
      </div>
    </div>
  );
}
