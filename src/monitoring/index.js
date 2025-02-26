import os from 'os';
import { logger } from '../utils/logger.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      system: {
        cpu: 0,
        memory: {
          total: 0,
          used: 0,
          free: 0
        },
        uptime: 0
      },
      application: {
        requests: 0,
        errors: 0,
        avgResponseTime: 0,
        responseTimes: [],
        messagesSent: 0,
        messagesReceived: 0,
        activeConnections: 0
      },
      resources: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0
      }
    };

    this.startMonitoring();
  }

  startMonitoring() {
    // Update system metrics every 2 seconds
    setInterval(() => {
      this.updateSystemMetrics();
      this.updateResourceMetrics();
    }, 2000);

    // Clean up old response times every minute
    setInterval(() => {
      this.cleanupMetrics();
    }, 60000);
  }

  updateSystemMetrics() {
    try {
      const cpus = os.cpus();
      const totalCpu = cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b);
        const idle = cpu.times.idle;
        return acc + ((total - idle) / total);
      }, 0) / cpus.length;

      const totalMem = os.totalmem();
      const freeMem = os.freemem();

      this.metrics.system = {
        cpu: totalCpu * 100,
        memory: {
          total: totalMem,
          used: totalMem - freeMem,
          free: freeMem
        },
        uptime: os.uptime()
      };
    } catch (error) {
      logger.error('Error updating system metrics:', error);
    }
  }

  updateResourceMetrics() {
    try {
      const memoryUsage = process.memoryUsage();
      
      this.metrics.resources = {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external
      };
    } catch (error) {
      logger.error('Error updating resource metrics:', error);
    }
  }

  updateRequestMetrics(responseTime, isError = false) {
    this.metrics.application.requests++;
    if (isError) this.metrics.application.errors++;
    
    this.metrics.application.responseTimes.push({
      time: responseTime,
      timestamp: Date.now()
    });

    this.updateAverageResponseTime();
  }

  updateAverageResponseTime() {
    const times = this.metrics.application.responseTimes;
    if (times.length === 0) return;

    const sum = times.reduce((acc, curr) => acc + curr.time, 0);
    this.metrics.application.avgResponseTime = sum / times.length;
  }

  updateConnectionMetrics(delta) {
    this.metrics.application.activeConnections += delta;
  }

  updateMessageMetrics(sent = false) {
    if (sent) {
      this.metrics.application.messagesSent++;
    } else {
      this.metrics.application.messagesReceived++;
    }
  }

  cleanupMetrics() {
    // Keep only last 5 minutes of response times
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    this.metrics.application.responseTimes = 
      this.metrics.application.responseTimes.filter(
        item => item.timestamp > fiveMinutesAgo
      );
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: Date.now()
    };
  }

  getResourceUtilization() {
    return {
      cpu: this.metrics.system.cpu,
      memory: {
        percentage: (this.metrics.system.memory.used / this.metrics.system.memory.total) * 100,
        ...this.metrics.system.memory
      },
      heap: {
        percentage: (this.metrics.resources.heapUsed / this.metrics.resources.heapTotal) * 100,
        ...this.metrics.resources
      }
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();
export const { 
  updateRequestMetrics, 
  updateConnectionMetrics, 
  updateMessageMetrics,
  getMetrics,
  getResourceUtilization 
} = performanceMonitor;
