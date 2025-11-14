'use client';

import { reportWebVitals } from '@/utils/performance';

/**
 * Report Web Vitals for performance monitoring
 * This is automatically called by Next.js when you export it from app directory
 */
export function onCLS(metric: any) {
  reportWebVitals(metric);
}

export function onFID(metric: any) {
  reportWebVitals(metric);
}

export function onFCP(metric: any) {
  reportWebVitals(metric);
}

export function onLCP(metric: any) {
  reportWebVitals(metric);
}

export function onTTFB(metric: any) {
  reportWebVitals(metric);
}

export function onINP(metric: any) {
  reportWebVitals(metric);
}
