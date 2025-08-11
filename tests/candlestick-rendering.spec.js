import { test, expect } from '@playwright/test';

test('candlestick chart renders properly with bars and wicks', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  
  // Wait for chart to load
  await page.waitForSelector('[class*="recharts-wrapper"]', { timeout: 10000 });
  
  // Take screenshot of initial candlestick chart
  await page.screenshot({ 
    path: 'tests/candlestick-initial.png',
    fullPage: false 
  });
  
  // Look for candlestick elements (bars and lines)
  const candlesticks = await page.locator('g rect').count();
  const wicks = await page.locator('g line').count();
  
  console.log(`Found ${candlesticks} candlestick bodies and ${wicks} wick lines`);
  
  // Test axis controls with candlesticks
  await page.click('button[aria-haspopup="dialog"]'); // Settings button
  
  // Set custom range to test positioning
  await page.fill('input[placeholder*="1167"]', '1000');
  await page.fill('input[placeholder*="1689"]', '2000');
  await page.click('text=Apply');
  
  // Wait for chart to update
  await page.waitForTimeout(1000);
  
  // Take screenshot of modified range
  await page.screenshot({ 
    path: 'tests/candlestick-custom-range.png',
    fullPage: false 
  });
});