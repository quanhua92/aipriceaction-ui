import { test, expect } from '@playwright/test';

test('rectangular candlesticks with axis controls', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  
  // Wait for chart to load
  await page.waitForSelector('[class*="recharts-wrapper"]', { timeout: 10000 });
  await page.waitForTimeout(2000);
  
  // Screenshot with rectangular candlesticks
  await page.screenshot({ 
    path: 'tests/rect-candles-initial.png',
    fullPage: false 
  });
  
  // Open axis controls
  await page.click('button[aria-haspopup="dialog"]');
  await page.waitForTimeout(500);
  
  // Set tight range to compress candlesticks
  await page.fill('input[placeholder*="1167"]', '1500');
  await page.fill('input[placeholder*="1689"]', '1600');
  await page.click('text=Apply');
  
  await page.waitForTimeout(2000);
  
  // Screenshot with compressed range
  await page.screenshot({ 
    path: 'tests/rect-candles-compressed.png',
    fullPage: false 
  });
});