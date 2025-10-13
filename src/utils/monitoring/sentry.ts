// Lightweight, opt-in Sentry init wrapper
// Set VITE_SENTRY_DSN to enable
export const initSentry = async () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;
  try {
    const Sentry = await import("@sentry/browser");
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
    (window as any).Sentry = Sentry;
  } catch (e) {
    // noop if Sentry is not installed
  }
};


