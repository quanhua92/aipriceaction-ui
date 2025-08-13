import { test, expect } from '@playwright/test';

test('Test Ask AI debug functionality and search persistence', async ({ page }) => {
  // Navigate to Ask AI page
  await page.goto('http://localhost:5173/ask');
  
  // Wait for page to load
  await page.waitForSelector('h1', { timeout: 10000 });
  
  console.log('Ask AI page loaded');
  
  // Listen for console debug logs
  page.on('console', msg => {
    if (msg.text().includes('=== DEBUG') || msg.text().includes('CHART CONTEXT') || msg.text().includes('TickerSearch')) {
      console.log('Debug log:', msg.text());
    }
  });
  
  // Wait for single ticker data to load and trigger debug logs
  await page.waitForTimeout(5000);
  
  // Test search dialog persistence in multi tab
  await page.click('[role="tab"]:has-text("Multiple Tickers")');
  console.log('Switched to multi tab');
  
  // Click to open search dialog
  const searchTrigger = page.locator('[role="combobox"]');
  await searchTrigger.click();
  
  // Wait for popover to open
  await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
  console.log('Search dialog opened');
  
  // Type to search for VCB
  await page.type('[placeholder*="tickers"]', 'VCB');
  await page.waitForTimeout(1000);
  
  // Click on VCB option
  const vcbOption = page.locator('[role="option"]', { hasText: 'VCB' }).first();
  if (await vcbOption.isVisible()) {
    await vcbOption.click();
    console.log('VCB selected');
    
    // Wait for URL to change and check if dialog persists
    await page.waitForTimeout(2000);
    
    // Check if search dialog is still open (persistence test)
    const isPopoverVisible = await page.locator('[role="listbox"]').isVisible();
    console.log('Search dialog still open after URL change:', isPopoverVisible);
    
    if (isPopoverVisible) {
      console.log('✅ Search dialog persistence is working');
    } else {
      console.log('❌ Search dialog closed after URL change');
    }
  }
  
  console.log('=== Test completed ===');
});