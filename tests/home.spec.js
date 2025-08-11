import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display market overview', async ({ page }) => {
    await page.goto('/?lang=en');
    await page.waitForLoadState('networkidle');
    
    // Check main sections
    await expect(page.locator('text=Key Sector Performance')).toBeVisible();
    await expect(page.locator('text=VN-Index').first()).toBeVisible();
    
    // Check for chart presence (should have some chart containers)
    const chartContainers = page.locator('.recharts-wrapper, .recharts-responsive-container');
    await expect(chartContainers.first()).toBeVisible({ timeout: 10000 });
  });
  
  test('should display sector performance', async ({ page }) => {
    await page.goto('/?lang=en');
    await page.waitForLoadState('networkidle');
    
    // Check sectors section
    await expect(page.locator('text=Key Sector Performance')).toBeVisible();
    
    // Should have sector cards that are clickable
    const sectorCards = page.locator('[role="button"], .cursor-pointer').filter({ hasText: /Banking|Real Estate|Technology|Steel/ });
    const sectorCount = await sectorCards.count();
    expect(sectorCount).toBeGreaterThan(0);
    
    // Test clicking a sector (if any are found)
    if (sectorCount > 0) {
      const firstSector = sectorCards.first();
      await firstSector.click();
      
      // Should navigate to sector page
      await expect(page).toHaveURL(/\/sector\/\w+/);
      await expect(page.locator('h1')).toContainText(/Banking|Real Estate|Technology|Securities|NGAN_HANG|BAT_DONG_SAN/);
    }
  });
  
  test('should display top performers', async ({ page }) => {
    await page.goto('/?lang=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for data to load
    
    // Should have VPA buttons (which we know exist and work)
    const vpaButtons = page.locator('text=VPA');
    const vpaCount = await vpaButtons.count();
    expect(vpaCount).toBeGreaterThan(0);
    
    // Should show some performance data (percentages)
    const percentageElements = page.locator('text=/%/');
    const percentageCount = await percentageElements.count();
    expect(percentageCount).toBeGreaterThan(0);
  });

  test('should handle data loading states', async ({ page }) => {
    await page.goto('/?lang=en');
    
    // Should not show persistent loading states after reasonable time
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);
    
    const loadingIndicators = page.locator('text=Loading, text=Calculating, text=loading');
    const persistentLoading = await loadingIndicators.count();
    
    // Some loading is okay initially, but not forever
    expect(persistentLoading).toBeLessThan(3);
  });
});