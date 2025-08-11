import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation - Improved', () => {
  test('should show hamburger menu on mobile and hide desktop nav', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/?lang=en');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Desktop navigation should be hidden on mobile
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
    
    // Hamburger button should be visible
    const hamburgerButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(hamburgerButton).toBeVisible();
    
    // Menu icon should be visible (closed state)
    const menuIcon = hamburgerButton.locator('svg').first();
    await expect(menuIcon).toBeVisible();
    
    // Mobile menu should not be visible initially
    const mobileMenu = page.locator('div.md\\:hidden.border-t');
    await expect(mobileMenu).not.toBeVisible();
    
  });

  test('should open mobile menu when hamburger is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?lang=en');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Click hamburger button to open menu
    const hamburgerButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await hamburgerButton.click();
    
    // Mobile menu should now be visible
    const mobileMenu = page.locator('div.md\\:hidden.border-t');
    await expect(mobileMenu).toBeVisible();
    
    // All navigation links should be visible in mobile menu
    const mobileNavLinks = page.locator('div.md\\:hidden nav a');
    await expect(mobileNavLinks).toHaveCount(5);
    
    // Check each link
    const expectedLinks = ['Dashboard', 'Sectors', 'Tickers', 'Compare Charts', 'Portfolio Analysis'];
    for (let i = 0; i < expectedLinks.length; i++) {
      const link = mobileNavLinks.nth(i);
      await expect(link).toContainText(expectedLinks[i]);
      await expect(link).toBeVisible();
    }
    
    // X icon should be visible (open state)
    const closeIcon = hamburgerButton.locator('svg').first();
    await expect(closeIcon).toBeVisible();
    
  });

  test('should close mobile menu when navigation link is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/?lang=en');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Open mobile menu
    const hamburgerButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await hamburgerButton.click();
    
    // Verify menu is open
    const mobileMenu = page.locator('div.md\\:hidden.border-t');
    await expect(mobileMenu).toBeVisible();
    
    // Click on a navigation link (Tickers)
    const tickersLink = page.locator('div.md\\:hidden nav a[href="/tickers"]');
    await tickersLink.click();
    
    // Wait for navigation
    await page.waitForURL('**/tickers');
    await page.waitForTimeout(500);
    
    // Mobile menu should be closed
    await expect(mobileMenu).not.toBeVisible();
    
  });

  test('should work properly on desktop (show desktop nav, hide hamburger)', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    
    await page.goto('/?lang=en');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Desktop navigation should be visible
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
    
    // All desktop nav links should be visible
    const desktopNavLinks = desktopNav.locator('a');
    await expect(desktopNavLinks).toHaveCount(5);
    
    // Hamburger button should be hidden on desktop
    const hamburgerButton = page.locator('button[aria-label="Toggle mobile menu"]');
    await expect(hamburgerButton).not.toBeVisible();
    
    // Mobile menu should never be visible on desktop
    const mobileMenu = page.locator('div.md\\:hidden.border-t');
    await expect(mobileMenu).not.toBeVisible();
    
  });

  test('should test responsive breakpoints', async ({ page }) => {
    const breakpoints = [
      { width: 320, height: 568, name: 'Mobile Small', expectMobile: true },
      { width: 375, height: 667, name: 'Mobile Medium', expectMobile: true },
      { width: 768, height: 1024, name: 'Tablet', expectMobile: false },
      { width: 1024, height: 768, name: 'Desktop', expectMobile: false },
      { width: 1920, height: 1080, name: 'Large Desktop', expectMobile: false }
    ];
    
    for (const bp of breakpoints) {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/?lang=en');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);
      
      const hamburgerButton = page.locator('button[aria-label="Toggle mobile menu"]');
      const desktopNav = page.locator('nav.hidden.md\\:flex');
      
      if (bp.expectMobile) {
        await expect(hamburgerButton).toBeVisible();
        await expect(desktopNav).not.toBeVisible();
      } else {
        await expect(hamburgerButton).not.toBeVisible(); 
        await expect(desktopNav).toBeVisible();
      }
    }
  });
});