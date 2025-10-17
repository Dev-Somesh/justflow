import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initSentry } from '@/utils/monitoring/sentry';
import '@/utils/mockData'; // Initialize mock data
// Start MSW in development only
async function startMocks() {
  if (import.meta.env.DEV) {
    try {
      const { worker } = await import('@/mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
    } catch {}
  }
}

Promise.all([startMocks(), initSentry()]).finally(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
