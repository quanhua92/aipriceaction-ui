import type { StockDataPoint } from "./stock-data";

export interface AskAITemplate {
	id: string;
	title: string;
	prompt: string;
}

export interface AskAIContextData {
	ticker: string;
	chartContext: string;
	vpaContext: string;
}

// Format chart data to context string
export function formatChartContext(ticker: string, data: StockDataPoint[]): string {
	if (!data || data.length === 0) {
		return `${ticker}: No chart data available`;
	}

	// DEBUG: Log all data points to understand date structure
	console.log(`=== DEBUG ${ticker} CHART CONTEXT ===`);
	console.log(`Total data points: ${data.length}`);
	console.log(`First point:`, data[0]);
	console.log(`Last point:`, data[data.length - 1]);
	console.log(`Last 3 points dates:`, data.slice(-3).map(p => ({ 
		date: p.date, 
		dateType: typeof p.date,
		dateInstance: p.date instanceof Date,
		close: p.close 
	})));

	// Get last 10 trading days for comprehensive context
	const recentData = data.slice(-10);
	
	// DEBUG: Log recent data details
	console.log(`Recent data (last ${recentData.length}):`, recentData.map(p => ({
		date: p.date,
		dateFormatted: p.date instanceof Date ? p.date.toISOString().split('T')[0] : p.date,
		close: p.close
	})));

	const contextLines = recentData.map((point, index) => {
		const dateStr = point.date instanceof Date 
			? point.date.toISOString().split('T')[0]
			: point.date;
		
		// DEBUG: Log each point being processed
		console.log(`Processing point ${index}: date=${point.date}, formatted=${dateStr}, close=${point.close}`);
		
		// Calculate daily change if not the first point
		let changeStr = "";
		if (index > 0) {
			const prevClose = recentData[index - 1].close;
			const change = point.close - prevClose;
			const changePercent = ((change / prevClose) * 100);
			changeStr = `, Change=${change > 0 ? '+' : ''}${change.toFixed(2)} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
		}
		
		const contextLine = `${ticker}: Date=${dateStr}, Open=${point.open}, High=${point.high}, Low=${point.low}, Close=${point.close}, Volume=${point.volume.toLocaleString()}${changeStr}`;
		console.log(`Generated context line: ${contextLine}`);
		
		return contextLine;
	});

	console.log(`=== END DEBUG ${ticker} ===`);
	return `# Last 10 Trading Days OHLCV Data\n${contextLines.join('\n')}`;
}

// Format VPA data to context string
export function formatVPAContext(ticker: string, vpaContent?: string): string {
	if (!vpaContent) {
		return `${ticker} VPA: No VPA data available`;
	}

	// Extract last 5 rows of meaningful VPA data
	// VPA files typically contain tables with analysis data
	const lines = vpaContent.split('\n').filter(line => line.trim());
	
	// Find lines that look like data rows (contain pipes or are structured)
	const dataLines = lines.filter(line => 
		line.includes('|') || 
		(line.includes('Date') && line.includes('Action')) ||
		line.match(/\d{4}-\d{2}-\d{2}/)
	);

	// Get last 5 relevant lines
	const recentVPA = dataLines.slice(-5);
	
	if (recentVPA.length === 0) {
		// If no structured data found, get last 5 non-empty lines
		const lastLines = lines.slice(-5);
		return `${ticker} VPA:\n${lastLines.join('\n')}`;
	}

	return `${ticker} VPA:\n${recentVPA.join('\n')}`;
}

// Build complete context for single ticker
export function buildSingleTickerContext(
	ticker: string, 
	chartData: StockDataPoint[], 
	vpaContent?: string
): string {
	const chartContext = formatChartContext(ticker, chartData);
	const vpaContext = formatVPAContext(ticker, vpaContent);
	
	return `# Chart Context\n${chartContext}\n\n# Volume Price Action Context\n${vpaContext}`;
}

// Build complete context for multiple tickers
export function buildMultipleTickersContext(
	tickersData: Array<{
		ticker: string;
		chartData: StockDataPoint[];
		vpaContent?: string;
	}>
): string {
	const contexts = tickersData.map(({ ticker, chartData, vpaContent }) => {
		const chartContext = formatChartContext(ticker, chartData);
		const vpaContext = formatVPAContext(ticker, vpaContent);
		
		return `## ${ticker}\n# Chart Context\n${chartContext}\n\n# Volume Price Action Context\n${vpaContext}`;
	});

	return contexts.join('\n\n---\n\n');
}

// Generate final prompt with context and template
export function generatePrompt(template: string, context: string): string {
	return `${context}\n\n# Question\n${template}`;
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error('Failed to copy to clipboard:', err);
		// Fallback for older browsers
		try {
			const textArea = document.createElement('textarea');
			textArea.value = text;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			const result = document.execCommand('copy');
			document.body.removeChild(textArea);
			return result;
		} catch (fallbackErr) {
			console.error('Fallback copy failed:', fallbackErr);
			return false;
		}
	}
}