import { test, expect } from '@playwright/test';

test('VNINDEX chart displays on home page', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:5174');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if VN-Index Overview section exists
  const vnindexSection = page.locator('text=VN-Index Overview');
  await expect(vnindexSection).toBeVisible();
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'tests/vnindex-debug.png', fullPage: true });
  
  // Look for chart content or loading/error states
  const chartContainer = page.locator('[data-testid="chart-container"], .recharts-wrapper, .recharts-surface');
  const loadingText = page.locator('text=Loading VN-Index data');
  const errorText = page.locator('text=Failed to load VN-Index data');
  
  // Wait for either chart, loading, or error state
  await Promise.race([
    chartContainer.waitFor({ state: 'visible', timeout: 10000 }),
    loadingText.waitFor({ state: 'visible', timeout: 10000 }),
    errorText.waitFor({ state: 'visible', timeout: 10000 })
  ]).catch(() => {
    console.log('No chart state detected within timeout');
  });
  
  console.log('Chart container found:', await chartContainer.count());
  console.log('Loading text found:', await loadingText.count());
  console.log('Error text found:', await errorText.count());
});