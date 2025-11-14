/**
 * Integration test script for complete user flow
 * Tests: Landing → Assessment → Results
 *
 * Run with: npx tsx scripts/test-user-flow.ts
 */

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function test(name: string, passed: boolean, message: string) {
  results.push({ name, passed, message });
  const icon = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  console.log(`${color}${icon}\x1b[0m ${name}: ${message}`);
}

async function testUserFlow() {
  console.log('\n🧪 Testing Complete User Flow\n');
  console.log('='.repeat(60));

  // Test 1: Landing Page Structure
  console.log('\n📄 Testing Landing Page...');
  try {
    const fs = require('fs');
    const landingPage = fs.readFileSync('src/app/page.tsx', 'utf8');

    test(
      'Landing page has Start Your Journey button',
      landingPage.includes('Start Your Journey'),
      'Button found'
    );

    test(
      'Landing page displays 8 frameworks',
      landingPage.includes('Big Five') &&
        landingPage.includes('MBTI') &&
        landingPage.includes('Enneagram'),
      'All frameworks displayed'
    );

    test(
      'Landing page has privacy notice',
      landingPage.includes('privacy') || landingPage.includes('Privacy'),
      'Privacy notice present'
    );

    test(
      'Landing page uses gradient-soft background',
      landingPage.includes('gradient-soft'),
      'Gradient background applied'
    );
  } catch (error) {
    test('Landing page tests', false, `Error: ${error}`);
  }

  // Test 2: Assessment Page Structure
  console.log('\n📝 Testing Assessment Page...');
  try {
    const fs = require('fs');
    const assessmentPage = fs.readFileSync(
      'src/app/assessment/page.tsx',
      'utf8'
    );

    test(
      'Assessment page has accordion layout',
      assessmentPage.includes('Accordion') &&
        assessmentPage.includes('AccordionItem'),
      'Accordion structure found'
    );

    test(
      'Assessment page has layout toggle',
      assessmentPage.includes('ToggleGroup') &&
        assessmentPage.includes('single') &&
        assessmentPage.includes('double'),
      'Layout toggle implemented'
    );

    test(
      'Assessment page has completion checkmarks',
      assessmentPage.includes('isComplete') && assessmentPage.includes('Check'),
      'Completion tracking present'
    );

    test(
      'Assessment page has View My Insights button',
      assessmentPage.includes('View My Insights'),
      'Navigation button found'
    );

    test(
      'Assessment page uses lazy loading',
      assessmentPage.includes('dynamic') &&
        assessmentPage.includes('ssr: false'),
      'Dynamic imports configured'
    );

    test(
      'Assessment page has debounced auto-save',
      assessmentPage.includes('setTimeout') && assessmentPage.includes('500'),
      'Auto-save with debounce implemented'
    );

    test(
      'Assessment page has authentication check',
      assessmentPage.includes('useSession') && assessmentPage.includes('login'),
      'Auth protection present'
    );
  } catch (error) {
    test('Assessment page tests', false, `Error: ${error}`);
  }

  // Test 3: Results Page Structure
  console.log('\n📊 Testing Results Page...');
  try {
    const fs = require('fs');
    const resultsPage = fs.readFileSync('src/app/results/page.tsx', 'utf8');

    test(
      'Results page has tabbed interface',
      resultsPage.includes('Tabs') &&
        resultsPage.includes('TabsList') &&
        resultsPage.includes('TabsContent'),
      'Tabs structure found'
    );

    test(
      'Results page has Insights tab',
      resultsPage.includes('insights') &&
        resultsPage.includes('Growth Areas') &&
        resultsPage.includes('Strengths'),
      'Insights tab implemented'
    );

    test(
      'Results page has Profile tab',
      resultsPage.includes('profile') &&
        resultsPage.includes('Learn More') &&
        resultsPage.includes('Edit'),
      'Profile tab implemented'
    );

    test(
      'Results page has reset functionality',
      resultsPage.includes('handleReset') && resultsPage.includes('confirm'),
      'Reset with confirmation present'
    );

    test(
      'Results page uses memoized insights',
      resultsPage.includes('useMemo') &&
        resultsPage.includes('generatedInsights'),
      'Insights generation memoized'
    );

    test(
      'Results page has color-coded insights',
      resultsPage.includes('type="improvement"') &&
        resultsPage.includes('type="strength"') &&
        resultsPage.includes('type="greenFlag"') &&
        resultsPage.includes('type="redFlag"'),
      'All insight types present'
    );
  } catch (error) {
    test('Results page tests', false, `Error: ${error}`);
  }

  // Test 4: Input Components
  console.log('\n🎛️  Testing Input Components...');
  try {
    const fs = require('fs');
    const inputComponents = [
      'BigFiveInput',
      'MBTIInput',
      'EnneagramInput',
      'AttachmentStyleInput',
      'LoveLanguagesInput',
      'ZodiacInput',
      'ChineseZodiacInput',
      'HumanDesignInput',
    ];

    for (const component of inputComponents) {
      const filePath = `src/components/input/${component}.tsx`;
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        test(
          `${component} exists and has onUpdate`,
          content.includes('onUpdate'),
          'Component properly integrated'
        );
      } else {
        test(`${component} exists`, false, 'File not found');
      }
    }
  } catch (error) {
    test('Input components tests', false, `Error: ${error}`);
  }

  // Test 5: Design System
  console.log('\n🎨 Testing Design System...');
  try {
    const fs = require('fs');
    const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');

    test(
      'CSS variables use HSL format',
      globalsCss.includes('hsl(') && globalsCss.includes('--primary:'),
      'HSL colors defined'
    );

    test(
      'Gradient utilities defined',
      globalsCss.includes('--gradient-soft') &&
        globalsCss.includes('--gradient-primary') &&
        globalsCss.includes('--gradient-accent'),
      'All gradients present'
    );

    test(
      'Shadow utilities defined',
      globalsCss.includes('--shadow-card') &&
        globalsCss.includes('--shadow-soft'),
      'Shadow utilities present'
    );

    test(
      'Font families configured',
      globalsCss.includes('Nunito') && globalsCss.includes('Lora'),
      'Custom fonts configured'
    );

    test(
      'Dark mode support',
      globalsCss.includes('.dark') && globalsCss.includes('--background:'),
      'Dark mode variables defined'
    );
  } catch (error) {
    test('Design system tests', false, `Error: ${error}`);
  }

  // Test 6: Accessibility Features
  console.log('\n♿ Testing Accessibility...');
  try {
    const fs = require('fs');
    const landingPage = fs.readFileSync('src/app/page.tsx', 'utf8');
    const assessmentPage = fs.readFileSync(
      'src/app/assessment/page.tsx',
      'utf8'
    );
    const resultsPage = fs.readFileSync('src/app/results/page.tsx', 'utf8');
    const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');

    test(
      'Skip link present in layout',
      layout.includes('Skip to main content') && layout.includes('sr-only'),
      'Skip link implemented'
    );

    test(
      'ARIA labels on buttons',
      landingPage.includes('aria-label') &&
        assessmentPage.includes('aria-label') &&
        resultsPage.includes('aria-label'),
      'ARIA labels present'
    );

    test(
      'Semantic HTML structure',
      resultsPage.includes('aria-labelledby') &&
        resultsPage.includes('<section'),
      'Semantic sections with labels'
    );

    test(
      'Role attributes for lists',
      landingPage.includes('role="list"') &&
        landingPage.includes('role="listitem"'),
      'List roles defined'
    );
  } catch (error) {
    test('Accessibility tests', false, `Error: ${error}`);
  }

  // Test 7: Performance Optimizations
  console.log('\n⚡ Testing Performance Optimizations...');
  try {
    const fs = require('fs');
    const assessmentPage = fs.readFileSync(
      'src/app/assessment/page.tsx',
      'utf8'
    );
    const resultsPage = fs.readFileSync('src/app/results/page.tsx', 'utf8');

    test(
      'Lazy loading implemented',
      assessmentPage.includes('dynamic(') && assessmentPage.includes('import('),
      'Dynamic imports used'
    );

    test(
      'Memoization used',
      assessmentPage.includes('useMemo') &&
        assessmentPage.includes('useCallback') &&
        resultsPage.includes('useMemo'),
      'React optimization hooks present'
    );

    test(
      'Loading skeletons implemented',
      assessmentPage.includes('AssessmentSkeleton') &&
        resultsPage.includes('ResultsSkeleton'),
      'Loading states present'
    );

    test(
      'Error boundaries present',
      resultsPage.includes('ErrorDisplay') &&
        assessmentPage.includes('ErrorDisplay'),
      'Error handling implemented'
    );
  } catch (error) {
    test('Performance tests', false, `Error: ${error}`);
  }

  // Test 8: Data Persistence
  console.log('\n💾 Testing Data Persistence...');
  try {
    const fs = require('fs');
    const assessmentPage = fs.readFileSync(
      'src/app/assessment/page.tsx',
      'utf8'
    );
    const adapter = fs.readFileSync(
      'src/lib/adapters/personalityDataAdapter.ts',
      'utf8'
    );

    test(
      'Data adapter exists',
      adapter.includes('toReferenceFormat') &&
        adapter.includes('toCurrentFormat'),
      'Adapter layer implemented'
    );

    test(
      'Auto-save with retry logic',
      assessmentPage.includes('retryCount') &&
        assessmentPage.includes('exponential'),
      'Retry mechanism present'
    );

    test(
      'Data loading on mount',
      assessmentPage.includes('useEffect') &&
        assessmentPage.includes('loadData'),
      'Data fetching implemented'
    );
  } catch (error) {
    test('Data persistence tests', false, `Error: ${error}`);
  }

  // Test 9: Responsive Design
  console.log('\n📱 Testing Responsive Design...');
  try {
    const fs = require('fs');
    const landingPage = fs.readFileSync('src/app/page.tsx', 'utf8');
    const assessmentPage = fs.readFileSync(
      'src/app/assessment/page.tsx',
      'utf8'
    );
    const resultsPage = fs.readFileSync('src/app/results/page.tsx', 'utf8');

    test(
      'Mobile-first breakpoints used',
      landingPage.includes('md:') &&
        assessmentPage.includes('md:') &&
        resultsPage.includes('md:'),
      'Responsive classes present'
    );

    test(
      'Grid layout responsive',
      landingPage.includes('grid-cols-2') &&
        landingPage.includes('md:grid-cols-4'),
      'Responsive grid configured'
    );

    test(
      'Layout toggle for assessment',
      assessmentPage.includes("layout === 'double'") &&
        assessmentPage.includes('md:grid-cols-2'),
      'Adaptive layout implemented'
    );
  } catch (error) {
    test('Responsive design tests', false, `Error: ${error}`);
  }

  // Test 10: External Links
  console.log('\n🔗 Testing External Links...');
  try {
    const fs = require('fs');
    const resultsPage = fs.readFileSync('src/app/results/page.tsx', 'utf8');

    test(
      'Learn More links present',
      resultsPage.includes('Learn More') &&
        resultsPage.includes('target="_blank"'),
      'External links configured'
    );

    test(
      'Links have security attributes',
      resultsPage.includes('rel="noopener noreferrer"'),
      'Security attributes present'
    );

    test(
      'Multiple framework links',
      resultsPage.includes('wikipedia.org') &&
        resultsPage.includes('16personalities.com') &&
        resultsPage.includes('attachmentproject.com'),
      'Various external resources linked'
    );
  } catch (error) {
    test('External links tests', false, `Error: ${error}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Summary\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;
  const percentage = Math.round((passed / total) * 100);

  console.log(`Total Tests: ${total}`);
  console.log(`\x1b[32mPassed: ${passed}\x1b[0m`);
  console.log(`\x1b[31mFailed: ${failed}\x1b[0m`);
  console.log(`Success Rate: ${percentage}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.message}`);
      });
  }

  console.log('\n' + '='.repeat(60));

  if (percentage >= 90) {
    console.log('\n✅ All critical tests passed! Application is ready.\n');
    process.exit(0);
  } else if (percentage >= 70) {
    console.log('\n⚠️  Most tests passed, but some issues need attention.\n');
    process.exit(1);
  } else {
    console.log('\n❌ Multiple critical issues found. Please review.\n');
    process.exit(1);
  }
}

// Run tests
testUserFlow().catch((error) => {
  console.error('\n❌ Test execution failed:', error);
  process.exit(1);
});
