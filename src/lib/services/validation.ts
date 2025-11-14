import {
  ValidationError,
  ValidationResult,
  ValidationWarning,
} from '@/types/common';
import {
  AttachmentStyleSchema,
  BigFiveScoresSchema,
  ChineseZodiacDataSchema,
  HumanDesignDataSchema,
  LoveLanguagesArraySchema,
  MBTITypeSchema,
  PersonalityData,
  PersonalityDataSchema,
  ZodiacDataSchema,
  calculateDataCompleteness,
  getFrameworkCompleteness,
} from '@/types/personality';
import { sanitizeString } from '@/utils/personalityUtils';
import { z } from 'zod';

/**
 * Comprehensive validation service for personality data
 */
export class ValidationService {
  /**
   * Validate complete personality data
   */
  static validatePersonalityData(data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // First, sanitize the data
      const sanitizedData = this.sanitizePersonalityData(data);

      // Validate with Zod schema
      const result = PersonalityDataSchema.safeParse(sanitizedData);

      if (!result.success) {
        result.error.errors.forEach((error) => {
          errors.push({
            field: error.path.join('.'),
            message: error.message,
            code: error.code,
          });
        });
      }

      // Additional business logic validation
      if (result.success) {
        const additionalValidation = this.validateBusinessRules(result.data);
        errors.push(...additionalValidation.errors);
        warnings.push(...additionalValidation.warnings);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            field: 'general',
            message: 'Validation failed due to unexpected error',
            code: 'VALIDATION_ERROR',
          },
        ],
        warnings: [],
      };
    }
  }

  /**
   * Validate individual framework data
   */
  static validateFramework(framework: string, data: unknown): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      let schema: z.ZodSchema;
      let sanitizedData = data;

      switch (framework) {
        case 'bigFive':
          schema = BigFiveScoresSchema;
          sanitizedData = this.sanitizeBigFiveData(data);
          break;
        case 'mbti':
          schema = MBTITypeSchema;
          sanitizedData = this.sanitizeMBTIData(data);
          break;
        case 'zodiac':
          schema = ZodiacDataSchema;
          sanitizedData = this.sanitizeZodiacData(data);
          break;
        case 'chineseZodiac':
          schema = ChineseZodiacDataSchema;
          sanitizedData = this.sanitizeChineseZodiacData(data);
          break;
        case 'humanDesign':
          schema = HumanDesignDataSchema;
          sanitizedData = this.sanitizeHumanDesignData(data);
          break;
        case 'attachmentStyle':
          schema = AttachmentStyleSchema;
          sanitizedData = this.sanitizeAttachmentStyleData(data);
          break;
        case 'loveLanguages':
          schema = LoveLanguagesArraySchema;
          sanitizedData = this.sanitizeLoveLanguagesData(data);
          break;
        default:
          return {
            isValid: false,
            errors: [
              {
                field: 'framework',
                message: `Unknown framework: ${framework}`,
                code: 'UNKNOWN_FRAMEWORK',
              },
            ],
            warnings: [],
          };
      }

      const result = schema.safeParse(sanitizedData);

      if (!result.success) {
        result.error.errors.forEach((error) => {
          errors.push({
            field: error.path.join('.'),
            message: error.message,
            code: error.code,
          });
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [
          {
            field: framework,
            message: `Validation failed for ${framework}`,
            code: 'FRAMEWORK_VALIDATION_ERROR',
          },
        ],
        warnings: [],
      };
    }
  }
  /**
   * Sanitize complete personality data
   */
  private static sanitizePersonalityData(data: unknown): any {
    if (!data || typeof data !== 'object') {
      return {};
    }

    const sanitized: any = {};
    const input = data as Record<string, any>;

    // Sanitize userId
    if (input.userId && typeof input.userId === 'string') {
      sanitized.userId = sanitizeString(input.userId);
    }

    // Sanitize timestamp
    if (input.timestamp) {
      sanitized.timestamp = new Date(input.timestamp);
    } else {
      sanitized.timestamp = new Date();
    }

    // Sanitize each framework
    if (input.bigFive) {
      sanitized.bigFive = this.sanitizeBigFiveData(input.bigFive);
    }
    if (input.mbti) {
      sanitized.mbti = this.sanitizeMBTIData(input.mbti);
    }
    if (input.zodiac) {
      sanitized.zodiac = this.sanitizeZodiacData(input.zodiac);
    }
    if (input.chineseZodiac) {
      sanitized.chineseZodiac = this.sanitizeChineseZodiacData(
        input.chineseZodiac
      );
    }
    if (input.humanDesign) {
      sanitized.humanDesign = this.sanitizeHumanDesignData(input.humanDesign);
    }
    if (input.attachmentStyle) {
      sanitized.attachmentStyle = this.sanitizeAttachmentStyleData(
        input.attachmentStyle
      );
    }
    if (input.loveLanguages) {
      sanitized.loveLanguages = this.sanitizeLoveLanguagesData(
        input.loveLanguages
      );
    }

    return sanitized;
  }

  /**
   * Sanitize Big Five data
   */
  private static sanitizeBigFiveData(data: unknown): any {
    if (!data || typeof data !== 'object') return null;

    const input = data as Record<string, any>;
    const sanitized: any = {};

    const traits = [
      'openness',
      'conscientiousness',
      'extraversion',
      'agreeableness',
      'neuroticism',
    ];

    for (const trait of traits) {
      if (typeof input[trait] === 'number') {
        // Clamp values between 0 and 100
        sanitized[trait] = Math.max(0, Math.min(100, Math.round(input[trait])));
      } else if (typeof input[trait] === 'string') {
        const parsed = parseFloat(input[trait]);
        if (!isNaN(parsed)) {
          sanitized[trait] = Math.max(0, Math.min(100, Math.round(parsed)));
        }
      }
    }

    return Object.keys(sanitized).length === traits.length ? sanitized : null;
  }

  /**
   * Sanitize MBTI data
   */
  private static sanitizeMBTIData(data: unknown): string | null {
    if (typeof data !== 'string') return null;

    const sanitized = sanitizeString(data).toUpperCase().trim();

    // Validate MBTI format (4 letters)
    if (sanitized.length !== 4) return null;

    const validChars = /^[EINTJFPS]{4}$/;
    if (!validChars.test(sanitized)) return null;

    return sanitized;
  }

  /**
   * Sanitize Zodiac data
   */
  private static sanitizeZodiacData(data: unknown): any {
    if (!data || typeof data !== 'object') return null;

    const input = data as Record<string, any>;
    const sanitized: any = {};

    if (typeof input.sun === 'string') {
      sanitized.sun = sanitizeString(input.sun).toLowerCase().trim();
    }
    if (typeof input.moon === 'string') {
      sanitized.moon = sanitizeString(input.moon).toLowerCase().trim();
    }
    if (typeof input.rising === 'string') {
      sanitized.rising = sanitizeString(input.rising).toLowerCase().trim();
    }

    return sanitized.sun ? sanitized : null;
  }

  /**
   * Sanitize Chinese Zodiac data
   */
  private static sanitizeChineseZodiacData(data: unknown): any {
    if (!data || typeof data !== 'object') return null;

    const input = data as Record<string, any>;
    const sanitized: any = {};

    if (typeof input.animal === 'string') {
      sanitized.animal = sanitizeString(input.animal).toLowerCase().trim();
    }
    if (typeof input.element === 'string') {
      sanitized.element = sanitizeString(input.element).toLowerCase().trim();
    }
    if (typeof input.year === 'number') {
      sanitized.year = Math.round(input.year);
    } else if (typeof input.year === 'string') {
      const parsed = parseInt(input.year, 10);
      if (!isNaN(parsed)) {
        sanitized.year = parsed;
      }
    }

    return sanitized.animal && sanitized.element && sanitized.year
      ? sanitized
      : null;
  }

  /**
   * Sanitize Human Design data
   */
  private static sanitizeHumanDesignData(data: unknown): any {
    if (!data || typeof data !== 'object') return null;

    const input = data as Record<string, any>;
    const sanitized: any = {};

    if (typeof input.type === 'string') {
      sanitized.type = sanitizeString(input.type).toLowerCase().trim();
    }
    if (typeof input.authority === 'string') {
      sanitized.authority = sanitizeString(input.authority).trim();
    }
    if (typeof input.profile === 'string') {
      sanitized.profile = sanitizeString(input.profile).trim();
    }

    return sanitized.type ? sanitized : null;
  }

  /**
   * Sanitize Attachment Style data
   */
  private static sanitizeAttachmentStyleData(data: unknown): string | null {
    if (typeof data !== 'string') return null;

    return sanitizeString(data).toLowerCase().trim();
  }

  /**
   * Sanitize Love Languages data
   */
  private static sanitizeLoveLanguagesData(data: unknown): any {
    if (!Array.isArray(data)) return null;

    const sanitized = data
      .map((item) => {
        if (!item || typeof item !== 'object') return null;

        const input = item as Record<string, any>;
        const result: any = {};

        if (typeof input.type === 'string') {
          result.type = sanitizeString(input.type).toLowerCase().trim();
        }
        if (typeof input.rank === 'number') {
          result.rank = Math.max(1, Math.min(5, Math.round(input.rank)));
        } else if (typeof input.rank === 'string') {
          const parsed = parseInt(input.rank, 10);
          if (!isNaN(parsed)) {
            result.rank = Math.max(1, Math.min(5, parsed));
          }
        }

        return result.type && result.rank ? result : null;
      })
      .filter((item) => item !== null);

    return sanitized.length === 5 ? sanitized : null;
  }

  /**
   * Validate business rules beyond schema validation
   */
  private static validateBusinessRules(data: PersonalityData): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check data completeness
    const completeness = calculateDataCompleteness(data);
    if (completeness < 30) {
      warnings.push({
        field: 'completeness',
        message: 'Consider completing more frameworks for better insights',
        code: 'LOW_COMPLETENESS',
      });
    }

    // Validate Big Five scores for extreme values
    if (data.bigFive) {
      const extremeThreshold = 10;
      Object.entries(data.bigFive).forEach(([trait, score]) => {
        if (score < extremeThreshold || score > 100 - extremeThreshold) {
          warnings.push({
            field: `bigFive.${trait}`,
            message: `Extreme ${trait} score (${score}) - please verify accuracy`,
            code: 'EXTREME_SCORE',
          });
        }
      });
    }

    // Validate Love Languages uniqueness
    if (data.loveLanguages) {
      const ranks = data.loveLanguages.map((l) => l.rank);
      const types = data.loveLanguages.map((l) => l.type);

      if (new Set(ranks).size !== ranks.length) {
        errors.push({
          field: 'loveLanguages',
          message: 'Love language ranks must be unique',
          code: 'DUPLICATE_RANKS',
        });
      }

      if (new Set(types).size !== types.length) {
        errors.push({
          field: 'loveLanguages',
          message: 'Love language types must be unique',
          code: 'DUPLICATE_TYPES',
        });
      }
    }

    // Validate Chinese Zodiac year consistency
    if (data.chineseZodiac) {
      const currentYear = new Date().getFullYear();
      if (
        data.chineseZodiac.year > currentYear ||
        data.chineseZodiac.year < 1900
      ) {
        warnings.push({
          field: 'chineseZodiac.year',
          message: 'Birth year seems unusual - please verify',
          code: 'UNUSUAL_YEAR',
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Check data completeness and provide scoring
   */
  static checkDataCompleteness(data: PersonalityData): {
    overall: number;
    frameworks: Record<string, number>;
    missingFrameworks: string[];
    recommendations: string[];
  } {
    const frameworkCompleteness = getFrameworkCompleteness(data);
    const frameworks: Record<string, number> = {};
    const missingFrameworks: string[] = [];
    const recommendations: string[] = [];

    // Calculate individual framework completeness scores
    Object.entries(frameworkCompleteness).forEach(([framework, isComplete]) => {
      if (isComplete) {
        frameworks[framework] = 100;
      } else {
        frameworks[framework] = 0;
        missingFrameworks.push(framework);
      }
    });

    // Special scoring for partially complete frameworks
    if (data.bigFive) {
      const bigFiveCount = Object.values(data.bigFive).filter(
        (score) => score !== undefined
      ).length;
      frameworks.bigFive = (bigFiveCount / 5) * 100;
    }

    if (data.zodiac) {
      let zodiacScore = data.zodiac.sun ? 60 : 0;
      if (data.zodiac.moon) zodiacScore += 20;
      if (data.zodiac.rising) zodiacScore += 20;
      frameworks.zodiac = zodiacScore;
    }

    const overall = calculateDataCompleteness(data);

    // Generate recommendations
    if (missingFrameworks.includes('bigFive')) {
      recommendations.push(
        'Complete Big Five assessment for core personality insights'
      );
    }
    if (missingFrameworks.includes('attachmentStyle')) {
      recommendations.push(
        'Take attachment style assessment for relationship insights'
      );
    }
    if (overall < 50) {
      recommendations.push(
        'Complete at least 3-4 frameworks for meaningful analysis'
      );
    }

    return {
      overall,
      frameworks,
      missingFrameworks,
      recommendations,
    };
  }

  /**
   * Generate user-friendly error messages
   */
  static formatValidationErrors(errors: ValidationError[]): string[] {
    return errors.map((error) => {
      switch (error.code) {
        case 'too_small':
          return `${error.field}: Value is too small`;
        case 'too_big':
          return `${error.field}: Value is too large`;
        case 'invalid_type':
          return `${error.field}: Invalid data type`;
        case 'invalid_enum_value':
          return `${error.field}: Invalid option selected`;
        case 'DUPLICATE_RANKS':
          return 'Love languages must have unique rankings from 1-5';
        case 'DUPLICATE_TYPES':
          return 'Each love language type must be selected exactly once';
        case 'EXTREME_SCORE':
          return error.message;
        default:
          return error.message || `Validation error in ${error.field}`;
      }
    });
  }

  /**
   * Generate user-friendly warning messages
   */
  static formatValidationWarnings(warnings: ValidationWarning[]): string[] {
    return warnings.map((warning) => warning.message);
  }
}
