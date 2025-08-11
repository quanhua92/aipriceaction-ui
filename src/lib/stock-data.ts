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

export function formatDateForUrl(date: Date | undefined): string {
	if (!date) return '';
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

export interface TickerPerformance {
	ticker: string;
	currentPrice: number;
	change: number;
	changePercent: number;
	volume: number;
}

export interface SectorPerformance {
	sector: string;
	sectorName: string;
	averageDailyChange: number;
	averageRangeChange: number;
	totalVolume: number;
	topPerformers: TickerPerformance[];
	totalTickers: number;
	activeTickersCount: number;
}

export function calculateTickerPerformance(data: StockDataPoint[]): TickerPerformance | null {
	if (data.length < 2) return null;
	
	// Sort data by date to ensure chronological order
	const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
	const latest = sortedData[sortedData.length - 1];
	const previous = sortedData[sortedData.length - 2];
	
	const change = latest.close - previous.close;
	const changePercent = (change / previous.close) * 100;
	
	return {
		ticker: latest.ticker,
		currentPrice: latest.close,
		change,
		changePercent,
		volume: latest.volume,
	};
}

export function calculateTickerRangePerformance(data: StockDataPoint[]): TickerPerformance | null {
	if (data.length < 2) return null;
	
	// Sort data by date to ensure chronological order
	const sortedData = [...data].sort((a, b) => a.date.getTime() - b.date.getTime());
	const latest = sortedData[sortedData.length - 1];
	const first = sortedData[0];
	
	const change = latest.close - first.close;
	const changePercent = (change / first.close) * 100;
	
	return {
		ticker: latest.ticker,
		currentPrice: latest.close,
		change,
		changePercent,
		volume: latest.volume,
	};
}

export function calculateSectorPerformance(
	sectorData: Record<string, StockDataPoint[]>,
	sector: string,
	sectorDisplayName: string,
): SectorPerformance {
	// Calculate daily performances (last 2 data points)
	const dailyPerformances = Object.entries(sectorData)
		.map(([tickerSymbol, data]) => {
			const performance = calculateTickerPerformance(data);
			return performance ? { ...performance, ticker: tickerSymbol } : null;
		})
		.filter((p): p is TickerPerformance => p !== null);

	// Calculate range performances (first vs last data point)
	const rangePerformances = Object.entries(sectorData)
		.map(([tickerSymbol, data]) => {
			const performance = calculateTickerRangePerformance(data);
			return performance ? { ...performance, ticker: tickerSymbol } : null;
		})
		.filter((p): p is TickerPerformance => p !== null);

	const averageDailyChange = dailyPerformances.length > 0 
		? dailyPerformances.reduce((sum, p) => sum + p.changePercent, 0) / dailyPerformances.length
		: 0;

	const averageRangeChange = rangePerformances.length > 0 
		? rangePerformances.reduce((sum, p) => sum + p.changePercent, 0) / rangePerformances.length
		: 0;

	const totalVolume = dailyPerformances.reduce((sum, p) => sum + p.volume, 0);

	// Get top 3 performers by range change percent (more meaningful for overall performance)
	const topPerformers = rangePerformances
		.sort((a, b) => b.changePercent - a.changePercent)
		.slice(0, 3);

	return {
		sector,
		sectorName: sectorDisplayName,
		averageDailyChange,
		averageRangeChange,
		totalVolume,
		topPerformers,
		totalTickers: Object.keys(sectorData).length,
		activeTickersCount: Math.max(dailyPerformances.length, rangePerformances.length),
	};
}

export function getTopPerformingTickers(
	allSectorData: Record<string, Record<string, StockDataPoint[]>>,
	limit: number = 10,
): TickerPerformance[] {
	const allPerformances: TickerPerformance[] = [];
	
	Object.values(allSectorData).forEach(sectorData => {
		Object.entries(sectorData).forEach(([tickerSymbol, data]) => {
			const performance = calculateTickerPerformance(data);
			if (performance) {
				// Override the ticker from the performance with the actual key
				allPerformances.push({ ...performance, ticker: tickerSymbol });
			}
		});
	});
	
	return allPerformances
		.sort((a, b) => b.changePercent - a.changePercent)
		.slice(0, limit);
}

export function getSectorDisplayName(sector: string): string {
	const sectorNames: Record<string, string> = {
		"CHUNG_KHOAN": "Securities",
		"NGAN_HANG": "Banking", 
		"BAT_DONG_SAN": "Real Estate",
		"CONG_NGHE": "Technology",
		"BAN_LE": "Retail",
		"THEP": "Steel",
		"HOA_CHAT": "Chemicals",
		"THUC_PHAM": "Food & Beverage",
		"NONG_NGHIEP": "Agriculture",
		"VAN_TAI": "Transportation",
		"VLXD": "Building Materials",
		"XAY_DUNG": "Construction",
		// Add more as needed
	};
	
	return sectorNames[sector] || sector.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// Portfolio Analysis Interfaces and Functions

export interface PortfolioPerformance {
	portfolioReturn: number;
	benchmarkReturn: number;
	activeReturn: number;
	volatility: number;
	benchmarkVolatility: number;
	sharpeRatio: number;
	informationRatio: number;
	maxDrawdown: number;
	bestPeriod: { start: string; end: string; return: number };
	worstPeriod: { start: string; end: string; return: number };
}

export interface StockPerformanceMetrics {
	ticker: string;
	totalReturn: number;
	annualizedReturn: number;
	volatility: number;
	beta: number;
	alpha: number;
	sharpeRatio: number;
	maxDrawdown: number;
	correlation: number;
	contribution: number;
}

export interface CorrelationMatrix {
	tickers: string[];
	matrix: number[][];
}

export interface DrawdownPeriod {
	start: string;
	end: string;
	peak: number;
	trough: number;
	drawdown: number;
	duration: number;
}

export interface PortfolioRiskMetrics {
	portfolioVolatility: number;
	diversificationRatio: number;
	concentrationRisk: number;
	valueAtRisk95: number;
	expectedShortfall: number;
	beta: number;
	trackingError: number;
}

export interface SectorAllocation {
	sector: string;
	allocation: number;
	performance: number;
	tickers: string[];
}

// Calculate daily returns for a stock
export function calculateDailyReturns(data: StockDataPoint[]): number[] {
	if (data.length < 2) return [];
	
	const returns: number[] = [];
	for (let i = 1; i < data.length; i++) {
		const dailyReturn = (data[i].close - data[i-1].close) / data[i-1].close;
		returns.push(dailyReturn);
	}
	return returns;
}

// Calculate cumulative returns
export function calculateCumulativeReturns(dailyReturns: number[]): number[] {
	let cumulative = 1;
	return dailyReturns.map(ret => {
		cumulative *= (1 + ret);
		return cumulative - 1;
	});
}

// Calculate correlation between two return series
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
	if (returns1.length !== returns2.length || returns1.length === 0) return 0;
	
	const n = returns1.length;
	const sum1 = returns1.reduce((a, b) => a + b, 0);
	const sum2 = returns2.reduce((a, b) => a + b, 0);
	const sum1Sq = returns1.reduce((a, b) => a + b * b, 0);
	const sum2Sq = returns2.reduce((a, b) => a + b * b, 0);
	const sumProduct = returns1.reduce((sum, val, i) => sum + val * returns2[i], 0);
	
	const numerator = n * sumProduct - sum1 * sum2;
	const denominator = Math.sqrt((n * sum1Sq - sum1 * sum1) * (n * sum2Sq - sum2 * sum2));
	
	return denominator === 0 ? 0 : numerator / denominator;
}

// Calculate beta coefficient
export function calculateBeta(stockReturns: number[], marketReturns: number[]): number {
	if (stockReturns.length !== marketReturns.length || stockReturns.length === 0) return 1;
	
	const marketVariance = calculateVariance(marketReturns);
	const covariance = calculateCovariance(stockReturns, marketReturns);
	
	return marketVariance === 0 ? 1 : covariance / marketVariance;
}

// Calculate covariance between two return series
export function calculateCovariance(returns1: number[], returns2: number[]): number {
	if (returns1.length !== returns2.length || returns1.length === 0) return 0;
	
	const mean1 = returns1.reduce((a, b) => a + b, 0) / returns1.length;
	const mean2 = returns2.reduce((a, b) => a + b, 0) / returns2.length;
	
	const covariance = returns1.reduce((sum, val, i) => {
		return sum + (val - mean1) * (returns2[i] - mean2);
	}, 0) / (returns1.length - 1);
	
	return covariance;
}

// Calculate variance of returns
export function calculateVariance(returns: number[]): number {
	if (returns.length === 0) return 0;
	
	const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
	const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (returns.length - 1);
	
	return variance;
}

// Calculate Sharpe ratio
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.03): number {
	if (returns.length === 0) return 0;
	
	const annualizedReturn = (returns.reduce((a, b) => a + b, 0) / returns.length) * 252;
	const annualizedVolatility = Math.sqrt(calculateVariance(returns) * 252);
	
	return annualizedVolatility === 0 ? 0 : (annualizedReturn - riskFreeRate) / annualizedVolatility;
}

// Calculate maximum drawdown
export function calculateMaxDrawdown(data: StockDataPoint[]): { maxDrawdown: number; periods: DrawdownPeriod[] } {
	if (data.length === 0) return { maxDrawdown: 0, periods: [] };
	
	let peak = data[0].close;
	let maxDrawdown = 0;
	let currentDrawdownStart = 0;
	const periods: DrawdownPeriod[] = [];
	
	for (let i = 1; i < data.length; i++) {
		if (data[i].close > peak) {
			// New peak found, end any current drawdown period
			if (peak > data[i-1].close) {
				periods.push({
					start: data[currentDrawdownStart].time,
					end: data[i-1].time,
					peak: peak,
					trough: Math.min(...data.slice(currentDrawdownStart, i).map(d => d.close)),
					drawdown: (peak - Math.min(...data.slice(currentDrawdownStart, i).map(d => d.close))) / peak,
					duration: i - currentDrawdownStart
				});
			}
			peak = data[i].close;
			currentDrawdownStart = i;
		} else {
			const currentDrawdown = (peak - data[i].close) / peak;
			if (currentDrawdown > maxDrawdown) {
				maxDrawdown = currentDrawdown;
			}
		}
	}
	
	return { maxDrawdown, periods };
}

// Calculate portfolio performance metrics
export function calculatePortfolioPerformance(
	portfolioData: Record<string, StockDataPoint[]>,
	benchmarkData: StockDataPoint[],
	weights: Record<string, number> = {}
): PortfolioPerformance {
	// Equal weights if not provided
	const tickers = Object.keys(portfolioData);
	
	// Handle edge cases
	if (tickers.length === 0 || benchmarkData.length === 0) {
		return {
			portfolioReturn: 0,
			benchmarkReturn: 0,
			activeReturn: 0,
			volatility: 0,
			benchmarkVolatility: 0,
			sharpeRatio: 0,
			informationRatio: 0,
			maxDrawdown: 0,
			bestPeriod: { start: "", end: "", return: 0 },
			worstPeriod: { start: "", end: "", return: 0 }
		};
	}
	
	const equalWeight = 1 / tickers.length;
	const portfolioWeights = { ...weights };
	
	// Ensure weights sum to 1
	tickers.forEach(ticker => {
		if (!(ticker in portfolioWeights)) {
			portfolioWeights[ticker] = equalWeight;
		}
	});
	
	// Calculate weighted portfolio returns
	const portfolioReturns: number[] = [];
	const benchmarkReturns = calculateDailyReturns(benchmarkData);
	
	// Find common date range - handle empty arrays safely
	const dataLengths = Object.values(portfolioData).map(data => data?.length || 0).filter(length => length > 0);
	if (dataLengths.length === 0) {
		return {
			portfolioReturn: 0,
			benchmarkReturn: 0,
			activeReturn: 0,
			volatility: 0,
			benchmarkVolatility: 0,
			sharpeRatio: 0,
			informationRatio: 0,
			maxDrawdown: 0,
			bestPeriod: { start: "", end: "", return: 0 },
			worstPeriod: { start: "", end: "", return: 0 }
		};
	}
	const minLength = Math.min(...dataLengths);
	
	for (let i = 1; i < minLength; i++) {
		let weightedReturn = 0;
		for (const ticker of tickers) {
			const stockData = portfolioData[ticker];
			if (stockData && stockData[i] && stockData[i-1] && stockData[i-1].close !== 0) {
				const dailyReturn = (stockData[i].close - stockData[i-1].close) / stockData[i-1].close;
				weightedReturn += dailyReturn * portfolioWeights[ticker];
			}
		}
		portfolioReturns.push(weightedReturn);
	}
	
	// Calculate performance metrics - handle empty arrays
	const portfolioTotalReturn = portfolioReturns.length > 0 ? 
		portfolioReturns.reduce((cum, ret) => cum * (1 + ret), 1) - 1 : 0;
	const benchmarkTotalReturn = benchmarkReturns.length > 0 && portfolioReturns.length > 0 ? 
		benchmarkReturns.slice(0, portfolioReturns.length).reduce((cum, ret) => cum * (1 + ret), 1) - 1 : 0;
	
	const portfolioVolatility = Math.sqrt(calculateVariance(portfolioReturns) * 252);
	const benchmarkVolatility = Math.sqrt(calculateVariance(benchmarkReturns) * 252);
	
	const portfolioSharpe = calculateSharpeRatio(portfolioReturns);
	const activeReturns = portfolioReturns.length > 0 && benchmarkReturns.length > 0 ? 
		portfolioReturns.map((ret, i) => ret - (benchmarkReturns[i] || 0)) : [];
	const informationRatio = activeReturns.length > 0 ? 
		(() => {
			const avgActiveReturn = activeReturns.reduce((a, b) => a + b, 0) / activeReturns.length * 252;
			const trackingError = Math.sqrt(calculateVariance(activeReturns) * 252);
			return trackingError !== 0 ? avgActiveReturn / trackingError : 0;
		})() : 0;
	
	// Calculate drawdown (simplified)
	let maxDrawdown = 0;
	let peak = 1;
	for (const ret of portfolioReturns) {
		peak *= (1 + ret);
		const currentValue = peak;
		if (currentValue > peak) peak = currentValue;
		const drawdown = (peak - currentValue) / peak;
		if (drawdown > maxDrawdown) maxDrawdown = drawdown;
	}
	
	return {
		portfolioReturn: portfolioTotalReturn,
		benchmarkReturn: benchmarkTotalReturn,
		activeReturn: portfolioTotalReturn - benchmarkTotalReturn,
		volatility: portfolioVolatility,
		benchmarkVolatility,
		sharpeRatio: portfolioSharpe,
		informationRatio,
		maxDrawdown,
		bestPeriod: { start: "", end: "", return: 0 }, // Simplified for now
		worstPeriod: { start: "", end: "", return: 0 }
	};
}

// Calculate correlation matrix for portfolio stocks
export function calculateCorrelationMatrix(portfolioData: Record<string, StockDataPoint[]>): CorrelationMatrix {
	const tickers = Object.keys(portfolioData);
	const matrix: number[][] = [];
	
	// Calculate returns for each ticker
	const returnsData: Record<string, number[]> = {};
	for (const ticker of tickers) {
		returnsData[ticker] = calculateDailyReturns(portfolioData[ticker]);
	}
	
	// Build correlation matrix
	for (let i = 0; i < tickers.length; i++) {
		matrix[i] = [];
		for (let j = 0; j < tickers.length; j++) {
			if (i === j) {
				matrix[i][j] = 1;
			} else {
				matrix[i][j] = calculateCorrelation(returnsData[tickers[i]], returnsData[tickers[j]]);
			}
		}
	}
	
	return { tickers, matrix };
}

// Calculate individual stock metrics
export function calculateStockMetrics(
	stockData: StockDataPoint[],
	benchmarkData: StockDataPoint[],
	ticker: string,
	portfolioWeight: number = 0
): StockPerformanceMetrics {
	const stockReturns = calculateDailyReturns(stockData);
	const benchmarkReturns = calculateDailyReturns(benchmarkData);
	
	// Align returns to same length
	const minLength = Math.min(stockReturns.length, benchmarkReturns.length);
	const alignedStockReturns = stockReturns.slice(0, minLength);
	const alignedBenchmarkReturns = benchmarkReturns.slice(0, minLength);
	
	const totalReturn = alignedStockReturns.reduce((cum, ret) => cum * (1 + ret), 1) - 1;
	const annualizedReturn = Math.pow(1 + totalReturn, 252 / alignedStockReturns.length) - 1;
	const volatility = Math.sqrt(calculateVariance(alignedStockReturns) * 252);
	const beta = calculateBeta(alignedStockReturns, alignedBenchmarkReturns);
	const correlation = calculateCorrelation(alignedStockReturns, alignedBenchmarkReturns);
	const sharpeRatio = calculateSharpeRatio(alignedStockReturns);
	const { maxDrawdown } = calculateMaxDrawdown(stockData);
	
	// Calculate alpha (simplified)
	const benchmarkReturn = alignedBenchmarkReturns.reduce((cum, ret) => cum * (1 + ret), 1) - 1;
	const alpha = totalReturn - (beta * benchmarkReturn);
	
	return {
		ticker,
		totalReturn,
		annualizedReturn,
		volatility,
		beta,
		alpha,
		sharpeRatio,
		maxDrawdown,
		correlation,
		contribution: totalReturn * portfolioWeight
	};
}
