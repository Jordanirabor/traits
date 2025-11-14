# Analysis Engine Services

This directory contains the personality analysis engine and related services.

## Overview

The analysis engine processes personality data from multiple frameworks and generates actionable insights across four categories:

1. **Self-Improvement** - Growth opportunities and areas for personal development
2. **Strengths** - Positive attributes and natural talents
3. **Green Flags** - Positive qualities to seek in romantic partners
4. **Red Flags** - Warning signs to watch for in relationships

## Architecture

The system uses a modular architecture with specialized engines:

- `analysisEngine.ts` - Core engine that orchestrates all analysis
- `selfImprovementEngine.ts` - Generates self-improvement insights
- `strengthEngine.ts` - Identifies personal strengths
- `greenFlagEngine.ts` - Generates relationship compatibility recommendations
- `redFlagEngine.ts` - Identifies relationship warning signs

## Usage

### Basic Analysis

```typescript
import { analysisEngine } from '@/lib/services';
import { PersonalityData } from '@/types/personality';

const personalityData: PersonalityData = {
  timestamp: new Date(),
  bigFive: {
    openness: 80,
    conscientiousness: 35,
    extraversion: 60,
    agreeableness: 75,
    neuroticism: 70,
  },
  mbti: 'INFP',
  attachmentStyle: 'anxious',
  loveLanguages: [
    { type: 'words-of-affirmation', rank: 1 },
    { type: 'quality-time', rank: 2 },
    { type: 'physical-touch', rank: 3 },
    { type: 'acts-of-service', rank: 4 },
    { type: 'gifts', rank: 5 },
  ],
};

// Generate complete analysis
const results = analysisEngine.generateInsights(personalityData);

console.log('Self-Improvement Insights:', results.selfImprovement);
console.log('Strengths:', results.strengths);
console.log('Green Flags:', results.greenFlags);
console.log('Red Flags:', results.redFlags);
console.log('Confidence Score:', results.confidence);
console.log('Data Completeness:', results.completeness);
```

### Validate Data Completeness

```typescript
const completenessReport = analysisEngine.validateCompleteness(personalityData);

console.log('Overall Completeness:', completenessReport.overall);
console.log('Missing Frameworks:', completenessReport.missingFrameworks);
console.log('Recommendations:', completenessReport.recommendations);
```

### Using Individual Engines

You can also use the specialized engines directly:

```typescript
import {
  selfImprovementEngine,
  strengthEngine,
  greenFlagEngine,
  redFlagEngine,
} from '@/lib/services';

// Generate only self-improvement insights
const selfImprovementInsights =
  selfImprovementEngine.generateSelfImprovementInsights(personalityData);

// Generate only strength insights
const strengthInsights =
  strengthEngine.generateStrengthInsights(personalityData);

// Generate only green flag insights
const greenFlagInsights =
  greenFlagEngine.generateGreenFlagInsights(personalityData);

// Generate only red flag insights
const redFlagInsights = redFlagEngine.generateRedFlagInsights(personalityData);
```

## Insight Structure

Each insight follows this structure:

```typescript
interface Insight {
  id: string; // Unique identifier
  title: string; // Short, descriptive title
  description: string; // Brief summary
  explanation: string; // Detailed explanation
  actionable: string; // Concrete next steps
  confidence: number; // 0-1 confidence score
  sources: string[]; // Frameworks used to generate this insight
}
```

## Weighting System

The analysis engine uses weighted scoring to prioritize insights:

### Framework Weights (for relationship analysis)

- **Attachment Style**: 60% - Highest priority
- **Big Five**: 25% - Secondary priority
- **MBTI**: 10% - Tertiary priority
- **Love Languages**: 5% - Supporting data
- **Human Design, Zodiac, Chinese Zodiac**: 0% - Informational only

### Insight Selection

Each engine generates multiple candidate insights and selects the top 3 based on:

1. **Priority** - Attachment-based insights are highest priority
2. **Weight** - Framework importance in the analysis
3. **Confidence** - How certain the algorithm is about the insight

## Key Features

### Evidence-Based Patterns

All insights are based on established psychological research:

- Attachment theory (Bowlby, Ainsworth)
- Big Five personality model (Costa & McCrae)
- MBTI cognitive functions (Jung, Myers-Briggs)
- Love Languages (Gary Chapman)

### Non-Fear-Based Messaging

Red flag insights are realistic but not alarmist:

- Focus on specific compatibility concerns
- Explain why patterns might be challenging
- Avoid catastrophizing or fear-mongering
- Provide context and understanding

### Actionable Recommendations

Every insight includes concrete next steps:

- Specific behaviors to practice
- Resources to explore
- Patterns to watch for
- Ways to leverage strengths

## Confidence Scoring

The confidence score (0-1) is calculated based on:

- **Data Completeness** (60%) - More complete data = higher confidence
- **Pattern Strength** (40%) - Clearer patterns = higher confidence

Critical frameworks (attachment style, Big Five) are weighted more heavily in the completeness calculation.

## Future Enhancements

Potential improvements for future versions:

- Machine learning to improve insight quality over time
- User feedback integration to refine recommendations
- Compatibility scoring between two users
- Longitudinal tracking of personality changes
- Integration with external assessment APIs
