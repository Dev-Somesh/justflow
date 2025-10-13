import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';
import { seedDemoData } from './seed';

export const worker = setupWorker(...handlers);

seedDemoData();


