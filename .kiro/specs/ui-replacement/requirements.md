# Requirements Document

## Introduction

This document outlines the requirements for replacing the current Next.js-based personality insights application UI/UX with a simpler, cleaner design based on a reference React application. The replacement will maintain all existing backend functionality (authentication, database storage, analysis engines) while adopting the reference app's visual design, component structure, and user flow.

## Glossary

- **Application**: The personality insights web application being modified
- **Reference App**: The existing React application in the `reference/` directory that provides the desired UI/UX
- **Current App**: The existing Next.js application with ConsentKeys authentication
- **Assessment Flow**: The multi-step process where users input their personality framework data
- **Analysis Engines**: The backend services that generate insights from personality data (strengthEngine, redFlagEngine, greenFlagEngine, selfImprovementEngine)
- **UI Components**: React components that render the user interface
- **Styling System**: The CSS variables, Tailwind configuration, and design tokens that define visual appearance

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a clean, modern landing page that introduces the personality assessment tool, so that I understand what the application does before starting.

#### Acceptance Criteria

1. WHEN the Application loads at the root path, THE Application SHALL display a landing page with the application title "Personality Finder"
2. WHEN the landing page renders, THE Application SHALL display a grid of all 8 personality frameworks with icons and brief descriptions
3. WHEN the landing page renders, THE Application SHALL display a prominent "Start Your Journey" button that navigates to the assessment page
4. WHEN the landing page renders, THE Application SHALL display a privacy notice stating that data is stored locally
5. THE Application SHALL apply the gradient-soft background styling to the landing page

### Requirement 2

**User Story:** As a user, I want to complete personality assessments through an accordion-based interface, so that I can focus on one framework at a time without feeling overwhelmed.

#### Acceptance Criteria

1. WHEN the user navigates to the assessment page, THE Application SHALL display all 8 personality frameworks as collapsible accordion items
2. WHEN the user clicks an accordion item, THE Application SHALL expand that item to reveal the input form for that framework
3. WHEN a framework assessment is completed, THE Application SHALL display a checkmark indicator on that accordion item
4. THE Application SHALL allow multiple accordion items to be open simultaneously
5. WHEN the user toggles the layout control, THE Application SHALL switch between single-column and two-column grid layouts
6. WHEN the two-column layout is active, THE Application SHALL display accordion items in a responsive grid
7. THE Application SHALL display framework origin descriptions within each accordion item
8. THE Application SHALL display a "View My Insights" button at the bottom of the assessment page

### Requirement 3

**User Story:** As a user, I want to view my personality insights organized by category, so that I can easily understand my strengths, growth areas, and relationship patterns.

#### Acceptance Criteria

1. WHEN the user clicks "View My Insights", THE Application SHALL navigate to the results page
2. WHEN the results page loads, THE Application SHALL display two tabs: "Insights" and "Profile"
3. WHEN the "Insights" tab is active, THE Application SHALL display insights grouped into four sections: Growth Areas, Strengths, What to Seek, and Watch Out For
4. WHEN the "Profile" tab is active, THE Application SHALL display all completed personality frameworks with their values and descriptions
5. THE Application SHALL display each insight in a card with title, description, and reasoning
6. THE Application SHALL apply color-coded left borders to insight cards based on type (primary for improvement, accent for strength, success for green flags, destructive for red flags)
7. WHEN a framework card is displayed in the Profile tab, THE Application SHALL include "Learn More" and "Edit" buttons
8. THE Application SHALL display a "Reset" button that clears all stored data

### Requirement 4

**User Story:** As a user, I want the application to maintain my authentication state and store my data securely, so that my personality data persists across sessions.

#### Acceptance Criteria

1. WHEN the user is not authenticated, THE Application SHALL redirect protected routes to the login page
2. WHEN the user completes authentication, THE Application SHALL store the session using the existing ConsentKeys integration
3. WHEN the user saves personality data, THE Application SHALL persist the data to the database using existing storage services
4. WHEN the user loads the assessment or results page, THE Application SHALL retrieve stored personality data from the database
5. THE Application SHALL maintain all existing authentication API routes and session management

### Requirement 5

**User Story:** As a user, I want the application to generate personalized insights using the same analysis logic, so that the quality of insights remains consistent.

#### Acceptance Criteria

1. WHEN the user views results, THE Application SHALL generate insights using the existing analysisEngine service
2. WHEN insights are generated, THE Application SHALL use the strengthEngine to identify user strengths
3. WHEN insights are generated, THE Application SHALL use the redFlagEngine to identify relationship warning signs
4. WHEN insights are generated, THE Application SHALL use the greenFlagEngine to identify positive relationship patterns
5. WHEN insights are generated, THE Application SHALL use the selfImprovementEngine to identify growth opportunities
6. THE Application SHALL maintain all existing validation logic for personality data inputs

### Requirement 6

**User Story:** As a developer, I want the application to use the reference app's visual design system, so that the UI has a consistent, polished appearance.

#### Acceptance Criteria

1. THE Application SHALL adopt the CSS custom properties defined in the reference app's index.css
2. THE Application SHALL use HSL color values for all color definitions
3. THE Application SHALL define gradient utilities (gradient-soft, gradient-primary, gradient-accent) matching the reference app
4. THE Application SHALL define shadow utilities (shadow-soft, shadow-card) matching the reference app
5. THE Application SHALL use the Nunito font family for body text and Lora font family for headings
6. THE Application SHALL configure Tailwind with the same color tokens and spacing scale as the reference app
7. THE Application SHALL support both light and dark mode color schemes

### Requirement 7

**User Story:** As a user, I want to input my personality data using the same input components as the reference app, so that the data entry experience is intuitive and consistent.

#### Acceptance Criteria

1. THE Application SHALL use the reference app's BigFiveInput component structure for Big Five trait inputs
2. THE Application SHALL use the reference app's MBTIInput component structure for MBTI type selection
3. THE Application SHALL use the reference app's EnneagramInput component structure for Enneagram type selection
4. THE Application SHALL use the reference app's AttachmentStyleInput component structure for attachment style selection
5. THE Application SHALL use the reference app's LoveLanguagesInput component structure for love language ranking
6. THE Application SHALL use the reference app's ZodiacInput component structure for zodiac sign selection
7. THE Application SHALL use the reference app's ChineseZodiacInput component structure for Chinese zodiac selection
8. THE Application SHALL use the reference app's HumanDesignInput component structure for Human Design type selection

### Requirement 8

**User Story:** As a user, I want navigation between pages to be smooth and intuitive, so that I can easily move through the application flow.

#### Acceptance Criteria

1. WHEN the user is on any page, THE Application SHALL display a back button that navigates to the previous page
2. WHEN the user clicks the back button on the assessment page, THE Application SHALL navigate to the landing page
3. WHEN the user clicks the back button on the results page, THE Application SHALL navigate to the assessment page
4. THE Application SHALL maintain Next.js routing structure while adopting the reference app's navigation patterns
5. THE Application SHALL display page titles and descriptions consistently across all pages
