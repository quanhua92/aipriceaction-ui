import { test, expect } from '@playwright/test';

test('Check if chart line is visible', async ({ page }) => {
  // Navigate to home page
  await page.goto('http://localhost:5174');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Look for SVG path elements (these represent the line)
  const svgPaths = page.locator('svg path, svg polyline, svg line').filter({ hasNot: page.locator('[class*="grid"]') });
  const pathCount = await svgPaths.count();
  
  console.log(`Found ${pathCount} potential chart lines`);
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'tests/line-visibility-debug.png', fullPage: true });
  
  // Check if Recharts generated any line elements
  const rechartLines = page.locator('.recharts-line, .recharts-line-curve');
  const lineCount = await rechartLines.count();
  
  console.log(`Found ${lineCount} recharts line elements`);
  
  // Log page console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Page error:', msg.text());
    }
  });
});