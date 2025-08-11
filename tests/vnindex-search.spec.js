import { test, expect } from '@playwright/test';

test('VNINDEX appears in tickers search', async ({ page }) => {
  // Navigate to tickers page
  await page.goto('/tickers?lang=en');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Look for the search input
  const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="tickers"]').first();
  await expect(searchInput).toBeVisible();
  
  // Type VNINDEX in search
  await searchInput.fill('VNINDEX');
  
  // Wait a moment for search results
  await page.waitForTimeout(1000);
  
  // Look for VNINDEX in results
  const vnindexResult = page.locator('text=VNINDEX').first();
  await expect(vnindexResult).toBeVisible();
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'tests/vnindex-search-debug.png', fullPage: true });
  
  console.log('VNINDEX found in search results');
});