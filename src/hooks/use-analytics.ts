import { useEffect, useCallback } from 'react';
import { WebVitalsMetric } from '../analytics/webVitals';

type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp?: number;
};

type PerformanceMetrics = {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
};

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private performanceMetrics: PerformanceMetrics = {
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  };

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  trackEvent(event: AnalyticsEvent): void {
    this.events.push({
      ...event,
      timestamp: Date.now(),
    });
    // TODO: Send to analytics service
    console.log('Event tracked:', event);
  }

  updatePerformanceMetrics(metric: WebVitalsMetric): void {
    switch (metric.name) {
      case 'FCP':
        this.performanceMetrics.fcp = metric.value;
        break;
      case 'LCP':
        this.performanceMetrics.lcp = metric.value;
        break;
      case 'FID':
        this.performanceMetrics.fid = metric.value;
        break;
      case 'CLS':
        this.performanceMetrics.cls = metric.value;
        break;
      case 'TTFB':
        this.performanceMetrics.ttfb = metric.value;
        break;
    }
    // TODO: Send to analytics service
    console.log('Performance metric updated:', metric);
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMetrics;
  }
}

export const analytics = AnalyticsService.getInstance();

export function useAnalytics() {
  const trackEvent = useCallback((
    category: string,
    action: string,
    label?: string,
    value?: number
  ) => {
    analytics.trackEvent({
      category,
      action,
      label,
      value,
    });
  }, []);

  const getPerformanceMetrics = useCallback(() => {
    return analytics.getPerformanceMetrics();
  }, []);

  const getEvents = useCallback(() => {
    return analytics.getEvents();
  }, []);

  return {
    trackEvent,
    getPerformanceMetrics,
    getEvents,
  };
}

export function usePageTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('page_view', window.location.pathname);

    const handleRouteChange = () => {
      trackEvent('page_view', window.location.pathname);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [trackEvent]);
}
