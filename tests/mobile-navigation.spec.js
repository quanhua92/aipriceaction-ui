import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test('should show navigation overflow issues on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    
    await page.goto('http://localhost:5174');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of current mobile navigation
    await page.screenshot({ path: 'mobile-nav-before.png', fullPage: false });
    
    // Check if navigation items are visible and accessible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
    
    // Check for navigation links
    const homeLink = page.locator('a[href="/"]');
    const tickersLink = page.locator('a[href="/tickers"]');
    const sectorsLink = page.locator('a[href="/sectors"]');
    const compareLink = page.locator('a[href="/compare"]');
    
    // Log navigation elements found
    const navLinks = await page.locator('nav a').count();
    console.log(`Found ${navLinks} navigation links`);
    
    // Check if navigation overflows on mobile
    const navBox = await nav.boundingBox();
    const viewportWidth = 375;
    
    if (navBox && navBox.width > viewportWidth) {
      console.log(`Navigation overflows! Nav width: ${navBox.width}px, Viewport: ${viewportWidth}px`);
    }
    
    // Try to click each navigation link to see if they're accessible
    if (await homeLink.isVisible()) {
      console.log('Home link is visible');
    } else {
      console.log('Home link is NOT visible');
    }
    
    if (await tickersLink.isVisible()) {
      console.log('Tickers link is visible');
    } else {
      console.log('Tickers link is NOT visible');
    }
    
    if (await sectorsLink.isVisible()) {
      console.log('Sectors link is visible');  
    } else {
      console.log('Sectors link is NOT visible');
    }
    
    if (await compareLink.isVisible()) {
      console.log('Compare link is visible');
    } else {
      console.log('Compare link is NOT visible');
    }
  });
  
  test('should check navigation on different mobile sizes', async ({ page }) => {
    const mobileSizes = [
      { width: 320, height: 568, name: 'iPhone 5' },
      { width: 375, height: 667, name: 'iPhone SE' }, 
      { width: 414, height: 736, name: 'iPhone Plus' },
      { width: 360, height: 640, name: 'Android Small' }
    ];
    
    for (const size of mobileSizes) {
      console.log(`Testing ${size.name} - ${size.width}x${size.height}`);
      
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:5174');
      await page.waitForLoadState('networkidle');
      
      const nav = page.locator('nav');
      const navBox = await nav.boundingBox();
      
      if (navBox) {
        console.log(`${size.name}: Nav width ${navBox.width}px vs viewport ${size.width}px`);
        if (navBox.width > size.width) {
          console.log(`❌ Navigation overflows on ${size.name}`);
        } else {
          console.log(`✅ Navigation fits on ${size.name}`);
        }
      }
    }
  });
});