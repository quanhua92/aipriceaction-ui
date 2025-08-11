import { test, expect } from '@playwright/test';

test.describe('Individual Ticker Pages', () => {
  test('should display ticker detail page', async ({ page }) => {
    // Test a known ticker
    await page.goto('/ticker/VCB');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should show ticker name/symbol
    await expect(page.locator('h1')).toContainText('VCB');
    
    // Should show price information
    const priceElements = page.locator('text=/\\d+,\\d+/, text=/[+\\-]\\d+\\.\\d+%/');
    const priceCount = await priceElements.count();
    expect(priceCount).toBeGreaterThan(0);
  });
  
  test('should display ticker chart', async ({ page }) => {
    await page.goto('/ticker/VNINDEX');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show chart
    const chartElements = page.locator('.recharts-wrapper, .recharts-responsive-container');
    await expect(chartElements.first()).toBeVisible({ timeout: 15000 });
  });
  
  test('should support date range selection on ticker page', async ({ page }) => {
    await page.goto('/ticker/VCB');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Should have date range buttons
    const rangeButtons = page.locator('button:has-text("1M"), button:has-text("3M"), button:has-text("6M")');
    const rangeCount = await rangeButtons.count();
    expect(rangeCount).toBeGreaterThan(2);
    
    // Test clicking different ranges
    const sixMonthButton = page.locator('button:has-text("6M")').first();
    await sixMonthButton.click();
    await page.waitForTimeout(1000);
    
    // Should update URL or state
    // The exact behavior depends on implementation
  });
  
  test('should handle invalid ticker gracefully', async ({ page }) => {
    // Test with non-existent ticker
    await page.goto('/ticker/INVALID123');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should not crash - either show error or redirect
    const hasError = await page.locator('text=Error, text=Not found, text=Invalid').count() > 0;
    const hasContent = await page.locator('h1').count() > 0;
    
    // Should handle gracefully (either error message or some content)
    expect(hasError || hasContent).toBe(true);
  });

  test('should show ticker technical information', async ({ page }) => {
    await page.goto('/ticker/VCB?range=3M');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show various ticker information
    const infoElements = page.locator('text=Open, text=High, text=Low, text=Close, text=Volume');
    const infoCount = await infoElements.count();
    expect(infoCount).toBeGreaterThan(1);
  });
});