/**
 * Comprehensive data sanitization utilities for security and data integrity
 */

/**
 * Sanitize string input to prevent XSS and ensure data integrity
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
};

/**
 * Sanitize HTML content by removing dangerous elements and attributes
 */
export const sanitizeHTML = (input: string): string => {
  if (typeof input !== 'string') return '';

  // Remove script tags and their content
  let sanitized = input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ''
  );

  // Remove dangerous attributes
  sanitized = sanitized.replace(
    /\s*(on\w+|javascript:|data:|vbscript:)[^>\s]*/gi,
    ''
  );

  // Remove dangerous tags
  const dangerousTags = [
    'script',
    'object',
    'embed',
    'form',
    'input',
    'textarea',
    'button',
    'select',
    'option',
  ];
  dangerousTags.forEach((tag) => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });

  return sanitized.trim();
};

/**
 * Sanitize numeric input
 */
export const sanitizeNumber = (
  input: unknown,
  min?: number,
  max?: number
): number | null => {
  let num: number;

  if (typeof input === 'number') {
    num = input;
  } else if (typeof input === 'string') {
    num = parseFloat(input);
  } else {
    return null;
  }

  if (isNaN(num) || !isFinite(num)) {
    return null;
  }

  if (min !== undefined && num < min) {
    num = min;
  }

  if (max !== undefined && num > max) {
    num = max;
  }

  return num;
};

/**
 * Sanitize integer input
 */
export const sanitizeInteger = (
  input: unknown,
  min?: number,
  max?: number
): number | null => {
  const num = sanitizeNumber(input, min, max);
  return num !== null ? Math.round(num) : null;
};

/**
 * Sanitize email address
 */
export const sanitizeEmail = (input: string): string | null => {
  if (typeof input !== 'string') return null;

  const sanitized = sanitizeString(input).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(sanitized) ? sanitized : null;
};

/**
 * Sanitize URL
 */
export const sanitizeURL = (input: string): string | null => {
  if (typeof input !== 'string') return null;

  try {
    const url = new URL(input);

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
};

/**
 * Sanitize array input
 */
export const sanitizeArray = <T>(
  input: unknown,
  itemSanitizer: (item: unknown) => T | null,
  maxLength?: number
): T[] => {
  if (!Array.isArray(input)) return [];

  let sanitized = input
    .map(itemSanitizer)
    .filter((item): item is T => item !== null);

  if (maxLength !== undefined && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
};

/**
 * Sanitize object by removing dangerous properties
 */
export const sanitizeObject = (input: unknown): Record<string, any> => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }

  const obj = input as Record<string, any>;
  const sanitized: Record<string, any> = {};

  // Dangerous property names to exclude
  const dangerousProps = [
    '__proto__',
    'constructor',
    'prototype',
    'eval',
    'function',
    'Function',
    'setTimeout',
    'setInterval',
    'require',
    'process',
    'global',
    'window',
    'document',
  ];

  Object.keys(obj).forEach((key) => {
    // Skip dangerous property names
    if (dangerousProps.includes(key)) return;

    // Sanitize property name
    const sanitizedKey = sanitizeString(key);
    if (!sanitizedKey) return;

    const value = obj[key];

    // Recursively sanitize nested objects
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[sanitizedKey] = sanitizeObject(value);
    } else if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeString(value);
    } else if (typeof value === 'number' && isFinite(value)) {
      sanitized[sanitizedKey] = value;
    } else if (typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value
        .map((item) => {
          if (typeof item === 'string') return sanitizeString(item);
          if (typeof item === 'number' && isFinite(item)) return item;
          if (typeof item === 'boolean') return item;
          if (item && typeof item === 'object') return sanitizeObject(item);
          return null;
        })
        .filter((item) => item !== null);
    }
  });

  return sanitized;
};

/**
 * Deep sanitize any input data structure
 */
export const deepSanitize = (input: unknown): any => {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input === 'string') {
    return sanitizeString(input);
  }

  if (typeof input === 'number') {
    return isFinite(input) ? input : null;
  }

  if (typeof input === 'boolean') {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(deepSanitize).filter((item) => item !== null);
  }

  if (typeof input === 'object') {
    return sanitizeObject(input);
  }

  return null;
};

/**
 * Validate and sanitize file upload data
 */
export const sanitizeFileData = (
  file: File,
  allowedTypes: string[],
  maxSize: number
): File | null => {
  if (!file || !(file instanceof File)) return null;

  // Check file type
  if (!allowedTypes.includes(file.type)) return null;

  // Check file size
  if (file.size > maxSize) return null;

  // Check filename for dangerous characters
  const sanitizedName = sanitizeString(file.name);
  if (!sanitizedName || sanitizedName !== file.name) return null;

  return file;
};

/**
 * Rate limiting helper for input validation
 */
export class InputRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  constructor(
    private maxAttempts: number = 10,
    private windowMs: number = 60000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (record.count >= this.maxAttempts) {
      return false;
    }

    // Increment counter
    record.count++;
    record.lastAttempt = now;
    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now - record.lastAttempt > this.windowMs) {
        this.attempts.delete(key);
      }
    }
  }
}
