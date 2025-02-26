import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResourceMonitor() {
  const [resources, setResources] = useState({
    cpu: 0,
    memory: {
      percentage: 0,
      used: 0,
      total: 0
    },
    heap: {
      percentage: 0,
      heapUsed: 0,
      heapTotal: 0
    }
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let unitIndex = 0;
    
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }
    
    return `${value.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center space-x-6 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <MetricBar
          label="CPU"
          value={resources.cpu}
          color="green"
        />
        <MetricBar
          label="RAM"
          value={resources.memory.percentage}
          color="blue"
        />
        <MetricBar
          label="HEAP"
          value={resources.heap.percentage}
          color="purple"
        />
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 w-72"
          >
            <div className="space-y-4">
              <DetailItem
                label="Memory Usage"
                used={formatBytes(resources.memory.used)}
                total={formatBytes(resources.memory.total)}
                percentage={resources.memory.percentage}
              />
              <DetailItem
                label="Heap Usage"
                used={formatBytes(resources.heap.heapUsed)}
                total={formatBytes(resources.heap.heapTotal)}
                percentage={resources.heap.percentage}
              />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                CPU Load: {resources.cpu.toFixed(1)}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricBar({ label, value, color }) {
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {label}:
      </span>
      <motion.div
        className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          className={`h-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {Math.round(value)}%
      </span>
    </div>
  );
}

function DetailItem({ label, used, total, percentage }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className="text-gray-600 dark:text-gray-300">
          {used} / {total}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
