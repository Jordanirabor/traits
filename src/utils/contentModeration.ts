/**
 * Content moderation utilities for age-appropriate insights
 */

import { Insight } from '@/types/insights';

/**
 * Age groups for content moderation
 */
export enum AgeGroup {
  MINOR_14_15 = '14-15',
  MINOR_16_17 = '16-17',
  ADULT = '18+',
}

/**
 * Get age group from age
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age < 16) return AgeGroup.MINOR_14_15;
  if (age < 18) return AgeGroup.MINOR_16_17;
  return AgeGroup.ADULT;
}

/**
 * Sensitive topics that require age-appropriate handling
 */
const SENSITIVE_TOPICS = {
  relationships: ['romantic', 'dating', 'intimacy', 'sexual', 'partner'],
  mental_health: [
    'depression',
    'anxiety',
    'trauma',
    'therapy',
    'medication',
    'disorder',
  ],
  substance: ['alcohol', 'drug', 'substance', 'addiction'],
  mature: ['adult', 'mature', 'explicit'],
};

/**
 * Check if content contains sensitive topics
 */
export function containsSensitiveTopic(
  text: string,
  topic: keyof typeof SENSITIVE_TOPICS
): boolean {
  const lowerText = text.toLowerCase();
  return SENSITIVE_TOPICS[topic].some((keyword) => lowerText.includes(keyword));
}

/**
 * Moderate insight content based on user age
 */
export function moderateInsight(insight: Insight, age: number): Insight {
  const ageGroup = getAgeGroup(age);

  // For adults, return as-is
  if (ageGroup === AgeGroup.ADULT) {
    return insight;
  }

  // Create moderated copy
  const moderated = { ...insight };

  // Add age-appropriate disclaimers
  if (containsSensitiveTopic(insight.description, 'relationships')) {
    moderated.description = moderateRelationshipContent(
      insight.description,
      ageGroup
    );
  }

  if (containsSensitiveTopic(insight.description, 'mental_health')) {
    moderated.explanation = addMentalHealthDisclaimer(
      insight.explanation,
      ageGroup
    );
  }

  // Add guidance for actionable steps
  if (insight.actionable) {
    moderated.actionable = addYouthGuidance(insight.actionable, ageGroup);
  }

  return moderated;
}

/**
 * Moderate relationship-related content
 */
function moderateRelationshipContent(
  content: string,
  ageGroup: AgeGroup
): string {
  if (ageGroup === AgeGroup.MINOR_14_15) {
    return `${content}\n\nNote: Focus on building healthy friendships and communication skills. Romantic relationships can wait until you're ready.`;
  }

  if (ageGroup === AgeGroup.MINOR_16_17) {
    return `${content}\n\nNote: Take your time with relationships and always prioritize respect and communication.`;
  }

  return content;
}

/**
 * Add mental health disclaimer for young users
 */
function addMentalHealthDisclaimer(
  content: string,
  ageGroup: AgeGroup
): string {
  const disclaimer =
    "\n\nImportant: If you're struggling with your mental health, please talk to a trusted adult, school counselor, or call a helpline. These insights are not a substitute for professional help.";

  return content + disclaimer;
}

/**
 * Add youth-specific guidance to actionable steps
 */
function addYouthGuidance(content: string, ageGroup: AgeGroup): string {
  if (ageGroup === AgeGroup.MINOR_14_15) {
    return `${content}\n\nTip: Ask a parent, guardian, or school counselor for help with these steps if you need it.`;
  }

  if (ageGroup === AgeGroup.MINOR_16_17) {
    return `${content}\n\nTip: Consider discussing these insights with a trusted adult who can provide guidance.`;
  }

  return content;
}

/**
 * Filter insights that may not be appropriate for age group
 */
export function filterInsightsForAge(
  insights: Insight[],
  age: number
): Insight[] {
  const ageGroup = getAgeGroup(age);

  // For adults, return all insights
  if (ageGroup === AgeGroup.ADULT) {
    return insights.map((insight) => moderateInsight(insight, age));
  }

  // For minors, filter and moderate
  return insights
    .filter((insight) => {
      // Filter out highly mature content for younger users
      if (ageGroup === AgeGroup.MINOR_14_15) {
        const hasMatureContent =
          containsSensitiveTopic(insight.description, 'mature') ||
          containsSensitiveTopic(insight.description, 'substance');

        if (hasMatureContent) {
          return false;
        }
      }

      return true;
    })
    .map((insight) => moderateInsight(insight, age));
}

/**
 * Get age-appropriate disclaimer text
 */
export function getAgeAppropriateDisclaimer(age: number): string {
  const ageGroup = getAgeGroup(age);

  if (ageGroup === AgeGroup.MINOR_14_15) {
    return 'These insights are for self-reflection and personal growth. Please share and discuss them with a parent, guardian, or school counselor. They are not medical or professional advice.';
  }

  if (ageGroup === AgeGroup.MINOR_16_17) {
    return 'These insights are for self-reflection and personal growth, not clinical diagnosis. Consider discussing them with a trusted adult if you have questions or concerns.';
  }

  return 'These insights are for self-reflection and personal growth, not clinical diagnosis. If you have concerns about your mental health, please consult a qualified professional.';
}

/**
 * Get parental guidance recommendation based on age
 */
export function getParentalGuidanceRecommendation(age: number): string | null {
  const ageGroup = getAgeGroup(age);

  if (ageGroup === AgeGroup.MINOR_14_15) {
    return 'We strongly recommend reviewing these insights with a parent or guardian who can help you understand and apply them appropriately.';
  }

  if (ageGroup === AgeGroup.MINOR_16_17) {
    return 'Consider sharing these insights with a parent, guardian, or trusted adult who can provide guidance.';
  }

  return null;
}

/**
 * Check if user should see enhanced privacy protections
 */
export function requiresEnhancedPrivacy(age: number): boolean {
  return age < 18;
}

/**
 * Get data retention recommendation based on age
 */
export function getDataRetentionRecommendation(age: number): {
  days: number;
  message: string;
} {
  const ageGroup = getAgeGroup(age);

  if (ageGroup === AgeGroup.MINOR_14_15) {
    return {
      days: 30,
      message:
        'For your privacy, we recommend automatically deleting your data after 30 days. You can change this in settings.',
    };
  }

  if (ageGroup === AgeGroup.MINOR_16_17) {
    return {
      days: 90,
      message:
        'We recommend automatically deleting your data after 90 days for privacy. You can adjust this in settings.',
    };
  }

  return {
    days: 365,
    message:
      'Your data will be kept until you delete it. You can set automatic deletion in settings.',
  };
}
