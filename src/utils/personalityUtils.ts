import {
  BigFiveScores,
  ChineseZodiacAnimal,
  ChineseZodiacElement,
  MBTIType,
  PersonalityData,
  ZodiacSign,
} from '@/types/personality';

/**
 * Calculate Chinese Zodiac animal and element based on birth year
 */
export const calculateChineseZodiac = (year: number) => {
  const animals: ChineseZodiacAnimal[] = [
    'rat',
    'ox',
    'tiger',
    'rabbit',
    'dragon',
    'snake',
    'horse',
    'goat',
    'monkey',
    'rooster',
    'dog',
    'pig',
  ];

  const elements: ChineseZodiacElement[] = [
    'metal',
    'water',
    'wood',
    'fire',
    'earth',
  ];

  // Chinese zodiac starts from 1900 as year of Rat
  const animalIndex = (year - 1900) % 12;
  const elementIndex = Math.floor(((year - 1900) % 10) / 2);

  return {
    animal: animals[animalIndex],
    element: elements[elementIndex],
    year,
  };
};

/**
 * Calculate Western zodiac sign based on birth date
 */
export const calculateZodiacSign = (month: number, day: number): ZodiacSign => {
  const zodiacRanges = [
    {
      sign: 'capricorn' as ZodiacSign,
      start: { month: 12, day: 22 },
      end: { month: 1, day: 19 },
    },
    {
      sign: 'aquarius' as ZodiacSign,
      start: { month: 1, day: 20 },
      end: { month: 2, day: 18 },
    },
    {
      sign: 'pisces' as ZodiacSign,
      start: { month: 2, day: 19 },
      end: { month: 3, day: 20 },
    },
    {
      sign: 'aries' as ZodiacSign,
      start: { month: 3, day: 21 },
      end: { month: 4, day: 19 },
    },
    {
      sign: 'taurus' as ZodiacSign,
      start: { month: 4, day: 20 },
      end: { month: 5, day: 20 },
    },
    {
      sign: 'gemini' as ZodiacSign,
      start: { month: 5, day: 21 },
      end: { month: 6, day: 20 },
    },
    {
      sign: 'cancer' as ZodiacSign,
      start: { month: 6, day: 21 },
      end: { month: 7, day: 22 },
    },
    {
      sign: 'leo' as ZodiacSign,
      start: { month: 7, day: 23 },
      end: { month: 8, day: 22 },
    },
    {
      sign: 'virgo' as ZodiacSign,
      start: { month: 8, day: 23 },
      end: { month: 9, day: 22 },
    },
    {
      sign: 'libra' as ZodiacSign,
      start: { month: 9, day: 23 },
      end: { month: 10, day: 22 },
    },
    {
      sign: 'scorpio' as ZodiacSign,
      start: { month: 10, day: 23 },
      end: { month: 11, day: 21 },
    },
    {
      sign: 'sagittarius' as ZodiacSign,
      start: { month: 11, day: 22 },
      end: { month: 12, day: 21 },
    },
  ];

  for (const range of zodiacRanges) {
    if (range.sign === 'capricorn') {
      // Special case for Capricorn which spans year boundary
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return range.sign;
      }
    } else {
      if (
        (month === range.start.month && day >= range.start.day) ||
        (month === range.end.month && day <= range.end.day) ||
        (month > range.start.month && month < range.end.month)
      ) {
        return range.sign;
      }
    }
  }

  return 'capricorn'; // fallback
};

/**
 * Convert MBTI dimensions to 4-letter type
 */
export const dimensionsToMBTI = (dimensions: {
  energyDirection: 'E' | 'I';
  informationGathering: 'S' | 'N';
  decisionMaking: 'T' | 'F';
  lifestyle: 'J' | 'P';
}): MBTIType => {
  return `${dimensions.energyDirection}${dimensions.informationGathering}${dimensions.decisionMaking}${dimensions.lifestyle}`;
};

/**
 * Convert MBTI type to dimensions
 */
export const mbtiToDimensions = (mbti: MBTIType) => {
  if (mbti.length !== 4) {
    throw new Error('Invalid MBTI type');
  }

  return {
    energyDirection: mbti[0] as 'E' | 'I',
    informationGathering: mbti[1] as 'S' | 'N',
    decisionMaking: mbti[2] as 'T' | 'F',
    lifestyle: mbti[3] as 'J' | 'P',
  };
};

/**
 * Normalize Big Five scores to ensure they're within 0-100 range
 */
export const normalizeBigFiveScores = (
  scores: Partial<BigFiveScores>
): BigFiveScores => {
  const normalize = (
    value: number | undefined,
    defaultValue: number = 50
  ): number => {
    if (value === undefined) return defaultValue;
    return Math.max(0, Math.min(100, Math.round(value)));
  };

  return {
    openness: normalize(scores.openness),
    conscientiousness: normalize(scores.conscientiousness),
    extraversion: normalize(scores.extraversion),
    agreeableness: normalize(scores.agreeableness),
    neuroticism: normalize(scores.neuroticism),
  };
};

/**
 * Get missing frameworks from personality data
 */
export const getMissingFrameworks = (data: PersonalityData): string[] => {
  const frameworks = [
    { key: 'bigFive', name: 'Big Five' },
    { key: 'mbti', name: 'MBTI' },
    { key: 'zodiac', name: 'Zodiac' },
    { key: 'chineseZodiac', name: 'Chinese Zodiac' },
    { key: 'humanDesign', name: 'Human Design' },
    { key: 'attachmentStyle', name: 'Attachment Style' },
    { key: 'loveLanguages', name: 'Love Languages' },
  ];

  return frameworks
    .filter((framework) => !data[framework.key as keyof PersonalityData])
    .map((framework) => framework.name);
};

/**
 * Generate recommendations for completing personality assessment
 */
export const generateCompletionRecommendations = (
  data: PersonalityData
): string[] => {
  const missing = getMissingFrameworks(data);
  const recommendations: string[] = [];

  if (missing.includes('Big Five')) {
    recommendations.push(
      'Complete a Big Five personality test for core trait analysis'
    );
  }

  if (missing.includes('Attachment Style')) {
    recommendations.push(
      'Take an attachment style assessment for relationship insights'
    );
  }

  if (missing.includes('MBTI')) {
    recommendations.push(
      'Determine your MBTI type for cognitive preference insights'
    );
  }

  if (missing.includes('Love Languages')) {
    recommendations.push(
      'Rank your love languages for relationship compatibility'
    );
  }

  if (missing.length > 4) {
    recommendations.push(
      'Consider completing at least 3-4 frameworks for meaningful insights'
    );
  }

  return recommendations;
};

// Re-export sanitization utilities
export {
  sanitizeInteger,
  sanitizeNumber,
  sanitizeString,
} from './sanitization';

/**
 * Deep clone personality data
 */
export const clonePersonalityData = (
  data: PersonalityData
): PersonalityData => {
  return JSON.parse(JSON.stringify(data));
};
