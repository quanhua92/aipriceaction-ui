import { test, expect } from '@playwright/test';

test('improved date picker UX with yyyy-mm-dd format', async ({ page }) => {
  await page.goto('http://localhost:5174/ticker/ACB');
  
  // Wait for page to load
  await page.waitForSelector('[class*="recharts-wrapper"]', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  // Click Custom button to open date picker
  await page.click('text=Custom');
  await page.waitForTimeout(500);
  
  // Screenshot of the improved date picker
  await page.screenshot({ 
    path: 'tests/improved-date-picker.png',
    fullPage: false 
  });
  
  // Test entering dates in yyyy-mm-dd format
  await page.fill('input[placeholder="yyyy-mm-dd"]', '2024-06-01');
  await page.fill('input[placeholder="yyyy-mm-dd"]:nth-of-type(2)', '2024-08-01');
  
  // Screenshot with dates entered
  await page.screenshot({ 
    path: 'tests/date-picker-with-dates.png',
    fullPage: false 
  });
  
  // Apply the custom range
  await page.click('text=Apply Range');
  await page.waitForTimeout(2000);
  
  // Screenshot showing the result
  await page.screenshot({ 
    path: 'tests/custom-date-range-applied.png',
    fullPage: false 
  });
});