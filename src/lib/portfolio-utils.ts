export interface PortfolioItem {
	ticker: string;
	quantity: number;
	price: number;
}

export interface PortfolioData {
	items: PortfolioItem[];
	deposit: number;
}

/**
 * Encodes portfolio items to URL format: ticker,quantity,price~ticker2,quantity2,price2
 * Watch list items have quantity=0 and price=0
 */
export function encodePortfolioItems(items: PortfolioItem[]): string {
	return items
		.map(item => `${item.ticker},${item.quantity},${item.price}`)
		.join('~');
}

/**
 * Decodes portfolio items from URL format
 * Items with quantity=0 and price=0 are watch list items
 */
export function decodePortfolioItems(dataString: string): PortfolioItem[] {
	if (!dataString) return [];
	
	try {
		return dataString.split('~').map(item => {
			const [ticker, quantityStr, priceStr] = item.split(',');
			return {
				ticker,
				quantity: parseFloat(quantityStr) || 0,
				price: parseFloat(priceStr) || 0,
			};
		}).filter(item => item.ticker);
	} catch {
		return [];
	}
}

/**
 * Separates portfolio items into investments and watch list
 */
export function separatePortfolioItems(items: PortfolioItem[]) {
	const investments = items.filter(item => item.quantity > 0 && item.price > 0);
	const watchList = items.filter(item => item.quantity === 0 && item.price === 0);
	return { investments, watchList };
}

/**
 * Checks if an item is in watch list (quantity=0 and price=0)
 */
export function isWatchListItem(item: PortfolioItem): boolean {
	return item.quantity === 0 && item.price === 0;
}

/**
 * Calculates total portfolio value (only items with quantity > 0 and price > 0)
 */
export function calculatePortfolioValue(items: PortfolioItem[]): number {
	return items.reduce((total, item) => {
		if (item.quantity > 0 && item.price > 0) {
			return total + (item.quantity * item.price);
		}
		return total;
	}, 0);
}

/**
 * Calculates individual investment value
 */
export function calculateInvestmentValue(item: PortfolioItem): number {
	if (item.quantity > 0 && item.price > 0) {
		return item.quantity * item.price;
	}
	return 0;
}

/**
 * Formats currency in VND with proper Vietnamese formatting
 */
export function formatVND(amount: number): string {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
}

/**
 * Formats number with thousand separators for input display
 */
export function formatNumber(value: number | string): string {
	const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
	if (num === 0) return '';
	return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Formats compact currency (e.g., ₫92.4K, ₫2.5M)
 */
export function formatCompactVND(amount: number): string {
	if (amount === 0) return '₫0';
	
	const absAmount = Math.abs(amount);
	const sign = amount < 0 ? '-' : '';
	
	if (absAmount >= 1_000_000_000) {
		return `${sign}₫${(absAmount / 1_000_000_000).toFixed(1)}B`;
	} else if (absAmount >= 1_000_000) {
		return `${sign}₫${(absAmount / 1_000_000).toFixed(1)}M`;
	} else if (absAmount >= 1_000) {
		return `${sign}₫${(absAmount / 1_000).toFixed(1)}K`;
	}
	
	return formatVND(amount);
}

/**
 * Parses number from formatted string (removes separators)
 */
export function parseFormattedNumber(value: string): number {
	if (!value || value.trim() === '') return 0;
	// Remove thousand separators and other non-numeric characters except decimal point
	const cleaned = value.replace(/[^\d.-]/g, '');
	const num = parseFloat(cleaned) || 0;
	return Math.max(0, num); // Ensure non-negative
}

/**
 * Validates if a price value is realistic for Vietnamese stocks
 */
export function validateStockPrice(price: number): { isValid: boolean; warning?: string } {
	if (price <= 0) {
		return { isValid: false };
	}
	
	if (price < 1000) {
		return { isValid: true, warning: 'Price seems unusually low for Vietnamese stocks' };
	}
	
	if (price > 1_000_000) {
		return { isValid: true, warning: 'Price seems unusually high - did you mean ₫' + formatNumber(price / 1000) + '?' };
	}
	
	return { isValid: true };
}

/**
 * Validates if a quantity is realistic
 */
export function validateQuantity(quantity: number): { isValid: boolean; warning?: string } {
	if (quantity < 0) {
		return { isValid: false };
	}
	
	if (quantity > 0 && quantity < 1) {
		return { isValid: true, warning: 'Fractional shares are uncommon in Vietnamese market' };
	}
	
	if (quantity > 1_000_000) {
		return { isValid: true, warning: 'Very large position - please double-check' };
	}
	
	return { isValid: true };
}

/**
 * Suggests rounded price values
 */
export function suggestRoundPrice(price: number): number[] {
	if (price <= 0) return [];
	
	const suggestions: number[] = [];
	const magnitude = Math.pow(10, Math.floor(Math.log10(price)));
	const normalized = price / magnitude;
	
	// Suggest common rounded values
	if (normalized < 2) {
		suggestions.push(magnitude * 1, magnitude * 2);
	} else if (normalized < 5) {
		suggestions.push(magnitude * 2, magnitude * 5);
	} else {
		suggestions.push(magnitude * 5, magnitude * 10);
	}
	
	// Also suggest nearest thousand
	const nearestThousand = Math.round(price / 1000) * 1000;
	if (nearestThousand !== price && nearestThousand > 0) {
		suggestions.push(nearestThousand);
	}
	
	return Array.from(new Set(suggestions)).sort((a, b) => a - b);
}


/**
 * Get sector information for Vietnamese stocks
 */
export function getStockSector(ticker: string): { sector: string; icon: string; color: string } {
	const sectors = {
		// Banking
		VCB: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		BID: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		CTG: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		ACB: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		MBB: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		VPB: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		TPB: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		TCB: { sector: 'Banking', icon: '🏦', color: 'bg-blue-500' },
		
		// Real Estate
		VHM: { sector: 'Real Estate', icon: '🏠', color: 'bg-green-500' },
		VIC: { sector: 'Real Estate', icon: '🏠', color: 'bg-green-500' },
		VRE: { sector: 'Real Estate', icon: '🏠', color: 'bg-green-500' },
		KDH: { sector: 'Real Estate', icon: '🏠', color: 'bg-green-500' },
		NVL: { sector: 'Real Estate', icon: '🏠', color: 'bg-green-500' },
		
		// Securities
		SSI: { sector: 'Securities', icon: '📈', color: 'bg-purple-500' },
		VCI: { sector: 'Securities', icon: '📈', color: 'bg-purple-500' },
		VCS: { sector: 'Securities', icon: '📈', color: 'bg-purple-500' },
		HCM: { sector: 'Securities', icon: '📈', color: 'bg-purple-500' },
		MBS: { sector: 'Securities', icon: '📈', color: 'bg-purple-500' },
		SHS: { sector: 'Securities', icon: '📈', color: 'bg-purple-500' },
		
		// Industrial & Steel
		HPG: { sector: 'Steel', icon: '🏭', color: 'bg-gray-500' },
		HSG: { sector: 'Steel', icon: '🏭', color: 'bg-gray-500' },
		NKG: { sector: 'Steel', icon: '🏭', color: 'bg-gray-500' },
		POM: { sector: 'Industrial', icon: '🏭', color: 'bg-gray-500' },
		
		// Technology
		FPT: { sector: 'Technology', icon: '💻', color: 'bg-indigo-500' },
		CMG: { sector: 'Technology', icon: '💻', color: 'bg-indigo-500' },
		
		// Index
		VNINDEX: { sector: 'Index', icon: '📊', color: 'bg-yellow-500' },
	};
	
	return sectors[ticker as keyof typeof sectors] || { 
		sector: 'Other', 
		icon: '📄', 
		color: 'bg-gray-400' 
	};
}

/**
 * Calculate portfolio diversification metrics
 */
export function calculatePortfolioDiversification(items: PortfolioItem[]): {
	diversificationScore: number;
	sectorConcentration: Array<{ sector: string; percentage: number; value: number }>;
	largestPosition: { ticker: string; percentage: number };
	riskLevel: 'Low' | 'Medium' | 'High';
	suggestions: string[];
} {
	const investments = items.filter(item => !isWatchListItem(item));
	if (investments.length === 0) {
		return {
			diversificationScore: 0,
			sectorConcentration: [],
			largestPosition: { ticker: '', percentage: 0 },
			riskLevel: 'Low',
			suggestions: [],
		};
	}
	
	const totalValue = calculatePortfolioValue(investments);
	
	// Calculate sector concentration
	const sectorMap = new Map<string, { value: number; tickers: string[] }>();
	investments.forEach(item => {
		const value = calculateInvestmentValue(item);
		const sector = getStockSector(item.ticker).sector;
		
		if (sectorMap.has(sector)) {
			const existing = sectorMap.get(sector)!;
			existing.value += value;
			existing.tickers.push(item.ticker);
		} else {
			sectorMap.set(sector, { value, tickers: [item.ticker] });
		}
	});
	
	const sectorConcentration = Array.from(sectorMap.entries())
		.map(([sector, data]) => ({
			sector,
			percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
			value: data.value,
		}))
		.sort((a, b) => b.percentage - a.percentage);
	
	// Find largest position
	const largestPosition = investments.reduce((largest, current) => {
		const currentValue = calculateInvestmentValue(current);
		const currentPercentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
		
		if (currentPercentage > largest.percentage) {
			return { ticker: current.ticker, percentage: currentPercentage };
		}
		return largest;
	}, { ticker: '', percentage: 0 });
	
	// Calculate diversification score (0-10)
	let score = 10;
	
	// Penalize for high individual position concentration
	if (largestPosition.percentage > 50) score -= 4;
	else if (largestPosition.percentage > 30) score -= 2;
	else if (largestPosition.percentage > 20) score -= 1;
	
	// Penalize for high sector concentration
	const maxSectorPercentage = Math.max(...sectorConcentration.map(s => s.percentage));
	if (maxSectorPercentage > 60) score -= 3;
	else if (maxSectorPercentage > 40) score -= 2;
	else if (maxSectorPercentage > 30) score -= 1;
	
	// Reward for number of positions
	if (investments.length < 3) score -= 2;
	else if (investments.length >= 8) score += 1;
	
	// Determine risk level
	let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
	if (score <= 4) riskLevel = 'High';
	else if (score <= 7) riskLevel = 'Medium';
	
	// Generate suggestions
	const suggestions: string[] = [];
	if (largestPosition.percentage > 30) {
		suggestions.push(`Consider reducing ${largestPosition.ticker} position (${largestPosition.percentage.toFixed(1)}% of portfolio)`);
	}
	if (maxSectorPercentage > 40) {
		const dominantSector = sectorConcentration[0];
		suggestions.push(`${dominantSector.percentage.toFixed(1)}% in ${dominantSector.sector} - consider diversifying to other sectors`);
	}
	if (investments.length < 5) {
		suggestions.push('Consider adding more positions to improve diversification');
	}
	if (sectorConcentration.length <= 2) {
		suggestions.push('Portfolio spans only ' + sectorConcentration.length + ' sectors - consider adding different industries');
	}
	
	return {
		diversificationScore: Math.max(0, Math.min(10, score)),
		sectorConcentration,
		largestPosition,
		riskLevel,
		suggestions,
	};
}

/**
 * Calculate portfolio performance metrics
 */
export function calculatePortfolioMetrics(items: PortfolioItem[], deposit: number = 0): {
	totalValue: number;
	totalInvestment: number;
	unrealizedPnL: number;
	unrealizedPnLPercentage: number;
	numberOfPositions: number;
	averagePositionSize: number;
	portfolioHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor';
} {
	const investments = items.filter(item => !isWatchListItem(item));
	const totalValue = calculatePortfolioValue(investments);
	const totalInvestment = deposit || totalValue; // Use deposit if available, otherwise assume current value
	const unrealizedPnL = totalValue - totalInvestment;
	const unrealizedPnLPercentage = totalInvestment > 0 ? (unrealizedPnL / totalInvestment) * 100 : 0;
	const numberOfPositions = investments.length;
	const averagePositionSize = numberOfPositions > 0 ? totalValue / numberOfPositions : 0;
	
	// Determine portfolio health based on diversification and performance
	const diversification = calculatePortfolioDiversification(items);
	let portfolioHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
	
	if (diversification.diversificationScore >= 8 && unrealizedPnLPercentage >= 0) {
		portfolioHealth = 'Excellent';
	} else if (diversification.diversificationScore >= 6 && unrealizedPnLPercentage >= -10) {
		portfolioHealth = 'Good';
	} else if (diversification.diversificationScore >= 4 || unrealizedPnLPercentage >= -20) {
		portfolioHealth = 'Fair';
	}
	
	return {
		totalValue,
		totalInvestment,
		unrealizedPnL,
		unrealizedPnLPercentage,
		numberOfPositions,
		averagePositionSize,
		portfolioHealth,
	};
}

/**
 * Scales portfolio values for privacy (default to 100,000,000 VND)
 */
export function scalePortfolioForPrivacy(
	items: PortfolioItem[], 
	_deposit: number, 
	targetDeposit: number = 100_000_000
): { scaledItems: PortfolioItem[], scaledDeposit: number, scaleFactor: number } {
	const totalValue = calculatePortfolioValue(items);
	const scaleFactor = totalValue > 0 ? targetDeposit / totalValue : 1;
	
	const scaledItems = items.map(item => ({
		...item,
		quantity: item.quantity > 0 ? item.quantity * scaleFactor : item.quantity,
		price: item.price,
	}));
	
	return {
		scaledItems,
		scaledDeposit: targetDeposit,
		scaleFactor,
	};
}

/**
 * Debounce function for URL updates - short delay to batch changes
 */
export function debounce<T extends (...args: any[]) => any>(
	func: T,
	delay: number = 300
): (...args: Parameters<T>) => void {
	let timeoutId: NodeJS.Timeout;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => func(...args), delay);
	};
}

/**
 * Smart input memory system for remembering user preferences
 */
export interface InputMemory {
	recentTickers: string[];
	commonPrices: Record<string, number[]>;
	commonQuantities: number[];
	quickRounds: number[];
	lastUpdated: number;
}

const MEMORY_KEY = 'portfolio-input-memory';
const MAX_RECENT_TICKERS = 20;
const MAX_COMMON_PRICES = 5;
const MAX_COMMON_QUANTITIES = 10;

/**
 * Load input memory from localStorage
 */
export function loadInputMemory(): InputMemory {
	try {
		const stored = localStorage.getItem(MEMORY_KEY);
		if (!stored) {
			return {
				recentTickers: [],
				commonPrices: {},
				commonQuantities: [100, 200, 500, 1000],
				quickRounds: [1000, 5000, 10000, 50000, 100000],
				lastUpdated: Date.now(),
			};
		}
		
		const memory = JSON.parse(stored) as InputMemory;
		
		// Migrate old format or add defaults
		if (!memory.quickRounds) {
			memory.quickRounds = [1000, 5000, 10000, 50000, 100000];
		}
		if (!memory.commonQuantities) {
			memory.commonQuantities = [100, 200, 500, 1000];
		}
		
		return memory;
	} catch {
		return {
			recentTickers: [],
			commonPrices: {},
			commonQuantities: [100, 200, 500, 1000],
			quickRounds: [1000, 5000, 10000, 50000, 100000],
			lastUpdated: Date.now(),
		};
	}
}

/**
 * Save input memory to localStorage
 */
export function saveInputMemory(memory: InputMemory): void {
	try {
		memory.lastUpdated = Date.now();
		localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
	} catch {
		// localStorage might be unavailable or full, fail silently
	}
}

/**
 * Remember a ticker input
 */
export function rememberTicker(ticker: string): void {
	if (!ticker || ticker.length < 2) return;
	
	const memory = loadInputMemory();
	const upperTicker = ticker.toUpperCase();
	
	// Remove if already exists, then add to front
	memory.recentTickers = memory.recentTickers.filter(t => t !== upperTicker);
	memory.recentTickers.unshift(upperTicker);
	
	// Keep only the most recent ones
	memory.recentTickers = memory.recentTickers.slice(0, MAX_RECENT_TICKERS);
	
	saveInputMemory(memory);
}

/**
 * Remember a price input for a specific ticker
 */
export function rememberPrice(ticker: string, price: number): void {
	if (!ticker || price <= 0) return;
	
	const memory = loadInputMemory();
	const upperTicker = ticker.toUpperCase();
	
	if (!memory.commonPrices[upperTicker]) {
		memory.commonPrices[upperTicker] = [];
	}
	
	// Remove if already exists, then add to front
	memory.commonPrices[upperTicker] = memory.commonPrices[upperTicker].filter(p => p !== price);
	memory.commonPrices[upperTicker].unshift(price);
	
	// Keep only the most recent ones
	memory.commonPrices[upperTicker] = memory.commonPrices[upperTicker].slice(0, MAX_COMMON_PRICES);
	
	saveInputMemory(memory);
}

/**
 * Remember a quantity input
 */
export function rememberQuantity(quantity: number): void {
	if (quantity <= 0) return;
	
	const memory = loadInputMemory();
	
	// Remove if already exists, then add to front
	memory.commonQuantities = memory.commonQuantities.filter(q => q !== quantity);
	memory.commonQuantities.unshift(quantity);
	
	// Keep only the most common ones
	memory.commonQuantities = memory.commonQuantities.slice(0, MAX_COMMON_QUANTITIES);
	
	saveInputMemory(memory);
}

/**
 * Get smart suggestions for ticker input
 */
export function getTickerSuggestions(input: string): string[] {
	const memory = loadInputMemory();
	
	if (!input || input.length < 1) {
		return memory.recentTickers.slice(0, 8);
	}
	
	const upperInput = input.toUpperCase();
	const filtered = memory.recentTickers.filter(ticker => 
		ticker.startsWith(upperInput) || ticker.includes(upperInput)
	);
	
	return filtered.slice(0, 8);
}

/**
 * Get smart suggestions for price input
 */
export function getPriceSuggestions(ticker: string, input: string = ''): number[] {
	const memory = loadInputMemory();
	const upperTicker = ticker.toUpperCase();
	
	const commonPrices = memory.commonPrices[upperTicker] || [];
	const quickRounds = memory.quickRounds;
	
	// If there's input, try to suggest relevant rounds
	if (input && input.length > 0) {
		const partial = parseFormattedNumber(input);
		if (partial > 0) {
			const suggested = suggestRoundPrice(partial);
			// Combine with common prices for this ticker
			const combined = Array.from(new Set([...suggested, ...commonPrices]));
			return combined.sort((a, b) => a - b).slice(0, 6);
		}
	}
	
	// Combine common prices with quick rounds, prioritize ticker-specific
	const suggestions = Array.from(new Set([...commonPrices, ...quickRounds]));
	return suggestions.sort((a, b) => a - b).slice(0, 8);
}

/**
 * Get smart suggestions for quantity input
 */
export function getQuantitySuggestions(input: string = ''): number[] {
	const memory = loadInputMemory();
	
	// If there's input, try to suggest relevant multiples
	if (input && input.length > 0) {
		const partial = parseFormattedNumber(input);
		if (partial > 0) {
			const suggested = [
				Math.round(partial / 100) * 100,
				Math.round(partial / 50) * 50,
				Math.round(partial / 10) * 10,
				partial * 2,
				partial * 5,
				partial * 10,
			].filter(q => q > 0 && q !== partial);
			
			const combined = Array.from(new Set([...suggested, ...memory.commonQuantities]));
			return combined.sort((a, b) => a - b).slice(0, 6);
		}
	}
	
	return memory.commonQuantities.slice(0, 8);
}

/**
 * Smart auto-complete for partially typed values
 */
export function smartAutoComplete(field: 'ticker' | 'price' | 'quantity', value: string, context?: { ticker?: string }): string[] {
	switch (field) {
		case 'ticker':
			return getTickerSuggestions(value);
		case 'price':
			const priceSuggestions = getPriceSuggestions(context?.ticker || '', value);
			return priceSuggestions.map(p => formatNumber(p));
		case 'quantity':
			const quantitySuggestions = getQuantitySuggestions(value);
			return quantitySuggestions.map(q => formatNumber(q));
		default:
			return [];
	}
}

/**
 * Predict next likely input based on patterns
 */
export function predictNextInput(items: PortfolioItem[], field: 'ticker' | 'price' | 'quantity'): string[] {
	const memory = loadInputMemory();
	
	switch (field) {
		case 'ticker':
			// Suggest tickers not already in portfolio
			const existingTickers = items.map(item => item.ticker);
			const availableTickers = memory.recentTickers.filter(ticker => 
				!existingTickers.includes(ticker)
			);
			return availableTickers.slice(0, 5);
			
		case 'price':
			// Analyze price patterns in current portfolio
			const prices = items
				.filter(item => item.price > 0)
				.map(item => item.price)
				.sort((a, b) => a - b);
			
			if (prices.length > 0) {
				const median = prices[Math.floor(prices.length / 2)];
				const suggested = suggestRoundPrice(median);
				return suggested.map(p => formatNumber(p));
			}
			return getPriceSuggestions('', '').map(p => formatNumber(p));
			
		case 'quantity':
			// Analyze quantity patterns in current portfolio
			const quantities = items
				.filter(item => item.quantity > 0)
				.map(item => item.quantity)
				.sort((a, b) => a - b);
			
			if (quantities.length > 0) {
				const median = quantities[Math.floor(quantities.length / 2)];
				const roundedSuggestions = [
					Math.round(median / 100) * 100,
					Math.round(median / 50) * 50,
					median * 2,
				].filter(q => q > 0);
				
				return Array.from(new Set(roundedSuggestions)).map(q => formatNumber(q));
			}
			return getQuantitySuggestions('').map(q => formatNumber(q));
			
		default:
			return [];
	}
}

/**
 * Clear old memory entries (older than 90 days)
 */
export function cleanupMemory(): void {
	const memory = loadInputMemory();
	const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
	
	if (memory.lastUpdated < ninetyDaysAgo) {
		// Clear old data but keep structure
		memory.recentTickers = memory.recentTickers.slice(0, 10); // Keep only 10 most recent
		memory.commonPrices = {};
		memory.commonQuantities = [100, 200, 500, 1000]; // Reset to defaults
		saveInputMemory(memory);
	}
}