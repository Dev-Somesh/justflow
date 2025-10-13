import React from 'react';
import { Card } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn, responsive } from '@/utils/theme';

export function AnalyticsDashboard() {
  const { getPerformanceMetrics, getEvents } = useAnalytics();
  const metrics = getPerformanceMetrics();
  const events = getEvents();

  const performanceScore = React.useMemo(() => {
    const scores = Object.values(metrics).filter(Boolean) as number[];
    return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }, [metrics]);

  return (
    <div className={responsive(
      'grid gap-4',
      'sm:gap-6',
      'md:grid-cols-2',
      'lg:grid-cols-3'
    )}>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground uppercase">{key}</span>
              <span className="font-mono">{value?.toFixed(2) || 'N/A'}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Score</h3>
        <div className="flex items-center justify-center">
          <div className={cn(
            'h-32 w-32 rounded-full border-8 flex items-center justify-center text-2xl font-bold',
            performanceScore >= 90 ? 'border-green-500' :
            performanceScore >= 70 ? 'border-yellow-500' :
            'border-red-500'
          )}>
            {performanceScore.toFixed(0)}
          </div>
        </div>
      </Card>

      <Card className={cn(
        'p-6',
        responsive('col-span-full', '', 'md:col-span-2', 'lg:col-span-1')
      )}>
        <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
        <div className="space-y-2">
          {events.slice(-5).map((event, i) => (
            <div key={i} className="text-sm">
              <span className="text-muted-foreground">{new Date(event.timestamp!).toLocaleTimeString()}</span>
              <span className="mx-2">•</span>
              <span className="font-medium">{event.category}</span>
              <span className="mx-2">•</span>
              <span>{event.action}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
