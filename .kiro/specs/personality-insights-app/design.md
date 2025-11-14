# Design Document

## Overview

The Personality Insights App is a React-based web application that provides a seamless, mobile-first experience for users to input personality assessment data and receive personalized insights. The system follows a modular architecture with clear separation between data input, analysis, and presentation layers.

### Core Design Principles

- **Mobile-First**: Optimized for touch interfaces and small screens
- **Progressive Enhancement**: Works on all devices with enhanced features on larger screens
- **Privacy-Focused**: All data stored locally with user control
- **Accessibility**: WCAG 2.1 AA compliant throughout
- **Performance**: Sub-2-second load times with smooth interactions

## Architecture

### High-Level System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Presentation  │    │   Application   │    │      Data       │
│     Layer       │◄──►│     Layer       │◄──►│     Layer       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │                 │
│ • Input Components   │ • Analysis Engine    │ • PostgreSQL DB │
│ • Results Dashboard  │ • State Management   │ • Local Storage │
│ • Auth Components    │ • Validation Logic   │ • Data Models   │
│ • Navigation         │ • Auth Middleware    │ • Persistence   │
└─────────────────────┘└─────────────────────┘└─────────────────┘
                       │                      │
                       │ • BetterAuth         │ • ConsentKeys    │
                       │ • Magic Links        │ • OIDC Provider  │
                       │ • Session Mgmt       │ • User Identity  │
                       └─────────────────────┘└─────────────────┘
```

### Technology Stack

- **Frontend Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for global state
- **Authentication**: BetterAuth with ConsentKeys OIDC + Magic Links
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Database storage for authenticated users, LocalStorage for anonymous users
- **Build Tool**: Next.js built-in tooling
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Deployment**: Vercel for full-stack hosting

### Application Flow

```mermaid
graph TD
    A[Landing Page] --> B{User Choice}
    B -->|Anonymous| C[Input Wizard]
    B -->|Sign Up/In| D[Authentication]
    D --> E[ConsentKeys OIDC]
    D --> F[Magic Link Email]
    E --> G[Authenticated Dashboard]
    F --> G
    C --> H[Framework Selection]
    G --> H
    H --> I[Data Entry]
    I --> J[Validation]
    J --> K{User Type}
    K -->|Authenticated| L[Database Storage]
    K -->|Anonymous| M[Local Storage]
    L --> N[Analysis Engine]
    M --> N
    N --> O[Results Dashboard]
    O --> P[Edit Mode]
    P --> I
```

## Components and Interfaces

### Core Components Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...auth]/route.ts
│   │   ├── personality/route.ts
│   │   └── analysis/route.ts
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── assessment/page.tsx
│   ├── results/page.tsx
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── AuthProvider.tsx
│   │   └── ProtectedRoute.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Layout.tsx
│   ├── input/
│   │   ├── FrameworkCard.tsx
│   │   ├── BigFiveInput.tsx
│   │   ├── MBTIInput.tsx
│   │   ├── ZodiacInput.tsx
│   │   ├── AttachmentStyleInput.tsx
│   │   └── LoveLanguagesInput.tsx
│   ├── results/
│   │   ├── ResultsDashboard.tsx
│   │   ├── InsightCard.tsx
│   │   ├── StrengthsSection.tsx
│   │   └── RelationshipSection.tsx
│   └── navigation/
│       ├── Header.tsx
│       ├── StepIndicator.tsx
│       └── Navigation.tsx
├── lib/
│   ├── auth/
│   │   ├── auth.ts
│   │   └── authClient.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── index.ts
│   └── services/
│       ├── analysisEngine.ts
│       ├── validation.ts
│       └── storage.ts
├── hooks/
│   ├── usePersonalityData.ts
│   ├── useAnalysis.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── types/
│   ├── personality.ts
│   ├── insights.ts
│   ├── auth.ts
│   └── common.ts
└── utils/
    ├── constants.ts
    ├── helpers.ts
    └── analytics.ts
```

### Key Interface Definitions

```typescript
// Core personality data structure
interface PersonalityData {
  userId: string;
  timestamp: Date;
  bigFive?: BigFiveScores;
  mbti?: MBTIType;
  zodiac?: ZodiacData;
  chineseZodiac?: ChineseZodiacData;
  humanDesign?: HumanDesignData;
  attachmentStyle?: AttachmentStyle;
  loveLanguages?: LoveLanguage[];
}

// Analysis results structure
interface AnalysisResults {
  selfImprovement: Insight[];
  strengths: Insight[];
  greenFlags: Insight[];
  redFlags: Insight[];
  confidence: number;
  completeness: number;
}

// Individual insight structure
interface Insight {
  id: string;
  title: string;
  description: string;
  explanation: string;
  actionable: string;
  confidence: number;
  sources: string[];
}
```

### Component Responsibilities

#### Input Components

- **FrameworkCard**: Reusable container for each personality framework
- **Specific Input Components**: Handle validation and data entry for each framework
- **ProgressBar**: Shows completion status across all frameworks

#### Results Components

- **ResultsDashboard**: Main container orchestrating all insight sections
- **InsightCard**: Reusable component for displaying individual insights
- **Section Components**: Specialized layouts for different insight types

#### Common Components

- **Button**: Consistent interactive elements with accessibility
- **Card**: Base container component with consistent styling
- **Layout**: Page-level structure and responsive behavior

## Data Models

### Personality Framework Models

```typescript
// Big Five personality model
interface BigFiveScores {
  openness: number; // 0-100
  conscientiousness: number; // 0-100
  extraversion: number; // 0-100
  agreeableness: number; // 0-100
  neuroticism: number; // 0-100
}

// MBTI type system
type MBTIType = string; // 4-letter combination (e.g., "ENFP")

interface MBTIDimensions {
  energyDirection: "E" | "I"; // Extraversion/Introversion
  informationGathering: "S" | "N"; // Sensing/Intuition
  decisionMaking: "T" | "F"; // Thinking/Feeling
  lifestyle: "J" | "P"; // Judging/Perceiving
}

// Attachment styles
type AttachmentStyle = "secure" | "anxious" | "avoidant" | "fearful-avoidant";

// Love languages with ranking
interface LoveLanguage {
  type:
    | "words-of-affirmation"
    | "quality-time"
    | "acts-of-service"
    | "physical-touch"
    | "gifts";
  rank: number; // 1-5
}

// Zodiac information
interface ZodiacData {
  sun: ZodiacSign;
  moon?: ZodiacSign;
  rising?: ZodiacSign;
}

// Human Design system
interface HumanDesignData {
  type:
    | "manifestor"
    | "generator"
    | "manifesting-generator"
    | "projector"
    | "reflector";
  authority?: string;
  profile?: string;
}

// Authentication types
interface User {
  id: string;
  email?: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}
```

### Database Schema

```typescript
// Database tables using Drizzle ORM
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const personalityProfiles = pgTable('personality_profiles', {
  id: text('id').primaryKey(),
  userId: text('userId').references(() => users.id, { onDelete: 'cascade' }),
  bigFive: jsonb('bigFive').$type<BigFiveScores>(),
  mbti: text('mbti'),
  zodiac: jsonb('zodiac').$type<ZodiacData>(),
  chineseZodiac: jsonb('chineseZodiac').$type<ChineseZodiacData>(),
  humanDesign: jsonb('humanDesign').$type<HumanDesignData>(),
  attachmentStyle: text('attachmentStyle'),
  loveLanguages: jsonb('loveLanguages').$type<LoveLanguage[]>(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const analysisResults = pgTable('analysis_results', {
  id: text('id').primaryKey(),
  profileId: text('profileId').references(() => personalityProfiles.id, { onDelete: 'cascade' }),
  selfImprovement: jsonb('selfImprovement').$type<Insight[]>(),
  strengths: jsonb('strengths').$type<Insight[]>(),
  greenFlags: jsonb('greenFlags').$type<Insight[]>(),
  redFlags: jsonb('redFlags').$type<Insight[]>(),
  confidence: real('confidence'),
  completeness: real('completeness'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

// Local Storage Schema (for anonymous users)
interface LocalStoredData {
  version: string;
  personalityData: PersonalityData;
  analysisResults?: AnalysisResults;
  preferences: UserPreferences;
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    completionStatus: Record<string, boolean>;
  };
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  dataRetention: number; // days
}
    | "manifesting-generator"
    | "projector"
    | "reflector";
  authority?: string;
  profile?: string;
}
```

### Storage Schema

```typescript
interface StoredData {
  version: string;
  personalityData: PersonalityData;
  analysisResults?: AnalysisResults;
  preferences: UserPreferences;
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    completionStatus: Record<string, boolean>;
  };
}

interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  dataRetention: number; // days
}
```

## Authentication System

### BetterAuth + ConsentKeys Integration

The application uses BetterAuth with dual authentication methods:

1. **Magic Link Authentication**: Email-based passwordless login
2. **ConsentKeys OIDC**: Secure OAuth2/OIDC authentication

#### Authentication Configuration

```typescript
// lib/auth/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins/magic-link";
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: false, // Disable password auth
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        // Send magic link via email service
        await sendMagicLinkEmail(email, url);
      },
    }),
  ],
  socialProviders: {
    consentkeys: {
      clientId: process.env.CONSENTKEYS_CLIENT_ID!,
      clientSecret: process.env.CONSENTKEYS_CLIENT_SECRET!,
      issuer: process.env.CONSENTKEYS_ISSUER_URL!,
      userinfo: process.env.CONSENTKEYS_USERINFO_URL!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

#### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant B as BetterAuth
    participant C as ConsentKeys
    participant E as Email Service

    Note over U,E: Magic Link Flow
    U->>A: Enter email
    A->>B: Request magic link
    B->>E: Send magic link email
    E->>U: Magic link email
    U->>A: Click magic link
    A->>B: Verify magic link
    B->>A: Create session
    A->>U: Authenticated

    Note over U,C: OIDC Flow
    U->>A: Click "Login with ConsentKeys"
    A->>B: Initiate OIDC flow
    B->>C: Redirect to ConsentKeys
    C->>U: ConsentKeys login page
    U->>C: Authenticate
    C->>B: Authorization code
    B->>C: Exchange for tokens
    C->>B: User info + tokens
    B->>A: Create session
    A->>U: Authenticated
```

#### User Experience Considerations

- **Anonymous Usage**: Users can use the app without authentication (data stored locally)
- **Account Creation**: Seamless upgrade from anonymous to authenticated user
- **Data Migration**: Automatic migration of local data when user signs up
- **Age Verification**: Additional consent flow for users under 18

### Data Storage Strategy

#### Dual Storage Approach

```typescript
interface StorageService {
  // For authenticated users
  saveToDatabase(userId: string, data: PersonalityData): Promise<void>;
  loadFromDatabase(userId: string): Promise<PersonalityData | null>;

  // For anonymous users
  saveToLocal(data: PersonalityData): void;
  loadFromLocal(): PersonalityData | null;

  // Migration helper
  migrateLocalToDatabase(userId: string): Promise<void>;
}
```

#### Privacy and Security

- **Data Encryption**: Sensitive personality data encrypted at rest
- **Minimal Data Collection**: Only collect necessary authentication data
- **User Control**: Full data deletion and export capabilities
- **Age-Appropriate Privacy**: Enhanced protections for users under 18

## Analysis Engine Design

### Core Analysis Architecture

The analysis engine follows a plugin-based architecture where each personality framework contributes to the overall analysis through weighted scoring and pattern recognition.

```typescript
interface AnalysisEngine {
  generateInsights(data: PersonalityData): AnalysisResults;
  calculateCompatibility(
    user1: PersonalityData,
    user2: PersonalityData
  ): CompatibilityScore;
  validateCompleteness(data: PersonalityData): CompletenessReport;
}
```

### Analysis Algorithms

#### Self-Improvement Insights Algorithm

1. **Contradiction Detection**: Identify conflicting traits across frameworks
2. **Growth Opportunity Scoring**: Weight low scores in key areas (Conscientiousness, high Neuroticism)
3. **Attachment-Based Recommendations**: Prioritize insecure attachment patterns
4. **Cross-Framework Synthesis**: Look for patterns that span multiple systems

```typescript
function generateSelfImprovementInsights(data: PersonalityData): Insight[] {
  const insights: Insight[] = [];

  // Priority 1: Attachment-based insights (40% weight)
  if (data.attachmentStyle === "anxious") {
    insights.push(createAnxietyManagementInsight(data));
  }

  // Priority 2: Big Five low scores (30% weight)
  if (data.bigFive?.conscientiousness < 40) {
    insights.push(createOrganizationInsight(data));
  }

  // Priority 3: Cross-framework contradictions (30% weight)
  const contradictions = detectContradictions(data);
  insights.push(...contradictions.map(createContradictionInsight));

  return selectTopInsights(insights, 3);
}
```

#### Relationship Compatibility Algorithm

The relationship analysis heavily weights attachment theory (50-60%) while incorporating complementary personality patterns.

```typescript
function generateRelationshipInsights(data: PersonalityData): {
  greenFlags: Insight[];
  redFlags: Insight[];
} {
  const attachmentWeight = 0.6;
  const personalityWeight = 0.4;

  // Attachment-based compatibility patterns
  const attachmentInsights = generateAttachmentInsights(data, attachmentWeight);

  // Personality complement patterns
  const personalityInsights = generatePersonalityInsights(
    data,
    personalityWeight
  );

  return combineInsights(attachmentInsights, personalityInsights);
}
```

### Insight Generation Rules

#### Evidence-Based Patterns

1. **Anxious Attachment + High Neuroticism**: Recommend partners with secure attachment and emotional stability
2. **Low Conscientiousness + Projector Human Design**: Suggest systems-based approaches and supportive partners
3. **High Openness + Intuitive MBTI**: Warn against rigid, close-minded partners
4. **Physical Touch Love Language**: Emphasize importance of affectionate partners

#### Quality Assurance

- **Specificity Check**: Ensure insights aren't generic horoscope-style statements
- **Actionability Validation**: Every insight must include concrete next steps
- **Tone Consistency**: Maintain encouraging, non-judgmental language
- **Evidence Linking**: Connect insights to specific personality data points

## User Experience Design

### Design System

#### Color Palette

```css
:root {
  /* Primary Colors */
  --primary-50: #f0f9ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;

  /* Neutral Colors */
  --neutral-50: #f9fafb;
  --neutral-500: #6b7280;
  --neutral-900: #111827;

  /* Semantic Colors */
  --success-500: #10b981;
  --warning-500: #f59e0b;
  --error-500: #ef4444;
}
```

#### Typography Scale

```css
.text-display {
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.text-heading {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.text-title {
  font-size: 1.5rem;
  line-height: 2rem;
}
.text-body {
  font-size: 1rem;
  line-height: 1.5rem;
}
.text-caption {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
```

#### Spacing System

```css
.space-xs {
  margin: 0.25rem;
}
.space-sm {
  margin: 0.5rem;
}
.space-md {
  margin: 1rem;
}
.space-lg {
  margin: 1.5rem;
}
.space-xl {
  margin: 2rem;
}
```

### Responsive Breakpoints

```css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
    padding: 1.5rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 2rem;
  }
}
```

### Interaction Patterns

#### Input Flow

1. **Landing Page**: Value proposition with clear CTA
2. **Framework Selection**: Visual grid of available assessments
3. **Progressive Input**: One framework at a time with save-and-continue
4. **Validation Feedback**: Real-time validation with helpful error messages
5. **Progress Indication**: Clear visual progress through the process

#### Results Experience

1. **Loading State**: Engaging animation while analysis runs
2. **Results Reveal**: Staggered animation revealing insights
3. **Interactive Cards**: Expandable insight cards with detailed explanations
4. **Edit Mode**: Easy access to modify inputs and regenerate results

### Accessibility Features

#### WCAG 2.1 AA Compliance

- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Keyboard Navigation**: Full functionality without mouse
- **Alternative Text**: Descriptive alt text for all images and icons

#### Age-Appropriate Considerations

- **Simple Language**: Clear, jargon-free explanations for younger users
- **Privacy Education**: Age-appropriate privacy guidance
- **Parental Guidance**: Recommendations for users under 16
- **Content Moderation**: Ensure insights are appropriate for all ages

## Error Handling

### Input Validation

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

#### Validation Rules

- **Big Five Scores**: Must be 0-100, numeric values
- **MBTI Type**: Must be valid 4-letter combination
- **Love Languages**: Must rank all 5 languages uniquely
- **Required Fields**: Framework-specific required data points

### Error Recovery Strategies

1. **Graceful Degradation**: Partial insights when some data is missing
2. **Auto-Save**: Prevent data loss during input process
3. **Retry Logic**: Automatic retry for transient failures
4. **User Feedback**: Clear error messages with resolution steps

### Storage Error Handling

```typescript
class StorageService {
  async saveData(data: PersonalityData): Promise<SaveResult> {
    try {
      localStorage.setItem("personality-data", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        return this.handleStorageQuotaExceeded();
      }
      return { success: false, error: error.message };
    }
  }

  private handleStorageQuotaExceeded(): SaveResult {
    // Implement cleanup strategy
    this.clearOldData();
    // Retry save operation
    return this.saveData(data);
  }
}
```

## Testing Strategy

### Unit Testing Approach

#### Component Testing

- **Input Components**: Validation logic and user interactions
- **Analysis Engine**: Algorithm correctness and edge cases
- **Storage Service**: Data persistence and retrieval
- **Utility Functions**: Helper functions and calculations

#### Test Coverage Targets

- **Critical Path**: 95% coverage for analysis engine and data validation
- **UI Components**: 80% coverage for user interactions
- **Utility Functions**: 90% coverage for business logic

### Integration Testing

#### User Journey Tests

1. **Complete Assessment Flow**: End-to-end personality input process
2. **Results Generation**: Full analysis pipeline from input to insights
3. **Data Persistence**: Save, retrieve, and update user data
4. **Error Scenarios**: Network failures, storage issues, invalid data

### Accessibility Testing

#### Automated Testing

- **axe-core**: Automated accessibility rule checking
- **Lighthouse**: Performance and accessibility audits
- **Color Contrast**: Automated contrast ratio validation

#### Manual Testing

- **Screen Reader**: NVDA/JAWS compatibility testing
- **Keyboard Navigation**: Tab order and focus management
- **Mobile Accessibility**: Touch target sizes and gestures

### Performance Testing

#### Metrics and Targets

- **First Contentful Paint**: < 1.5 seconds
- **Largest Contentful Paint**: < 2.5 seconds
- **Time to Interactive**: < 3 seconds
- **Cumulative Layout Shift**: < 0.1

#### Testing Scenarios

- **Mobile 3G**: Slow network simulation
- **Low-End Devices**: CPU throttling simulation
- **Large Datasets**: Stress testing with maximum personality data

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/personality_insights"

# BetterAuth
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Email Provider (Magic Links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# ConsentKeys OIDC Provider
CONSENTKEYS_CLIENT_ID=your-consentkeys-client-id
CONSENTKEYS_CLIENT_SECRET=your-consentkeys-client-secret
CONSENTKEYS_ISSUER_URL=https://your-consentkeys-issuer.com
CONSENTKEYS_USERINFO_URL=https://your-consentkeys-issuer.com/userinfo

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ConsentKeys Configuration

#### Required Callback URLs

- `https://your-domain.com/api/auth/oauth2/callback/consentkeys-oidc`
- `http://localhost:3000/api/auth/oauth2/callback/consentkeys-oidc`

#### Redirect URLs

- `https://your-domain.com/dashboard`
- `https://your-domain.com/results`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/results`

### Database Setup

```bash
# Generate database migrations
yarn db:generate

# Apply migrations to your database
yarn db:migrate

# (Optional) Open Drizzle Studio for database management
yarn db:studio
```

## Security Considerations

### Data Privacy

#### Local Storage Security

- **No PII Collection**: Avoid collecting identifiable information
- **Data Encryption**: Consider encrypting sensitive personality data
- **Secure Deletion**: Proper data cleanup when users delete information
- **Session Management**: Clear data on browser close if requested

#### Privacy by Design

- **Minimal Data Collection**: Only collect necessary personality data
- **User Control**: Full user control over data retention and deletion
- **Transparency**: Clear privacy notices and data usage explanations
- **Age-Appropriate Privacy**: Enhanced privacy protections for users under 18

### Content Security

#### Input Sanitization

- **XSS Prevention**: Sanitize all user inputs
- **Data Validation**: Strict validation of personality assessment data
- **Content Filtering**: Ensure generated insights are appropriate

#### Secure Development Practices

- **Dependency Scanning**: Regular security audits of npm packages
- **Code Review**: Security-focused code review process
- **HTTPS Only**: Enforce secure connections
- **CSP Headers**: Content Security Policy implementation
