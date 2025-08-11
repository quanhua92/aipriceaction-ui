import { test, expect } from '@playwright/test';

test.describe('Home Page Investigation', () => {
  test('debug chart display and sector button issues', async ({ page }) => {
    console.log('🔍 Starting investigation of home page issues...');
    
    // Enable console logging and error tracking
    const consoleMessages = [];
    const networkRequests = [];
    const errors = [];
    
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      console.log('BROWSER:', msg.text());
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
      console.error('PAGE ERROR:', error.message);
    });
    
    page.on('response', response => {
      if (response.url().includes('csv') || response.url().includes('json') || response.url().includes('ticker')) {
        networkRequests.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
        console.log(`📡 ${response.status()}: ${response.url()}`);
      }
    });
    
    // Navigate to home page
    console.log('📄 Navigating to home page...');
    await page.goto('/');
    
    // Wait for initial render
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check page title
    const title = await page.title();
    console.log('📝 Page title:', title);
    
    // 1. INVESTIGATE CHART ISSUES
    console.log('📊 === CHART INVESTIGATION ===');
    
    // Check for VN-Index text/data
    const vnIndexText = page.locator('text=VN-Index').first();
    const vnIndexExists = await vnIndexText.count() > 0;
    console.log(`VN-Index element exists: ${vnIndexExists}`);
    
    if (vnIndexExists) {
      const vnIndexTextContent = await vnIndexText.textContent();
      console.log(`VN-Index text: "${vnIndexTextContent}"`);
    }
    
    // Check for chart containers
    const chartContainers = [
      page.locator('.recharts-wrapper'),
      page.locator('.recharts-responsive-container'), 
      page.locator('[data-testid*="chart"]'),
      page.locator('svg.recharts-surface')
    ];
    
    for (let i = 0; i < chartContainers.length; i++) {
      const count = await chartContainers[i].count();
      console.log(`Chart container type ${i + 1}: ${count} found`);
      
      if (count > 0) {
        const isVisible = await chartContainers[i].first().isVisible();
        console.log(`  First container visible: ${isVisible}`);
        
        if (isVisible) {
          const boundingBox = await chartContainers[i].first().boundingBox();
          console.log(`  Container size:`, boundingBox);
        }
      }
    }
    
    // Check for loading states
    const loadingIndicators = page.locator('text=Loading').or(page.locator('text=loading'));
    const loadingCount = await loadingIndicators.count();
    console.log(`Loading indicators: ${loadingCount}`);
    
    // Check for error messages
    const errorTexts = page.locator('text=error').or(page.locator('text=Error')).or(page.locator('text=failed'));
    const errorCount = await errorTexts.count();
    console.log(`Error messages on page: ${errorCount}`);
    
    if (errorCount > 0) {
      for (let i = 0; i < errorCount; i++) {
        const errorText = await errorTexts.nth(i).textContent();
        console.log(`  Error ${i + 1}: "${errorText}"`);
      }
    }
    
    // Check if data is actually being fetched
    console.log('🌐 Network requests made:');
    networkRequests.forEach(req => {
      console.log(`  ${req.status} ${req.statusText}: ${req.url}`);
    });
    
    // 2. INVESTIGATE SECTOR BUTTON ISSUES  
    console.log('🏢 === SECTOR BUTTON INVESTIGATION ===');
    
    // Find sector cards/buttons
    const sectorButtons = page.locator('[role="button"]').or(page.locator('button')).or(page.locator('.cursor-pointer'));
    const sectorCount = await sectorButtons.count();
    console.log(`Total interactive elements found: ${sectorCount}`);
    
    // Look for specific sector names
    const commonSectors = ['Banking', 'NGAN_HANG', 'Real Estate', 'Technology', 'BAT_DONG_SAN'];
    
    for (const sector of commonSectors) {
      const sectorElement = page.locator(`text="${sector}"`);
      const count = await sectorElement.count();
      console.log(`"${sector}" elements: ${count}`);
      
      if (count > 0) {
        const isClickable = await sectorElement.first().getAttribute('role') === 'button' || 
                           await sectorElement.first().locator('..').getAttribute('role') === 'button' ||
                           (await sectorElement.first().getAttribute('class') || '').includes('cursor-pointer');
        console.log(`  "${sector}" is clickable: ${isClickable}`);
      }
    }
    
    // Try to find and test a sector button click
    console.log('🔘 Testing sector button interaction...');
    
    const bankingSector = page.locator('text=Banking').or(page.locator('text=NGAN_HANG')).first();
    const bankingSectorExists = await bankingSector.count() > 0;
    
    if (bankingSectorExists) {
      console.log('Found banking sector element, attempting click...');
      const currentUrl = page.url();
      console.log(`URL before click: ${currentUrl}`);
      
      try {
        await bankingSector.click({ timeout: 5000 });
        await page.waitForTimeout(2000);
        
        const newUrl = page.url();
        console.log(`URL after click: ${newUrl}`);
        
        if (currentUrl === newUrl) {
          console.log('❌ URL did not change - sector button click failed');
        } else {
          console.log('✅ URL changed - sector button click worked');
        }
        
        // Navigate back for further testing
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      } catch (error) {
        console.log(`❌ Error clicking banking sector: ${error.message}`);
      }
    } else {
      console.log('❌ No banking sector button found');
    }
    
    // 3. CAPTURE DEBUGGING INFO
    console.log('📸 === CAPTURING DEBUG INFO ===');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'tests/debug-home-page.png', 
      fullPage: true 
    });
    console.log('Screenshot saved: tests/debug-home-page.png');
    
    // Get page HTML for analysis
    const bodyHTML = await page.locator('body').innerHTML();
    const hasRechartsContent = bodyHTML.includes('recharts');
    const hasVNINDEXContent = bodyHTML.includes('VNINDEX') || bodyHTML.includes('VN-Index');
    const hasSectorContent = bodyHTML.includes('Banking') || bodyHTML.includes('NGAN_HANG');
    
    console.log(`Page contains recharts: ${hasRechartsContent}`);
    console.log(`Page contains VNINDEX: ${hasVNINDEXContent}`); 
    console.log(`Page contains sector data: ${hasSectorContent}`);
    
    // Output console messages and errors
    console.log('🚨 === CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(`  ${msg}`));
    
    if (errors.length > 0) {
      console.log('💥 === PAGE ERRORS ===');
      errors.forEach(error => console.log(`  ${error}`));
    }
    
    // Basic assertions to track issues
    expect(errors.length).toBeLessThan(5); // Allow some minor errors but flag major issues
    expect(title).toContain('AIPriceAction'); // Should have proper title
  });
  
  test('test individual chart components', async ({ page }) => {
    console.log('📊 Testing chart components individually...');
    
    // Navigate to a specific ticker page that should definitely have data
    await page.goto('/ticker/VCB');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check if individual ticker charts work
    const chartExists = await page.locator('.recharts-wrapper').count() > 0;
    console.log(`Individual ticker chart exists: ${chartExists}`);
    
    if (chartExists) {
      const chartVisible = await page.locator('.recharts-wrapper').first().isVisible();
      console.log(`Individual ticker chart visible: ${chartVisible}`);
      
      // Take screenshot of working chart for comparison
      await page.screenshot({ path: 'tests/debug-ticker-chart.png' });
    }
  });
});