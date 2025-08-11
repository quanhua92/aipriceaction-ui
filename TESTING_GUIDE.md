# Testing Guide for AIPriceAction

This guide covers the comprehensive test suite for the AIPriceAction Vietnamese Stock Market Analysis application.

## 🧪 Test Suite Overview

Our test suite uses **Playwright** for end-to-end testing and covers all major user workflows, pages, and edge cases. The tests are designed to catch regressions, validate user experiences, and ensure the application remains stable across different browsers and devices.

## 📁 Test Structure

```
tests/
├── app.spec.js                    # Core application functionality
├── home.spec.js                   # Home page features
├── portfolio.spec.js              # Portfolio analysis page
├── compare.spec.js                # Chart comparison functionality
├── tickers.spec.js                # Ticker browser page
├── sectors.spec.js                # Sector analysis page
├── ticker-detail.spec.js          # Individual ticker pages
├── mobile-navigation-improved.spec.js  # Mobile responsive navigation
├── e2e-workflows.spec.js          # Complete user workflows
├── vnindex-search.spec.js         # VNINDEX search functionality
└── multi-ticker-select-test.spec.js   # Multi-ticker selection UX
```

## 🚀 Running Tests

### Prerequisites
- Node.js and pnpm installed
- Development server running on port 5174

### Basic Commands

```bash
# Install Playwright browsers (first time only)
pnpx playwright install

# Run all tests
pnpm playwright test

# Run tests with UI (headed mode)
pnpm playwright test --headed

# Run specific test file
pnpm playwright test home.spec.js

# Run tests in specific browser
pnpm playwright test --project=chromium

# Run tests with timeout
timeout 60s pnpm playwright test portfolio.spec.js --headed
```

### Test Reporting

```bash
# Generate HTML report
pnpm playwright show-report

# Run tests with video recording
pnpm playwright test --project=chromium --video=retain-on-failure
```

## 🎯 Test Coverage

### Core Application Tests (`app.spec.js`)
- ✅ Home page loading and structure validation
- ✅ JavaScript error detection and crash prevention  
- ✅ Cross-page navigation functionality
- ✅ Basic page title and header verification

### Home Page Tests (`home.spec.js`)
- ✅ Market overview section display
- ✅ Sector performance cards and navigation
- ✅ Top performers list
- ✅ Chart rendering and visibility
- ✅ Loading state management

### Portfolio Analysis Tests (`portfolio.spec.js`)
- ✅ Empty state with ticker search
- ✅ Portfolio loading from URL parameters
- ✅ Sample portfolio links functionality
- ✅ Adding tickers via search interface
- ✅ Portfolio analysis components (Performance, Risk, Attribution, Diversification)
- ✅ Runtime error prevention
- ✅ Ticker search dialog staying open (UX improvement)

### Chart Comparison Tests (`compare.spec.js`)
- ✅ Empty state with ticker selection
- ✅ Multi-ticker comparison functionality
- ✅ URL parameter loading
- ✅ Date range changes
- ✅ Ticker removal functionality
- ✅ Responsive grid layout with many tickers

### Ticker Browser Tests (`tickers.spec.js`)
- ✅ Ticker list display and search
- ✅ VNINDEX search functionality
- ✅ Navigation to individual ticker pages
- ✅ Performance data display
- ✅ Loading state handling

### Sector Analysis Tests (`sectors.spec.js`)
- ✅ Sector performance overview
- ✅ Performance metrics display
- ✅ Navigation to individual sector pages
- ✅ Sector-specific content validation
- ✅ Chart and performance data rendering

### Individual Ticker Tests (`ticker-detail.spec.js`)
- ✅ Ticker detail page display
- ✅ Chart rendering for individual tickers
- ✅ Date range selection functionality
- ✅ Invalid ticker handling
- ✅ Technical information display

### Mobile Navigation Tests (`mobile-navigation-improved.spec.js`)
- ✅ Mobile hamburger menu functionality
- ✅ Desktop vs mobile navigation switching
- ✅ Menu closing after navigation
- ✅ Responsive breakpoint testing (320px to 1920px)
- ✅ Touch interaction compatibility

### End-to-End Workflow Tests (`e2e-workflows.spec.js`)
- ✅ Complete portfolio creation workflow
- ✅ Ticker discovery and analysis journey
- ✅ Comparison workflow from search to analysis
- ✅ Mobile responsive navigation flow
- ✅ Error handling and edge cases

## 🛠️ Test Configuration

### Browser Support
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)

### Environment Setup
```javascript
// playwright.config.js
{
  baseURL: 'http://localhost:5174',
  retries: 2 (CI only),
  timeout: 5000ms per assertion,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure'
}
```

## 🐛 Debugging Failed Tests

### View Test Results
```bash
# Open HTML report
pnpm playwright show-report

# View screenshots
ls test-results/*/test-failed-*.png

# View videos  
ls test-results/*/video.webm
```

### Common Issues & Solutions

#### Test Timeouts
```javascript
// Increase timeout for slow-loading components
await expect(page.locator('.recharts-wrapper')).toBeVisible({ timeout: 15000 });
```

#### Element Not Found
```javascript
// Use more flexible selectors
await expect(page.locator('h1')).toContainText('Vietnamese Stock Market');
// Instead of exact match
```

#### Network Issues
```javascript
// Wait for network requests to complete
await page.waitForLoadState('networkidle');
await page.waitForTimeout(3000); // Additional wait for data loading
```

## 📝 Writing New Tests

### Test File Template
```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should perform specific functionality', async ({ page }) => {
    await page.goto('/your-page');
    await page.waitForLoadState('networkidle');
    
    // Test assertions
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Best Practices

#### 1. Use Descriptive Test Names
```javascript
// Good ✅
test('should display portfolio analysis without runtime crashes', async ({ page }) => {

// Bad ❌  
test('portfolio test', async ({ page }) => {
```

#### 2. Wait for Content to Load
```javascript
// Always wait for page to be ready
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000); // For heavy data loading
```

#### 3. Use Flexible Selectors
```javascript
// Prefer content-based selectors
await page.locator('text=Portfolio Analysis')

// Over fragile class selectors
await page.locator('.portfolio-title-class')
```

#### 4. Handle Dynamic Content
```javascript
// Check for multiple possible outcomes
const hasData = await page.locator('.data-section').count() > 0;
const hasError = await page.locator('.error-message').count() > 0;
expect(hasData || hasError).toBe(true);
```

#### 5. Test Error Handling
```javascript
// Track JavaScript errors
const errors = [];
page.on('pageerror', error => errors.push(error.message));

// Assert no critical errors occurred
expect(errors.filter(e => e.includes('Error')).length).toBe(0);
```

## 🔍 Test Scenarios Coverage

### Happy Path Scenarios ✅
- User browses from home → sectors → individual stocks
- User creates portfolio → analyzes performance → compares stocks
- User searches tickers → views charts → changes time ranges

### Edge Cases ✅
- Empty portfolio states
- Invalid ticker symbols
- Network loading failures
- Mobile responsive breakpoints
- JavaScript runtime errors

### Error Scenarios ✅
- 404 pages and invalid URLs
- API failures and timeouts  
- Invalid date ranges
- Missing data handling

## 📊 CI/CD Integration

### GitHub Actions Example
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpx playwright install --with-deps
      - run: pnpm playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 🎯 Quality Metrics

Our test suite maintains high quality standards:
- **Coverage**: All major pages and workflows
- **Reliability**: Retries and robust selectors
- **Performance**: Optimized timeouts and parallel execution
- **Maintainability**: Clear structure and documentation
- **Cross-browser**: Desktop and mobile compatibility

## 🤝 Contributing to Tests

### Adding New Features
1. Write tests for new functionality first (TDD approach)
2. Ensure tests cover both happy path and error cases  
3. Test mobile responsiveness for UI changes
4. Update this guide with new test scenarios

### Updating Existing Tests
1. Run affected tests after code changes
2. Update test expectations when UI text/structure changes
3. Maintain backwards compatibility where possible
4. Document breaking changes in test behavior

## 🚨 Troubleshooting

### Common Error Messages

**"Element not found"**
- Check if page finished loading: `await page.waitForLoadState('networkidle')`
- Verify element exists in current application state
- Use broader selectors: `text=partial match` instead of exact text

**"Test timeout"**
- Increase timeout for slow operations: `{ timeout: 15000 }`
- Check if development server is running
- Verify network requests are completing

**"Navigation failed"**
- Ensure development server is running on correct port (5174)
- Check for JavaScript errors preventing navigation
- Verify URL routing is working correctly

### Debug Commands
```bash
# Run single test with debug info
DEBUG=pw:api pnpm playwright test home.spec.js

# Run tests in debug mode (step through)
pnpm playwright test --debug

# Generate trace files for analysis
pnpm playwright test --trace on
```

---

## 📞 Support

For testing issues:
1. Check the [Playwright documentation](https://playwright.dev/docs/intro)
2. Review test failure screenshots in `test-results/`
3. Check development server logs for API issues
4. Ensure all dependencies are installed: `pnpm install`

**Happy Testing! 🧪✨**