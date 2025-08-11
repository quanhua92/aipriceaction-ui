import { test, expect } from '@playwright/test';

test.describe('Tickers Page', () => {
  test('should display ticker browser with search', async ({ page }) => {
    await page.goto('/tickers');
    await page.waitForLoadState('networkidle');
    
    // Should show page title
    await expect(page.locator('h1')).toContainText('All Stock Tickers');
    
    // Should have search functionality
    await expect(page.locator('input[placeholder*="Search"], input[placeholder*="tickers"]')).toBeVisible();
    
    // Should show ticker list or table
    const tickerElements = page.locator('text=/^[A-Z]{3,4}$/');
    const tickerCount = await tickerElements.count();
    expect(tickerCount).toBeGreaterThan(5);
  });
  
  test('should support ticker search functionality', async ({ page }) => {
    await page.goto('/tickers');
    await page.waitForLoadState('networkidle');
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="tickers"]').first();
    await searchInput.fill('VCB');
    await page.waitForTimeout(1000);
    
    // Should show VCB in results
    await expect(page.locator('text=VCB')).toBeVisible();
    
    // Test VNINDEX search (from the original test)
    await searchInput.fill('VNINDEX');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=VNINDEX')).toBeVisible();
  });
  
  test('should allow navigation to individual ticker pages', async ({ page }) => {
    await page.goto('/tickers');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Find a ticker link and click it
    const tickerLink = page.locator('a[href*="/ticker/"], text=/^[A-Z]{3}$/ >> nth=0');
    const tickerLinkCount = await tickerLink.count();
    
    if (tickerLinkCount > 0) {
      await tickerLink.first().click();
      
      // Should navigate to ticker page
      await expect(page).toHaveURL(/\/ticker\/[A-Z]+/);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
  
  test('should show ticker performance data', async ({ page }) => {
    await page.goto('/tickers');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should show some performance indicators (prices, changes, etc.)
    const performanceElements = page.locator('text=%, text=/[+\\-]\\d/, text=/\\d+,\\d+/');
    const performanceCount = await performanceElements.count();
    expect(performanceCount).toBeGreaterThan(0);
  });

  test('should handle loading states appropriately', async ({ page }) => {
    await page.goto('/tickers');
    
    // Should not show persistent loading after reasonable time
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    const loadingIndicators = page.locator('text=Loading, text=loading');
    const persistentLoading = await loadingIndicators.count();
    expect(persistentLoading).toBeLessThan(2);
  });
});