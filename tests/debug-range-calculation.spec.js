import { test, expect } from '@playwright/test';

test('debug auto range calculation', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  
  // Wait for chart to load
  await page.waitForSelector('[class*="recharts-wrapper"]', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // Take screenshot showing current state
  await page.screenshot({ 
    path: 'tests/debug-range-initial.png',
    fullPage: false 
  });
  
  // Click settings to see current auto range
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(500);
  
  // Screenshot showing current auto range in placeholders
  await page.screenshot({ 
    path: 'tests/debug-range-settings.png',
    fullPage: false 
  });
  
  // Try different time ranges to see if auto range updates
  await page.click('text=1M');
  await page.waitForTimeout(2000);
  
  await page.screenshot({ 
    path: 'tests/debug-range-1m.png',
    fullPage: false 
  });
  
  // Check settings again
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(500);
  
  await page.screenshot({ 
    path: 'tests/debug-range-1m-settings.png',
    fullPage: false 
  });
});