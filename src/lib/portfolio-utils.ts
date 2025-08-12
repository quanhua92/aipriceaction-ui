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
 * Formats currency in VND
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
		quantity: item.quantity,
		price: item.price > 0 ? item.price * scaleFactor : item.price,
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