export interface FrameworkResource {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  learnMoreUrl: string;
  assessmentTools: Array<{
    name: string;
    url: string;
    isFree: boolean;
    description: string;
  }>;
  helpText: string;
}

export const frameworkResources: Record<string, FrameworkResource> = {
  bigFive: {
    id: 'bigFive',
    name: 'Big Five Personality',
    description:
      'The Big Five model measures five core personality dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. It is one of the most scientifically validated personality frameworks.',
    estimatedTime: '5-10 minutes',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Big_Five_personality_traits',
    assessmentTools: [
      {
        name: 'IPIP-NEO',
        url: 'https://www.personal.psu.edu/~j5j/IPIP/',
        isFree: true,
        description: 'Comprehensive 120-item personality inventory',
      },
      {
        name: 'Truity Big Five Test',
        url: 'https://www.truity.com/test/big-five-personality-test',
        isFree: true,
        description: 'Quick and accessible Big Five assessment',
      },
    ],
    helpText:
      'Rate yourself honestly on each dimension. There are no right or wrong answers - this is about understanding your natural tendencies.',
  },
  mbti: {
    id: 'mbti',
    name: 'MBTI Type',
    description:
      'The Myers-Briggs Type Indicator categorizes personality into 16 types based on four dimensions: Extraversion/Introversion, Sensing/Intuition, Thinking/Feeling, and Judging/Perceiving.',
    estimatedTime: '3-5 minutes',
    learnMoreUrl:
      'https://en.wikipedia.org/wiki/Myers%E2%80%93Briggs_Type_Indicator',
    assessmentTools: [
      {
        name: '16Personalities',
        url: 'https://www.16personalities.com/free-personality-test',
        isFree: true,
        description: 'Popular free MBTI-style test with detailed results',
      },
      {
        name: 'Truity TypeFinder',
        url: 'https://www.truity.com/test/type-finder-personality-test-new',
        isFree: true,
        description: 'Research-backed personality type assessment',
      },
    ],
    helpText:
      'Choose the preference that feels most natural to you in each dimension. Consider how you typically behave, not how you wish to be.',
  },
  zodiac: {
    id: 'zodiac',
    name: 'Zodiac Signs',
    description:
      'Western astrology divides the year into 12 zodiac signs based on the position of the sun at birth. Your sun sign represents your core identity, while moon and rising signs add depth.',
    estimatedTime: '2-3 minutes',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Astrological_sign',
    assessmentTools: [
      {
        name: 'Astro.com',
        url: 'https://www.astro.com/horoscopes',
        isFree: true,
        description:
          'Calculate your complete birth chart including moon and rising signs',
      },
      {
        name: 'Cafe Astrology',
        url: 'https://cafeastrology.com/free-natal-chart-report.html',
        isFree: true,
        description:
          'Free natal chart calculator with detailed interpretations',
      },
    ],
    helpText:
      "Enter your birth date to automatically calculate your sun sign. For moon and rising signs, you'll need your exact birth time and location.",
  },
  chineseZodiac: {
    id: 'chineseZodiac',
    name: 'Chinese Zodiac',
    description:
      'The Chinese zodiac assigns one of 12 animals and one of 5 elements based on your birth year. This system is deeply rooted in Chinese philosophy and astrology.',
    estimatedTime: '2-3 minutes',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Chinese_zodiac',
    assessmentTools: [
      {
        name: 'China Highlights',
        url: 'https://www.chinahighlights.com/travelguide/chinese-zodiac/',
        isFree: true,
        description: 'Comprehensive Chinese zodiac calculator and guide',
      },
      {
        name: 'Travel China Guide',
        url: 'https://www.travelchinaguide.com/intro/social_customs/zodiac/',
        isFree: true,
        description: 'Detailed information about Chinese zodiac signs',
      },
    ],
    helpText:
      'Your Chinese zodiac is determined by your birth year. The calculator will automatically determine your animal and element.',
  },
  humanDesign: {
    id: 'humanDesign',
    name: 'Human Design',
    description:
      'Human Design combines astrology, I Ching, Kabbalah, and chakras to create a unique system. Your type, authority, and profile describe how you best interact with the world.',
    estimatedTime: '5-10 minutes',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Human_Design',
    assessmentTools: [
      {
        name: 'Jovian Archive',
        url: 'https://www.jovianarchive.com/get_your_chart',
        isFree: true,
        description: 'Official Human Design chart calculator',
      },
      {
        name: 'MyBodyGraph',
        url: 'https://www.mybodygraph.com/',
        isFree: true,
        description: 'Free Human Design chart with basic interpretation',
      },
    ],
    helpText:
      "You'll need your exact birth time and location to generate an accurate Human Design chart. If you don't have this information, you can still select your type based on descriptions.",
  },
  attachmentStyle: {
    id: 'attachmentStyle',
    name: 'Attachment Style',
    description:
      'Attachment theory describes patterns in how we form emotional bonds and relationships. Your attachment style influences how you connect with romantic partners and handle intimacy.',
    estimatedTime: '3-5 minutes',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/Attachment_theory',
    assessmentTools: [
      {
        name: 'Attachment Project Quiz',
        url: 'https://www.attachmentproject.com/attachment-style-quiz/',
        isFree: true,
        description: 'Quick quiz to determine your attachment style',
      },
      {
        name: 'Psychology Today Test',
        url: 'https://www.psychologytoday.com/us/tests/relationships/relationship-attachment-style-test',
        isFree: false,
        description: 'Comprehensive attachment style assessment',
      },
    ],
    helpText:
      'Choose the description that best matches your typical patterns in romantic relationships. Consider your general tendencies, not just your current relationship.',
  },
  loveLanguages: {
    id: 'loveLanguages',
    name: 'Love Languages',
    description:
      'The Five Love Languages describe how people prefer to give and receive love: Words of Affirmation, Quality Time, Acts of Service, Physical Touch, and Receiving Gifts.',
    estimatedTime: '3-5 minutes',
    learnMoreUrl: 'https://en.wikipedia.org/wiki/The_Five_Love_Languages',
    assessmentTools: [
      {
        name: '5 Love Languages Quiz',
        url: 'https://5lovelanguages.com/quizzes/love-language',
        isFree: true,
        description: 'Official quiz from Dr. Gary Chapman',
      },
      {
        name: 'Truity Love Languages Test',
        url: 'https://www.truity.com/test/love-styles-test',
        isFree: true,
        description: 'Alternative love languages assessment',
      },
    ],
    helpText:
      'Rank the love languages from most to least important to you. Think about what makes you feel most loved and appreciated in relationships.',
  },
};

export const getFrameworkResource = (
  frameworkId: string
): FrameworkResource | undefined => {
  return frameworkResources[frameworkId];
};

export const getAllFrameworkResources = (): FrameworkResource[] => {
  return Object.values(frameworkResources);
};
