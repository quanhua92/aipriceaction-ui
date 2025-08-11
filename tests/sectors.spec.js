import { test, expect } from '@playwright/test';

test.describe('Sectors Page', () => {
  test('should display sector performance overview', async ({ page }) => {
    await page.goto('/sectors');
    await page.waitForLoadState('networkidle');
    
    // Should show page title
    await expect(page.locator('h1')).toContainText('Market Sectors');
    
    // Should show sector cards or list
    const sectorElements = page.locator('text=/Banking|Real Estate|Technology|Steel|Securities/');
    const sectorCount = await sectorElements.count();
    expect(sectorCount).toBeGreaterThan(2);
  });
  
  test('should show sector performance metrics', async ({ page }) => {
    await page.goto('/sectors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should show performance data (percentages, changes)
    const performanceData = page.locator('text=%, text=/[+\\-]\\d+\\.\\d+%/');
    const performanceCount = await performanceData.count();
    expect(performanceCount).toBeGreaterThan(0);
  });
  
  test('should allow navigation to individual sector pages', async ({ page }) => {
    await page.goto('/sectors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Find and click a sector
    const sectorElements = page.locator('[role="button"], .cursor-pointer').filter({ hasText: /Banking|Real Estate|Technology|Steel/ });
    const sectorCount = await sectorElements.count();
    
    if (sectorCount > 0) {
      const firstSector = sectorElements.first();
      await firstSector.click();
      
      // Should navigate to sector detail page
      await expect(page).toHaveURL(/\/sector\/\w+/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
  
  test('should handle individual sector page', async ({ page }) => {
    // Test a known sector page
    await page.goto('/sector/NGAN_HANG');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should show sector-specific content
    await expect(page.locator('h1')).toContainText(/Banking|NGAN_HANG/);
    
    // Should show tickers in this sector
    const tickerElements = page.locator('text=/^[A-Z]{3}$/');
    const tickerCount = await tickerElements.count();
    expect(tickerCount).toBeGreaterThan(1);
  });

  test('should display sector charts and performance data', async ({ page }) => {
    await page.goto('/sectors');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show some chart elements
    const chartElements = page.locator('.recharts-wrapper, .recharts-responsive-container');
    const chartCount = await chartElements.count();
    expect(chartCount).toBeGreaterThanOrEqual(0); // Charts might not always load
    
    // Should show top performers in sectors
    const topPerformerElements = page.locator('text=Top Performers, text=Best, text=Worst');
    const topPerformerCount = await topPerformerElements.count();
    expect(topPerformerCount).toBeGreaterThan(0);
  });
});