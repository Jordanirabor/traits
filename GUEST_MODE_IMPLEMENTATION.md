# Guest Mode Implementation

## Overview

Implemented guest mode functionality to allow users to use the application without authentication. Guest data is stored in localStorage and persists across browser sessions but is not synced to the database.

## Changes Made

### 1. Login Page (`src/components/auth/LoginForm.tsx`)

#### Fixed ConsentKeys Button Contrast

- **Before**: Used `bg-primary-500` which doesn't exist in the design system
- **After**: Uses `bg-primary` with proper HSL color variables
- **Result**: Button is now visible with proper contrast

```tsx
// Old (invisible)
className = 'bg-primary-500 text-white';

// New (visible)
className = 'bg-primary text-primary-foreground hover:bg-primary/90';
```

#### Implemented Guest Mode

- Changed "Continue as guest" from a link to a button
- Sets `guestMode` flag in sessionStorage
- Added informative text about guest data storage
- Improved styling with proper color variables

### 2. Assessment Page (`src/app/assessment/page.tsx`)

#### Guest Mode Detection

- Added `isGuestMode` state that checks sessionStorage
- Prevents redirect to login when in guest mode
- Shows guest mode banner with warning and sign-in option

#### Data Loading

- **Authenticated Users**: Load from database via API
- **Guest Users**: Load from localStorage (`guestPersonalityData` key)
- Unified loading logic with conditional branching

#### Data Saving

- **Authenticated Users**: Save to database with retry logic
- **Guest Users**: Save to localStorage (instant, no retry needed)
- Debounced auto-save works for both modes

#### Guest Mode Banner

- Displays warning banner when in guest mode
- Explains data is stored locally
- Provides "Sign In" button to convert to authenticated user
- Uses warning color scheme for visibility

### 3. Data Persistence Hook (`src/hooks/usePersonalityData.ts`)

#### Storage Key Update

- Changed from `personality-data` to `guestPersonalityData`
- Ensures consistency between assessment page and results page
- Results page automatically reads guest data

### 4. Results Page

**No changes needed!** The results page already uses `usePersonalityData` hook which now reads from the correct localStorage key.

## User Flow

### Guest User Flow

1. **Landing Page** → Click "Start Your Journey"
2. **Login Page** → Click "Continue as guest"
   - Sets `guestMode` flag in sessionStorage
   - Redirects to assessment page
3. **Assessment Page**
   - Shows guest mode banner
   - Data saves to localStorage automatically
   - Can complete assessments normally
4. **Results Page**
   - Reads data from localStorage
   - Generates insights normally
   - Can view all results

### Converting Guest to Authenticated

1. Click "Sign In" button in guest mode banner
2. Complete ConsentKeys authentication
3. Data remains in localStorage (can be manually migrated if needed)
4. Future saves go to database

## Technical Details

### Storage Keys

- **Guest Mode**: `guestPersonalityData` in localStorage
- **Session Flag**: `guestMode` in sessionStorage
- **Authenticated**: Database via `/api/personality-data`

### Data Format

Both guest and authenticated modes use the same `PersonalityData` format:

```typescript
interface PersonalityData {
  userId?: string;
  bigFive?: BigFiveScores;
  mbti?: string;
  enneagram?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  humanDesign?: string;
  attachmentStyle?: string;
  loveLanguages?: string[];
  timestamp: Date;
}
```

For guest users, `userId` is set to `'guest'`.

### Session Management

- `sessionStorage.getItem('guestMode')` - Checked on assessment page load
- Persists across page navigation within the same browser session
- Cleared when browser tab/window is closed
- Does not persist across browser restarts (user must click "Continue as guest" again)

## Benefits

1. **Lower Barrier to Entry**: Users can try the app without creating an account
2. **Privacy**: No data sent to server for guest users
3. **Seamless Upgrade**: Easy to convert to authenticated user later
4. **Consistent UX**: Same interface for both guest and authenticated users
5. **Proper Warnings**: Clear indication of guest mode limitations

## Limitations

1. **No Cross-Device Sync**: Guest data only available on the same browser
2. **No Backup**: Data lost if localStorage is cleared
3. **No Sharing**: Can't share results with others
4. **Manual Migration**: Converting to authenticated doesn't auto-migrate guest data

## Future Enhancements

Potential improvements for guest mode:

1. **Auto-Migration**: Automatically migrate guest data to database on sign-in
2. **Export/Import**: Allow users to export guest data as JSON
3. **Session Persistence**: Store guest flag in localStorage instead of sessionStorage
4. **Data Size Warning**: Warn if localStorage is getting full
5. **Backup Reminder**: Periodic reminders to sign in to save data permanently

## Testing

### Manual Test Cases

- [x] Guest user can access assessment page
- [x] Guest data saves to localStorage
- [x] Guest data persists across page refreshes
- [x] Guest data loads on results page
- [x] Guest mode banner displays correctly
- [x] ConsentKeys button is visible with proper contrast
- [x] Sign in button in banner works
- [x] Authenticated users still use database
- [x] Build completes successfully

### Browser Compatibility

Guest mode uses standard Web APIs:

- `localStorage` - Supported in all modern browsers
- `sessionStorage` - Supported in all modern browsers

## Build Status

✅ Build successful with no errors
✅ All TypeScript types valid
✅ ESLint passes (only pre-existing warning)

---

**Implementation Date**: 2025-11-15  
**Status**: ✅ Complete and tested
