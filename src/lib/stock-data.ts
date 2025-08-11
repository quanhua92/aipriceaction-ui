export interface StockDataPoint {
	ticker: string;
	time: string;
	date: Date;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
}

export interface TickerGroup {
	[sector: string]: string[];
}

export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "2Y" | "ALL" | "CUSTOM";

export interface DateRange {
	startDate?: Date;
	endDate?: Date;
}

export interface CustomDateRange extends DateRange {
	range: "CUSTOM";
}

export type DateRangeConfig = 
	| { range: Exclude<TimeRange, "CUSTOM"> }
	| CustomDateRange;

const GITHUB_RAW_BASE_URL =
	"https://raw.githubusercontent.com/quanhua92/aipriceaction-ui/refs/heads/main/market_data";

export function getTickerCsvUrl(ticker: string): string {
	return `${GITHUB_RAW_BASE_URL}/${ticker}.csv`;
}

export async function fetchTickerData(
	ticker: string,
): Promise<StockDataPoint[]> {
	const url = getTickerCsvUrl(ticker);

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Failed to fetch data for ${ticker}: ${response.status}`);
		}

		const csvText = await response.text();
		return parseCsvData(csvText);
	} catch (error) {
		console.error(`Error fetching data for ${ticker}:`, error);
		throw error;
	}
}

export function parseCsvData(csvText: string): StockDataPoint[] {
	const lines = csvText.trim().split("\n");
	const header = lines[0];

	if (!header.includes("ticker,time,open,high,low,close,volume")) {
		throw new Error("Invalid CSV format");
	}

	return lines.slice(1).map((line) => {
		const [ticker, time, open, high, low, close, volume] = line.split(",");
		
		// Parse date in YYYY-MM-DD format and treat it as local time
		const [year, month, day] = time.split("-").map(Number);
		const date = new Date(year, month - 1, day); // month is 0-indexed

		// Scale prices by 1000 for stock tickers (VND), but not for VNINDEX (points)
		const priceScale = ticker === "VNINDEX" ? 1 : 1000;

		return {
			ticker,
			time,
			date,
			open: parseFloat(open) * priceScale,
			high: parseFloat(high) * priceScale,
			low: parseFloat(low) * priceScale,
			close: parseFloat(close) * priceScale,
			volume: parseInt(volume, 10),
		};
	});
}

export function filterDataByTimeRange(
	data: StockDataPoint[],
	range: TimeRange,
): StockDataPoint[] {
	if (range === "ALL") return data;
	if (range === "CUSTOM") return data; // Custom filtering handled separately

	const now = new Date();
	const cutoffDate = new Date();

	switch (range) {
		case "1M":
			cutoffDate.setMonth(now.getMonth() - 1);
			break;
		case "3M":
			cutoffDate.setMonth(now.getMonth() - 3);
			break;
		case "6M":
			cutoffDate.setMonth(now.getMonth() - 6);
			break;
		case "1Y":
			cutoffDate.setFullYear(now.getFullYear() - 1);
			break;
		case "2Y":
			cutoffDate.setFullYear(now.getFullYear() - 2);
			break;
	}

	return data.filter((point) => point.date >= cutoffDate);
}

export function filterDataByDateRange(
	data: StockDataPoint[],
	config: DateRangeConfig,
): StockDataPoint[] {
	if (config.range !== "CUSTOM") {
		return filterDataByTimeRange(data, config.range);
	}

	const { startDate, endDate } = config;
	
	return data.filter((point) => {
		if (startDate && point.date < startDate) return false;
		if (endDate && point.date > endDate) return false;
		return true;
	});
}

export function parseDateString(dateStr: string): Date | null {
	try {
		const date = new Date(dateStr);
		return isNaN(date.getTime()) ? null : date;
	} catch {
		return null;
	}
}

export function formatDateForUrl(date: Date): string {
	return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

export function getDataDateBounds(data: StockDataPoint[]): DateRange {
	if (data.length === 0) return {};
	
	const dates = data.map(point => point.date);
	return {
		startDate: new Date(Math.min(...dates.map(d => d.getTime()))),
		endDate: new Date(Math.max(...dates.map(d => d.getTime()))),
	};
}

export function createDateRangeConfig(
	range?: TimeRange,
	startDate?: string,
	endDate?: string,
): DateRangeConfig {
	// If custom dates are provided, use custom range
	if (startDate || endDate) {
		return {
			range: "CUSTOM",
			startDate: startDate ? parseDateString(startDate) || undefined : undefined,
			endDate: endDate ? parseDateString(endDate) || undefined : undefined,
		};
	}
	
	// Otherwise use the provided range or default
	return { range: range || "ALL" };
}

export function sampleData(
	data: StockDataPoint[],
	maxPoints: number = 1000,
): StockDataPoint[] {
	if (data.length <= maxPoints) return data;

	const step = Math.floor(data.length / maxPoints);
	return data.filter((_, index) => index % step === 0);
}

export function calculatePriceChange(data: StockDataPoint[]): {
	change: number;
	changePercent: number;
} {
	if (data.length < 2) return { change: 0, changePercent: 0 };

	const latest = data[data.length - 1];
	const previous = data[data.length - 2];

	const change = latest.close - previous.close;
	const changePercent = (change / previous.close) * 100;

	return { change, changePercent };
}

export function calculateRangeChange(data: StockDataPoint[]): {
	change: number;
	changePercent: number;
} {
	if (data.length < 2) return { change: 0, changePercent: 0 };

	const latest = data[data.length - 1];
	const first = data[0];

	const change = latest.close - first.close;
	const changePercent = (change / first.close) * 100;

	return { change, changePercent };
}

export function getLatestPrice(data: StockDataPoint[]): StockDataPoint | null {
	return data.length > 0 ? data[data.length - 1] : null;
}

export async function loadTickerGroups(): Promise<TickerGroup> {
	try {
		const url = "https://raw.githubusercontent.com/quanhua92/aipriceaction-ui/refs/heads/main/ticker_group.json";
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("Failed to fetch ticker groups");
		}
		return await response.json();
	} catch (error) {
		console.error("Error loading ticker groups:", error);
		throw error;
	}
}

export function getAllTickers(tickerGroups: TickerGroup): string[] {
	const allTickers = Object.values(tickerGroups).flat();
	// Include VNINDEX as it's not a stock but has chartable data
	return ["VNINDEX", ...allTickers];
}

export function getTickersBySector(
	tickerGroups: TickerGroup,
	sector: string,
): string[] {
	return tickerGroups[sector] || [];
}

export function findTickerSector(
	tickerGroups: TickerGroup,
	ticker: string,
): string | null {
	// VNINDEX is a market index, not part of any sector
	if (ticker === "VNINDEX") {
		return null;
	}
	
	for (const [sector, tickers] of Object.entries(tickerGroups)) {
		if (tickers.includes(ticker)) {
			return sector;
		}
	}
	return null;
}
