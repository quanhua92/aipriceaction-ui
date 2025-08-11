import { test, expect } from '@playwright/test';

test('Candlestick chart has axis controls', async ({ page }) => {
  // Navigate to a ticker page with chart
  await page.goto('http://localhost:5174/ticker/VCB');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Look for the settings button in chart header
  const settingsButton = page.locator('button').filter({ hasText: /settings/i }).or(
    page.locator('button[aria-expanded]').filter({ has: page.locator('svg') })
  ).first();
  
  // Click the settings button to open axis controls
  await settingsButton.click();
  
  // Wait for popover to appear
  await page.waitForTimeout(500);
  
  // Look for Y-Axis Controls text
  const axisControls = page.locator('text=Y-Axis Controls');
  await expect(axisControls).toBeVisible();
  
  // Look for Min Price and Max Price inputs
  const minPriceInput = page.locator('input#min-price');
  const maxPriceInput = page.locator('input#max-price');
  
  await expect(minPriceInput).toBeVisible();
  await expect(maxPriceInput).toBeVisible();
  
  // Look for Apply and Reset buttons
  const applyButton = page.locator('button:has-text("Apply")');
  const resetButton = page.locator('button').filter({ has: page.locator('svg') }).nth(1);
  
  await expect(applyButton).toBeVisible();
  await expect(resetButton).toBeVisible();
  
  // Take screenshot for verification
  await page.screenshot({ path: 'tests/axis-controls-debug.png', fullPage: true });
  
  console.log('Axis controls found and working');
});