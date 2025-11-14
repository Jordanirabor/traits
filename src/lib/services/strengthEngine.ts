import { Insight } from '@/types/insights';
import { PersonalityData } from '@/types/personality';

/**
 * Strength Identification Engine
 * Identifies positive attributes, rare combinations, and natural talents
 */

interface InsightCandidate {
  insight: Insight;
  weight: number;
  priority: number;
}

export class StrengthEngine {
  /**
   * Generate exactly 3 strength insights
   */
  generateStrengthInsights(data: PersonalityData): Insight[] {
    const candidates: InsightCandidate[] = [];

    // Identify high Big Five scores
    candidates.push(...this.generateBigFiveStrengths(data));

    // Identify secure attachment strengths
    candidates.push(...this.generateAttachmentStrengths(data));

    // Identify rare personality combinations
    candidates.push(...this.generateRareCombinationStrengths(data));

    // Identify complementary trait patterns
    candidates.push(...this.generateComplementaryStrengths(data));

    // Select top 3 insights
    return this.selectTopInsights(candidates, 3);
  }

  /**
   * Generate strengths from high Big Five scores
   */
  private generateBigFiveStrengths(data: PersonalityData): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.bigFive) {
      return insights;
    }

    const {
      openness,
      conscientiousness,
      extraversion,
      agreeableness,
      neuroticism,
    } = data.bigFive;

    // High openness
    if (openness > 75) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-openness', 0),
          title: 'Creative and Intellectually Curious',
          description:
            'Your high openness makes you naturally innovative and adaptable to new ideas',
          explanation:
            'High openness is associated with creativity, intellectual curiosity, and comfort with ambiguity. You likely enjoy exploring new concepts, appreciate art and beauty, and can see connections others miss. This trait is highly valued in creative fields, research, and innovation.',
          actionable:
            "Leverage this strength in roles requiring innovation, problem-solving, or creative thinking. Seek environments that value new ideas. Share your unique perspectives—they're valuable. Consider creative hobbies or fields where your imagination can flourish.",
          confidence: 0.85,
          sources: ['bigFive'],
        },
        weight: 0.3,
        priority: 1,
      });
    }

    // High conscientiousness
    if (conscientiousness > 75) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-conscientiousness', 1),
          title: 'Reliable and Achievement-Oriented',
          description:
            'Your high conscientiousness makes you exceptionally dependable and goal-focused',
          explanation:
            'High conscientiousness is one of the strongest predictors of success across domains. You naturally plan ahead, follow through on commitments, and maintain high standards. People trust you because you consistently deliver. This trait is invaluable in leadership, project management, and any role requiring accountability.',
          actionable:
            'Take on leadership roles where your reliability shines. Use your organizational skills to mentor others. Be careful not to burn out—your high standards can be exhausting. Your follow-through is a superpower in a world of flaky people.',
          confidence: 0.88,
          sources: ['bigFive'],
        },
        weight: 0.32,
        priority: 1,
      });
    }

    // High extraversion
    if (extraversion > 75) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-extraversion', 2),
          title: 'Energizing and Socially Confident',
          description:
            'Your high extraversion gives you natural charisma and social energy',
          explanation:
            'High extraversion means you energize others and thrive in social situations. You likely build networks easily, communicate effectively, and create enthusiasm. This trait is powerful in sales, leadership, teaching, and any role requiring social influence. You make people feel engaged and alive.',
          actionable:
            "Pursue roles with high social interaction—you'll excel and feel fulfilled. Use your energy to build communities and networks. Your ability to connect people is valuable. Balance social time with strategic alone time for deep work.",
          confidence: 0.82,
          sources: ['bigFive'],
        },
        weight: 0.28,
        priority: 1,
      });
    }

    // High agreeableness
    if (agreeableness > 75) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-agreeableness', 3),
          title: 'Empathetic and Collaborative',
          description:
            'Your high agreeableness makes you naturally compassionate and team-oriented',
          explanation:
            "High agreeableness means you excel at understanding others' perspectives and creating harmony. You're likely trusted, liked, and sought out for advice. This trait is essential in counseling, healthcare, education, and team environments. You make people feel heard and valued.",
          actionable:
            'Leverage your empathy in helping professions or team leadership. Your ability to build consensus is rare and valuable. Set boundaries to avoid being taken advantage of. Your kindness is a strength, not a weakness.',
          confidence: 0.8,
          sources: ['bigFive'],
        },
        weight: 0.27,
        priority: 1,
      });
    }

    // Low neuroticism (emotional stability)
    if (neuroticism < 30) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-stability', 4),
          title: 'Emotionally Stable and Resilient',
          description:
            'Your low neuroticism gives you exceptional emotional stability and stress resilience',
          explanation:
            "Low neuroticism (high emotional stability) is a significant strength. You remain calm under pressure, recover quickly from setbacks, and don't get overwhelmed by stress. This makes you reliable in crises and able to think clearly when others panic. It's a leadership superpower.",
          actionable:
            'Take on high-pressure roles where your calm is an asset. Others will look to you for stability during chaos. Use your resilience to support more anxious people. Your even-keeled nature is incredibly valuable in leadership and crisis management.',
          confidence: 0.87,
          sources: ['bigFive'],
        },
        weight: 0.31,
        priority: 1,
      });
    }

    return insights;
  }

  /**
   * Generate strengths from secure attachment
   */
  private generateAttachmentStrengths(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (data.attachmentStyle === 'secure') {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-secure-attachment', 0),
          title: 'Secure Attachment Foundation',
          description:
            'Your secure attachment style is one of your greatest relationship assets',
          explanation:
            'Secure attachment is relatively rare (only about 50-60% of adults) and incredibly valuable. You can be intimate without losing yourself, handle conflict constructively, and trust without being naive. You likely had consistent, responsive caregiving that taught you relationships are safe. This is the foundation for healthy relationships.',
          actionable:
            "Use your secure attachment to model healthy relationship patterns for others. You can help anxious partners feel safe and avoidant partners open up. Your ability to communicate needs clearly and respond to others' needs is a gift. Consider relationship coaching or mentoring.",
          confidence: 0.92,
          sources: ['attachmentStyle'],
        },
        weight: 0.4,
        priority: 1,
      });
    }

    return insights;
  }

  /**
   * Generate strengths from rare personality combinations
   */
  private generateRareCombinationStrengths(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    // High openness + high conscientiousness (rare combination)
    if (
      data.bigFive &&
      data.bigFive.openness > 75 &&
      data.bigFive.conscientiousness > 75
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-rare-creative-disciplined', 0),
          title: 'Disciplined Creativity',
          description:
            'Your combination of high openness and conscientiousness is rare and powerful',
          explanation:
            'Most creative people struggle with follow-through, and most disciplined people struggle with innovation. You have both—the ability to generate novel ideas AND execute them systematically. This combination is found in successful entrepreneurs, artists who actually finish projects, and innovative leaders.',
          actionable:
            'Pursue ambitious creative projects that require sustained effort. You can succeed where others fail because you combine vision with execution. Consider entrepreneurship, creative direction, or research. Your ability to be both imaginative and reliable is exceptionally rare.',
          confidence: 0.88,
          sources: ['bigFive'],
        },
        weight: 0.38,
        priority: 1,
      });
    }

    // INFJ or INTJ with secure attachment (rare combination)
    if (
      data.mbti &&
      (data.mbti === 'INFJ' || data.mbti === 'INTJ') &&
      data.attachmentStyle === 'secure'
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-rare-intuitive-secure', 1),
          title: 'Insightful and Emotionally Grounded',
          description:
            'Your combination of intuitive depth and secure attachment is exceptionally rare',
          explanation: `${data.mbti} is one of the rarest types (1-3% of population), and secure attachment with this type is even rarer. You combine deep insight into patterns and people with emotional stability. You can see what others miss while maintaining healthy relationships. This makes you an exceptional counselor, strategist, or advisor.`,
          actionable:
            "Trust your intuitive insights—they're usually right. Use your combination of depth and stability to guide others. You can handle complex emotional situations that would overwhelm others. Consider roles in counseling, strategy, or leadership development.",
          confidence: 0.85,
          sources: ['mbti', 'attachmentStyle'],
        },
        weight: 0.36,
        priority: 1,
      });
    }

    // High agreeableness + low neuroticism (peaceful strength)
    if (
      data.bigFive &&
      data.bigFive.agreeableness > 75 &&
      data.bigFive.neuroticism < 30
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId('strength-rare-peaceful', 2),
          title: 'Calm and Compassionate Presence',
          description:
            'Your combination of high agreeableness and emotional stability creates a peaceful strength',
          explanation:
            'You combine genuine care for others with emotional resilience—you can be compassionate without being overwhelmed. This is the profile of effective therapists, mediators, and healers. You create safety for others while maintaining your own stability.',
          actionable:
            "Consider helping professions where your calm compassion is needed. You can hold space for others' pain without taking it on. Your presence is healing. Use this gift in counseling, mediation, healthcare, or crisis support.",
          confidence: 0.83,
          sources: ['bigFive'],
        },
        weight: 0.34,
        priority: 1,
      });
    }

    return insights;
  }

  /**
   * Generate strengths from complementary trait patterns
   */
  private generateComplementaryStrengths(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    // High openness + high extraversion (social creativity)
    if (
      data.bigFive &&
      data.bigFive.openness > 70 &&
      data.bigFive.extraversion > 70
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId(
            'strength-complementary-social-creative',
            0
          ),
          title: 'Socially Creative Innovator',
          description:
            'Your combination of openness and extraversion makes you a charismatic innovator',
          explanation:
            "You don't just have creative ideas—you can sell them and inspire others to join you. This combination is powerful in entrepreneurship, marketing, teaching, and leadership. You make innovation accessible and exciting to others.",
          actionable:
            'Lead creative teams or innovative projects. Your ability to generate ideas AND get people excited about them is rare. Consider roles in creative leadership, innovation consulting, or entrepreneurship. You can change minds and inspire action.',
          confidence: 0.8,
          sources: ['bigFive'],
        },
        weight: 0.3,
        priority: 2,
      });
    }

    // Manifesting Generator with high conscientiousness
    if (
      data.humanDesign?.type === 'manifesting-generator' &&
      data.bigFive &&
      data.bigFive.conscientiousness > 70
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId(
            'strength-complementary-mg-disciplined',
            1
          ),
          title: 'Efficient Multi-Passionate Achiever',
          description:
            'Your Manifesting Generator energy with high conscientiousness creates powerful efficiency',
          explanation:
            "Manifesting Generators have sustainable energy and can do multiple things simultaneously. Combined with high conscientiousness, you can juggle multiple projects and actually complete them. You're efficient, energetic, and reliable—a rare combination.",
          actionable:
            'Embrace your multi-passionate nature while using your discipline to finish what you start. You can handle more than most people. Build systems that support your varied interests. Your ability to move quickly AND follow through is a superpower.',
          confidence: 0.78,
          sources: ['humanDesign', 'bigFive'],
        },
        weight: 0.28,
        priority: 2,
      });
    }

    return insights;
  }

  /**
   * Select top insights based on weight and priority
   */
  private selectTopInsights(
    candidates: InsightCandidate[],
    count: number
  ): Insight[] {
    return candidates
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
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
  private generateInsightId(type: string, index: number): string {
    return `${type}-${Date.now()}-${index}`;
  }
}

export const strengthEngine = new StrengthEngine();
