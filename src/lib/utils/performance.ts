/**
 * Performance optimization utilities
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Debounce function for performance optimization
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Hook for intersection observer (lazy loading)
 * @param options IntersectionObserver options
 * @returns Ref and isIntersecting state
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return { ref, isIntersecting };
}

/**
 * Hook for prefetching data
 * @param prefetchFn Function to prefetch data
 * @param delay Delay before prefetching in milliseconds
 */
export function usePrefetch(prefetchFn: () => void, delay: number = 100) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Use requestIdleCallback if available, otherwise use setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => prefetchFn());
      } else {
        setTimeout(prefetchFn, 0);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [prefetchFn, delay]);
}

/**
 * Memoize expensive computations
 * @param fn Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Hook for optimized event handlers
 * @param handler Event handler function
 * @param deps Dependencies array
 * @returns Memoized event handler
 */
export function useEventCallback<T extends (...args: any[]) => any>(
  handler: T,
  deps: React.DependencyList
): T {
  const handlerRef = useRef<T>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler, ...deps]);

  return useCallback(
    ((...args: Parameters<T>) => {
      return handlerRef.current(...args);
    }) as T,
    []
  );
}
