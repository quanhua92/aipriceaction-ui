import { test, expect } from '@playwright/test';

test('final candlestick chart with working axis controls', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  
  // Wait for chart to load
  await page.waitForSelector('[class*="recharts-wrapper"]', { timeout: 10000 });
  
  // Screenshot initial state
  await page.screenshot({ 
    path: 'tests/final-candlestick-initial.png',
    fullPage: false 
  });
  
  // Test axis controls
  await page.click('button[aria-haspopup="dialog"]');
  
  // Apply custom range
  await page.fill('input[placeholder*="1167"]', '1400');
  await page.fill('input[placeholder*="1689"]', '1600');
  await page.click('text=Apply');
  
  await page.waitForTimeout(1500);
  
  // Screenshot with custom range
  await page.screenshot({ 
    path: 'tests/final-candlestick-custom.png',
    fullPage: false 
  });
  
  // Reset axis
  await page.click('button[aria-haspopup="dialog"]');
  await page.click('button:has-text("⟲")'); // Reset button
  await page.waitForTimeout(1000);
  
  // Screenshot reset state
  await page.screenshot({ 
    path: 'tests/final-candlestick-reset.png',
    fullPage: false 
  });
});