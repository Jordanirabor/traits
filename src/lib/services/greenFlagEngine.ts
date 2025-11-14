import { Insight } from '@/types/insights';
import { PersonalityData } from '@/types/personality';

/**
 * Green Flag (Positive Compatibility) Engine
 * Generates relationship compatibility recommendations with attachment theory weighting
 */

interface InsightCandidate {
  insight: Insight;
  weight: number;
  priority: number;
}

export class GreenFlagEngine {
  /**
   * Generate exactly 3 green flag insights
   * Attachment theory weighted at 50-60%
   */
  generateGreenFlagInsights(data: PersonalityData): Insight[] {
    const candidates: InsightCandidate[] = [];

    // Priority 1: Attachment-based compatibility (50-60% weight)
    candidates.push(...this.generateAttachmentGreenFlags(data));

    // Priority 2: Big Five complementary traits (25-30% weight)
    candidates.push(...this.generateBigFiveGreenFlags(data));

    // Priority 3: MBTI compatibility patterns (10-15% weight)
    candidates.push(...this.generateMBTIGreenFlags(data));

    // Priority 4: Love Language alignment (5-10% weight)
    candidates.push(...this.generateLoveLanguageGreenFlags(data));

    // Select top 3 insights
    return this.selectTopInsights(candidates, 3);
  }

  /**
   * Generate attachment-based green flags (50-60% weight)
   */
  private generateAttachmentGreenFlags(
    data: PersonalityData
  ): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.attachmentStyle) {
      return insights;
    }

    const attachmentGreenFlags = {
      secure: {
        title: 'Seek Another Secure Partner',
        description:
          'Look for partners who are comfortable with both intimacy and independence',
        explanation:
          "As someone with secure attachment, you'll thrive most with another secure partner. Look for someone who can communicate their needs directly, doesn't play games, handles conflict constructively, and is comfortable with both closeness and space. Secure-secure pairings have the highest relationship satisfaction.",
        actionable:
          "Green flags to watch for: They communicate clearly about their feelings and needs. They're comfortable with commitment but don't rush it. They can handle disagreements without shutting down or escalating. They have healthy friendships and family relationships. They trust you without being controlling.",
        confidence: 0.92,
      },
      anxious: {
        title: 'Prioritize Secure, Consistent Partners',
        description:
          'Seek partners who provide consistent reassurance and emotional availability',
        explanation:
          'With anxious attachment, you need a partner who is reliably responsive and emotionally available. Secure partners are ideal—they can provide the consistency you need without feeling smothered. Avoid avoidant partners who will trigger your anxiety. The right partner will make you feel safe enough to develop more security yourself.',
        actionable:
          "Green flags to watch for: They respond to texts/calls consistently. They're comfortable with emotional expression and don't dismiss your feelings. They proactively reassure you. They're patient with your need for connection. They have secure friendships. They don't pull away when you express needs.",
        confidence: 0.9,
      },
      avoidant: {
        title: 'Find Patient, Secure Partners',
        description:
          'Look for partners who respect your need for space while gently encouraging intimacy',
        explanation:
          "With avoidant attachment, you need a secure partner who won't take your need for space personally but also won't let you completely withdraw. They should be comfortable with slower relationship progression and respect your independence while creating safety for vulnerability. Avoid anxious partners who will feel rejected by your need for space.",
        actionable:
          "Green flags to watch for: They give you space without playing games. They're secure enough not to take your independence personally. They communicate their needs clearly without being demanding. They have their own full life and interests. They gently encourage emotional sharing without pressure.",
        confidence: 0.88,
      },
      'fearful-avoidant': {
        title: 'Seek Exceptionally Secure, Patient Partners',
        description:
          'Look for partners with strong secure attachment who can handle your push-pull dynamic',
        explanation:
          'With fearful-avoidant attachment, you need an exceptionally secure partner who can remain stable through your push-pull patterns. They need to be patient, non-reactive, and willing to work through your fears without taking them personally. This is challenging—consider working on your attachment in therapy before or during a relationship.',
        actionable:
          'Green flags to watch for: They remain calm and consistent even when you push away. They have done their own therapy/healing work. They can set boundaries without being harsh. They\'re comfortable with complexity and don\'t need you to be "easy." They encourage therapy and personal growth.',
        confidence: 0.91,
      },
    };

    const greenFlag = attachmentGreenFlags[data.attachmentStyle];
    if (greenFlag) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-attachment', 0),
          ...greenFlag,
          sources: ['attachmentStyle'],
        },
        weight: 0.55,
        priority: 1,
      });
    }

    return insights;
  }

  /**
   * Generate Big Five complementary trait green flags (25-30% weight)
   */
  private generateBigFiveGreenFlags(data: PersonalityData): InsightCandidate[] {
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

    // High neuroticism needs emotionally stable partner
    if (neuroticism > 65) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-stability', 0),
          title: 'Seek Emotionally Stable Partners',
          description:
            'Look for partners with low neuroticism who can provide emotional grounding',
          explanation:
            "With your higher neuroticism, you'll benefit from a partner who is emotionally stable and calm. They can help regulate your emotional intensity without dismissing your feelings. Two highly neurotic people together can create an anxiety spiral. Look for someone who stays calm in storms.",
          actionable:
            "Green flags to watch for: They remain calm during conflicts or stress. They don't catastrophize or spiral with you. They can soothe your anxiety without invalidating it. They have healthy coping mechanisms. They're not easily rattled by your emotional intensity.",
          confidence: 0.82,
          sources: ['bigFive'],
        },
        weight: 0.28,
        priority: 2,
      });
    }

    // Low conscientiousness benefits from organized partner
    if (conscientiousness < 40) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-organization', 1),
          title: 'Value Organized, Reliable Partners',
          description:
            'Seek partners with higher conscientiousness who can complement your spontaneity',
          explanation:
            "Your lower conscientiousness means you're flexible and spontaneous, but you'll benefit from a partner who brings structure and follow-through. They can handle the logistics while you bring creativity and adaptability. This creates a balanced partnership where both strengths shine.",
          actionable:
            "Green flags to watch for: They naturally handle planning and organization. They follow through on commitments reliably. They don't judge your spontaneity but help channel it. They enjoy taking care of practical details. They appreciate your flexibility.",
          confidence: 0.75,
          sources: ['bigFive'],
        },
        weight: 0.25,
        priority: 2,
      });
    }

    // High openness needs intellectually curious partner
    if (openness > 70) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-curiosity', 2),
          title: 'Prioritize Intellectually Curious Partners',
          description:
            'Look for partners who share your love of ideas, growth, and new experiences',
          explanation:
            'Your high openness means you need mental stimulation and growth in relationships. A partner with low openness will feel boring to you, and you\'ll feel "too much" to them. Seek someone who enjoys deep conversations, trying new things, and exploring ideas together.',
          actionable:
            "Green flags to watch for: They enjoy deep, philosophical conversations. They're excited to try new experiences with you. They read, learn, and grow continuously. They appreciate your creativity and unique perspectives. They don't need everything to be conventional.",
          confidence: 0.8,
          sources: ['bigFive'],
        },
        weight: 0.27,
        priority: 2,
      });
    }

    // Extraversion compatibility (similar levels work best)
    if (extraversion > 65) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-social-energy', 3),
          title: 'Find Socially Energetic Partners',
          description:
            'Seek partners who match your social energy and enjoy an active social life',
          explanation:
            'Your high extraversion means you need a partner who either matches your social energy or is secure enough to support your social needs without joining every time. Introverted partners may feel drained by your social needs, leading to resentment.',
          actionable:
            "Green flags to watch for: They enjoy socializing and meeting new people. They have their own friend groups and social interests. They don't make you feel guilty for your social needs. They can match your energy for activities and adventures.",
          confidence: 0.73,
          sources: ['bigFive'],
        },
        weight: 0.24,
        priority: 2,
      });
    } else if (extraversion < 35) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-quiet-energy', 4),
          title: 'Seek Partners Who Value Quiet Connection',
          description:
            'Look for partners who appreciate depth over breadth in social connection',
          explanation:
            "Your introversion means you need a partner who values quality time together and doesn't pressure you into constant socializing. Another introvert or a secure ambivert works well. Highly extraverted partners may feel neglected by your need for alone time.",
          actionable:
            'Green flags to watch for: They enjoy quiet evenings at home. They have a few close friends rather than a huge social circle. They respect your need for alone time to recharge. They find depth and intimacy in one-on-one connection.',
          confidence: 0.74,
          sources: ['bigFive'],
        },
        weight: 0.24,
        priority: 2,
      });
    }

    return insights;
  }

  /**
   * Generate MBTI compatibility green flags (10-15% weight)
   */
  private generateMBTIGreenFlags(data: PersonalityData): InsightCandidate[] {
    const insights: InsightCandidate[] = [];

    if (!data.mbti) {
      return insights;
    }

    // Intuitive types (N) need other intuitives
    if (data.mbti.includes('N')) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-intuitive', 0),
          title: 'Seek Fellow Intuitive Types',
          description:
            'Look for partners who think abstractly and enjoy exploring possibilities',
          explanation:
            "As an intuitive type, you think in patterns, possibilities, and abstract concepts. Sensor types (S) focus on concrete details and present reality. While not impossible, N-S pairings often struggle with communication—you'll feel misunderstood, and they'll find you impractical. Fellow intuitives speak your language.",
          actionable:
            'Green flags to watch for: They enjoy discussing ideas, theories, and future possibilities. They understand your metaphors and abstract thinking. They don\'t constantly ask you to "be more practical." They see the big picture like you do.',
          confidence: 0.7,
          sources: ['mbti'],
        },
        weight: 0.12,
        priority: 3,
      });
    }

    // Thinking types (T) with Feeling types (F) can complement
    if (data.mbti.includes('F')) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-emotional-intelligence', 1),
          title: 'Value Emotional Intelligence in Partners',
          description:
            'Seek partners who prioritize emotional connection and empathy',
          explanation:
            'As a Feeling type, you make decisions based on values and impact on people. You need a partner who either shares this (another F) or deeply respects it (a mature T). Partners who dismiss emotions as "illogical" will hurt you. Look for emotional intelligence regardless of type.',
          actionable:
            "Green flags to watch for: They consider how decisions affect people. They validate your feelings even if they don't fully understand them. They show empathy and emotional awareness. They don't mock or dismiss emotional processing.",
          confidence: 0.68,
          sources: ['mbti'],
        },
        weight: 0.11,
        priority: 3,
      });
    }

    return insights;
  }

  /**
   * Generate Love Language green flags (5-10% weight)
   */
  private generateLoveLanguageGreenFlags(
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

    const loveLanguageGreenFlags = {
      'words-of-affirmation': {
        title: 'Seek Verbally Expressive Partners',
        description:
          'Look for partners who naturally express appreciation and affection verbally',
        explanation:
          'Your primary love language is Words of Affirmation—you feel most loved through verbal expressions of care, appreciation, and encouragement. You need a partner who is comfortable saying "I love you," giving compliments, and verbally affirming you regularly. Silent love won\'t feel like love to you.',
        actionable:
          'Green flags to watch for: They compliment you genuinely and often. They verbally express their feelings. They send sweet texts or leave notes. They tell you specifically what they appreciate about you. They\'re comfortable saying "I love you."',
        confidence: 0.76,
      },
      'quality-time': {
        title: 'Prioritize Present, Attentive Partners',
        description:
          'Seek partners who value undivided attention and meaningful time together',
        explanation:
          'Your primary love language is Quality Time—you feel most loved when someone gives you their full, undivided attention. You need a partner who puts away their phone, plans dates, and creates space for connection. Distracted presence feels like rejection to you.',
        actionable:
          "Green flags to watch for: They put their phone away during conversations. They plan dates and activities together. They create rituals for connection. They're fully present when with you. They prioritize one-on-one time.",
        confidence: 0.78,
      },
      'acts-of-service': {
        title: 'Value Partners Who Show Love Through Actions',
        description:
          'Look for partners who naturally help, support, and lighten your load',
        explanation:
          'Your primary love language is Acts of Service—you feel most loved when someone does things to make your life easier. You need a partner who notices what needs doing and does it without being asked. Words without actions feel empty to you.',
        actionable:
          'Green flags to watch for: They help without being asked. They notice what would make your life easier. They follow through on promises. They take care of practical things. They show love through helpful actions.',
        confidence: 0.77,
      },
      'physical-touch': {
        title: 'Seek Naturally Affectionate Partners',
        description:
          'Look for partners who are comfortable with frequent physical affection',
        explanation:
          "Your primary love language is Physical Touch—you feel most loved through physical affection, from hand-holding to hugs to sexual intimacy. You need a partner who is naturally touchy and doesn't find your need for physical connection clingy. Physical distance feels like emotional distance to you.",
        actionable:
          "Green flags to watch for: They initiate physical affection regularly. They're comfortable with public displays of affection. They cuddle, hold hands, and touch you often. They don't pull away from your touch. They understand your need for physical connection.",
        confidence: 0.79,
      },
      gifts: {
        title: 'Appreciate Thoughtful, Symbolic Partners',
        description:
          'Seek partners who express love through thoughtful gifts and gestures',
        explanation:
          "Your primary love language is Receiving Gifts—you feel most loved when someone gives you thoughtful gifts that show they were thinking of you. This isn't about materialism; it's about the thought and symbolism. You need a partner who understands that gifts represent love to you.",
        actionable:
          "Green flags to watch for: They give thoughtful gifts (not necessarily expensive). They remember important dates. They bring you small surprises. They understand the symbolic meaning of gifts. They don't mock your appreciation for presents.",
        confidence: 0.72,
      },
    };

    const greenFlag = loveLanguageGreenFlags[topLanguage.type];
    if (greenFlag) {
      insights.push({
        insight: {
          id: this.generateInsightId('green-flag-love-language', 0),
          ...greenFlag,
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

export const greenFlagEngine = new GreenFlagEngine();
