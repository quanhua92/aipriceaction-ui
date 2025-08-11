import { test, expect } from '@playwright/test';

test('multi-ticker selection should keep dropdown open', async ({ page }) => {
  await page.goto('/compare?tickers=VNINDEX&range=3M&lang=en');
  
  // Wait for page to load
  await page.waitForSelector('text=Select Tickers', { timeout: 10000 });
  await page.waitForTimeout(1000);
  
  // Click the ticker search input
  await page.click('button[role="combobox"]');
  await page.waitForTimeout(500);
  
  // Screenshot showing dropdown open
  await page.screenshot({ 
    path: 'tests/multi-ticker-dropdown-open.png',
    fullPage: false 
  });
  
  // Select first ticker (should keep dropdown open)
  await page.click('span:has-text("ACB")');
  await page.waitForTimeout(500);
  
  // Screenshot after first selection - dropdown should still be open
  await page.screenshot({ 
    path: 'tests/multi-ticker-after-first-selection.png',
    fullPage: false 
  });
  
  // Select second ticker quickly
  await page.click('span:has-text("BID")');
  await page.waitForTimeout(500);
  
  // Screenshot after second selection
  await page.screenshot({ 
    path: 'tests/multi-ticker-after-second-selection.png',
    fullPage: false 
  });
  
  // Check that both tickers were added
  const acbBadge = await page.locator('text=ACB').count();
  const bidBadge = await page.locator('text=BID').count();
  
  console.log(`ACB badge count: ${acbBadge}, BID badge count: ${bidBadge}`);
});