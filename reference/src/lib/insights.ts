import { PersonalityData, BigFiveScores } from "./storage";

export interface Insight {
  title: string;
  description: string;
  reasoning: string;
}

export interface Insights {
  selfImprovement: Insight[];
  strengths: Insight[];
  greenFlags: Insight[];
  redFlags: Insight[];
}

export const generateInsights = (data: PersonalityData): Insights => {
  return {
    selfImprovement: generateSelfImprovementInsights(data),
    strengths: generateStrengthInsights(data),
    greenFlags: generateGreenFlags(data),
    redFlags: generateRedFlags(data),
  };
};

const generateSelfImprovementInsights = (data: PersonalityData): Insight[] => {
  const insights: Insight[] = [];
  const bigFive = data.bigFive;
  const usedTitles = new Set<string>();

  const addUniqueInsight = (insight: Insight) => {
    if (!usedTitles.has(insight.title) && insights.length < 3) {
      insights.push(insight);
      usedTitles.add(insight.title);
    }
  };

  if (bigFive) {
    if (bigFive.conscientiousness < 40) {
      addUniqueInsight({
        title: "Building Structure & Organization",
        description: "Your flexible approach to life offers creativity, but developing organizational systems could help you achieve goals more consistently. Try setting small, achievable daily routines to build momentum without feeling restricted.",
        reasoning: `Your conscientiousness score of ${bigFive.conscientiousness}% suggests a spontaneous nature that may benefit from gentle structure to enhance productivity.`
      });
    }

    if (bigFive.neuroticism > 60) {
      addUniqueInsight({
        title: "Emotional Resilience Practice",
        description: "Your emotional sensitivity is a gift that helps you connect deeply with others. Complement this with mindfulness practices or journaling to process intense feelings and build resilience during challenging times.",
        reasoning: `With neuroticism at ${bigFive.neuroticism}%, you experience emotions intensely, which can be channeled into deeper self-awareness through mindfulness techniques.`
      });
    }

    if (bigFive.extraversion < 40) {
      addUniqueInsight({
        title: "Expanding Social Comfort Zones",
        description: "Your introspective nature brings depth to relationships. Consider gradually expanding your social circle in low-pressure settings that align with your interests, allowing meaningful connections to develop naturally.",
        reasoning: `Your extraversion score of ${bigFive.extraversion}% indicates introverted tendencies that benefit from intentional, low-pressure social expansion.`
      });
    }
  }

  if (data.attachmentStyle === "anxious" || data.attachmentStyle === "avoidant") {
    addUniqueInsight({
      title: "Developing Secure Attachment Patterns",
      description: "Understanding your attachment style is the first step. Practice communicating your needs clearly in relationships and notice when old patterns emerge. Therapy or attachment-focused self-work can help you move toward more secure relating.",
      reasoning: `Your ${data.attachmentStyle} attachment style can create relationship challenges that are addressable through awareness and intentional practice.`
    });
  }

  if (bigFive && bigFive.agreeableness > 70) {
    addUniqueInsight({
      title: "Balancing Kindness with Boundaries",
      description: "Your compassionate nature is admirable, but setting healthy boundaries will protect your energy and relationships. Practice saying 'no' to requests that don't align with your values or capacity.",
      reasoning: `High agreeableness (${bigFive.agreeableness}%) means you naturally prioritize others, which can lead to overextension without clear boundaries.`
    });
  }

  if (data.enneagram === "2") {
    addUniqueInsight({
      title: "Recognizing Your Own Needs",
      description: "As a Helper, you're excellent at meeting others' needs but may neglect your own. Practice identifying and voicing your needs without guilt. Your well-being matters just as much as others'.",
      reasoning: `Enneagram Type 2s often struggle with self-care while focusing heavily on others' needs, which can lead to burnout.`
    });
  }

  if (data.enneagram === "1") {
    addUniqueInsight({
      title: "Embracing Imperfection",
      description: "Your high standards drive excellence, but perfectionism can be exhausting. Practice self-compassion and recognize that 'good enough' is often truly good enough. Progress matters more than perfection.",
      reasoning: `Type 1 Reformers have a strong inner critic that can create stress; learning to accept imperfection reduces anxiety.`
    });
  }

  if (data.enneagram === "9") {
    addUniqueInsight({
      title: "Expressing Your Opinions",
      description: "Your peacekeeping nature is valuable, but your voice matters too. Practice sharing your preferences and opinions, even when they differ from others. Your perspective deserves to be heard.",
      reasoning: `Type 9 Peacemakers often minimize their own desires to avoid conflict, which can lead to loss of self.`
    });
  }

  // Ensure at least one insight is always present
  if (insights.length === 0) {
    insights.push({
      title: "Self-Awareness Journey",
      description: "Understanding yourself is the first step toward growth. As you explore different personality frameworks, you'll gain insights into patterns that shape your relationships and decisions. Keep reflecting on what resonates with you.",
      reasoning: "Self-awareness through personality assessment provides a foundation for personal development and improved relationships."
    });
  }

  return insights;
};

const generateStrengthInsights = (data: PersonalityData): Insight[] => {
  const insights: Insight[] = [];
  const bigFive = data.bigFive;
  const usedTitles = new Set<string>();

  const addUniqueInsight = (insight: Insight) => {
    if (!usedTitles.has(insight.title) && insights.length < 3) {
      insights.push(insight);
      usedTitles.add(insight.title);
    }
  };

  if (bigFive) {
    if (bigFive.openness > 60) {
      addUniqueInsight({
        title: "Creative Problem-Solving Ability",
        description: "Your high openness means you naturally see possibilities others miss. This makes you excellent at innovation, adapting to change, and bringing fresh perspectives to challenges. Leverage this in projects that need creative solutions.",
        reasoning: `Openness score of ${bigFive.openness}% indicates exceptional curiosity and creative thinking that drives innovation.`
      });
    }

    if (bigFive.conscientiousness > 60) {
      addUniqueInsight({
        title: "Reliable & Goal-Oriented",
        description: "Your strong conscientiousness makes you someone others can count on. You follow through on commitments and achieve long-term goals through consistent effort. This is invaluable in both professional and personal contexts.",
        reasoning: `Conscientiousness at ${bigFive.conscientiousness}% shows strong self-discipline and dependability that others value highly.`
      });
    }

    if (bigFive.agreeableness > 60) {
      addUniqueInsight({
        title: "Natural Relationship Builder",
        description: "Your empathy and cooperative nature help you create harmonious relationships. People feel understood around you, making you an excellent mediator, friend, and team member who brings out the best in others.",
        reasoning: `With agreeableness at ${bigFive.agreeableness}%, you possess exceptional emotional intelligence and collaboration skills.`
      });
    }

    if (bigFive.extraversion > 60) {
      addUniqueInsight({
        title: "Energizing Social Presence",
        description: "Your extraverted energy brings vitality to groups and helps others feel engaged. You're skilled at networking, public speaking, and creating connections that benefit everyone involved.",
        reasoning: `Extraversion score of ${bigFive.extraversion}% reflects natural social confidence and ability to energize others.`
      });
    }
  }

  if (data.attachmentStyle === "secure") {
    addUniqueInsight({
      title: "Secure Attachment Foundation",
      description: "Your secure attachment style is a tremendous strength. You can be intimate without losing yourself and independent without pushing others away. This balance makes you a stable, trustworthy presence in relationships.",
      reasoning: `Secure attachment is the healthiest attachment pattern, enabling balanced intimacy and independence in relationships.`
    });
  }

  if (data.enneagram === "3") {
    addUniqueInsight({
      title: "Driven Achievement Motivation",
      description: "Your Achiever energy makes you excellent at setting and reaching goals. You inspire others with your dedication and demonstrate what's possible through focused effort and adaptability.",
      reasoning: `Type 3 Achievers possess exceptional drive and ability to succeed, which motivates teams and creates positive momentum.`
    });
  }

  if (data.enneagram === "8") {
    addUniqueInsight({
      title: "Protective Leadership Strength",
      description: "Your Challenger nature gives you natural leadership and the courage to stand up for others. You're direct, decisive, and protect those who can't protect themselves.",
      reasoning: `Type 8 Challengers possess remarkable strength and willingness to confront injustice, making them powerful advocates.`
    });
  }

  if (data.enneagram === "7") {
    addUniqueInsight({
      title: "Optimistic Energy & Versatility",
      description: "Your Enthusiast spirit brings joy and possibility thinking to every situation. You help others see opportunities and maintain morale during challenging times with your natural optimism.",
      reasoning: `Type 7 Enthusiasts have exceptional ability to reframe challenges positively and maintain momentum through difficult periods.`
    });
  }

  // Ensure at least one insight is always present
  if (insights.length === 0) {
    insights.push({
      title: "Authentic Self-Expression",
      description: "Your unique combination of traits creates your personal strengths. Embrace what makes you distinctively you—these qualities enable you to contribute value that only you can bring to relationships and endeavors.",
      reasoning: "Every personality profile contains inherent strengths that become powerful when recognized and developed intentionally."
    });
  }

  return insights;
};

const generateGreenFlags = (data: PersonalityData): Insight[] => {
  const insights: Insight[] = [];
  const attachmentStyle = data.attachmentStyle;
  const usedTitles = new Set<string>();

  const addUniqueInsight = (insight: Insight) => {
    if (!usedTitles.has(insight.title) && insights.length < 3) {
      insights.push(insight);
      usedTitles.add(insight.title);
    }
  };

  if (attachmentStyle === "anxious") {
    addUniqueInsight({
      title: "Consistent & Reassuring Communication",
      description: "Look for partners who naturally communicate openly and regularly. They'll check in without being asked, share their feelings freely, and provide reassurance through both words and actions, helping you feel secure.",
      reasoning: `Anxious attachment thrives with consistent communication that reduces uncertainty and provides emotional security.`
    });
  }

  if (attachmentStyle === "avoidant") {
    addUniqueInsight({
      title: "Respects Your Independence",
      description: "Seek partners who value alone time and don't take your need for space personally. They'll have their own interests and friendships, creating a healthy interdependence rather than codependence.",
      reasoning: `Avoidant attachment requires partners who understand independence as healthy, not as rejection.`
    });
  }

  if (attachmentStyle === "secure") {
    addUniqueInsight({
      title: "Emotionally Available & Balanced",
      description: "Your secure attachment pairs well with others who can discuss feelings comfortably, handle conflict constructively, and maintain their sense of self while being fully present in the relationship.",
      reasoning: `Secure attachment flourishes with partners who match your emotional availability and healthy relationship patterns.`
    });
  }

  const bigFive = data.bigFive;
  if (bigFive) {
    if (bigFive.openness > 60) {
      addUniqueInsight({
        title: "Intellectually Curious & Open-Minded",
        description: "Partners who enjoy exploring new ideas, experiences, and perspectives will match your openness. Look for people who ask thoughtful questions and embrace growth rather than staying rigidly fixed in their ways.",
        reasoning: `Your high openness (${bigFive.openness}%) pairs best with partners who share intellectual curiosity and love of exploration.`
      });
    }

    if (bigFive.conscientiousness > 60) {
      addUniqueInsight({
        title: "Follows Through on Commitments",
        description: "You'll thrive with partners who keep their word and show up consistently. They plan ahead, take responsibilities seriously, and demonstrate through actions that you can depend on them.",
        reasoning: `Your conscientiousness (${bigFive.conscientiousness}%) values reliability, making follow-through essential in partners.`
      });
    }
  }

  if (data.enneagram === "5") {
    addUniqueInsight({
      title: "Respects Your Need for Space",
      description: "Look for people who understand your need for alone time to process and recharge. They won't take it personally when you withdraw to think, and they'll appreciate your depth when you re-engage.",
      reasoning: `Type 5 Investigators need partners who respect their boundaries around alone time and intellectual processing.`
    });
  }

  if (data.enneagram === "4") {
    addUniqueInsight({
      title: "Appreciates Your Authenticity",
      description: "Seek partners who value emotional depth and authenticity as much as you do. They'll engage with your feelings rather than dismiss them, and they'll appreciate your unique perspective on life.",
      reasoning: `Type 4 Individualists need partners who can match their emotional depth and value authentic self-expression.`
    });
  }

  if (data.enneagram === "6") {
    addUniqueInsight({
      title: "Reliable & Trustworthy Presence",
      description: "Partners who demonstrate consistency, answer questions patiently, and prove their reliability through actions will help you feel secure. Look for people whose words align with their behaviors.",
      reasoning: `Type 6 Loyalists thrive with partners who provide the stability and consistency that builds trust over time.`
    });
  }

  // Ensure at least one insight is always present
  if (insights.length === 0) {
    insights.push({
      title: "Emotional Compatibility",
      description: "Look for partners who communicate openly and show genuine interest in understanding you. Healthy relationships thrive when both people feel heard, valued, and able to be themselves without pretense.",
      reasoning: "Emotional safety and mutual understanding form the foundation of fulfilling relationships regardless of specific personality traits."
    });
  }

  return insights;
};

const generateRedFlags = (data: PersonalityData): Insight[] => {
  const insights: Insight[] = [];
  const attachmentStyle = data.attachmentStyle;
  const usedTitles = new Set<string>();

  const addUniqueInsight = (insight: Insight) => {
    if (!usedTitles.has(insight.title) && insights.length < 3) {
      insights.push(insight);
      usedTitles.add(insight.title);
    }
  };

  if (attachmentStyle === "anxious") {
    addUniqueInsight({
      title: "Inconsistent Communication Patterns",
      description: "Be cautious with partners who are hot and cold—very attentive sometimes, then distant without explanation. This unpredictability can trigger anxiety and prevent you from feeling secure in the relationship.",
      reasoning: `Anxious attachment is triggered by inconsistency, which activates fear of abandonment and relationship insecurity.`
    });
  }

  if (attachmentStyle === "avoidant") {
    addUniqueInsight({
      title: "Excessive Demands for Closeness",
      description: "Watch for partners who need constant reassurance, become anxious when you need space, or try to merge their life completely with yours early on. This intensity can feel overwhelming and trigger your need to withdraw.",
      reasoning: `Avoidant attachment is overwhelmed by excessive emotional demands, leading to increased distancing as a coping mechanism.`
    });
  }

  if (attachmentStyle === "secure") {
    addUniqueInsight({
      title: "Inability to Discuss Emotions",
      description: "Partners who shut down during conflict, refuse to talk about feelings, or get defensive when you try to address issues will frustrate your healthy communication style and create unnecessary distance.",
      reasoning: `Secure attachment relies on open communication, making emotional avoidance particularly frustrating and incompatible.`
    });
  }

  const bigFive = data.bigFive;
  if (bigFive) {
    if (bigFive.openness > 60) {
      addUniqueInsight({
        title: "Rigid Thinking & Resistance to Growth",
        description: "Partners who insist there's only one right way to do things, dismiss your ideas without consideration, or resist trying new experiences will stifle your creative, explorative nature over time.",
        reasoning: `Your high openness (${bigFive.openness}%) needs intellectual stimulation; rigidity creates frustration and stagnation.`
      });
    }

    if (bigFive.agreeableness > 70) {
      addUniqueInsight({
        title: "Takes Advantage of Your Kindness",
        description: "Be alert to people who consistently ask for favors but rarely reciprocate, make you feel guilty for setting boundaries, or expect you to always accommodate their needs while dismissing yours.",
        reasoning: `High agreeableness (${bigFive.agreeableness}%) can be exploited by those who take without giving, leading to burnout and resentment.`
      });
    }
  }

  if (data.enneagram === "1") {
    addUniqueInsight({
      title: "Constant Criticism of Your Standards",
      description: "Avoid partners who mock your desire for improvement, call you 'uptight' for having standards, or pressure you to lower your values. Your integrity is a strength, not a flaw.",
      reasoning: `Type 1 Reformers need partners who respect their values rather than undermining their commitment to doing what's right.`
    });
  }

  if (data.enneagram === "3") {
    addUniqueInsight({
      title: "Values Image Over Substance",
      description: "Be wary of people who are overly focused on appearances, status symbols, or how things look to others rather than authentic connection. This can trigger your own image-consciousness in unhealthy ways.",
      reasoning: `Type 3 Achievers can get caught in superficial competition with image-focused partners, losing touch with authentic self.`
    });
  }

  if (data.enneagram === "8") {
    addUniqueInsight({
      title: "Passive-Aggressive Behavior",
      description: "Partners who avoid direct communication, say one thing but do another, or express anger through withdrawal will frustrate your preference for honest, direct confrontation.",
      reasoning: `Type 8 Challengers value directness and can find passive-aggressive behavior deeply disrespectful and confusing.`
    });
  }

  // Ensure at least one insight is always present
  if (insights.length === 0) {
    insights.push({
      title: "Disrespect of Boundaries",
      description: "Be cautious with partners who repeatedly cross your stated boundaries, dismiss your needs, or make you feel guilty for having limits. Healthy relationships require mutual respect for each person's boundaries and autonomy.",
      reasoning: "Boundary violations signal fundamental disrespect that undermines trust and safety in relationships across all personality types."
    });
  }

  return insights;
};
