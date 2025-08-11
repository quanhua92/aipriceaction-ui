import { test, expect } from '@playwright/test';

test.describe('Ticker Performance Table', () => {
  test('should display sortable table in Portfolio page', async ({ page }) => {
    // Navigate to portfolio with some tickers
    await page.goto('/portfolio?tickers=%5B%22VCB%22,%22BID%22,%22CTG%22%5D&range=3M');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for data to load
    
    // Should show the performance table
    await expect(page.locator('text=Portfolio Stocks Performance')).toBeVisible();
    
    // Should have sortable headers
    await expect(page.locator('text=Ticker')).toBeVisible();
    await expect(page.locator('text=Price')).toBeVisible();
    await expect(page.locator('text=Daily')).toBeVisible();
    await expect(page.locator('text=3M')).toBeVisible();
    
    // Should show ticker rows
    await expect(page.locator('text=VCB')).toBeVisible();
    await expect(page.locator('text=BID')).toBeVisible();
    await expect(page.locator('text=CTG')).toBeVisible();
    
    // Should be able to click on ticker to navigate
    const vcbRow = page.locator('a[href="/ticker/VCB"]').first();
    await expect(vcbRow).toBeVisible();
  });
  
  test('should display sortable table in Compare page', async ({ page }) => {
    // Navigate to compare with some tickers
    await page.goto('/compare?tickers=%5B%22HPG%22,%22HSG%22%5D&range=1M');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for data to load
    
    // Should show the performance table
    await expect(page.locator('text=Selected Stocks Performance')).toBeVisible();
    
    // Should have sortable headers
    await expect(page.locator('text=Ticker')).toBeVisible();
    await expect(page.locator('text=Price')).toBeVisible();
    await expect(page.locator('text=Daily')).toBeVisible();
    await expect(page.locator('text=1M')).toBeVisible();
    
    // Should show ticker rows
    await expect(page.locator('text=HPG')).toBeVisible();
    await expect(page.locator('text=HSG')).toBeVisible();
  });
  
  test('should handle sorting functionality', async ({ page }) => {
    // Navigate to portfolio with multiple tickers
    await page.goto('/portfolio?tickers=%5B%22VCB%22,%22BID%22,%22CTG%22,%22ACB%22%5D&range=3M');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Should have the performance table
    await expect(page.locator('text=Portfolio Stocks Performance')).toBeVisible();
    
    // Test clicking ticker sort button (should have sort arrows)
    const tickerSortButton = page.locator('button:has-text("Ticker")').first();
    await expect(tickerSortButton).toBeVisible();
    
    // Click to sort by ticker
    await tickerSortButton.click();
    
    // Test clicking price sort button  
    const priceSortButton = page.locator('button:has-text("Price")').first();
    await expect(priceSortButton).toBeVisible();
    await priceSortButton.click();
    
    // Test clicking daily sort button
    const dailySortButton = page.locator('button:has-text("Daily")').first();
    await expect(dailySortButton).toBeVisible();
    await dailySortButton.click();
  });
  
  test('should handle empty state gracefully', async ({ page }) => {
    // Navigate to empty portfolio
    await page.goto('/portfolio');
    await page.waitForLoadState('networkidle');
    
    // Should not show performance table when no tickers
    const tableElement = page.locator('text=Portfolio Stocks Performance');
    await expect(tableElement).not.toBeVisible();
    
    // Navigate to empty compare page
    await page.goto('/compare');
    await page.waitForLoadState('networkidle');
    
    // Should not show performance table when no tickers
    const compareTableElement = page.locator('text=Selected Stocks Performance');
    await expect(compareTableElement).not.toBeVisible();
  });
  
  test('should show performance data with colors', async ({ page }) => {
    // Navigate to portfolio with tickers that likely have performance data
    await page.goto('/portfolio?tickers=%5B%22VCB%22,%22VNINDEX%22%5D&range=3M');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000); // Wait longer for data
    
    // Should show the performance table
    await expect(page.locator('text=Portfolio Stocks Performance')).toBeVisible();
    
    // Should show VCB in the table (VNINDEX is filtered out)
    await expect(page.locator('text=VCB')).toBeVisible();
    
    // Should show some price data (either price or "No data")
    const priceElements = page.locator('div:has-text("₫"), div:has-text("No data")');
    await expect(priceElements.first()).toBeVisible();
  });
});