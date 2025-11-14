import { AnalysisResults, CompletenessReport, Insight } from '@/types/insights';
import {
  calculateDataCompleteness,
  PersonalityData,
} from '@/types/personality';
import { greenFlagEngine } from './greenFlagEngine';
import { redFlagEngine } from './redFlagEngine';
import { selfImprovementEngine } from './selfImprovementEngine';
import { strengthEngine } from './strengthEngine';

/**
 * Core Analysis Engine
 * Implements weighted scoring and pattern detection for personality analysis
 */

// Framework weights for cross-framework analysis
const FRAMEWORK_WEIGHTS = {
  attachmentStyle: 0.6, // Highest weight for relationship analysis
  bigFive: 0.25,
  mbti: 0.1,
  loveLanguages: 0.05,
  humanDesign: 0.0, // Informational only
  zodiac: 0.0, // Informational only
  chineseZodiac: 0.0, // Informational only
};

// Confidence thresholds
const MIN_CONFIDENCE_THRESHOLD = 0.3;
const HIGH_CONFIDENCE_THRESHOLD = 0.7;

/**
 * Pattern detection result
 */
interface Pattern {
  type: 'contradiction' | 'strength' | 'growth-opportunity' | 'compatibility';
  confidence: number;
  frameworks: string[];
  description: string;
  weight: number;
}

/**
 * Weighted insight candidate
 */
interface InsightCandidate {
  insight: Insight;
  weight: number;
  priority: number;
}

/**
 * Main Analysis Engine class
 */
export class AnalysisEngine {
  /**
   * Generate complete personality insights
   */
  generateInsights(data: PersonalityData): AnalysisResults {
    const completeness = calculateDataCompleteness(data);
    const patterns = this.detectPatterns(data);
    const confidence = this.calculateOverallConfidence(data, patterns);

    // Generate insights using specialized engines
    const selfImprovement =
      selfImprovementEngine.generateSelfImprovementInsights(data);
    const strengths = strengthEngine.generateStrengthInsights(data);
    const greenFlags = greenFlagEngine.generateGreenFlagInsights(data);
    const redFlags = redFlagEngine.generateRedFlagInsights(data);

    return {
      selfImprovement,
      strengths,
      greenFlags,
      redFlags,
      confidence,
      completeness,
    };
  }

  /**
   * Validate data completeness and provide recommendations
   */
  validateCompleteness(data: PersonalityData): CompletenessReport {
    const frameworks = {
      bigFive: data.bigFive ? 100 : 0,
      mbti: data.mbti ? 100 : 0,
      zodiac: data.zodiac ? 100 : 0,
      chineseZodiac: data.chineseZodiac ? 100 : 0,
      humanDesign: data.humanDesign ? 100 : 0,
      attachmentStyle: data.attachmentStyle ? 100 : 0,
      loveLanguages: data.loveLanguages?.length === 5 ? 100 : 0,
    };

    const missingFrameworks = Object.entries(frameworks)
      .filter(([_, score]) => score === 0)
      .map(([name]) => name);

    const recommendations =
      this.generateCompletenessRecommendations(missingFrameworks);

    return {
      overall: calculateDataCompleteness(data),
      frameworks,
      missingFrameworks,
      recommendations,
    };
  }

  /**
   * Detect patterns across personality frameworks
   */
  private detectPatterns(data: PersonalityData): Pattern[] {
    const patterns: Pattern[] = [];

    // Detect contradictions
    patterns.push(...this.detectContradictions(data));

    // Detect strengths
    patterns.push(...this.detectStrengthPatterns(data));

    // Detect growth opportunities
    patterns.push(...this.detectGrowthOpportunities(data));

    // Detect compatibility patterns
    patterns.push(...this.detectCompatibilityPatterns(data));

    return patterns;
  }

  /**
   * Detect contradictions between frameworks
   */
  private detectContradictions(data: PersonalityData): Pattern[] {
    const contradictions: Pattern[] = [];

    // MBTI Extraversion vs Big Five Extraversion
    if (data.mbti && data.bigFive) {
      const mbtiIsExtraverted = data.mbti.startsWith('E');
      const bigFiveExtraversion = data.bigFive.extraversion;

      if (
        (mbtiIsExtraverted && bigFiveExtraversion < 40) ||
        (!mbtiIsExtraverted && bigFiveExtraversion > 60)
      ) {
        contradictions.push({
          type: 'contradiction',
          confidence: 0.7,
          frameworks: ['mbti', 'bigFive'],
          description: 'Extraversion mismatch between MBTI and Big Five',
          weight: FRAMEWORK_WEIGHTS.mbti + FRAMEWORK_WEIGHTS.bigFive,
        });
      }
    }

    // Anxious attachment with high Big Five Neuroticism
    if (data.attachmentStyle === 'anxious' && data.bigFive) {
      if (data.bigFive.neuroticism > 70) {
        contradictions.push({
          type: 'contradiction',
          confidence: 0.8,
          frameworks: ['attachmentStyle', 'bigFive'],
          description: 'High anxiety across multiple frameworks',
          weight: FRAMEWORK_WEIGHTS.attachmentStyle + FRAMEWORK_WEIGHTS.bigFive,
        });
      }
    }

    return contradictions;
  }

  /**
   * Detect strength patterns
   */
  private detectStrengthPatterns(data: PersonalityData): Pattern[] {
    const strengths: Pattern[] = [];

    // High Big Five scores
    if (data.bigFive) {
      const { openness, conscientiousness, extraversion, agreeableness } =
        data.bigFive;

      if (openness > 75) {
        strengths.push({
          type: 'strength',
          confidence: 0.8,
          frameworks: ['bigFive'],
          description: 'High openness to experience',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }

      if (conscientiousness > 75) {
        strengths.push({
          type: 'strength',
          confidence: 0.8,
          frameworks: ['bigFive'],
          description: 'High conscientiousness',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }

      if (extraversion > 75) {
        strengths.push({
          type: 'strength',
          confidence: 0.8,
          frameworks: ['bigFive'],
          description: 'High extraversion',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }

      if (agreeableness > 75) {
        strengths.push({
          type: 'strength',
          confidence: 0.8,
          frameworks: ['bigFive'],
          description: 'High agreeableness',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }
    }

    // Secure attachment
    if (data.attachmentStyle === 'secure') {
      strengths.push({
        type: 'strength',
        confidence: 0.9,
        frameworks: ['attachmentStyle'],
        description: 'Secure attachment style',
        weight: FRAMEWORK_WEIGHTS.attachmentStyle,
      });
    }

    return strengths;
  }

  /**
   * Detect growth opportunities
   */
  private detectGrowthOpportunities(data: PersonalityData): Pattern[] {
    const opportunities: Pattern[] = [];

    // Low Big Five scores
    if (data.bigFive) {
      const { conscientiousness, agreeableness, neuroticism } = data.bigFive;

      if (conscientiousness < 40) {
        opportunities.push({
          type: 'growth-opportunity',
          confidence: 0.75,
          frameworks: ['bigFive'],
          description: 'Low conscientiousness - organization opportunity',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }

      if (agreeableness < 40) {
        opportunities.push({
          type: 'growth-opportunity',
          confidence: 0.7,
          frameworks: ['bigFive'],
          description: 'Low agreeableness - empathy development',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }

      if (neuroticism > 70) {
        opportunities.push({
          type: 'growth-opportunity',
          confidence: 0.8,
          frameworks: ['bigFive'],
          description: 'High neuroticism - emotional regulation',
          weight: FRAMEWORK_WEIGHTS.bigFive,
        });
      }
    }

    // Insecure attachment patterns
    if (data.attachmentStyle && data.attachmentStyle !== 'secure') {
      opportunities.push({
        type: 'growth-opportunity',
        confidence: 0.85,
        frameworks: ['attachmentStyle'],
        description: `${data.attachmentStyle} attachment - relationship work`,
        weight: FRAMEWORK_WEIGHTS.attachmentStyle,
      });
    }

    return opportunities;
  }

  /**
   * Detect compatibility patterns for relationships
   */
  private detectCompatibilityPatterns(data: PersonalityData): Pattern[] {
    const patterns: Pattern[] = [];

    // Attachment-based compatibility needs
    if (data.attachmentStyle) {
      patterns.push({
        type: 'compatibility',
        confidence: 0.9,
        frameworks: ['attachmentStyle'],
        description: `Attachment-based compatibility for ${data.attachmentStyle}`,
        weight: FRAMEWORK_WEIGHTS.attachmentStyle,
      });
    }

    // Big Five complementary traits
    if (data.bigFive) {
      patterns.push({
        type: 'compatibility',
        confidence: 0.7,
        frameworks: ['bigFive'],
        description: 'Big Five complementary trait needs',
        weight: FRAMEWORK_WEIGHTS.bigFive,
      });
    }

    // Love language alignment
    if (data.loveLanguages) {
      const topLanguage = data.loveLanguages.find((l) => l.rank === 1);
      if (topLanguage) {
        patterns.push({
          type: 'compatibility',
          confidence: 0.75,
          frameworks: ['loveLanguages'],
          description: `Primary love language: ${topLanguage.type}`,
          weight: FRAMEWORK_WEIGHTS.loveLanguages,
        });
      }
    }

    return patterns;
  }

  /**
   * Calculate overall confidence score based on data completeness and pattern strength
   */
  private calculateOverallConfidence(
    data: PersonalityData,
    patterns: Pattern[]
  ): number {
    const completeness = calculateDataCompleteness(data) / 100;

    // Weight critical frameworks more heavily
    let weightedCompleteness = 0;
    let totalWeight = 0;

    if (data.attachmentStyle) {
      weightedCompleteness += FRAMEWORK_WEIGHTS.attachmentStyle;
    }
    if (data.bigFive) {
      weightedCompleteness += FRAMEWORK_WEIGHTS.bigFive;
    }
    if (data.mbti) {
      weightedCompleteness += FRAMEWORK_WEIGHTS.mbti;
    }
    if (data.loveLanguages) {
      weightedCompleteness += FRAMEWORK_WEIGHTS.loveLanguages;
    }

    totalWeight =
      FRAMEWORK_WEIGHTS.attachmentStyle +
      FRAMEWORK_WEIGHTS.bigFive +
      FRAMEWORK_WEIGHTS.mbti +
      FRAMEWORK_WEIGHTS.loveLanguages;

    const dataConfidence = weightedCompleteness / totalWeight;

    // Average pattern confidence
    const patternConfidence =
      patterns.length > 0
        ? patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length
        : 0.5;

    // Combine data completeness and pattern confidence
    return (
      Math.round((dataConfidence * 0.6 + patternConfidence * 0.4) * 100) / 100
    );
  }

  /**
   * Generate recommendations for missing frameworks
   */
  private generateCompletenessRecommendations(
    missingFrameworks: string[]
  ): string[] {
    const recommendations: string[] = [];

    const priorityFrameworks = ['attachmentStyle', 'bigFive'];
    const missingPriority = missingFrameworks.filter((f) =>
      priorityFrameworks.includes(f)
    );

    if (missingPriority.length > 0) {
      recommendations.push(
        `Complete ${missingPriority.join(' and ')} for more accurate insights`
      );
    }

    if (missingFrameworks.includes('loveLanguages')) {
      recommendations.push(
        'Add Love Languages for better relationship compatibility insights'
      );
    }

    if (missingFrameworks.length === 0) {
      recommendations.push(
        'All frameworks completed - insights are comprehensive'
      );
    }

    return recommendations;
  }

  /**
   * Select top insights based on weight and priority
   */
  protected selectTopInsights(
    candidates: InsightCandidate[],
    count: number
  ): Insight[] {
    return candidates
      .sort((a, b) => {
        // Sort by priority first, then weight, then confidence
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        if (a.weight !== b.weight) {
          return b.weight - a.weight;
        }
        return b.insight.confidence - a.insight.confidence;
      })
      .slice(0, count)
      .map((c) => c.insight);
  }

  /**
   * Generate unique insight ID
   */
  protected generateInsightId(type: string, index: number): string {
    return `${type}-${Date.now()}-${index}`;
  }
}

// Export singleton instance
export const analysisEngine = new AnalysisEngine();
