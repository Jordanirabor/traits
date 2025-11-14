import { Insight } from '@/types/insights';
import { PersonalityData } from '@/types/personality';

/**
 * Red Flag (Warning Signs) Engine
 * Generates realistic but non-fear-based relationship warnings
 */

interface InsightCandidate {
  insight: Insight;
  weight: number;
  priority: number;
}

export class RedFlagEngine {
  /**
   * Generate exactly 3 red flag insights
   * Attachment theory weighted at 50-60%
   */
  generateRedFlagInsights(data: PersonalityData): Insight[] {
    const candidates: InsightCandidate[] = [];

    // Priority 1: Attachment-based triggers (50-60% weight)
    candidates.push(...this.generateAttachmentRedFlags(data));

    // Priority 2: Big Five conflict patterns (25-30% weight)
    candidates.push(...this.generateBigFiveRedFlags(data));

    // Priority 3: MBTI incompatibility patterns (10-15% weight)
    candidates.push(...this.generateMBTIRedFlags(data));

    // Priority 4: Love Language mismatches (5-10% weight)
    candidates.push(...this.generateLoveLanguageRedFlags(data));

    // Select top 3 insights
    return this.selectTopInsights(candidates, 3);
  }

  /**
   * Generate attachment-based red flags (50-60% weight)
   */
  private generateAttachmentRedFlags(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.attachmentStyle) {
      return insights;
    }

    const attachmentRedFlags = {
      secure: {
        title: 'Watch for Emotional Unavailability',
        description:
          "Be cautious of partners who can't reciprocate your emotional openness",
        explanation:
          'As someone with secure attachment, your biggest risk is not recognizing insecure attachment in others until you\'re deeply invested. You might mistake avoidant behavior for "independence" or anxious behavior for "passion." Your security can make you too patient with unhealthy patterns.',
        actionable:
          'Red flags to watch for: They can\'t discuss feelings or future plans. They pull away when you get closer. They\'re inconsistent in communication. They have a pattern of short relationships. They dismiss your emotional needs as "too much." Trust your gut if something feels off.',
        confidence: 0.85,
      },
      anxious: {
        title: 'Avoid Avoidant and Inconsistent Partners',
        description:
          'Be very cautious of partners who are emotionally distant or unpredictable',
        explanation:
          'With anxious attachment, you\'re vulnerable to avoidant partners who will trigger your deepest fears. The push-pull dynamic feels like "chemistry" but it\'s actually your attachment system in distress. Inconsistent partners will keep you in a state of anxiety, preventing you from developing security.',
        actionable:
          "Red flags to watch for: They're hot and cold—intense then distant. They avoid commitment conversations. They don't respond to texts for days. They make you feel \"too needy\" for normal relationship needs. They have a pattern of leaving relationships. They can't handle your emotions.",
        confidence: 0.92,
      },
      avoidant: {
        title: 'Watch for Anxious or Clingy Partners',
        description:
          'Be cautious of partners whose need for closeness feels overwhelming',
        explanation:
          "With avoidant attachment, you're vulnerable to anxious partners who will trigger your need to withdraw. Their need for reassurance will feel suffocating, and your withdrawal will increase their anxiety—creating a painful cycle. You need someone who respects space, not someone who makes you feel guilty for needing it.",
        actionable:
          "Red flags to watch for: They need constant reassurance and contact. They get upset when you need alone time. They want to move very fast (love bombing). They don't have their own full life. They make you feel guilty for your independence. They can't self-soothe.",
        confidence: 0.88,
      },
      'fearful-avoidant': {
        title: 'Avoid Both Extremes: Avoidant and Anxious',
        description:
          'Be cautious of partners at either extreme of the attachment spectrum',
        explanation:
          "With fearful-avoidant attachment, you're vulnerable to both avoidant partners (who trigger your abandonment fears) and anxious partners (who trigger your engulfment fears). You need someone exceptionally secure, which is rare. Be especially careful not to mistake intensity or drama for connection.",
        actionable:
          "Red flags to watch for: They're either too distant or too intense. They have chaotic relationship histories. They can't handle your complexity. They react strongly to your push-pull patterns. They haven't done their own healing work. The relationship feels like a rollercoaster.",
        confidence: 0.9,
      },
    };

    const redFlag = attachmentRedFlags[data.attachmentStyle];
    if (redFlag) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-attachment', 0),
          ...redFlag,
          sources: ['attachmentStyle'],
        },
        weight: 0.55,
        priority: 1,
      });
    }

    return insights;
  }

  /**
   * Generate Big Five conflict pattern red flags (25-30% weight)
   */
  private generateBigFiveRedFlags(data: PersonalityData): InsightCandidate[] {
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

    // High neuroticism - avoid other high neuroticism
    if (neuroticism > 65) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-double-anxiety', 0),
          title: 'Avoid Highly Anxious or Reactive Partners',
          description:
            'Be cautious of partners with high neuroticism who will amplify your anxiety',
          explanation:
            "With your higher neuroticism, pairing with another highly anxious person creates an anxiety spiral. When you're both dysregulated, there's no one to provide grounding. You need someone who can stay calm when you're anxious, not someone who will panic with you.",
          actionable:
            "Red flags to watch for: They catastrophize situations with you. They can't calm you down because they're also spiraling. They have frequent emotional crises. They lack healthy coping mechanisms. Your anxiety feeds off each other. Neither of you can be the stable one.",
          confidence: 0.83,
          sources: ['bigFive'],
        },
        weight: 0.28,
        priority: 2,
      });
    }

    // High openness - avoid very low openness
    if (openness > 70) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-closed-minded', 1),
          title: 'Watch for Rigid or Close-Minded Partners',
          description:
            'Be cautious of partners who resist new ideas and prefer strict routines',
          explanation:
            'Your high openness means you need growth, exploration, and intellectual stimulation. Partners with very low openness will find you "too much," "impractical," or "weird." They\'ll resist your desire for new experiences and make you feel like you need to dim your curiosity.',
          actionable:
            'Red flags to watch for: They dismiss your ideas as impractical or weird. They resist trying new things. They need everything to be conventional. They mock your interests or creativity. They want you to "settle down" and be more traditional. They find your curiosity annoying.',
          confidence: 0.78,
          sources: ['bigFive'],
        },
        weight: 0.26,
        priority: 2,
      });
    }

    // Low conscientiousness - avoid judgmental partners
    if (conscientiousness < 40) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-judgmental', 2),
          title: 'Avoid Rigid or Judgmental Partners',
          description:
            'Be cautious of partners who are inflexible and critical of your spontaneity',
          explanation:
            "Your lower conscientiousness means you're flexible and spontaneous. While you can benefit from an organized partner, avoid someone who is rigidly perfectionistic or judgmental. They'll make you feel like you're constantly failing their standards, which is toxic.",
          actionable:
            'Red flags to watch for: They criticize your organization or habits constantly. They can\'t be flexible or spontaneous. They make you feel inadequate or lazy. They need everything done their way. They can\'t appreciate your strengths. They try to "fix" you.',
          confidence: 0.75,
          sources: ['bigFive'],
        },
        weight: 0.25,
        priority: 2,
      });
    }

    // High agreeableness - avoid exploitative partners
    if (agreeableness > 75) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-exploitative', 3),
          title: 'Watch for Partners Who Take Advantage',
          description:
            'Be cautious of partners who exploit your kindness and empathy',
          explanation:
            'Your high agreeableness is a strength, but it makes you vulnerable to people who will take advantage of your giving nature. You might ignore red flags because you empathize with their struggles or want to see the best in them. Your kindness should be valued, not exploited.',
          actionable:
            'Red flags to watch for: They take more than they give consistently. They guilt-trip you when you set boundaries. They have a victim mentality. They don\'t reciprocate your care. They expect you to sacrifice your needs. They call you "selfish" for basic boundaries.',
          confidence: 0.8,
          sources: ['bigFive'],
        },
        weight: 0.27,
        priority: 2,
      });
    }

    // Extreme extraversion mismatch
    if (extraversion > 70) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-social-mismatch-high', 4),
          title: 'Avoid Extremely Introverted Partners',
          description: 'Be cautious of partners who resent your social needs',
          explanation:
            'Your high extraversion means you need social interaction to feel alive. An extremely introverted partner will feel drained by your social needs and may resent your friendships or desire to go out. This creates a dynamic where you feel guilty for being yourself.',
          actionable:
            "Red flags to watch for: They make you feel guilty for wanting to socialize. They refuse to meet your friends or attend events. They complain about your social life. They want you home all the time. They don't have their own friends. They make you choose between them and your social needs.",
          confidence: 0.72,
          sources: ['bigFive'],
        },
        weight: 0.23,
        priority: 3,
      });
    } else if (extraversion < 30) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-social-mismatch-low', 5),
          title: 'Watch for Overly Social or Demanding Partners',
          description:
            "Be cautious of partners who don't respect your need for solitude",
          explanation:
            "Your introversion means you need alone time to recharge. A highly extraverted partner who doesn't understand this will make you feel guilty for needing space. They might interpret your need for solitude as rejection, creating constant conflict.",
          actionable:
            "Red flags to watch for: They take your need for alone time personally. They want constant social activities. They don't understand why you need to recharge. They pressure you to be more social. They make you feel like something is wrong with you for being introverted.",
          confidence: 0.73,
          sources: ['bigFive'],
        },
        weight: 0.23,
        priority: 3,
      });
    }

    return insights;
  }

  /**
   * Generate MBTI incompatibility red flags (10-15% weight)
   */
  private generateMBTIRedFlags(data: PersonalityData): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.mbti) {
      return insights;
    }

    // Intuitive types - avoid dismissive sensors
    if (data.mbti.includes('N')) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-sensor-dismissive', 0),
          title: 'Watch for Partners Who Dismiss Your Ideas',
          description:
            'Be cautious of highly practical partners who find your abstract thinking impractical',
          explanation:
            'As an intuitive type, you think in patterns and possibilities. Some sensor types (S) will find this frustrating and constantly tell you to "be more realistic" or "stop overthinking." This makes you feel misunderstood and stifled. You need someone who values your way of thinking.',
          actionable:
            "Red flags to watch for: They constantly call you impractical or unrealistic. They don't understand your metaphors or abstract thinking. They dismiss your ideas without consideration. They want everything to be concrete and literal. They make you feel like your thinking is wrong.",
          confidence: 0.68,
          sources: ['mbti'],
        },
        weight: 0.12,
        priority: 3,
      });
    }

    // Feeling types - avoid emotionally dismissive partners
    if (data.mbti.includes('F')) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-emotionally-dismissive', 1),
          title: 'Avoid Emotionally Dismissive Partners',
          description:
            'Be cautious of partners who mock or invalidate your emotional processing',
          explanation:
            'As a Feeling type, you process decisions through values and emotional impact. Some Thinking types will dismiss this as "illogical" or "too emotional," making you feel like your way of processing is wrong. You need someone who respects emotional intelligence, even if they process differently.',
          actionable:
            'Red flags to watch for: They call you "too emotional" or "irrational." They mock your feelings or empathy. They pride themselves on being "logical" in a way that dismisses emotions. They can\'t validate your feelings. They make you feel weak for caring about people.',
          confidence: 0.7,
          sources: ['mbti'],
        },
        weight: 0.11,
        priority: 3,
      });
    }

    return insights;
  }

  /**
   * Generate Love Language mismatch red flags (5-10% weight)
   */
  private generateLoveLanguageRedFlags(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.loveLanguages || data.loveLanguages.length === 0) {
      return insights;
    }

    const topLanguage = data.loveLanguages.find((l) => l.rank === 1);
    if (!topLanguage) {
      return insights;
    }

    const loveLanguageRedFlags = {
      'words-of-affirmation': {
        title: 'Avoid Emotionally Unexpressive Partners',
        description:
          "Be cautious of partners who can't or won't verbally express affection",
        explanation:
          "Your primary love language is Words of Affirmation—you need verbal expressions of love. Partners who are silent or uncomfortable with verbal affection will leave you feeling unloved, even if they show love in other ways. You'll constantly wonder if they care.",
        actionable:
          'Red flags to watch for: They never say "I love you" or give compliments. They mock your need for verbal affirmation. They say "you should just know" instead of expressing feelings. They\'re uncomfortable with emotional expression. They think words don\'t matter.',
        confidence: 0.74,
      },
      'quality-time': {
        title: 'Watch for Distracted or Unavailable Partners',
        description:
          "Be cautious of partners who can't give you undivided attention",
        explanation:
          "Your primary love language is Quality Time—you need focused, present attention. Partners who are always on their phone, working, or distracted will make you feel invisible and unimportant. You'll feel lonely even when you're together.",
        actionable:
          "Red flags to watch for: They're always on their phone when with you. They cancel plans frequently. They can't be present without distractions. They prioritize work or hobbies over time together. They don't plan dates or quality time. You feel alone even when together.",
        confidence: 0.76,
      },
      'acts-of-service': {
        title: "Avoid Partners Who Don't Follow Through",
        description:
          "Be cautious of partners who make promises but don't take action",
        explanation:
          "Your primary love language is Acts of Service—you need actions, not just words. Partners who say they love you but never help or follow through will leave you feeling unsupported. You'll end up doing everything while they just talk.",
        actionable:
          "Red flags to watch for: They make promises but don't follow through. They never help without being asked repeatedly. They say they love you but don't show it through actions. They expect you to do everything. They don't notice what needs doing.",
        confidence: 0.75,
      },
      'physical-touch': {
        title: 'Watch for Physically Distant Partners',
        description:
          'Be cautious of partners who are uncomfortable with physical affection',
        explanation:
          'Your primary love language is Physical Touch—you need regular physical affection. Partners who are uncomfortable with touch or find your need for it "clingy" will make you feel rejected and unloved. Physical distance will feel like emotional rejection.',
        actionable:
          'Red flags to watch for: They pull away from your touch. They never initiate physical affection. They mock your need for touch as "clingy." They\'re uncomfortable with any public affection. They make you feel bad for wanting physical connection.',
        confidence: 0.77,
      },
      gifts: {
        title: 'Avoid Partners Who Dismiss Thoughtfulness',
        description:
          "Be cautious of partners who don't understand the symbolic value of gifts",
        explanation:
          'Your primary love language is Receiving Gifts—you value thoughtful gestures and symbols of love. Partners who mock this as "materialistic" or never remember important dates will make you feel uncared for. It\'s not about money; it\'s about thoughtfulness.',
        actionable:
          "Red flags to watch for: They forget birthdays and anniversaries consistently. They mock your appreciation for gifts. They never give thoughtful presents. They call you materialistic. They don't understand that gifts symbolize love to you.",
        confidence: 0.7,
      },
    };

    const redFlag = loveLanguageRedFlags[topLanguage.type];
    if (redFlag) {
      insights.push({
        insight: {
          id: this.generateInsightId('red-flag-love-language', 0),
          ...redFlag,
          sources: ['loveLanguages'],
        },
        weight: 0.08,
        priority: 4,
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

export const redFlagEngine = new RedFlagEngine();
