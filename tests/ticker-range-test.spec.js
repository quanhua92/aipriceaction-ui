import { test, expect } from '@playwright/test';

test('ticker auto range should adjust for time period', async ({ page }) => {
  // Test ACB ticker with different time ranges
  await page.goto('http://localhost:5174/ticker/ACB?range=1M');
  
  // Wait for chart to load
  await page.waitForSelector('[class*="recharts-wrapper"]', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // Take screenshot of 1M range
  await page.screenshot({ 
    path: 'tests/acb-1m-range.png',
    fullPage: false 
  });
  
  // Check Y-axis settings for 1M
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(500);
  
  await page.screenshot({ 
    path: 'tests/acb-1m-settings.png',
    fullPage: false 
  });
  
  // Switch to 3M range
  await page.goto('http://localhost:5174/ticker/ACB?range=3M');
  await page.waitForTimeout(3000);
  
  // Take screenshot of 3M range
  await page.screenshot({ 
    path: 'tests/acb-3m-range.png',
    fullPage: false 
  });
  
  // Check Y-axis settings for 3M
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(500);
  
  await page.screenshot({ 
    path: 'tests/acb-3m-settings.png',
    fullPage: false 
  });
});