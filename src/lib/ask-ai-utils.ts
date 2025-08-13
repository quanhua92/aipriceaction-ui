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
export function formatChartContext(ticker: string, data: StockDataPoint[], maxDays: number = 10): string {
	if (!data || data.length === 0 || maxDays === 0) {
		return maxDays === 0 ? "" : `${ticker}: No chart data available`;
	}

	// Get last N trading days based on configuration
	const recentData = data.slice(-maxDays);
	
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
	return `# Last ${maxDays} Trading Days OHLCV Data\n${contextLines.join('\n')}`;
}

// Format VPA data to context string
export function formatVPAContext(ticker: string, vpaContent?: string, maxDays: number = 5): string {
	if (!vpaContent || maxDays === 0) {
		return maxDays === 0 ? "" : `${ticker} VPA: No VPA data available`;
	}

	// Extract last N rows of meaningful VPA data
	// VPA files typically contain tables with analysis data
	const lines = vpaContent.split('\n').filter(line => line.trim());
	
	// Find lines that look like data rows (contain pipes or are structured)
	const dataLines = lines.filter(line => 
		line.includes('|') || 
		(line.includes('Date') && line.includes('Action')) ||
		line.match(/\d{4}-\d{2}-\d{2}/)
	);

	// Get last N relevant lines based on configuration
	const recentVPA = dataLines.slice(-maxDays);
	
	if (recentVPA.length === 0) {
		// If no structured data found, get last N non-empty lines
		const lastLines = lines.slice(-maxDays);
		// Add TICKER: prefix to each line
		const prefixedLines = lastLines.map(line => `${ticker}: ${line}`);
		return `${ticker} VPA:\n${prefixedLines.join('\n')}`;
	}

	// Add TICKER: prefix to each VPA data line
	const prefixedVPA = recentVPA.map(line => `${ticker}: ${line}`);
	return `${ticker} VPA:\n${prefixedVPA.join('\n')}`;
}

// Build complete context for single ticker
export function buildSingleTickerContext(
	ticker: string, 
	chartData: StockDataPoint[], 
	vpaContent?: string,
	chartContextDays: number = 10,
	vpaContextDays: number = 5
): string {
	const chartContext = formatChartContext(ticker, chartData, chartContextDays);
	const vpaContext = formatVPAContext(ticker, vpaContent, vpaContextDays);
	
	// Filter out empty contexts
	const contexts = [];
	if (chartContext) contexts.push(`# Chart Context\n${chartContext}`);
	if (vpaContext) contexts.push(`# Volume Price Action Context\n${vpaContext}`);
	
	return contexts.join('\n\n');
}

// Build complete context for multiple tickers
export function buildMultipleTickersContext(
	tickersData: Array<{
		ticker: string;
		chartData: StockDataPoint[];
		vpaContent?: string;
	}>,
	chartContextDays: number = 10,
	vpaContextDays: number = 5
): string {
	const contexts = tickersData.map(({ ticker, chartData, vpaContent }) => {
		const chartContext = formatChartContext(ticker, chartData, chartContextDays);
		const vpaContext = formatVPAContext(ticker, vpaContent, vpaContextDays);
		
		// Filter out empty contexts
		const tickerContexts = [];
		if (chartContext) tickerContexts.push(`# Chart Context\n${chartContext}`);
		if (vpaContext) tickerContexts.push(`# Volume Price Action Context\n${vpaContext}`);
		
		return tickerContexts.length > 0 ? `## ${ticker}\n${tickerContexts.join('\n\n')}` : '';
	}).filter(context => context); // Remove empty contexts

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