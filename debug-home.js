const { chromium } = require('playwright');

async function debugHomePage() {
	console.log('🔍 Starting Playwright investigation of home page...');
	
	const browser = await chromium.launch({ headless: false }); // Set to true for headless
	const page = await browser.newPage();
	
	// Enable console logging
	page.on('console', msg => console.log('BROWSER:', msg.text()));
	page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
	
	try {
		// Navigate to home page
		console.log('📄 Navigating to home page...');
		await page.goto('http://localhost:5174', { waitUntil: 'networkidle' });
		
		// Wait a bit for React to render
		await page.waitForTimeout(3000);
		
		// Check if the page loaded
		const title = await page.title();
		console.log('📝 Page title:', title);
		
		// Check for chart containers
		console.log('📊 Checking for chart elements...');
		const chartContainers = await page.locator('[data-testid="chart"], .recharts-wrapper, .recharts-responsive-container').count();
		console.log(`Found ${chartContainers} chart containers`);
		
		// Check for error messages
		console.log('❌ Checking for error messages...');
		const errorMessages = await page.locator('text=error, text=Error, text=failed, text=Failed').count();
		console.log(`Found ${errorMessages} error messages`);
		
		// Check for loading states
		console.log('⏳ Checking for loading states...');
		const loadingMessages = await page.locator('text=Loading, text=loading').count();
		console.log(`Found ${loadingMessages} loading indicators`);
		
		// Check VN-Index data specifically
		console.log('🏠 Checking VN-Index data...');
		const vnIndexElements = await page.locator('text=VN-Index, text=VNINDEX').count();
		console.log(`Found ${vnIndexElements} VN-Index related elements`);
		
		// Check sector buttons
		console.log('🏢 Investigating sector buttons...');
		const sectorCards = await page.locator('[data-testid="sector-card"], .cursor-pointer').count();
		console.log(`Found ${sectorCards} sector cards`);
		
		// Try to click a sector button if available
		const sectorButton = page.locator('text="Banking"').first();
		if (await sectorButton.count() > 0) {
			console.log('🔘 Testing Banking sector button click...');
			await sectorButton.click();
			await page.waitForTimeout(2000);
			const currentUrl = page.url();
			console.log('🔗 URL after sector click:', currentUrl);
		}
		
		// Check network requests
		console.log('🌐 Checking network activity...');
		const responses = [];
		page.on('response', response => {
			if (response.url().includes('csv') || response.url().includes('json')) {
				responses.push({
					url: response.url(),
					status: response.status(),
					statusText: response.statusText()
				});
			}
		});
		
		// Reload to capture network requests
		await page.reload({ waitUntil: 'networkidle' });
		await page.waitForTimeout(5000);
		
		console.log('📡 Network responses:');
		responses.forEach(resp => {
			console.log(`  ${resp.status} ${resp.statusText}: ${resp.url}`);
		});
		
		// Take a screenshot for visual debugging
		await page.screenshot({ path: 'debug-home-screenshot.png', fullPage: true });
		console.log('📸 Screenshot saved as debug-home-screenshot.png');
		
		// Check the DOM structure
		console.log('🏗️ Checking DOM structure...');
		const bodyContent = await page.locator('body').innerHTML();
		const hasChartData = bodyContent.includes('recharts') || bodyContent.includes('chart');
		const hasVNIndexData = bodyContent.includes('VNINDEX') || bodyContent.includes('VN-Index');
		console.log(`Has chart elements: ${hasChartData}`);
		console.log(`Has VN-Index data: ${hasVNIndexData}`);
		
		// Check console errors
		console.log('🚨 Final console check...');
		await page.evaluate(() => {
			console.log('DOM ready state:', document.readyState);
			console.log('Number of script tags:', document.scripts.length);
			console.log('React detected:', !!window.React);
		});
		
	} catch (error) {
		console.error('💥 Error during investigation:', error.message);
	} finally {
		await browser.close();
		console.log('✅ Investigation complete');
	}
}

debugHomePage();