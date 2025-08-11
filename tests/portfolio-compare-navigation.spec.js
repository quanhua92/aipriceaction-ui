import { test, expect } from '@playwright/test';

test.describe('Portfolio-Compare Bidirectional Navigation', () => {
  test('should navigate from Portfolio to Compare and back with same parameters', async ({ page }) => {
    // Start with portfolio page with some tickers and custom range
    await page.goto('/portfolio?tickers=%5B%22VCB%22,%22BID%22,%22VNINDEX%22%5D&range=3M');
    await page.waitForLoadState('networkidle');
    
    // Should have the tickers in the portfolio
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
    
    // Click "Open in Compare" button
    const compareButton = page.locator('text=Open in Compare');
    await expect(compareButton).toBeVisible();
    await compareButton.click();
    
    // Should navigate to compare page with same parameters
    await expect(page).toHaveURL(/\/compare/);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for data to load
    
    // Should show the same tickers in compare page
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
    
    // Should have the "Open in Portfolio" button
    const portfolioButton = page.locator('text=Open in Portfolio');
    await expect(portfolioButton).toBeVisible();
    
    // Click "Open in Portfolio" button to go back
    await portfolioButton.click();
    
    // Should navigate back to portfolio page
    await expect(page).toHaveURL(/\/portfolio/);
    await page.waitForLoadState('networkidle');
    
    // Should still have the same tickers
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
  });
  
  test('should preserve custom date ranges in bidirectional navigation', async ({ page }) => {
    // Note: This is a basic test - in a real scenario you'd set custom dates
    // and verify they're preserved across navigation
    
    await page.goto('/portfolio?tickers=%5B%22HPG%22,%22HSG%22%5D&range=1Y');
    await page.waitForLoadState('networkidle');
    
    // Navigate to compare
    await page.locator('text=Open in Compare').click();
    await expect(page).toHaveURL(/\/compare.*range=1Y/);
    
    // Navigate back to portfolio  
    await page.locator('text=Open in Portfolio').click();
    await expect(page).toHaveURL(/\/portfolio.*range=1Y/);
  });
  
  test('should handle empty ticker list gracefully', async ({ page }) => {
    // Start with empty portfolio
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');
    
    // Should show empty state
    await expect(page.locator('text=Build Your Portfolio')).toBeVisible();
    
    // Add some tickers
    const searchInput = page.locator('input[placeholder*="Type stock symbol"]');
    await searchInput.fill('VCB');
    await page.waitForTimeout(1000);
    
    // Select the first result
    await page.locator('text=VCB').first().click();
    await page.waitForTimeout(500);
    
    // Should now have VCB ticker
    await expect(page.locator('text=VCB ×')).toBeVisible();
    
    // Navigate to compare
    const compareButton = page.locator('text=Open in Compare');
    await expect(compareButton).toBeVisible();
    await compareButton.click();
    
    // Should navigate to compare with VCB
    await expect(page).toHaveURL(/\/compare/);
    await expect(page.locator('text=VCB')).toBeVisible();
    
    // Navigate back
    await page.locator('text=Open in Portfolio').click();
    await expect(page).toHaveURL(/\/portfolio/);
    await expect(page.locator('text=VCB ×')).toBeVisible();
  });
});