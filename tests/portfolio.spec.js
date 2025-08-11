import { test, expect } from '@playwright/test';

test.describe('Portfolio Analysis', () => {
  test('should show empty state when no tickers selected', async ({ page }) => {
    await page.goto('/portfolio?lang=en');
    await page.waitForLoadState('networkidle');
    
    // Should show portfolio page title
    await expect(page.locator('h1')).toContainText('Portfolio Analysis');
    
    // Should show empty state with search
    await expect(page.locator('text=Build Your Portfolio')).toBeVisible();
    await expect(page.locator('text=Search for Stocks')).toBeVisible();
    
    // Should have sample portfolio links
    await expect(page.locator('text=Banking Portfolio')).toBeVisible();
    await expect(page.locator('text=Real Estate Portfolio')).toBeVisible();
    await expect(page.locator('text=Industrial Portfolio')).toBeVisible();
  });
  
  test('should load portfolio from URL parameters', async ({ page }) => {
    // Load portfolio with some tickers
    await page.goto('/portfolio?tickers=VCB&tickers=BID&tickers=VNINDEX&range=3M&lang=en');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should show portfolio analysis components
    await expect(page.locator('text=Portfolio Configuration')).toBeVisible();
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
    await expect(page.locator('text=VNINDEX (Benchmark)')).toBeVisible();
    
    // Should show analysis sections (wait for data to load)
    await expect(page.locator('text=Performance Overview')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Risk Analysis')).toBeVisible({ timeout: 10000 });
  });
  
  test('should allow adding tickers via search', async ({ page }) => {
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');
    
    // Find and click ticker search
    const searchButton = page.locator('button[role="combobox"]').first();
    await searchButton.click();
    
    // Search for a ticker
    const searchInput = page.locator('input[placeholder*="stock symbol"]');
    await searchInput.fill('VCB');
    await page.waitForTimeout(1000);
    
    // Select the ticker
    const vcbOption = page.locator('text=VCB').first();
    await vcbOption.click();
    
    // Should navigate to portfolio with ticker
    await expect(page).toHaveURL(/tickers=.*VCB/);
    await expect(page.locator('text=VCB')).toBeVisible();
  });
  
  test('should test sample portfolio links', async ({ page }) => {
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');
    
    // Click banking portfolio sample
    const bankingPortfolio = page.locator('text=Banking Portfolio');
    await bankingPortfolio.click();
    
    // Should load banking portfolio
    await page.waitForURL(/tickers=.*VCB.*BID/);
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
    await expect(page.locator('text=VNINDEX')).toBeVisible();
  });

  test('should handle portfolio analysis without crashes', async ({ page }) => {
    // Track JavaScript errors
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    // Load portfolio with data
    await page.goto('/portfolio?tickers=VCB&tickers=BID&tickers=HPG&tickers=VNINDEX&range=6M');
    await page.waitForLoadState('networkidle');
    
    // Wait for analysis to complete
    await page.waitForTimeout(5000);
    
    // Should not have critical runtime errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning:') && 
      !error.includes('DevTools') &&
      error.includes('Error')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Portfolio analysis errors:', criticalErrors);
    }
    
    expect(criticalErrors.length).toBe(0);
    
    // Should show portfolio analysis sections
    await expect(page.locator('text=Performance Overview')).toBeVisible();
    await expect(page.locator('text=Risk Analysis')).toBeVisible();
    await expect(page.locator('text=Performance Attribution')).toBeVisible();
    await expect(page.locator('text=Diversification Analysis')).toBeVisible();
  });

  test('should support ticker search dialog staying open', async ({ page }) => {
    await page.goto('/portfolio?tickers=VCB&range=3M');
    await page.waitForLoadState('networkidle');
    
    // Find the add ticker search
    const addTickerSearch = page.locator('button[role="combobox"]').last();
    await addTickerSearch.click();
    
    // Type to search
    const searchInput = page.locator('input[placeholder*="add stocks"]');
    await searchInput.fill('BID');
    await page.waitForTimeout(500);
    
    // Select BID
    const bidOption = page.locator('span:has-text("BID")').first();
    await bidOption.click();
    await page.waitForTimeout(500);
    
    // Dialog should still be open (this was the reported bug)
    const dialogStillOpen = await page.locator('[role="dialog"], .popover-content').isVisible();
    expect(dialogStillOpen).toBe(true);
    
    // Should be able to select another ticker quickly
    await searchInput.fill('HPG');
    await page.waitForTimeout(500);
    const hpgOption = page.locator('span:has-text("HPG")').first();
    await hpgOption.click();
    
    // Both tickers should be added to portfolio
    await expect(page).toHaveURL(/tickers=.*BID/);
    await expect(page).toHaveURL(/tickers=.*HPG/);
  });
});