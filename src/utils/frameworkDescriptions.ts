export const getFrameworkDescription = (
  framework: string,
  value: any
): string => {
  switch (framework) {
    case 'bigFive':
      return 'The Big Five model measures five core dimensions of personality: Openness (creativity and curiosity), Conscientiousness (organization and discipline), Extraversion (social energy), Agreeableness (compassion and cooperation), and Neuroticism (emotional stability). This scientifically validated model helps predict behavior patterns, career fit, and interpersonal dynamics.';

    case 'mbti':
      const mbtiDescriptions: Record<string, string> = {
        INTJ: 'The Architect - Strategic, analytical, and independent thinkers who excel at planning and problem-solving.',
        INTP: 'The Logician - Innovative, curious analysts who love exploring theoretical concepts.',
        ENTJ: 'The Commander - Bold, strategic leaders who excel at organizing and directing.',
        ENTP: 'The Debater - Quick-witted, clever thinkers who love intellectual challenges.',
        INFJ: 'The Advocate - Idealistic, insightful visionaries who seek meaning and authenticity.',
        INFP: 'The Mediator - Empathetic idealists guided by values and creativity.',
        ENFJ: 'The Protagonist - Charismatic, inspiring leaders who bring out the best in others.',
        ENFP: 'The Campaigner - Enthusiastic, creative free spirits who connect with others easily.',
        ISTJ: 'The Logistician - Practical, reliable organizers who value tradition and order.',
        ISFJ: 'The Defender - Warm, dedicated protectors who care deeply about others.',
        ESTJ: 'The Executive - Efficient, organized administrators who value structure.',
        ESFJ: 'The Consul - Caring, social harmonizers who create supportive communities.',
        ISTP: 'The Virtuoso - Bold, practical experimenters who master tools and techniques.',
        ISFP: 'The Adventurer - Flexible, charming artists who live in the moment.',
        ESTP: 'The Entrepreneur - Energetic, perceptive risk-takers who thrive on action.',
        ESFP: 'The Entertainer - Spontaneous, enthusiastic performers who love life.',
      };
      return (
        mbtiDescriptions[value as string] ||
        'MBTI categorizes personality into 16 types based on preferences in four dimensions.'
      );

    case 'attachmentStyle':
      const attachmentDescriptions: Record<string, string> = {
        secure:
          "Secure attachment style indicates you're comfortable with intimacy and independence. You trust others easily, communicate openly, and handle relationship challenges with confidence. This healthy attachment pattern stems from consistent, responsive caregiving.",
        anxious:
          'Anxious attachment style means you deeply value closeness but often worry about relationships. You may seek reassurance frequently and fear abandonment. This pattern can develop from inconsistent caregiving but is changeable with awareness and practice.',
        avoidant:
          'Avoidant attachment style indicates you highly value independence and may feel uncomfortable with too much closeness. You prefer self-reliance and may withdraw when relationships feel demanding. Understanding this pattern is the first step toward more secure relating.',
        fearful:
          'Fearful-avoidant attachment (also called disorganized) involves conflicting desires for closeness and distance. You may want intimacy but fear getting hurt. This pattern often stems from early relationship trauma but can heal with support and self-awareness.',
        'fearful-avoidant':
          'Fearful-avoidant attachment (also called disorganized) involves conflicting desires for closeness and distance. You may want intimacy but fear getting hurt. This pattern often stems from early relationship trauma but can heal with support and self-awareness.',
      };
      return (
        attachmentDescriptions[value as string] ||
        'Attachment style describes how you form emotional bonds in relationships.'
      );

    case 'loveLanguages':
      return 'The Five Love Languages describe how people prefer to give and receive affection: Words of Affirmation (verbal appreciation), Quality Time (focused attention), Receiving Gifts (thoughtful tokens), Acts of Service (helpful actions), and Physical Touch (physical connection). Understanding your primary languages helps you communicate love more effectively.';

    case 'zodiacSign':
      return `Your zodiac sign ${value} is determined by the sun's position at your birth. Western astrology suggests this influences personality traits, preferences, and compatibility with others. While not scientifically proven, many find astrological insights meaningful for self-reflection.`;

    case 'chineseZodiac':
      return `The Chinese Zodiac assigns an animal and element based on your birth year in a 12-year cycle. Your sign ${value} is believed to influence personality characteristics, fortune, and compatibility in relationships and life decisions.`;

    case 'enneagram':
      const enneagramDescriptions: Record<string, string> = {
        '1': 'Type 1: The Reformer - You are principled, purposeful, self-controlled, and perfectionistic. You strive to be good and right, driven by a strong inner critic. Your core desire is integrity and improvement.',
        '2': 'Type 2: The Helper - You are generous, demonstrative, people-pleasing, and sometimes possessive. You seek to be loved and needed by others. Your core desire is to feel appreciated and wanted.',
        '3': 'Type 3: The Achiever - You are adaptable, excelling, driven, and image-conscious. You seek success and validation through accomplishments. Your core desire is to feel valuable and worthwhile.',
        '4': 'Type 4: The Individualist - You are expressive, dramatic, self-absorbed, and temperamental. You seek authenticity and deep emotional connection. Your core desire is to find yourself and your significance.',
        '5': 'Type 5: The Investigator - You are perceptive, innovative, isolated, and sometimes detached. You seek knowledge and competence. Your core desire is to be capable and competent.',
        '6': 'Type 6: The Loyalist - You are engaging, responsible, anxious, and sometimes suspicious. You seek security and support. Your core desire is to have security and guidance.',
        '7': 'Type 7: The Enthusiast - You are spontaneous, versatile, scattered, and acquisitive. You seek satisfaction and freedom. Your core desire is to be happy and avoid pain.',
        '8': 'Type 8: The Challenger - You are self-confident, decisive, willful, and confrontational. You seek control and self-protection. Your core desire is to be strong and independent.',
        '9': 'Type 9: The Peacemaker - You are receptive, reassuring, complacent, and resigned. You seek inner peace and harmony. Your core desire is to have inner stability and avoid conflict.',
      };
      return (
        enneagramDescriptions[value as string] ||
        'The Enneagram describes nine interconnected personality types, each with unique motivations, fears, and growth paths.'
      );

    case 'humanDesign':
      const humanDesignDescriptions: Record<string, string> = {
        manifestor:
          "Manifestors are natural initiators who impact others with their energy. You're designed to start things without waiting for permission. Your strategy is to inform others before acting to reduce resistance.",
        generator:
          "Generators have sustainable life force energy for work they love. You're designed to respond to opportunities rather than initiate. Your satisfaction comes from doing what lights you up.",
        'manifesting-generator':
          "Manifesting Generators are multi-passionate, efficient doers who can juggle multiple projects. You combine Generator's sustained energy with Manifestor's initiating power. Follow your excitement and inform before acting.",
        projector:
          "Projectors are natural guides who see systems and people clearly. You're designed to wait for recognition and invitation before sharing your wisdom. Your gift is directing others' energy effectively.",
        reflector:
          "Reflectors are rare mirrors of community health. You're deeply sensitive to your environment and people around you. Your decision-making strategy is to wait a lunar cycle (28 days) for clarity.",
      };
      return (
        humanDesignDescriptions[value as string] ||
        'Human Design combines astrology, I Ching, Kabbalah, and chakras to describe your energetic blueprint.'
      );

    default:
      return '';
  }
};
