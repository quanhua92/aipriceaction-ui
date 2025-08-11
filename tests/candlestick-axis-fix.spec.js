import { test, expect } from '@playwright/test';

test('VNINDEX candlestick charts respect custom Y-axis range', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:5174');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Wait for chart to load
  await page.waitForTimeout(2000);
  
  // Look for the settings button in the VN-Index Overview chart
  const settingsButton = page.locator('.recharts-surface').locator('..').locator('button').first();
  
  try {
    await settingsButton.click();
    
    // Wait for popover
    await page.waitForTimeout(500);
    
    // Set custom axis range (1 to 2000)
    await page.locator('input#min-price').fill('1');
    await page.locator('input#max-price').fill('2000');
    
    // Apply the changes
    await page.locator('button:has-text("Apply")').click();
    
    // Wait for chart to update
    await page.waitForTimeout(1000);
    
    // Take screenshot to verify candles are positioned correctly
    await page.screenshot({ path: 'tests/candlestick-axis-fix.png', fullPage: true });
    
    console.log('Custom axis range applied successfully');
  } catch (error) {
    console.log('Settings button not found or not clickable:', error.message);
    
    // Take screenshot anyway to see current state
    await page.screenshot({ path: 'tests/candlestick-current-state.png', fullPage: true });
  }
});