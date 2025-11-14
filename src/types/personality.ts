import { z } from 'zod';

// Big Five personality model
export interface BigFiveScores {
  openness: number; // 0-100
  conscientiousness: number; // 0-100
  extraversion: number; // 0-100
  agreeableness: number; // 0-100
  neuroticism: number; // 0-100
}

// Zod schema for Big Five validation
export const BigFiveScoresSchema = z.object({
  openness: z.number().min(0).max(100),
  conscientiousness: z.number().min(0).max(100),
  extraversion: z.number().min(0).max(100),
  agreeableness: z.number().min(0).max(100),
  neuroticism: z.number().min(0).max(100),
});

// MBTI type system
export type MBTIType = string; // 4-letter combination (e.g., "ENFP")

export interface MBTIDimensions {
  energyDirection: 'E' | 'I'; // Extraversion/Introversion
  informationGathering: 'S' | 'N'; // Sensing/Intuition
  decisionMaking: 'T' | 'F'; // Thinking/Feeling
  lifestyle: 'J' | 'P'; // Judging/Perceiving
}

// Valid MBTI types
const VALID_MBTI_TYPES = [
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
] as const;

// Zod schemas for MBTI validation
export const MBTIDimensionsSchema = z.object({
  energyDirection: z.enum(['E', 'I']),
  informationGathering: z.enum(['S', 'N']),
  decisionMaking: z.enum(['T', 'F']),
  lifestyle: z.enum(['J', 'P']),
});

export const MBTITypeSchema = z.enum(VALID_MBTI_TYPES);

// Attachment styles
export type AttachmentStyle =
  | 'secure'
  | 'anxious'
  | 'avoidant'
  | 'fearful-avoidant';

// Zod schema for attachment style validation
export const AttachmentStyleSchema = z.enum([
  'secure',
  'anxious',
  'avoidant',
  'fearful-avoidant',
]);

// Love languages with ranking
export interface LoveLanguage {
  type:
    | 'words-of-affirmation'
    | 'quality-time'
    | 'acts-of-service'
    | 'physical-touch'
    | 'gifts';
  rank: number; // 1-5
}

// Zod schemas for love languages validation
export const LoveLanguageTypeSchema = z.enum([
  'words-of-affirmation',
  'quality-time',
  'acts-of-service',
  'physical-touch',
  'gifts',
]);

export const LoveLanguageSchema = z.object({
  type: LoveLanguageTypeSchema,
  rank: z.number().min(1).max(5),
});

export const LoveLanguagesArraySchema = z
  .array(LoveLanguageSchema)
  .length(5)
  .refine(
    (languages) => {
      const ranks = languages.map((l) => l.rank);
      const uniqueRanks = new Set(ranks);
      return uniqueRanks.size === 5 && ranks.every((r) => r >= 1 && r <= 5);
    },
    {
      message: 'All love languages must have unique ranks from 1-5',
    }
  )
  .refine(
    (languages) => {
      const types = languages.map((l) => l.type);
      const uniqueTypes = new Set(types);
      return uniqueTypes.size === 5;
    },
    {
      message: 'All love language types must be included exactly once',
    }
  );

// Zodiac information
export type ZodiacSign =
  | 'aries'
  | 'taurus'
  | 'gemini'
  | 'cancer'
  | 'leo'
  | 'virgo'
  | 'libra'
  | 'scorpio'
  | 'sagittarius'
  | 'capricorn'
  | 'aquarius'
  | 'pisces';

export interface ZodiacData {
  sun: ZodiacSign;
  moon?: ZodiacSign;
  rising?: ZodiacSign;
}

// Zod schemas for zodiac validation
export const ZodiacSignSchema = z.enum([
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
]);

export const ZodiacDataSchema = z.object({
  sun: ZodiacSignSchema,
  moon: ZodiacSignSchema.optional(),
  rising: ZodiacSignSchema.optional(),
});

// Chinese Zodiac
export type ChineseZodiacAnimal =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

export type ChineseZodiacElement =
  | 'wood'
  | 'fire'
  | 'earth'
  | 'metal'
  | 'water';

export interface ChineseZodiacData {
  animal: ChineseZodiacAnimal;
  element: ChineseZodiacElement;
  year: number;
}

// Zod schemas for Chinese zodiac validation
export const ChineseZodiacAnimalSchema = z.enum([
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
]);

export const ChineseZodiacElementSchema = z.enum([
  'wood',
  'fire',
  'earth',
  'metal',
  'water',
]);

export const ChineseZodiacDataSchema = z.object({
  animal: ChineseZodiacAnimalSchema,
  element: ChineseZodiacElementSchema,
  year: z.number().min(1900).max(2100),
});

// Human Design system
export type HumanDesignType =
  | 'manifestor'
  | 'generator'
  | 'manifesting-generator'
  | 'projector'
  | 'reflector';

export interface HumanDesignData {
  type: HumanDesignType;
  authority?: string;
  profile?: string;
}

// Zod schemas for Human Design validation
export const HumanDesignTypeSchema = z.enum([
  'manifestor',
  'generator',
  'manifesting-generator',
  'projector',
  'reflector',
]);

export const HumanDesignDataSchema = z.object({
  type: HumanDesignTypeSchema,
  authority: z.string().optional(),
  profile: z.string().optional(),
});

// Core personality data structure
export interface PersonalityData {
  userId?: string;
  timestamp: Date;
  bigFive?: BigFiveScores;
  mbti?: MBTIType;
  zodiac?: ZodiacData;
  chineseZodiac?: ChineseZodiacData;
  humanDesign?: HumanDesignData;
  attachmentStyle?: AttachmentStyle;
  loveLanguages?: LoveLanguage[];
}

// Zod schema for complete personality data validation
export const PersonalityDataSchema = z.object({
  userId: z.string().optional(),
  timestamp: z.date(),
  bigFive: BigFiveScoresSchema.optional(),
  mbti: MBTITypeSchema.optional(),
  zodiac: ZodiacDataSchema.optional(),
  chineseZodiac: ChineseZodiacDataSchema.optional(),
  humanDesign: HumanDesignDataSchema.optional(),
  attachmentStyle: AttachmentStyleSchema.optional(),
  loveLanguages: LoveLanguagesArraySchema.optional(),
});

// Utility functions for data transformation and normalization
export const normalizePersonalityData = (
  data: Partial<PersonalityData>
): PersonalityData => {
  return {
    userId: data.userId,
    timestamp: data.timestamp || new Date(),
    bigFive: data.bigFive,
    mbti: data.mbti?.toUpperCase() as MBTIType,
    zodiac: data.zodiac,
    chineseZodiac: data.chineseZodiac,
    humanDesign: data.humanDesign,
    attachmentStyle: data.attachmentStyle,
    loveLanguages: data.loveLanguages,
  };
};

export const calculateDataCompleteness = (data: PersonalityData): number => {
  const frameworks = [
    'bigFive',
    'mbti',
    'zodiac',
    'chineseZodiac',
    'humanDesign',
    'attachmentStyle',
    'loveLanguages',
  ];

  const completedFrameworks = frameworks.filter(
    (framework) => data[framework as keyof PersonalityData] !== undefined
  );

  return Math.round((completedFrameworks.length / frameworks.length) * 100);
};

export const getFrameworkCompleteness = (
  data: PersonalityData
): Record<string, boolean> => {
  return {
    bigFive: !!data.bigFive,
    mbti: !!data.mbti,
    zodiac: !!data.zodiac,
    chineseZodiac: !!data.chineseZodiac,
    humanDesign: !!data.humanDesign,
    attachmentStyle: !!data.attachmentStyle,
    loveLanguages: !!data.loveLanguages && data.loveLanguages.length === 5,
  };
};
