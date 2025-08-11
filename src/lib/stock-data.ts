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

export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "2Y" | "ALL";

const GITHUB_RAW_BASE_URL =
	"https://raw.githubusercontent.com/quanhua92/aipriceaction-ui/main/market_data_2017_2025";

export function getTickerCsvUrl(ticker: string): string {
	return `${GITHUB_RAW_BASE_URL}/${ticker}_2017-01-03_to_2025-08-11.csv`;
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

		return {
			ticker,
			time,
			date: new Date(time),
			open: parseFloat(open),
			high: parseFloat(high),
			low: parseFloat(low),
			close: parseFloat(close),
			volume: parseInt(volume, 10),
		};
	});
}

export function filterDataByTimeRange(
	data: StockDataPoint[],
	range: TimeRange,
): StockDataPoint[] {
	if (range === "ALL") return data;

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

export function getLatestPrice(data: StockDataPoint[]): StockDataPoint | null {
	return data.length > 0 ? data[data.length - 1] : null;
}

export async function loadTickerGroups(): Promise<TickerGroup> {
	try {
		const response = await fetch("/ticker_group.json");
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
	return Object.values(tickerGroups).flat();
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
	for (const [sector, tickers] of Object.entries(tickerGroups)) {
		if (tickers.includes(ticker)) {
			return sector;
		}
	}
	return null;
}
