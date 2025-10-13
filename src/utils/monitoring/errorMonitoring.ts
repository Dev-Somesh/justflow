type ErrorWithDetails = {
  message: string;
  stack?: string;
  componentStack?: string;
  metadata?: Record<string, unknown>;
};

class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;
  
  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  private setupGlobalHandlers(): void {
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.error?.message || 'Unknown error',
        stack: event.error?.stack,
        metadata: {
          type: 'window.error',
          filename: event.filename,
          lineNo: event.lineno,
          colNo: event.colno
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: event.reason?.message || 'Unhandled Promise rejection',
        stack: event.reason?.stack,
        metadata: {
          type: 'unhandledrejection',
          reason: event.reason
        }
      });
    });
  }

  logError(error: ErrorWithDetails): void {
    // Forward to Sentry if available and DSN configured
    const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
    const hasSentry = (window as any).Sentry && dsn;
    if (hasSentry) {
      try {
        (window as any).Sentry.captureException(new Error(error.message), {
          extra: {
            stack: error.stack,
            componentStack: error.componentStack,
            metadata: error.metadata,
          },
        });
      } catch {}
    }
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      componentStack: error.componentStack,
      metadata: error.metadata,
      timestamp: new Date().toISOString()
    });
  }

  logComponentError(error: Error, componentStack: string): void {
    this.logError({
      message: error.message,
      stack: error.stack,
      componentStack,
      metadata: {
        type: 'react-error-boundary'
      }
    });
  }
}

export const errorMonitor = ErrorMonitoringService.getInstance();
