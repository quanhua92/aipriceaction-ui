import { test, expect } from '@playwright/test';

test.describe('End-to-End User Workflows', () => {
  test('complete portfolio creation workflow', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to portfolio
    await page.click('a[href="/portfolio"]');
    await page.waitForURL('**/portfolio');
    await page.waitForLoadState('networkidle');
    
    // Should show empty state
    await expect(page.locator('text=Build Your Portfolio')).toBeVisible();
    
    // Try sample banking portfolio
    await page.click('text=Banking Portfolio');
    await page.waitForURL(/tickers=.*VCB/);
    await page.waitForTimeout(3000);
    
    // Should show portfolio analysis
    await expect(page.locator('text=Performance Overview')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Risk Analysis')).toBeVisible();
    
    // Add another stock using search
    const searchButton = page.locator('button[role="combobox"]').last();
    await searchButton.click();
    
    const searchInput = page.locator('input[placeholder*="add stocks"]');
    await searchInput.fill('HPG');
    await page.waitForTimeout(1000);
    
    const hpgOption = page.locator('span:has-text("HPG")').first();
    await hpgOption.click();
    
    // Should add HPG to portfolio
    await expect(page).toHaveURL(/tickers=.*HPG/);
    await expect(page.locator('text=HPG')).toBeVisible();
    
    // Change date range
    const sixMonthButton = page.locator('button:has-text("6M")').first();
    await sixMonthButton.click();
    await expect(page).toHaveURL(/range=6M/);
    
    // Open in compare view
    const compareButton = page.locator('text=Open in Compare');
    await compareButton.click();
    await page.waitForURL('**/compare');
    
    // Should show comparison charts
    await expect(page.locator('.recharts-wrapper')).toBeVisible({ timeout: 10000 });
  });
  
  test('ticker discovery and analysis workflow', async ({ page }) => {
    // Start by browsing sectors
    await page.goto('/sectors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click on a sector
    const sectorCard = page.locator('[role="button"], .cursor-pointer').filter({ hasText: /Banking|Real Estate/ }).first();
    await sectorCard.click();
    await page.waitForURL(/\/sector\/\w+/);
    await page.waitForTimeout(2000);
    
    // Should show sector details
    await expect(page.locator('h1')).toBeVisible();
    
    // Find a ticker in the sector and click it
    const tickerLink = page.locator('text=/^[A-Z]{3}$/', '[href*="/ticker/"]').first();
    const tickerExists = await tickerLink.count() > 0;
    
    if (tickerExists) {
      await tickerLink.click();
      await page.waitForURL(/\/ticker\/[A-Z]+/);
      await page.waitForTimeout(2000);
      
      // Should show ticker chart
      await expect(page.locator('.recharts-wrapper')).toBeVisible({ timeout: 15000 });
      
      // Test different time ranges
      const oneYearButton = page.locator('button:has-text("1Y")').first();
      if (await oneYearButton.count() > 0) {
        await oneYearButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });
  
  test('comparison workflow from ticker search', async ({ page }) => {
    // Start at tickers page
    await page.goto('/tickers');
    await page.waitForLoadState('networkidle');
    
    // Search for a specific ticker
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('VNINDEX');
    await page.waitForTimeout(1000);
    
    // Should find VNINDEX
    await expect(page.locator('text=VNINDEX')).toBeVisible();
    
    // Navigate to compare page
    await page.goto('/compare');
    await page.waitForLoadState('networkidle');
    
    // Add multiple tickers for comparison
    const compareSearch = page.locator('button[role="combobox"]');
    await compareSearch.click();
    
    const compareInput = page.locator('input[placeholder*="Search"]');
    
    // Add first ticker
    await compareInput.fill('VNINDEX');
    await page.waitForTimeout(1000);
    await page.click('span:has-text("VNINDEX")');
    await page.waitForTimeout(500);
    
    // Add second ticker (dialog should stay open)
    await compareInput.fill('VCB');
    await page.waitForTimeout(1000); 
    await page.click('span:has-text("VCB")');
    await page.waitForTimeout(500);
    
    // Add third ticker
    await compareInput.fill('HPG');
    await page.waitForTimeout(1000);
    await page.click('span:has-text("HPG")');
    await page.waitForTimeout(1000);
    
    // Should show all tickers
    await expect(page.locator('text=VNINDEX')).toBeVisible();
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=HPG')).toBeVisible();
    
    // Should show comparison charts
    const charts = page.locator('.recharts-wrapper');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThanOrEqual(2);
  });

  test('mobile responsive navigation workflow', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should show mobile navigation
    const hamburger = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(hamburger).toBeVisible();
    
    // Open mobile menu
    await hamburger.click();
    const mobileMenu = page.locator('div.md\\:hidden.border-t');
    await expect(mobileMenu).toBeVisible();
    
    // Navigate to portfolio via mobile menu
    await page.click('div.md\\:hidden nav a[href="/portfolio"]');
    await page.waitForURL('**/portfolio');
    
    // Menu should close after navigation
    await expect(mobileMenu).not.toBeVisible();
    
    // Should work on mobile - test ticker search
    const mobileSearch = page.locator('button[role="combobox"]').first();
    await mobileSearch.click();
    
    const mobileSearchInput = page.locator('input[placeholder*="stock symbol"]');
    await mobileSearchInput.fill('VCB');
    await page.waitForTimeout(1000);
    
    await page.click('span:has-text("VCB")');
    
    // Should work on mobile
    await expect(page).toHaveURL(/tickers=.*VCB/);
  });

  test('error handling and edge cases workflow', async ({ page }) => {
    // Track errors throughout the workflow
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    // Test invalid URLs
    await page.goto('/invalid-page-123');
    await page.waitForLoadState('networkidle');
    // Should handle gracefully (404 or redirect)
    
    // Test empty portfolio with analysis
    await page.goto('/portfolio?range=INVALID');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should still show portfolio page
    await expect(page.locator('h1')).toContainText('Portfolio Analysis');
    
    // Test invalid ticker comparison
    await page.goto('/compare?tickers=INVALID123&range=3M');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should handle gracefully
    await expect(page.locator('h1')).toContainText('Compare Charts');
    
    // Check that no critical errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning:') && 
      !error.includes('DevTools') &&
      error.toLowerCase().includes('error')
    );
    
    expect(criticalErrors.length).toBeLessThan(2);
  });
});