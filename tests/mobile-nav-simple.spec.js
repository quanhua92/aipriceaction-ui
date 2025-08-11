import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation Debug', () => {
  test('debug mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('http://localhost:5174');
    
    // Wait for the page to load completely
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Give extra time for loading
    
    // Take a screenshot to see what's actually rendered
    await page.screenshot({ path: 'mobile-debug.png', fullPage: true });
    
    // Check page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Look for header element
    const header = page.locator('header');
    const headerVisible = await header.isVisible();
    console.log('Header visible:', headerVisible);
    
    // Look for nav element inside header  
    const nav = page.locator('header nav');
    const navVisible = await nav.isVisible();
    console.log('Nav visible:', navVisible);
    
    // Count all navigation links
    const navLinks = page.locator('header nav a');
    const linkCount = await navLinks.count();
    console.log('Navigation links found:', linkCount);
    
    // Check if any links are visible
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const linkVisible = await link.isVisible();
      const linkText = await link.textContent();
      console.log(`Link ${i}: "${linkText}" - visible: ${linkVisible}`);
    }
    
    // Get header container dimensions
    const headerContainer = page.locator('header .container');
    const containerBox = await headerContainer.boundingBox();
    console.log('Header container dimensions:', containerBox);
    
    // Get nav dimensions
    const navBox = await nav.boundingBox();
    console.log('Nav dimensions:', navBox);
    
    if (navBox && navBox.width > 375) {
      console.log('⚠️ Navigation overflows on mobile!');
    }
  });
});