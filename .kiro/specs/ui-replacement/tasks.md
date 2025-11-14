# Implementation Plan

- [x] 1. Set up design system and styling foundation
  - Copy CSS variables from reference app's `index.css` to `src/app/globals.css`
  - Update Tailwind configuration to match reference app's theme (fonts, colors, utilities)
  - Add Nunito and Lora font imports to root layout
  - Add custom utility classes (gradient-soft, shadow-card, transition-smooth)
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

- [x] 2. Install and configure missing UI components
  - Install missing shadcn/ui components: Accordion, Tabs, ToggleGroup, Slider
  - Copy Accordion component from reference app to `src/components/ui/`
  - Copy Tabs component from reference app to `src/components/ui/`
  - Copy ToggleGroup component from reference app to `src/components/ui/`
  - Copy Slider component from reference app to `src/components/ui/`
  - Verify all components work with current Tailwind setup
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.2_

- [x] 3. Create personality data adapter layer
  - Create `src/lib/adapters/personalityDataAdapter.ts` with conversion functions
  - Implement `toReferenceFormat()` to strip metadata for UI components
  - Implement `toCurrentFormat()` to add metadata for database storage
  - Create type definitions for both formats
  - _Requirements: 4.3, 4.4, 5.1_

- [x] 4. Migrate input components from reference app
- [x] 4.1 Copy and adapt BigFiveInput component
  - Copy `BigFiveInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - Add proper TypeScript types
  - _Requirements: 7.1, 5.6_

- [x] 4.2 Copy and adapt MBTIInput component
  - Copy `MBTIInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.2, 5.6_

- [x] 4.3 Copy and adapt EnneagramInput component
  - Copy `EnneagramInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.3, 5.6_

- [x] 4.4 Copy and adapt AttachmentStyleInput component
  - Copy `AttachmentStyleInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.4, 5.6_

- [x] 4.5 Copy and adapt LoveLanguagesInput component
  - Copy `LoveLanguagesInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.5, 5.6_

- [x] 4.6 Copy and adapt ZodiacInput component
  - Copy `ZodiacInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.6, 5.6_

- [x] 4.7 Copy and adapt ChineseZodiacInput component
  - Copy `ChineseZodiacInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.7, 5.6_

- [x] 4.8 Copy and adapt HumanDesignInput component
  - Copy `HumanDesignInput` from reference app to `src/components/input/`
  - Update to use database storage instead of localStorage
  - Integrate with existing validation logic
  - _Requirements: 7.8, 5.6_

- [x] 5. Create InsightCard component
  - Copy `InsightCard` component from reference app to `src/components/results/`
  - Update styling to match design system
  - Add proper TypeScript types
  - Implement color-coded borders for different insight types
  - _Requirements: 3.5, 3.6_

- [x] 6. Implement new landing page
  - Replace `src/app/page.tsx` with reference app's Index page structure
  - Add hero section with Sparkles icon and "Start Your Journey" button
  - Create frameworks grid displaying all 8 personality frameworks with icons
  - Add privacy notice at bottom
  - Apply gradient-soft background
  - Implement navigation to assessment page
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 7. Implement new assessment page
- [x] 7.1 Create assessment page structure
  - Replace `src/app/assessment/page.tsx` with accordion-based layout
  - Add header with back button, title, and layout toggle
  - Implement layout toggle between single and double column
  - Apply gradient-soft background
  - _Requirements: 2.1, 2.5, 2.6, 8.1, 8.2_

- [x] 7.2 Implement accordion framework list
  - Create accordion with all 8 personality frameworks
  - Add framework icons and titles to accordion triggers
  - Display framework origin descriptions in accordion content
  - Integrate input components into accordion items
  - _Requirements: 2.2, 2.7_

- [x] 7.3 Add completion tracking and validation
  - Implement completion checkmark logic for each framework
  - Display checkmarks on completed accordion items
  - Add "View My Insights" button at bottom
  - Implement validation before navigating to results
  - Show toast error if no frameworks completed
  - _Requirements: 2.3, 2.8, 3.1_

- [x] 7.4 Integrate data persistence
  - Connect input components to database storage service
  - Implement data loading on page mount
  - Implement debounced auto-save on input changes
  - Handle authentication state and redirect if not logged in
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Implement new results page
- [x] 8.1 Create results page structure
  - Replace `src/app/results/page.tsx` with tabbed layout
  - Add header with back button, title, and reset button
  - Implement Insights and Profile tabs
  - Apply gradient-soft background
  - Add redirect logic if no data exists
  - _Requirements: 3.1, 3.2, 3.8, 8.3_

- [x] 8.2 Implement Insights tab
  - Create four insight sections: Growth Areas, Strengths, What to Seek, Watch Out For
  - Add section icons (TrendingUp, Sparkles, Heart, AlertTriangle)
  - Display insights using InsightCard component
  - Apply correct color coding to each insight type
  - Integrate with existing analysis engines
  - _Requirements: 3.3, 3.5, 3.6, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 8.3 Implement Profile tab
  - Display completed frameworks in card format
  - Add framework descriptions using existing frameworkDescriptions utility
  - Implement "Learn More" external links for each framework
  - Add "Edit" buttons that navigate back to assessment page
  - Display Big Five as progress bars
  - Display other frameworks as text values
  - _Requirements: 3.4, 3.7_

- [x] 8.4 Implement reset functionality
  - Add reset button to header
  - Implement confirmation dialog before clearing data
  - Clear data from database on confirmation
  - Show success toast and redirect to landing page
  - _Requirements: 3.8_

- [x] 9. Add loading and error states
  - Create loading skeleton components for assessment and results pages
  - Add loading states during data fetching
  - Implement error handling for database operations
  - Add toast notifications for save failures
  - Implement retry logic for failed saves
  - _Requirements: 4.3, 4.4_

- [x] 10. Update navigation and routing
  - Verify all page transitions work correctly
  - Ensure back buttons navigate to correct pages
  - Maintain authentication redirects for protected routes
  - Remove or redirect old dashboard page
  - Update any internal links to use new page structure
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 11. Copy framework descriptions utility
  - Copy `frameworkDescriptions.ts` from reference app to `src/utils/`
  - Verify all framework descriptions are present
  - Integrate with Profile tab display
  - _Requirements: 3.4, 3.7_

- [x] 12. Final integration and polish
  - Test complete user flow: Landing → Assessment → Results
  - Verify data persistence across page refreshes
  - Test with no data, partial data, and full data scenarios
  - Verify authentication flow works correctly
  - Test responsive design on mobile, tablet, and desktop
  - Verify all external "Learn More" links work
  - Check accessibility (keyboard navigation, screen readers)
  - Optimize performance (lazy loading, memoization)
  - _Requirements: All_

- [x] 13. Cleanup and documentation
  - Remove unused components from old UI
  - Remove unused styles and CSS
  - Update README with new UI information
  - Document any breaking changes
  - Optionally remove reference app directory
  - _Requirements: All_
