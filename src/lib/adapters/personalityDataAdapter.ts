/**
 * Personality Data Adapter
 *
 * This adapter provides conversion functions between the reference app's simple
 * PersonalityData format (used by UI components) and the current app's more
 * complex format with metadata (used for database storage).
 *
 * Reference Format: Simple data structure without metadata
 * Current Format: Includes userId, timestamp, and complex nested objects
 */

import {
  AttachmentStyle,
  BigFiveScores,
  ChineseZodiacData,
  PersonalityData as CurrentPersonalityData,
  HumanDesignData,
  LoveLanguage,
  MBTIType,
  ZodiacData,
} from '@/types/personality';

/**
 * Reference app's simple personality data format
 * Used by UI components for display and input
 */
export interface ReferencePersonalityData {
  bigFive?: BigFiveScores;
  mbti?: string;
  enneagram?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  humanDesign?: string;
  attachmentStyle?: string;
  loveLanguages?: string[]; // Ranked in order of preference
  dateOfBirth?: string;
}

/**
 * Convert from current app format (with metadata) to reference format (simple)
 *
 * This strips metadata like userId and timestamp, and simplifies nested objects
 * to match the reference app's flat structure that UI components expect.
 *
 * @param current - Current app's personality data with metadata
 * @returns Reference app's simple personality data format
 */
export function toReferenceFormat(
  current: CurrentPersonalityData
): ReferencePersonalityData {
  const reference: ReferencePersonalityData = {};

  // Big Five - direct copy (same structure)
  if (current.bigFive) {
    reference.bigFive = current.bigFive;
  }

  // MBTI - direct copy (simple string)
  if (current.mbti) {
    reference.mbti = current.mbti;
  }

  // Enneagram - not in current format, but included for reference compatibility
  // This will be undefined unless added to current format
  reference.enneagram = undefined;

  // Zodiac - extract sun sign from complex ZodiacData object
  if (current.zodiac) {
    reference.zodiacSign = current.zodiac.sun;
  }

  // Chinese Zodiac - extract animal from complex ChineseZodiacData object
  if (current.chineseZodiac) {
    reference.chineseZodiac = current.chineseZodiac.animal;
  }

  // Human Design - extract type from complex HumanDesignData object
  if (current.humanDesign) {
    reference.humanDesign = current.humanDesign.type;
  }

  // Attachment Style - direct copy (simple string)
  if (current.attachmentStyle) {
    reference.attachmentStyle = current.attachmentStyle;
  }

  // Love Languages - convert from array of objects with ranks to simple ordered array
  if (current.loveLanguages && current.loveLanguages.length > 0) {
    // Sort by rank (1 = highest priority) and extract just the type strings
    reference.loveLanguages = current.loveLanguages
      .sort((a, b) => a.rank - b.rank)
      .map((lang) => lang.type);
  }

  // Date of Birth - not in current format, but included for reference compatibility
  reference.dateOfBirth = undefined;

  return reference;
}

/**
 * Convert from reference format (simple) to current app format (with metadata)
 *
 * This adds metadata like userId and timestamp, and expands simple values
 * into the complex nested objects that the database expects.
 *
 * @param reference - Reference app's simple personality data
 * @param userId - User ID to associate with the data
 * @returns Current app's personality data with metadata
 */
export function toCurrentFormat(
  reference: ReferencePersonalityData,
  userId?: string
): CurrentPersonalityData {
  const current: CurrentPersonalityData = {
    userId,
    timestamp: new Date(),
  };

  // Big Five - direct copy (same structure)
  if (reference.bigFive) {
    current.bigFive = reference.bigFive;
  }

  // MBTI - direct copy (simple string)
  if (reference.mbti) {
    current.mbti = reference.mbti as MBTIType;
  }

  // Zodiac - expand simple string to ZodiacData object
  if (reference.zodiacSign) {
    current.zodiac = {
      sun: reference.zodiacSign as ZodiacData['sun'],
      // moon and rising are optional and not provided by reference format
    };
  }

  // Chinese Zodiac - expand simple string to ChineseZodiacData object
  if (reference.chineseZodiac) {
    // Infer element and year from current date if not provided
    // This is a simplified approach - in production, you'd want to calculate properly
    const currentYear = new Date().getFullYear();
    current.chineseZodiac = {
      animal: reference.chineseZodiac as ChineseZodiacData['animal'],
      element: 'wood', // Default element - should be calculated based on year
      year: currentYear,
    };
  }

  // Human Design - expand simple string to HumanDesignData object
  if (reference.humanDesign) {
    current.humanDesign = {
      type: reference.humanDesign as HumanDesignData['type'],
      // authority and profile are optional and not provided by reference format
    };
  }

  // Attachment Style - direct copy (simple string)
  if (reference.attachmentStyle) {
    current.attachmentStyle = reference.attachmentStyle as AttachmentStyle;
  }

  // Love Languages - convert from simple ordered array to array of objects with ranks
  if (reference.loveLanguages && reference.loveLanguages.length > 0) {
    current.loveLanguages = reference.loveLanguages.map((type, index) => ({
      type: type as LoveLanguage['type'],
      rank: index + 1, // First item gets rank 1, second gets rank 2, etc.
    }));
  }

  return current;
}

/**
 * Merge partial reference data into existing current format data
 *
 * This is useful for incremental updates where the UI component only
 * changes one framework at a time.
 *
 * @param existing - Existing current format data
 * @param updates - Partial reference format updates
 * @returns Updated current format data
 */
export function mergeReferenceUpdates(
  existing: CurrentPersonalityData,
  updates: Partial<ReferencePersonalityData>
): CurrentPersonalityData {
  // Convert updates to current format
  const updatesInCurrentFormat = toCurrentFormat(
    updates as ReferencePersonalityData,
    existing.userId
  );

  // Merge with existing data, preserving metadata
  return {
    ...existing,
    ...updatesInCurrentFormat,
    userId: existing.userId, // Preserve original userId
    timestamp: new Date(), // Update timestamp
  };
}

/**
 * Check if personality data has any completed frameworks
 *
 * @param data - Personality data in either format
 * @returns True if at least one framework is completed
 */
export function hasAnyData(
  data: CurrentPersonalityData | ReferencePersonalityData
): boolean {
  return !!(
    data.bigFive ||
    data.mbti ||
    (data as ReferencePersonalityData).zodiacSign ||
    (data as CurrentPersonalityData).zodiac ||
    (data as ReferencePersonalityData).chineseZodiac ||
    (data as CurrentPersonalityData).chineseZodiac ||
    (data as ReferencePersonalityData).humanDesign ||
    (data as CurrentPersonalityData).humanDesign ||
    data.attachmentStyle ||
    (data.loveLanguages && data.loveLanguages.length > 0)
  );
}

/**
 * Get completion status for each framework
 *
 * @param data - Personality data in current format
 * @returns Object with boolean flags for each framework
 */
export function getFrameworkCompletion(
  data: CurrentPersonalityData
): Record<string, boolean> {
  return {
    bigFive: !!data.bigFive,
    mbti: !!data.mbti,
    zodiac: !!data.zodiac,
    chineseZodiac: !!data.chineseZodiac,
    humanDesign: !!data.humanDesign,
    attachmentStyle: !!data.attachmentStyle,
    loveLanguages: !!data.loveLanguages && data.loveLanguages.length === 5,
  };
}
