# Breaking Changes - UI v2.0

This document outlines breaking changes introduced in the UI replacement (v2.0) and provides migration guidance.

## Overview

Version 2.0 replaces the multi-step wizard interface with a cleaner, accordion-based design. While the backend functionality remains unchanged, several UI components and patterns have been updated.

## Removed Components

The following components have been removed from the codebase:

### Input Components (Old Wizard UI)

- `AssessmentWizard.tsx` - Replaced by accordion-based assessment page
- `AssessmentNavigation.tsx` - No longer needed with accordion UI
- `ProgressBar.tsx` - Replaced by completion checkmarks on accordion items
- `StepIndicator.tsx` - No longer needed with accordion UI
- `ResourceModal.tsx` - "Learn More" links now open external resources directly
- `FrameworkCard.tsx` - Replaced by accordion items with framework descriptions

### Export Changes

The `src/components/input/index.ts` file no longer exports the removed components.

## Page Structure Changes

### Dashboard Page (`/dashboard`)

- **Old Behavior**: Displayed a dashboard with navigation to assessment
- **New Behavior**: Automatically redirects to `/assessment`
- **Migration**: Update any links pointing to `/dashboard` to use `/assessment` instead

### Assessment Page (`/assessment`)

- **Old UI**: Multi-step wizard with next/previous navigation
- **New UI**: Single-page accordion with all frameworks visible
- **Key Changes**:
  - No step-by-step navigation
  - Multiple frameworks can be open simultaneously
  - Layout toggle for single/double column view
  - Completion checkmarks instead of progress bar

### Results Page (`/results`)

- **Old UI**: Single dashboard view
- **New UI**: Tabbed interface with "Insights" and "Profile" tabs
- **Key Changes**:
  - Insights grouped by category (Growth Areas, Strengths, Green Flags, Red Flags)
  - Profile tab shows all completed frameworks
  - "Learn More" links open external resources
  - "Edit" buttons navigate back to assessment page

### Landing Page (`/`)

- **Old UI**: Simple welcome page
- **New UI**: Hero section with framework grid and "Start Your Journey" CTA
- **Key Changes**:
  - Displays all 8 frameworks upfront
  - More prominent call-to-action
  - Privacy notice included

## Design System Changes

### CSS Variables

The design system now uses HSL color values and new gradient/shadow utilities:

```css
/* New gradients */
--gradient-soft
--gradient-primary
--gradient-accent

/* New shadows */
--shadow-soft
--shadow-card
```

### Typography

- **Body Text**: Now uses Nunito font family
- **Headings**: Now uses Lora font family
- **Old Fonts**: Previous font stack has been replaced

### Color Scheme

All colors now use HSL format for better light/dark mode support. If you have custom styles, update them to use the new CSS variables.

## Data Structure

### No Breaking Changes

The personality data structure remains **100% compatible**:

- Database schema unchanged
- API endpoints unchanged
- Data validation unchanged
- Analysis engines unchanged

### Storage

- Data continues to be stored in PostgreSQL
- No migration scripts needed
- Existing user data works with new UI

## Authentication

### No Breaking Changes

ConsentKeys authentication remains unchanged:

- Login flow identical
- Session management unchanged
- Protected routes work the same way

## API Routes

### No Breaking Changes

All API routes remain functional:

- `/api/auth/*` - Authentication endpoints unchanged
- `/api/personality-data` - Data persistence endpoint unchanged

## Migration Guide

### For Developers

1. **Remove Old Imports**

   ```typescript
   // ❌ Remove these imports
   import { AssessmentWizard } from '@/components/input/AssessmentWizard';
   import { ProgressBar } from '@/components/input/ProgressBar';
   import { StepIndicator } from '@/components/input/StepIndicator';

   // ✅ Use new page structure instead
   // Navigate to /assessment for accordion-based UI
   ```

2. **Update Navigation Links**

   ```typescript
   // ❌ Old
   router.push('/dashboard');

   // ✅ New
   router.push('/assessment');
   ```

3. **Update Custom Styles**
   If you have custom styles, update them to use new CSS variables:

   ```css
   /* ❌ Old */
   background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);

   /* ✅ New */
   background: var(--gradient-soft);
   ```

### For Users

**No action required!** The new UI is a drop-in replacement:

- Your existing data will work with the new interface
- No need to re-enter personality information
- All insights and analysis remain the same

## Rollback Instructions

If you need to rollback to the old UI:

1. Checkout the previous version:

   ```bash
   git checkout <commit-before-ui-replacement>
   ```

2. Reinstall dependencies:

   ```bash
   npm install
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

## Support

For questions or issues related to the UI migration:

- Review the UI replacement spec: `.kiro/specs/ui-replacement/`
- Check the design document: `.kiro/specs/ui-replacement/design.md`
- Review implementation tasks: `.kiro/specs/ui-replacement/tasks.md`

## Version History

- **v2.0.0** (Current) - New accordion-based UI with tabbed results
- **v1.0.0** - Original wizard-based UI (deprecated)
