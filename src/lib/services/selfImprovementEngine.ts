import { Insight } from '@/types/insights';
import { PersonalityData } from '@/types/personality';

/**
 * Self-Improvement Insight Generation Engine
 * Focuses on growth opportunities, contradictions, and actionable recommendations
 */

interface InsightCandidate {
  insight: Insight;
  weight: number;
  priority: number;
}

export class SelfImprovementEngine {
  /**
   * Generate exactly 3 self-improvement insights
   */
  generateSelfImprovementInsights(data: PersonalityData): Insight[] {
    const candidates: InsightCandidate[] = [];

    // Priority 1: Attachment-based insights (40% weight)
    candidates.push(...this.generateAttachmentInsights(data));

    // Priority 2: Big Five low scores (30% weight)
    candidates.push(...this.generateBigFiveInsights(data));

    // Priority 3: Cross-framework contradictions (30% weight)
    candidates.push(...this.generateContradictionInsights(data));

    // Select top 3 insights
    return this.selectTopInsights(candidates, 3);
  }

  /**
   * Generate attachment-based self-improvement insights
   */
  private generateAttachmentInsights(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.attachmentStyle || data.attachmentStyle === 'secure') {
      return insights;
    }

    const attachmentInsights = {
      anxious: {
        title: 'Building Emotional Self-Reliance',
        description:
          'Your anxious attachment style suggests you may seek excessive reassurance in relationships',
        explanation:
          'Anxious attachment often develops from inconsistent caregiving in childhood. This pattern can lead to relationship anxiety and fear of abandonment. The good news is that attachment styles can evolve with awareness and practice.',
        actionable:
          'Practice self-soothing techniques when feeling anxious. Start a daily journaling practice to identify triggers. Consider therapy focused on attachment work, particularly EMDR or somatic experiencing.',
        confidence: 0.85,
      },
      avoidant: {
        title: 'Embracing Emotional Vulnerability',
        description:
          'Your avoidant attachment style indicates you may struggle with emotional intimacy',
        explanation:
          'Avoidant attachment typically forms as a protective mechanism when emotional needs were dismissed or overwhelming. While independence is valuable, deep connections require vulnerability.',
        actionable:
          'Start small by sharing one feeling daily with someone you trust. Practice staying present during emotional conversations instead of withdrawing. Explore therapy to understand your emotional patterns.',
        confidence: 0.85,
      },
      'fearful-avoidant': {
        title: 'Navigating the Push-Pull Dynamic',
        description:
          'Your fearful-avoidant attachment creates a challenging push-pull pattern in relationships',
        explanation:
          'Fearful-avoidant attachment combines both anxious and avoidant patterns, creating internal conflict between wanting closeness and fearing it. This is often the result of trauma or highly inconsistent caregiving.',
        actionable:
          'Work with a trauma-informed therapist who specializes in attachment. Practice grounding techniques when feeling overwhelmed. Build awareness of your push-pull patterns through mindful observation.',
        confidence: 0.9,
      },
    };

    const insight = attachmentInsights[data.attachmentStyle];
    if (insight) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-attachment', 0),
          ...insight,
          sources: ['attachmentStyle'],
        },
        weight: 0.4,
        priority: 1,
      });
    }

    // Additional insight for anxious + high neuroticism
    if (
      data.attachmentStyle === 'anxious' &&
      data.bigFive &&
      data.bigFive.neuroticism > 70
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-anxiety', 1),
          title: 'Managing Heightened Emotional Sensitivity',
          description:
            'Your combination of anxious attachment and high neuroticism creates intense emotional experiences',
          explanation:
            "When anxious attachment combines with high neuroticism, emotional reactions can feel overwhelming. This isn't a flaw—it's heightened sensitivity that needs specific tools to manage effectively.",
          actionable:
            'Develop a daily mindfulness practice (even 5 minutes helps). Learn the "RAIN" technique (Recognize, Allow, Investigate, Nurture) for intense emotions. Consider medication evaluation with a psychiatrist if anxiety is debilitating.',
          confidence: 0.88,
          sources: ['attachmentStyle', 'bigFive'],
        },
        weight: 0.45,
        priority: 1,
      });
    }

    return insights;
  }

  /**
   * Generate Big Five-based self-improvement insights
   */
  private generateBigFiveInsights(data: PersonalityData): InsightCandidate[] {
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

    // Low conscientiousness
    if (conscientiousness < 40) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-conscientiousness', 0),
          title: 'Building Sustainable Organization Systems',
          description:
            'Your lower conscientiousness score suggests organization and follow-through may be challenging',
          explanation:
            "Low conscientiousness isn't about being lazy—it often means you're more spontaneous and flexible. However, modern life requires some structure. The key is building systems that work with your natural tendencies, not against them.",
          actionable:
            'Use external systems instead of willpower: set phone reminders, use habit-stacking (attach new habits to existing ones), and create visible cues. Start with ONE small habit and build from there. Consider body-doubling or accountability partners.',
          confidence: 0.75,
          sources: ['bigFive'],
        },
        weight: 0.3,
        priority: 2,
      });
    }

    // High neuroticism
    if (neuroticism > 70) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-neuroticism', 1),
          title: 'Developing Emotional Regulation Skills',
          description:
            'Your high neuroticism score indicates you experience emotions intensely and frequently',
          explanation:
            "High neuroticism means your emotional system is highly responsive—you feel things deeply. While this can be exhausting, it also means you're capable of profound empathy and awareness. The goal isn't to feel less, but to regulate more effectively.",
          actionable:
            'Learn and practice emotional regulation techniques: box breathing (4-4-4-4), progressive muscle relaxation, or the 5-4-3-2-1 grounding technique. Regular exercise significantly reduces neuroticism. Consider CBT or DBT therapy.',
          confidence: 0.8,
          sources: ['bigFive'],
        },
        weight: 0.32,
        priority: 2,
      });
    }

    // Low agreeableness
    if (agreeableness < 40) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-agreeableness', 2),
          title: 'Balancing Assertiveness with Collaboration',
          description:
            'Your lower agreeableness suggests you prioritize honesty and independence over harmony',
          explanation:
            "Low agreeableness isn't about being mean—it often indicates strong boundaries and directness. However, relationships require some compromise and empathy. You can maintain your authenticity while developing collaborative skills.",
          actionable:
            'Practice perspective-taking: before responding, ask "What might they be feeling?" Use "I" statements to express disagreement without attacking. Recognize when to prioritize the relationship over being right.',
          confidence: 0.72,
          sources: ['bigFive'],
        },
        weight: 0.28,
        priority: 2,
      });
    }

    // Low extraversion (only if significantly low)
    if (extraversion < 30) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-extraversion', 3),
          title: 'Managing Social Energy Strategically',
          description:
            'Your low extraversion means social interaction drains rather than energizes you',
          explanation:
            "Being introverted in an extraverted world can feel exhausting. The key is honoring your need for solitude while maintaining necessary social connections. You don't need to become extraverted—you need strategies that work for your energy system.",
          actionable:
            'Schedule recovery time after social events. Communicate your needs clearly ("I need to recharge alone"). Choose quality over quantity in friendships. Find social activities that align with your interests rather than forcing small talk.',
          confidence: 0.7,
          sources: ['bigFive'],
        },
        weight: 0.25,
        priority: 3,
      });
    }

    return insights;
  }

  /**
   * Generate insights from cross-framework contradictions
   */
  private generateContradictionInsights(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    // MBTI vs Big Five extraversion contradiction
    if (data.mbti && data.bigFive) {
      const mbtiIsExtraverted = data.mbti.startsWith('E');
      const bigFiveExtraversion = data.bigFive.extraversion;

      if (mbtiIsExtraverted && bigFiveExtraversion < 40) {
        insights.push({
          insight: {
            id: this.generateInsightId(
              'self-improvement-contradiction-extraversion',
              0
            ),
            title: 'Understanding Your Social Energy Paradox',
            description:
              'Your MBTI suggests extraversion, but your Big Five score indicates introversion',
            explanation:
              'This contradiction often means you enjoy social interaction in specific contexts (like discussing ideas) but find general socializing draining. You might be a "social introvert" or have developed extraverted behaviors that don\'t match your natural energy patterns.',
            actionable:
              'Identify which social situations energize vs. drain you. Honor your need for alone time even if you seem outgoing. Choose social activities that align with your interests and values rather than forcing yourself into typical "extraverted" activities.',
            confidence: 0.7,
            sources: ['mbti', 'bigFive'],
          },
          weight: 0.3,
          priority: 2,
        });
      } else if (!mbtiIsExtraverted && bigFiveExtraversion > 60) {
        insights.push({
          insight: {
            id: this.generateInsightId(
              'self-improvement-contradiction-introversion',
              1
            ),
            title: 'Reconciling Your Social Identity',
            description:
              'Your MBTI suggests introversion, but your Big Five score indicates extraversion',
            explanation:
              'This pattern might indicate you\'ve identified as introverted due to social anxiety or past experiences, but you actually gain energy from social interaction. Or you might be an "extraverted introvert" who needs people but in specific ways.',
            actionable:
              'Experiment with different types of social engagement. Notice when you feel energized vs. drained. Consider whether social anxiety or past experiences have shaped your self-perception. You might benefit from gradually expanding your social comfort zone.',
            confidence: 0.68,
            sources: ['mbti', 'bigFive'],
          },
          weight: 0.28,
          priority: 2,
        });
      }
    }

    // Projector Human Design with low conscientiousness
    if (
      data.humanDesign?.type === 'projector' &&
      data.bigFive &&
      data.bigFive.conscientiousness < 40
    ) {
      insights.push({
        insight: {
          id: this.generateInsightId('self-improvement-projector-systems', 2),
          title: 'Creating Systems for Your Projector Energy',
          description:
            'As a Projector with low conscientiousness, you need external structure to thrive',
          explanation:
            "Projectors aren't designed to work like Generators—you need rest and recognition. Combined with low conscientiousness, traditional productivity advice won't work. You need systems designed for your specific energy type.",
          actionable:
            'Work in focused bursts with significant rest between. Wait for invitations and recognition before offering guidance. Create visual systems and external accountability. Your value is in insight, not constant output.',
          confidence: 0.73,
          sources: ['humanDesign', 'bigFive'],
        },
        weight: 0.3,
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

export const selfImprovementEngine = new SelfImprovementEngine();
