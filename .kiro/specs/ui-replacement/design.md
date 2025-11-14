# Design Document

## Overview

This design document outlines the approach for replacing the current Next.js personality insights application UI with the cleaner, simpler design from the reference React application. The replacement will maintain all existing backend functionality (ConsentKeys authentication, database storage, analysis engines) while adopting the reference app's visual design system, component structure, and user flow patterns.

The key principle is **UI replacement, not functionality replacement**. We're keeping the robust backend infrastructure and replacing only the presentation layer.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│  (NEW - Reference App UI Components & Styling)              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Landing Page │  │  Assessment  │  │   Results    │     │
│  │   (Index)    │  │     Page     │  │     Page     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (EXISTING - Keep all current logic)                        │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Logic   │  │  Hooks       │  │  Services    │     │
│  │ (ConsentKeys)│  │              │  │  (Analysis)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  (EXISTING - Keep all current storage)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │   Database   │  │   Session    │                        │
│  │  (Drizzle)   │  │   Storage    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Routing Strategy

We'll maintain Next.js App Router structure but simplify the page components to match the reference app's flow:

- `/` - Landing page (simplified Index page)
- `/assessment` - Single assessment page with accordion UI
- `/results` - Results page with Insights/Profile tabs
- `/login` - Keep existing login page (unchanged)
- `/dashboard` - Remove or redirect to `/assessment`

Authentication middleware and protected routes remain unchanged.

## Components and Interfaces

### Design System Migration

#### CSS Variables (globals.css)

Replace current CSS variables with reference app's design tokens:

```css
:root {
  /* Colors - All HSL format */
  --background: 210 40% 98%;
  --foreground: 215 25% 20%;
  --card: 0 0% 100%;
  --primary: 190 80% 45%;
  --primary-glow: 190 85% 55%;
  --secondary: 195 70% 92%;
  --muted: 210 30% 94%;
  --accent: 15 90% 65%;
  --success: 150 65% 50%;
  --destructive: 0 75% 55%;

  /* Gradients */
  --gradient-soft: linear-gradient(
    180deg,
    hsl(210, 40%, 98%),
    hsl(195, 70%, 95%)
  );
  --gradient-primary: linear-gradient(
    135deg,
    hsl(190, 80%, 45%),
    hsl(220, 75%, 55%)
  );

  /* Shadows */
  --shadow-card: 0 2px 12px hsla(215, 25%, 20%, 0.08);

  /* Typography */
  font-family: 'Nunito', sans-serif; /* Body text */
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Lora', Georgia, serif; /* Headings */
}
```

#### Tailwind Configuration

Update `tailwind.config.js` to match reference app's extended theme:

- Add Nunito and Lora font families
- Configure color tokens to use CSS variables
- Add custom utilities: `gradient-soft`, `shadow-card`, `transition-smooth`

### Page Components

#### 1. Landing Page (`src/app/page.tsx`)

**Purpose**: Welcome users and introduce the 8 personality frameworks

**Structure**:

```tsx
<div className="min-h-screen gradient-soft">
  <div className="max-w-4xl mx-auto px-4 py-12">
    {/* Hero Section */}
    <div className="text-center mb-16">
      <Sparkles icon />
      <h1>Personality Finder</h1>
      <p>Description</p>
      <Button onClick={() => router.push('/assessment')}>
        Start Your Journey
      </Button>
    </div>

    {/* Frameworks Grid */}
    <Card>
      <h2>Frameworks We Analyze</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* 8 framework cards with icons */}
      </div>
    </Card>

    {/* Privacy Notice */}
    <p className="text-sm text-muted-foreground">🔒 Privacy notice</p>
  </div>
</div>
```

**Key Changes**:

- Remove complex wizard/stepper UI
- Simplify to single-page welcome
- Use gradient-soft background
- Display all 8 frameworks upfront

#### 2. Assessment Page (`src/app/assessment/page.tsx`)

**Purpose**: Collect personality data through accordion-based inputs

**Structure**:

```tsx
<div className="min-h-screen gradient-soft">
  <div className="max-w-6xl mx-auto px-4 py-8">
    {/* Header with back button and layout toggle */}
    <div className="flex items-center justify-between">
      <Button onClick={() => router.back()}>
        <ArrowLeft />
      </Button>
      <h1>Personality Assessment</h1>
      <ToggleGroup>
        {' '}
        {/* Single/Double column */}
        <ToggleGroupItem value="single">
          <List />
        </ToggleGroupItem>
        <ToggleGroupItem value="double">
          <LayoutGrid />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>

    {/* Accordion of frameworks */}
    <Accordion
      type="multiple"
      className={layout === 'double' ? 'grid grid-cols-2' : ''}
    >
      {frameworks.map((framework) => (
        <AccordionItem key={framework.id}>
          <AccordionTrigger>
            <Icon />
            <span>{framework.title}</span>
            {isComplete && <Check />}
          </AccordionTrigger>
          <AccordionContent>
            <p>{framework.origin}</p>
            {framework.component}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>

    {/* View Results Button */}
    <Button onClick={handleViewResults}>View My Insights</Button>
  </div>
</div>
```

**Key Changes**:

- Replace multi-step wizard with single-page accordion
- Add layout toggle (single/double column)
- Show completion checkmarks on accordion items
- Integrate existing input components (BigFiveInput, MBTIInput, etc.)

**Data Flow**:

```
User Input → updateData() → Save to DB via storageService
                          ↓
                    Update local state
                          ↓
                    Show checkmark on accordion
```

#### 3. Results Page (`src/app/results/page.tsx`)

**Purpose**: Display personality insights and profile data

**Structure**:

```tsx
<div className="min-h-screen gradient-soft">
  <div className="max-w-4xl mx-auto px-4 py-8">
    {/* Header */}
    <div className="flex items-center justify-between">
      <Button onClick={() => router.push('/assessment')}>
        <ArrowLeft />
      </Button>
      <h1>Your Insights</h1>
      <Button onClick={handleReset}>Reset</Button>
    </div>

    {/* Tabs */}
    <Tabs defaultValue="insights">
      <TabsList>
        <TabsTrigger value="insights">Insights</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="insights">
        {/* Growth Areas */}
        <section>
          <h2>
            <TrendingUp /> Growth Areas
          </h2>
          {insights.selfImprovement.map((insight) => (
            <InsightCard {...insight} type="improvement" />
          ))}
        </section>

        {/* Strengths, Green Flags, Red Flags sections */}
      </TabsContent>

      <TabsContent value="profile">
        {/* Framework cards with values */}
        {data.bigFive && (
          <Card>
            <h3>Big Five Personality Traits</h3>
            <Button asChild>
              <a href="..." target="_blank">
                Learn More
              </a>
            </Button>
            <Button onClick={() => router.push('/assessment')}>Edit</Button>
            {/* Progress bars for each trait */}
          </Card>
        )}
        {/* Other frameworks */}
      </TabsContent>
    </Tabs>
  </div>
</div>
```

**Key Changes**:

- Replace complex dashboard with tabbed interface
- Group insights by category with icons
- Add "Learn More" external links
- Simplify profile display

### Input Components

Migrate all 8 input components from reference app to current app structure:

1. **BigFiveInput** - Slider inputs for 5 traits (0-100%)
2. **MBTIInput** - 4 toggle groups for I/E, N/S, T/F, J/P
3. **EnneagramInput** - Radio group for types 1-9
4. **AttachmentStyleInput** - Radio group for 4 styles
5. **LoveLanguagesInput** - Drag-and-drop ranking of 5 languages
6. **ZodiacInput** - Select dropdown for 12 signs
7. **ChineseZodiacInput** - Select dropdown for 12 animals
8. **HumanDesignInput** - Radio group for 5 types

**Component Interface Pattern**:

```tsx
interface InputProps {
  data: PersonalityData;
  onUpdate: (newData: Partial<PersonalityData>) => void;
}

// Example: BigFiveInput
export function BigFiveInput({ data, onUpdate }: InputProps) {
  const handleChange = (trait: string, value: number) => {
    onUpdate({
      bigFive: {
        ...data.bigFive,
        [trait]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      {traits.map((trait) => (
        <div key={trait}>
          <Label>{trait}</Label>
          <Slider
            value={[data.bigFive?.[trait] || 50]}
            onValueChange={([value]) => handleChange(trait, value)}
          />
        </div>
      ))}
    </div>
  );
}
```

### Shared UI Components

Copy shadcn/ui components from reference app that aren't in current app:

- `Accordion` - For assessment page
- `Tabs` - For results page
- `ToggleGroup` - For layout switcher
- `Slider` - For Big Five inputs
- Update existing `Card`, `Button` styling to match reference

## Data Models

### PersonalityData Interface

The reference app uses a simpler interface. We'll create an adapter layer:

```typescript
// Reference app interface (simple)
interface ReferencePersonalityData {
  bigFive?: BigFiveScores;
  mbti?: string;
  enneagram?: string;
  zodiacSign?: string;
  chineseZodiac?: string;
  humanDesign?: string;
  attachmentStyle?: string;
  loveLanguages?: string[];
  dateOfBirth?: string;
}

// Current app interface (with metadata)
interface CurrentPersonalityData {
  userId: string;
  bigFive?: BigFiveScores;
  mbti?: string;
  // ... same fields
  createdAt: Date;
  updatedAt: Date;
}

// Adapter functions
function toReferenceFormat(
  current: CurrentPersonalityData
): ReferencePersonalityData {
  const { userId, createdAt, updatedAt, ...rest } = current;
  return rest;
}

function toCurrentFormat(
  reference: ReferencePersonalityData,
  userId: string
): CurrentPersonalityData {
  return {
    ...reference,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
```

### Storage Integration

Replace reference app's localStorage with existing database storage:

```typescript
// Reference app (localStorage)
export const savePersonalityData = (data: PersonalityData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Current app (database) - Keep this!
export const savePersonalityData = async (
  userId: string,
  data: PersonalityData
): Promise<void> => {
  await storageService.savePersonalityData(userId, data);
};
```

**Integration Strategy**:

- UI components call `updateData(newData)`
- `updateData` function saves to database via existing `storageService`
- On page load, fetch from database instead of localStorage
- Maintain session-based user identification

## Error Handling

### Loading States

Add loading skeletons for:

- Assessment page data fetch
- Results page insights generation
- Authentication checks

```tsx
// LoadingSkeleton component
export function AssessmentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}
```

### Error States

Handle common errors:

- **No data on results page**: Redirect to assessment
- **Authentication failure**: Redirect to login
- **Database save failure**: Show toast notification, retry
- **Invalid input**: Show inline validation errors

```tsx
// Error handling pattern
const handleViewResults = () => {
  if (!hasAnyData(data)) {
    toast.error('Please complete at least one assessment');
    return;
  }
  router.push('/results');
};
```

### Validation

Reuse existing validation from `src/lib/services/validation.ts`:

- Big Five scores: 0-100
- MBTI: Valid 4-letter code
- Enneagram: 1-9
- Love Languages: Exactly 5 items, no duplicates

## Testing Strategy

### Component Testing

Focus on new UI components:

1. **Landing Page**
   - Renders all 8 frameworks
   - "Start Your Journey" navigates to assessment
   - Privacy notice displays

2. **Assessment Page**
   - Accordion items expand/collapse
   - Layout toggle switches between single/double column
   - Checkmarks appear when framework completed
   - Data persists on input change
   - "View My Insights" validates data before navigation

3. **Results Page**
   - Redirects if no data
   - Tabs switch between Insights/Profile
   - Insights grouped correctly by type
   - Profile displays all completed frameworks
   - Reset button clears data and redirects

4. **Input Components**
   - Each input updates data correctly
   - Validation prevents invalid inputs
   - Existing data pre-fills inputs

### Integration Testing

Test data flow:

- Input → Save → Retrieve → Display
- Authentication → Protected Route → Data Access
- Insights Generation → Display

### Manual Testing Checklist

- [ ] Complete full user flow: Landing → Assessment → Results
- [ ] Test with no data (first-time user)
- [ ] Test with partial data (some frameworks completed)
- [ ] Test with full data (all frameworks completed)
- [ ] Test authentication flow
- [ ] Test data persistence across page refreshes
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode (if implemented)
- [ ] Test layout toggle on assessment page
- [ ] Test external "Learn More" links

## Migration Plan

### Phase 1: Design System Setup

1. Update `globals.css` with reference app CSS variables
2. Update `tailwind.config.js` with reference app theme
3. Add Nunito and Lora fonts to layout
4. Add missing shadcn/ui components (Accordion, Tabs, ToggleGroup, Slider)

### Phase 2: Page Components

1. Replace landing page (`src/app/page.tsx`)
2. Replace assessment page (`src/app/assessment/page.tsx`)
3. Replace results page (`src/app/results/page.tsx`)
4. Remove unused pages (dashboard, old assessment wizard steps)

### Phase 3: Input Components

1. Copy input components from reference app
2. Adapt to use database storage instead of localStorage
3. Integrate with existing validation
4. Test each input component individually

### Phase 4: Integration & Testing

1. Connect pages with Next.js routing
2. Integrate authentication checks
3. Test full user flow
4. Fix any styling inconsistencies
5. Optimize performance

### Phase 5: Cleanup

1. Remove unused components
2. Remove unused styles
3. Update documentation
4. Remove reference app directory (optional)

## Performance Considerations

### Optimization Strategies

1. **Code Splitting**: Next.js automatic code splitting per page
2. **Lazy Loading**: Lazy load input components in accordion
3. **Memoization**: Memoize insight generation (expensive computation)
4. **Debouncing**: Debounce slider inputs to reduce database writes

```tsx
// Debounced save
const debouncedSave = useMemo(
  () =>
    debounce((data: PersonalityData) => {
      savePersonalityData(userId, data);
    }, 500),
  [userId]
);
```

### Bundle Size

Reference app is lighter than current app:

- Remove unused Next.js features if possible
- Tree-shake unused UI components
- Optimize font loading (subset Nunito/Lora)

## Accessibility

Maintain existing accessibility features:

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation for accordion and tabs
- Focus management
- Color contrast ratios (WCAG AA)
- Screen reader announcements for dynamic content

Reference app has good accessibility patterns - adopt them:

- Proper heading hierarchy
- Descriptive button labels
- Form labels for all inputs
- Skip links (if needed)

## Security

No changes to security model:

- Keep existing ConsentKeys authentication
- Keep existing session management
- Keep existing CSRF protection
- Keep existing input sanitization
- Maintain secure database queries

## Deployment

No changes to deployment process:

- Same Next.js build process
- Same environment variables
- Same database configuration
- Test in staging before production
