declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      params?: { [key: string]: string | number | boolean | undefined }
    ) => void;
    dataLayer: unknown[];
  }
}

export function initializeGoogleAnalytics(measurementId: string): void {
  // Add Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', measurementId);
}

export function trackPageView(path: string): void {
  window.gtag?.('event', 'page_view', {
    page_path: path,
  });
}

export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

export function trackError(
  error: Error,
  fatal: boolean = false
): void {
  window.gtag?.('event', 'exception', {
    description: error.message,
    fatal: fatal,
  });
}

export function trackTiming(
  category: string,
  variable: string,
  value: number,
  label?: string
): void {
  window.gtag?.('event', 'timing_complete', {
    event_category: category,
    name: variable,
    value: value,
    event_label: label,
  });
}
