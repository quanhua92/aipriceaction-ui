import { test, expect } from '@playwright/test';

test('Test axis controls with working line chart', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:5174');
  
  // Wait for chart to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take initial screenshot
  await page.screenshot({ path: 'tests/working-chart-initial.png', fullPage: true });
  
  // Click settings button
  const settingsButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-settings"], svg[class*="settings"]') }).first();
  await settingsButton.click();
  await page.waitForTimeout(500);
  
  // Verify axis controls are visible
  await expect(page.locator('text=Y-Axis Controls')).toBeVisible();
  await expect(page.locator('input#min-price')).toBeVisible();
  await expect(page.locator('input#max-price')).toBeVisible();
  
  // Set custom range: min=1, max=2000 (should compress the line to bottom)
  await page.locator('input#min-price').fill('1');
  await page.locator('input#max-price').fill('2000');
  
  // Apply changes
  await page.locator('button:has-text("Apply")').click();
  await page.waitForTimeout(1000);
  
  // Take screenshot after axis change
  await page.screenshot({ path: 'tests/working-chart-compressed.png', fullPage: true });
  
  // Reset to auto range
  const resetButton = page.locator('button').filter({ has: page.locator('svg[class*="lucide-rotate"]') }).first();
  await resetButton.click();
  await page.waitForTimeout(1000);
  
  // Take final screenshot
  await page.screenshot({ path: 'tests/working-chart-reset.png', fullPage: true });
  
  console.log('Axis controls test completed successfully');
});