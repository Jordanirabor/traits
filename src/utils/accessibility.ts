/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Check if a color contrast ratio meets WCAG AA standards
 * @param foreground - Foreground color in hex format
 * @param background - Background color in hex format
 * @returns Object with contrast ratio and compliance status
 */
export function checkColorContrast(
  foreground: string,
  background: string
): { ratio: number; isCompliant: boolean; level: 'AAA' | 'AA' | 'fail' } {
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    isCompliant: ratio >= 4.5,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'fail',
  };
}

/**
 * Generate a unique ID for accessibility purposes
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateA11yId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announce a message to screen readers
 * @param message - Message to announce
 * @param priority - Priority level (polite or assertive)
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within a modal or dialog
 * @param element - Container element to trap focus within
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Check if user prefers reduced motion
 * @returns Boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate animation duration based on user preferences
 * @param defaultDuration - Default duration in milliseconds
 * @returns Duration in milliseconds (1ms if reduced motion preferred)
 */
export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 1 : defaultDuration;
}

/**
 * Create a visually hidden but screen-reader accessible element
 * @returns CSS class string for sr-only elements
 */
export const srOnlyClass =
  'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

/**
 * Validate ARIA attributes for a given element
 * @param element - HTML element to validate
 * @returns Array of validation errors
 */
export function validateAriaAttributes(element: HTMLElement): string[] {
  const errors: string[] = [];

  // Check for aria-label or aria-labelledby on interactive elements
  const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
  if (interactiveTags.includes(element.tagName.toLowerCase())) {
    const hasLabel =
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.textContent?.trim();

    if (!hasLabel) {
      errors.push(`${element.tagName} element missing accessible label`);
    }
  }

  // Check for valid aria-expanded on expandable elements
  if (element.hasAttribute('aria-expanded')) {
    const value = element.getAttribute('aria-expanded');
    if (value !== 'true' && value !== 'false') {
      errors.push('aria-expanded must be "true" or "false"');
    }
  }

  return errors;
}

/**
 * Keyboard navigation helper for custom components
 * @param event - Keyboard event
 * @param handlers - Object with key handlers
 */
export function handleKeyboardNavigation(
  event: React.KeyboardEvent,
  handlers: {
    onEnter?: () => void;
    onSpace?: () => void;
    onEscape?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
  }
): void {
  switch (event.key) {
    case 'Enter':
      handlers.onEnter?.();
      break;
    case ' ':
      event.preventDefault();
      handlers.onSpace?.();
      break;
    case 'Escape':
      handlers.onEscape?.();
      break;
    case 'ArrowUp':
      event.preventDefault();
      handlers.onArrowUp?.();
      break;
    case 'ArrowDown':
      event.preventDefault();
      handlers.onArrowDown?.();
      break;
    case 'ArrowLeft':
      handlers.onArrowLeft?.();
      break;
    case 'ArrowRight':
      handlers.onArrowRight?.();
      break;
  }
}
