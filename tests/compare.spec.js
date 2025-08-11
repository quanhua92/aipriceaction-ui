import { test, expect } from '@playwright/test';

test.describe('Compare Charts', () => {
  test('should show empty state with ticker selection', async ({ page }) => {
    await page.goto('/compare?lang=en');
    await page.waitForLoadState('networkidle');
    
    // Should show compare page title
    await expect(page.locator('h1')).toContainText('Compare Charts');
    
    // Should have ticker selection
    await expect(page.locator('text=Select Tickers')).toBeVisible();
    await expect(page.locator('button[role="combobox"]')).toBeVisible();
    
    // Should have date range selector
    await expect(page.locator('text=1M, text=3M, text=6M')).toBeVisible();
  });
  
  test('should allow comparing multiple tickers', async ({ page }) => {
    await page.goto('/compare?lang=en');
    await page.waitForLoadState('networkidle');
    
    // Add first ticker
    const searchButton = page.locator('button[role="combobox"]');
    await searchButton.click();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('VCB');
    await page.waitForTimeout(1000);
    
    const vcbOption = page.locator('span:has-text("VCB")').first();
    await vcbOption.click();
    await page.waitForTimeout(500);
    
    // Add second ticker (dialog should stay open)
    await searchInput.fill('BID');  
    await page.waitForTimeout(1000);
    
    const bidOption = page.locator('span:has-text("BID")').first();
    await bidOption.click();
    await page.waitForTimeout(1000);
    
    // Should show both tickers in URL and on page
    await expect(page).toHaveURL(/tickers=.*VCB/);
    await expect(page).toHaveURL(/tickers=.*BID/);
    
    // Should show comparison charts
    const charts = page.locator('.recharts-wrapper, .recharts-responsive-container');
    await expect(charts.first()).toBeVisible({ timeout: 10000 });
  });
  
  test('should load compare page with URL parameters', async ({ page }) => {
    await page.goto('/compare?tickers=VCB&tickers=BID&tickers=VNINDEX&range=6M&lang=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show selected tickers
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible(); 
    await expect(page.locator('text=VNINDEX')).toBeVisible();
    
    // Should show charts in responsive grid
    const chartContainers = page.locator('.grid-cols-1.md\\:grid-cols-2').first();
    await expect(chartContainers).toBeVisible();
    
    // Should have multiple chart elements
    const charts = page.locator('.recharts-wrapper');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThanOrEqual(2);
  });
  
  test('should handle date range changes', async ({ page }) => {
    await page.goto('/compare?tickers=VNINDEX&range=3M&lang=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Test different time ranges
    const ranges = ['1M', '6M', '1Y'];
    
    for (const range of ranges) {
      const rangeButton = page.locator(`button:has-text("${range}")`).first();
      await rangeButton.click();
      await page.waitForTimeout(1000);
      
      // Should update URL
      await expect(page).toHaveURL(new RegExp(`range=${range}`));
    }
  });

  test('should support removing tickers', async ({ page }) => {
    await page.goto('/compare?tickers=VCB&tickers=BID&tickers=HPG&range=3M&lang=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Should show all tickers initially
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
    await expect(page.locator('text=HPG')).toBeVisible();
    
    // Remove BID ticker (click the X or remove button)
    const bidBadge = page.locator('text=BID').locator('..').locator('button, [role="button"]').first();
    await bidBadge.click();
    await page.waitForTimeout(500);
    
    // BID should be removed from URL
    await expect(page).toHaveURL(/^(?!.*BID).*/);
    
    // VCB and HPG should still be there
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=HPG')).toBeVisible();
  });

  test('should handle large number of tickers', async ({ page }) => {
    // Test with many tickers to ensure responsive grid works
    const tickers = ['VCB', 'BID', 'CTG', 'ACB', 'HPG', 'VHM'];
    const tickerParams = tickers.map(t => `tickers=${t}`).join('&');
    
    await page.goto(`/compare?${tickerParams}&range=3M&lang=en`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show all tickers
    for (const ticker of tickers) {
      await expect(page.locator(`text=${ticker}`)).toBeVisible();
    }
    
    // Should have responsive grid layout
    const gridContainer = page.locator('.grid-cols-1.md\\:grid-cols-2');
    await expect(gridContainer).toBeVisible();
    
    // Charts should be visible (at least some)
    const charts = page.locator('.recharts-wrapper');
    const chartCount = await charts.count();
    expect(chartCount).toBeGreaterThanOrEqual(3);
  });
});