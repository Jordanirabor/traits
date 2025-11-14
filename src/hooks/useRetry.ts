'use client';

import { useCallback, useState } from 'react';

interface RetryOptions {
  maxAttempts?: number;
  delay?: number;
  onError?: (error: Error, attempt: number) => void;
  onSuccess?: () => void;
}

/**
 * Hook for handling retry logic with exponential backoff
 */
export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {}
) {
  const { maxAttempts = 3, delay = 1000, onError, onSuccess } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);

  const execute = useCallback(
    async (attempt = 1): Promise<T | null> => {
      setIsRetrying(true);
      setAttemptCount(attempt);

      try {
        const result = await asyncFunction();
        setIsRetrying(false);
        setLastError(null);
        setAttemptCount(0);
        onSuccess?.();
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setLastError(err);
        onError?.(err, attempt);

        if (attempt < maxAttempts) {
          // Exponential backoff: delay * 2^(attempt-1)
          const backoffDelay = delay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          return execute(attempt + 1);
        } else {
          setIsRetrying(false);
          return null;
        }
      }
    },
    [asyncFunction, maxAttempts, delay, onError, onSuccess]
  );

  const reset = useCallback(() => {
    setIsRetrying(false);
    setAttemptCount(0);
    setLastError(null);
  }, []);

  return {
    execute,
    reset,
    isRetrying,
    attemptCount,
    lastError,
    hasReachedMaxAttempts: attemptCount >= maxAttempts,
  };
}
