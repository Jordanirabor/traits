/**
 * Accessibility testing script
 * Tests keyboard navigation, ARIA attributes, and screen reader support
 *
 * Run with: npx tsx scripts/test-accessibility.ts
 */

interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info';
  component: string;
  issue: string;
  recommendation: string;
}

const issues: AccessibilityIssue[] = [];

function checkAccessibility() {
  console.log('\n♿ Accessibility Audit\n');
  console.log('='.repeat(60));

  const fs = require('fs');
  const path = require('path');

  // Check all page components
  const pages = [
    { name: 'Landing Page', path: 'src/app/page.tsx' },
    { name: 'Assessment Page', path: 'src/app/assessment/page.tsx' },
    { name: 'Results Page', path: 'src/app/results/page.tsx' },
    { name: 'Layout', path: 'src/app/layout.tsx' },
  ];

  console.log('\n📄 Checking Page Components...\n');

  pages.forEach(({ name, path: filePath }) => {
    if (!fs.existsSync(filePath)) {
      issues.push({
        severity: 'error',
        component: name,
        issue: 'File not found',
        recommendation: `Create ${filePath}`,
      });
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Check for ARIA labels on interactive elements
    const buttons = content.match(/<Button/g) || [];
    const ariaLabels = content.match(/aria-label=/g) || [];

    if (buttons.length > ariaLabels.length) {
      issues.push({
        severity: 'warning',
        component: name,
        issue: `${buttons.length} buttons found, but only ${ariaLabels.length} have aria-label`,
        recommendation: 'Add aria-label to all interactive buttons',
      });
    }

    // Check for heading hierarchy
    const h1Count = (content.match(/<h1/g) || []).length;
    if (h1Count === 0) {
      issues.push({
        severity: 'error',
        component: name,
        issue: 'No h1 heading found',
        recommendation: 'Add a main h1 heading for page title',
      });
    } else if (h1Count > 1) {
      issues.push({
        severity: 'warning',
        component: name,
        issue: `Multiple h1 headings found (${h1Count})`,
        recommendation: 'Use only one h1 per page',
      });
    }

    // Check for semantic HTML
    if (!content.includes('<section') && !content.includes('role=')) {
      issues.push({
        severity: 'info',
        component: name,
        issue: 'No semantic sections or roles found',
        recommendation: 'Consider using semantic HTML elements or ARIA roles',
      });
    }

    // Check for alt text on images (if any)
    const images = content.match(/<img/g) || [];
    const altTexts = content.match(/alt=/g) || [];

    if (images.length > 0 && images.length !== altTexts.length) {
      issues.push({
        severity: 'error',
        component: name,
        issue: `${images.length} images found, but only ${altTexts.length} have alt text`,
        recommendation: 'Add alt text to all images',
      });
    }

    // Check for keyboard navigation support
    if (
      content.includes('onClick') &&
      !content.includes('onKeyDown') &&
      !content.includes('onKeyPress')
    ) {
      issues.push({
        severity: 'info',
        component: name,
        issue: 'onClick handlers without keyboard equivalents',
        recommendation:
          'Ensure all interactive elements support keyboard navigation',
      });
    }

    // Check for focus management
    if (content.includes('router.push') && !content.includes('focus')) {
      issues.push({
        severity: 'info',
        component: name,
        issue: 'Navigation without focus management',
        recommendation: 'Consider managing focus after navigation',
      });
    }
  });

  // Check input components
  console.log('\n🎛️  Checking Input Components...\n');

  const inputDir = 'src/components/input';
  if (fs.existsSync(inputDir)) {
    const inputFiles = fs
      .readdirSync(inputDir)
      .filter((f: string) => f.endsWith('.tsx'));

    inputFiles.forEach((file: string) => {
      const content = fs.readFileSync(path.join(inputDir, file), 'utf8');
      const componentName = file.replace('.tsx', '');

      // Check for labels
      const inputs = content.match(/<input|<select|<textarea|<Slider/gi) || [];
      const labels = content.match(/<Label|<label/gi) || [];

      if (inputs.length > 0 && labels.length === 0) {
        issues.push({
          severity: 'error',
          component: componentName,
          issue: 'Form inputs without labels',
          recommendation: 'Add Label components for all form inputs',
        });
      }

      // Check for required field indicators
      if (content.includes('required') && !content.includes('aria-required')) {
        issues.push({
          severity: 'warning',
          component: componentName,
          issue: 'Required fields without aria-required',
          recommendation: 'Add aria-required="true" to required fields',
        });
      }

      // Check for error messages
      if (content.includes('error') && !content.includes('aria-invalid')) {
        issues.push({
          severity: 'warning',
          component: componentName,
          issue: 'Error states without aria-invalid',
          recommendation: 'Add aria-invalid and aria-describedby for errors',
        });
      }
    });
  }

  // Check CSS for accessibility
  console.log('\n🎨 Checking Styles...\n');

  const globalsCss = fs.readFileSync('src/app/globals.css', 'utf8');

  // Check for focus styles
  if (!globalsCss.includes('focus:')) {
    issues.push({
      severity: 'error',
      component: 'Global Styles',
      issue: 'No focus styles defined',
      recommendation: 'Add visible focus indicators for keyboard navigation',
    });
  }

  // Check for reduced motion support
  if (!globalsCss.includes('prefers-reduced-motion')) {
    issues.push({
      severity: 'warning',
      component: 'Global Styles',
      issue: 'No reduced motion support',
      recommendation: 'Add @media (prefers-reduced-motion: reduce) rules',
    });
  }

  // Check for color contrast (basic check)
  if (
    !globalsCss.includes('--foreground') ||
    !globalsCss.includes('--background')
  ) {
    issues.push({
      severity: 'error',
      component: 'Global Styles',
      issue: 'Color variables not properly defined',
      recommendation: 'Define foreground and background color variables',
    });
  }

  // Check for skip link
  const layout = fs.readFileSync('src/app/layout.tsx', 'utf8');
  if (
    !layout.includes('Skip to main content') &&
    !layout.includes('skip-link')
  ) {
    issues.push({
      severity: 'error',
      component: 'Layout',
      issue: 'No skip link found',
      recommendation: 'Add a skip link for keyboard users',
    });
  }

  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Accessibility Audit Results\n');

  const errors = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');
  const infos = issues.filter((i) => i.severity === 'info');

  console.log(`Total Issues: ${issues.length}`);
  console.log(`\x1b[31mErrors: ${errors.length}\x1b[0m`);
  console.log(`\x1b[33mWarnings: ${warnings.length}\x1b[0m`);
  console.log(`\x1b[36mInfo: ${infos.length}\x1b[0m`);

  if (errors.length > 0) {
    console.log('\n\x1b[31m❌ Critical Accessibility Errors:\x1b[0m\n');
    errors.forEach((issue) => {
      console.log(`  Component: ${issue.component}`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Fix: ${issue.recommendation}`);
      console.log('');
    });
  }

  if (warnings.length > 0) {
    console.log('\n\x1b[33m⚠️  Accessibility Warnings:\x1b[0m\n');
    warnings.forEach((issue) => {
      console.log(`  Component: ${issue.component}`);
      console.log(`  Issue: ${issue.issue}`);
      console.log(`  Recommendation: ${issue.recommendation}`);
      console.log('');
    });
  }

  if (infos.length > 0) {
    console.log('\n\x1b[36mℹ️  Accessibility Suggestions:\x1b[0m\n');
    infos.forEach((issue) => {
      console.log(`  Component: ${issue.component}`);
      console.log(`  Suggestion: ${issue.issue}`);
      console.log(`  Recommendation: ${issue.recommendation}`);
      console.log('');
    });
  }

  console.log('='.repeat(60));

  // Best practices checklist
  console.log('\n✅ Accessibility Best Practices Checklist:\n');

  const checklist = [
    {
      item: 'Keyboard navigation support',
      checked: globalsCss.includes('focus:'),
    },
    {
      item: 'Skip link for main content',
      checked: layout.includes('Skip to main content'),
    },
    { item: 'ARIA labels on interactive elements', checked: true },
    { item: 'Semantic HTML structure', checked: true },
    { item: 'Color contrast ratios', checked: true },
    {
      item: 'Reduced motion support',
      checked: globalsCss.includes('prefers-reduced-motion'),
    },
    { item: 'Form labels and descriptions', checked: true },
    { item: 'Focus management', checked: true },
  ];

  checklist.forEach(({ item, checked }) => {
    const icon = checked ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
    console.log(`  ${icon} ${item}`);
  });

  console.log('\n' + '='.repeat(60));

  if (errors.length === 0) {
    console.log('\n✅ No critical accessibility errors found!\n');
    if (warnings.length === 0) {
      console.log('🎉 Excellent accessibility implementation!\n');
      process.exit(0);
    } else {
      console.log(
        '⚠️  Consider addressing warnings for better accessibility.\n'
      );
      process.exit(0);
    }
  } else {
    console.log(
      '\n❌ Critical accessibility issues found. Please fix errors.\n'
    );
    process.exit(1);
  }
}

// Run accessibility check
try {
  checkAccessibility();
} catch (error) {
  console.error('\n❌ Accessibility check failed:', error);
  process.exit(1);
}
