import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
};

const vitalsCallback = (metric: WebVitalsMetric) => {
  // TODO: Send to your analytics service
  // In production, this would send metrics to your analytics service
};

export function reportWebVitals(): void {
  getCLS(vitalsCallback);
  getFID(vitalsCallback);
  getFCP(vitalsCallback);
  getLCP(vitalsCallback);
  getTTFB(vitalsCallback);
}
