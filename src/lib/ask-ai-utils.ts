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

	// Get last 10 trading days for comprehensive context
	const recentData = data.slice(-10);
	
	const contextLines = recentData.map((point, index) => {
		// Use the time string directly (already in YYYY-MM-DD format)
		const dateStr = point.time;
		
		// Calculate daily change if not the first point
		let changeStr = "";
		if (index > 0) {
			const prevClose = recentData[index - 1].close;
			const change = point.close - prevClose;
			const changePercent = ((change / prevClose) * 100);
			changeStr = `, Change=${change > 0 ? '+' : ''}${change.toFixed(2)} (${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
		}
		
		return `${ticker}: Date=${dateStr}, Open=${point.open}, High=${point.high}, Low=${point.low}, Close=${point.close}, Volume=${point.volume.toLocaleString()}${changeStr}`;
	});
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