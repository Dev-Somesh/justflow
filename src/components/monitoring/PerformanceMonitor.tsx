import { useEffect } from 'react';
import { reportWebVitals } from '../../utils/analytics/webVitals';

export function PerformanceMonitor() {
  useEffect(() => {
    // Initialize web vitals reporting
    reportWebVitals();

    // Setup performance observer for long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log long tasks that block the main thread
          if (entry.duration > 50) {
            console.warn('Long Task detected:', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
