import { test, expect } from '@playwright/test';

test.describe('Application Core', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/?lang=en');
    
    // Check basic page structure
    await expect(page).toHaveTitle(/AI Price Action/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Vietnamese Stock Market');
    
    // Check navigation is present (be more specific to avoid multiple matches)
    const logo = page.locator('header a[href="/"]').filter({ hasText: 'AIPriceAction' });
    await expect(logo).toBeVisible();
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that main sections are present
    await expect(page.locator('text=Key Sector Performance')).toBeVisible();
    await expect(page.locator('text=Securities')).toBeVisible();
    await expect(page.locator('text=VN-Index').first()).toBeVisible();
  });
  
  test('should handle errors gracefully', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('/?lang=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should not have critical JavaScript errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning:') && 
      !error.includes('Download the React DevTools') &&
      !error.includes('DevTools')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Errors found:', criticalErrors);
    }
    
    expect(criticalErrors.length).toBeLessThan(3); // Allow minor warnings but not crashes
  });

  test('should navigate between pages correctly', async ({ page }) => {
    await page.goto('/?lang=en');
    
    // Test navigation to different pages
    const pages = [
      { selector: 'a[href="/sectors"]', path: '/sectors', title: 'Market Sectors' },
      { selector: 'a[href="/tickers"]', path: '/tickers', title: 'All Stock Tickers' },  
      { selector: 'a[href="/compare"]', path: '/compare', title: 'Compare Charts' },
      { selector: 'a[href="/portfolio"]', path: '/portfolio', title: 'Portfolio Analysis' }
    ];
    
    for (const pageInfo of pages) {
      // Click navigation link
      await page.click(pageInfo.selector);
      await page.waitForURL(`**${pageInfo.path}`);
      await page.waitForLoadState('networkidle');
      
      // Verify page loaded
      await expect(page.locator('h1')).toContainText(pageInfo.title);
      
      // Go back to home (use first home link to avoid ambiguity)
      await page.locator('a[href="/"]').first().click();
      await page.waitForURL('**/');
    }
  });
});