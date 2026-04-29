/**
 * Utility functions for extracting and formatting user names
 */

const TITLES = new Set([
  'mr',
  'mrs',
  'miss',
  'ms',
  'dr',
  'doctor',
  'prof',
  'professor',
  'sir',
  'madam',
  'lord',
  'lady',
  'rev',
  'reverend',
  'fr',
  'father',
  'sr',
  'sister',
  'brother',
  'capt',
  'captain',
  'col',
  'colonel',
  'gen',
  'general',
  'lt',
  'lieutenant',
  'sgt',
  'sergeant',
  'maj',
  'major',
]);

/**
 * Extract first name from full name, skipping titles.
 *
 * "Miss Antoniette Grass" → "Antoniette"
 * "Dr. John Smith"        → "John"
 * "Antoniette Grass"      → "Antoniette"
 */
export function extractFirstName(fullName: string | null | undefined): string {
  if (!fullName || typeof fullName !== 'string') return '';

  const parts = fullName
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  if (parts.length === 0) return '';

  const first = parts[0].toLowerCase().replace(/\.$/, '');
  if (TITLES.has(first)) {
    return parts.length > 1 ? parts[1] : '';
  }

  return parts[0];
}

/**
 * Get a friendly display name from user data.
 * Falls back to the email username if no name is available.
 */
export function getDisplayName(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name) {
    const firstName = extractFirstName(name);
    if (firstName) return firstName;
  }

  if (email) return email.split('@')[0];

  return 'User';
}
