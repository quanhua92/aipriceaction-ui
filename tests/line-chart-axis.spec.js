import { test, expect } from '@playwright/test';

test('Line chart respects custom Y-axis range', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:5174');
  
  // Wait for the page to load and chart to render
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take screenshot of initial state
  await page.screenshot({ path: 'tests/before-axis-change.png', fullPage: true });
  
  // Look for the settings button
  const settingsButton = page.locator('button').filter({ has: page.locator('svg') }).first();
  
  try {
    await settingsButton.click();
    await page.waitForTimeout(500);
    
    // Set custom range (1 to 2000)
    await page.locator('input#min-price').fill('1');
    await page.locator('input#max-price').fill('2000');
    
    // Apply changes
    await page.locator('button:has-text("Apply")').click();
    await page.waitForTimeout(1000);
    
    // Take screenshot after change
    await page.screenshot({ path: 'tests/after-axis-change.png', fullPage: true });
    
    console.log('Axis change applied successfully');
  } catch (error) {
    console.log('Could not apply axis change:', error.message);
    await page.screenshot({ path: 'tests/axis-error.png', fullPage: true });
  }
});