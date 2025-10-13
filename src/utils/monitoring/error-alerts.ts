import { toast } from '@/components/ui/use-toast';

type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorAlert {
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
  count: number;
}

class ErrorAlertService {
  private static instance: ErrorAlertService;
  private errorBuffer: Map<string, ErrorAlert>;
  private readonly bufferTimeWindow = 5 * 60 * 1000; // 5 minutes
  private readonly errorThresholds: Record<ErrorSeverity, number> = {
    low: 10,
    medium: 5,
    high: 3,
    critical: 1,
  };

  private constructor() {
    this.errorBuffer = new Map();
    this.startBufferCleanup();
  }

  static getInstance(): ErrorAlertService {
    if (!ErrorAlertService.instance) {
      ErrorAlertService.instance = new ErrorAlertService();
    }
    return ErrorAlertService.instance;
  }

  private startBufferCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, alert] of this.errorBuffer.entries()) {
        if (now - alert.timestamp > this.bufferTimeWindow) {
          this.errorBuffer.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }

  private getSeverity(error: Error): ErrorSeverity {
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'high';
    }
    if (error.message.includes('undefined') || error.message.includes('null')) {
      return 'medium';
    }
    if (error.message.includes('permission') || error.message.includes('auth')) {
      return 'critical';
    }
    return 'low';
  }

  private shouldTriggerAlert(alert: ErrorAlert): boolean {
    return alert.count >= this.errorThresholds[alert.severity];
  }

  private showAlert(alert: ErrorAlert): void {
    const variant = 
      alert.severity === 'critical' ? 'destructive' :
      alert.severity === 'high' ? 'destructive' :
      alert.severity === 'medium' ? 'default' :
      'secondary';

    toast({
      title: `${alert.severity.toUpperCase()} Priority Error Alert`,
      description: `${alert.message} (occurred ${alert.count} times in the last 5 minutes)`,
      variant,
      duration: alert.severity === 'critical' ? Infinity : 5000,
    });
  }

  trackError(error: Error): void {
    const severity = this.getSeverity(error);
    const key = `${severity}:${error.message}`;
    const now = Date.now();

    let alert = this.errorBuffer.get(key);
    if (alert) {
      alert.count++;
      alert.timestamp = now;
    } else {
      alert = {
        message: error.message,
        severity,
        timestamp: now,
        count: 1,
      };
    }

    this.errorBuffer.set(key, alert);

    if (this.shouldTriggerAlert(alert)) {
      this.showAlert(alert);
      // Reset count after showing alert
      alert.count = 0;
    }
  }
}

export const errorAlerts = ErrorAlertService.getInstance();
