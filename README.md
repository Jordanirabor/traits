# Personality Insights App

A mobile-first web application that aggregates multiple personality frameworks to provide users with actionable self-improvement insights and relationship compatibility guidance.

## ✨ New UI (v2.0)

The application has been redesigned with a cleaner, more intuitive interface:

- **Landing Page**: Modern hero section with framework overview
- **Assessment Page**: Accordion-based interface for focused data entry
- **Results Page**: Tabbed layout with Insights and Profile views
- **Design System**: Gradient backgrounds, custom shadows, and refined typography

## Project Overview

This project is built with the following foundation:

### 🚀 Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: BetterAuth (placeholder implementation)
- **State Management**: Zustand (ready for implementation)

### 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── personality-data/ # Data persistence endpoints
│   ├── assessment/        # Accordion-based assessment page
│   ├── results/           # Tabbed results page (Insights & Profile)
│   ├── login/             # Login page
│   ├── page.tsx           # Landing page with framework overview
│   └── layout.tsx         # Root layout with AuthProvider
├── components/
│   ├── auth/              # Authentication components
│   ├── common/            # Shared components (Header, Privacy, etc.)
│   ├── input/             # Personality framework input components
│   ├── results/           # Results display components
│   └── ui/                # shadcn/ui components (Accordion, Tabs, etc.)
├── lib/
│   ├── auth/              # ConsentKeys authentication
│   ├── db/                # Database schema and connection
│   ├── services/          # Analysis engines and storage
│   ├── adapters/          # Data format adapters
│   └── utils/             # Utility functions
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
└── utils/                 # Framework descriptions and utilities
```

### 🔧 Features Implemented

#### ✅ User Interface (v2.0)

- **Landing Page**: Clean hero section with framework grid and "Start Your Journey" CTA
- **Assessment Page**: Accordion-based interface with single/double column layout toggle
- **Results Page**: Tabbed interface with Insights (Growth Areas, Strengths, Green Flags, Red Flags) and Profile views
- **Design System**: Gradient backgrounds, custom shadows, Nunito/Lora typography
- **Responsive Design**: Mobile-first with tablet and desktop optimizations

#### ✅ Personality Frameworks

- **Big Five**: Slider inputs for Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **MBTI**: Toggle groups for 4 dichotomies (I/E, N/S, T/F, J/P)
- **Enneagram**: Radio selection for types 1-9
- **Attachment Style**: Radio selection for Secure, Anxious, Avoidant, Fearful-Avoidant
- **Love Languages**: Ranked selection of 5 languages
- **Zodiac**: Dropdown selection for 12 signs
- **Chinese Zodiac**: Dropdown selection for 12 animals
- **Human Design**: Radio selection for 5 types

#### ✅ Analysis Engines

- **Strength Engine**: Identifies user strengths based on personality data
- **Self-Improvement Engine**: Generates growth area recommendations
- **Green Flag Engine**: Identifies positive relationship patterns
- **Red Flag Engine**: Identifies potential relationship challenges
- **Validation**: Input validation for all personality frameworks

#### ✅ Data Persistence

- PostgreSQL database with Drizzle ORM
- User-specific personality data storage
- Session-based data retrieval
- Auto-save functionality with debouncing
- Data migration support

#### ✅ Authentication

- ConsentKeys OIDC integration
- Session management with secure cookies
- Protected routes for authenticated users
- Login page with ConsentKeys flow
- Automatic redirect handling

#### ✅ TypeScript Types

- Complete type definitions for personality frameworks
- Analysis results and insights types
- Authentication and session types
- Common utility types

### 🎨 Design System

- **Colors**: HSL-based color system with CSS variables for light/dark mode support
- **Typography**: Nunito (body text) and Lora (headings) font families
- **Gradients**: Custom gradient utilities (gradient-soft, gradient-primary, gradient-accent)
- **Shadows**: Soft shadows for cards and elevated elements
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

### 🔐 Authentication

- **ConsentKeys OIDC**: OAuth2/OIDC authentication with secure session handling
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Session Persistence**: Secure cookie-based session management
- **User Data Isolation**: Each user's personality data is stored separately

### 🗄️ Database Schema

- **Users**: Authentication and profile data with ConsentKeys integration
- **Sessions**: Secure session management with expiration
- **Personality Profiles**: All 8 personality framework data with timestamps
- **Analysis Results**: Generated insights and recommendations (cached)

### 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and ConsentKeys credentials
   ```

3. **Set Up Database**

   ```bash
   npm run db:generate  # Generate migrations
   npm run db:migrate   # Apply migrations
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Use the Application**
   - Open http://localhost:3000
   - Click "Start Your Journey" to begin
   - Log in with ConsentKeys
   - Complete personality assessments
   - View your personalized insights

### 📝 Environment Variables Required

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/personality_insights"

# ConsentKeys OIDC Provider
CONSENTKEYS_CLIENT_ID=your-consentkeys-client-id
CONSENTKEYS_CLIENT_SECRET=your-consentkeys-client-secret
CONSENTKEYS_DISCOVERY_URL=https://api.pseudoidc.consentkeys.com/.well-known/openid-configuration
CONSENTKEYS_REDIRECT_URL=http://localhost:3000/api/auth/callback/consentkeys

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for a complete template.

### 🎯 User Flow

1. **Landing Page** (`/`)
   - View overview of 8 personality frameworks
   - Click "Start Your Journey" to begin

2. **Assessment Page** (`/assessment`)
   - Log in with ConsentKeys (if not authenticated)
   - Complete personality assessments using accordion interface
   - Toggle between single and double column layouts
   - Data auto-saves as you type
   - Click "View My Insights" when ready

3. **Results Page** (`/results`)
   - **Insights Tab**: View Growth Areas, Strengths, Green Flags, and Red Flags
   - **Profile Tab**: Review completed frameworks with descriptions and edit options
   - Reset data to start over

### 🧪 Testing

```bash
npm run build    # Test production build
npm run lint     # Run ESLint
npm run type-check # Check TypeScript types
```

### 🔧 Development Scripts

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run db:generate   # Generate database migrations
npm run db:migrate    # Apply database migrations
npm run db:studio     # Open Drizzle Studio
```

### 📚 Documentation

- **Original Spec**: `.kiro/specs/personality-insights-app/`
- **UI Replacement Spec**: `.kiro/specs/ui-replacement/`
- **ConsentKeys Setup**: `CONSENTKEYS_PRODUCTION_SETUP.md`
- **ConsentKeys Implementation**: `CONSENTKEYS_IMPLEMENTATION_SUMMARY.md`

### 🔄 Migration from v1.0

If you're upgrading from the old wizard-based UI:

- The dashboard page now redirects to `/assessment`
- Old wizard components have been removed
- Data structure remains compatible (no migration needed)
- All analysis engines and authentication remain unchanged

See `BREAKING_CHANGES.md` for detailed migration information.

---

**Status**: ✅ Complete - UI v2.0 with all features implemented  
**Version**: 2.0.0
