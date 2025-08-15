import type { StockDataPoint } from '../stock-data';

export interface FinalSprintResult {
	ticker: string;
	name: string;
	dailyGain: number;
	consecutiveDays: number;
	volumeRatio: number;
	momentumScore: number;
	riskLevel: 'high' | 'medium' | 'low';
	lastPrice: number;
	volume: number;
	averageVolume: number;
	priceData: StockDataPoint[];
}

export interface SectorConfig {
	name: string;
	tickers: string[];
}

// Sector configurations for Final Sprint Scanner
export const SECTOR_CONFIGS: Record<string, SectorConfig> = {
	banking: {
		name: 'Banking',
		tickers: ['VCB', 'BID', 'TCB', 'CTG', 'VPB', 'ACB', 'MBB', 'SHB', 'TPB', 'VIB'],
	},
	securities: {
		name: 'Securities',
		tickers: ['SSI', 'VCI', 'HCM', 'MBS', 'SHS', 'VND', 'CTS', 'BSI', 'FTS', 'TCI'],
	},
	realEstate: {
		name: 'Real Estate',
		tickers: ['VIC', 'VHM', 'VRE', 'KDH', 'NVL', 'DIG', 'KBC', 'PDR', 'SCR', 'CEO'],
	},
};

// Final Sprint Scanner Configuration
const FINAL_SPRINT_CONFIG = {
	// Minimum daily gain percentage to be considered (6.5% ceiling limit approach)
	MIN_DAILY_GAIN: 6.5,
	
	// Minimum consecutive strong days
	MIN_CONSECUTIVE_DAYS: 2,
	
	// Minimum volume ratio compared to average
	MIN_VOLUME_RATIO: 1.5,
	
	// Days to look back for analysis
	ANALYSIS_DAYS: 30,
	
	// Days to calculate average volume
	VOLUME_AVERAGE_DAYS: 20,
	
	// Maximum days to look for consecutive gains
	MAX_CONSECUTIVE_DAYS: 10,
};

/**
 * Calculate consecutive strong days for a stock
 */
function calculateConsecutiveDays(data: StockDataPoint[], minGain: number): number {
	if (data.length < 2) return 0;
	
	let consecutiveDays = 0;
	const sortedData = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());
	
	for (let i = 0; i < Math.min(sortedData.length - 1, FINAL_SPRINT_CONFIG.MAX_CONSECUTIVE_DAYS); i++) {
		const current = sortedData[i];
		const previous = sortedData[i + 1];
		
		if (!current || !previous) break;
		
		const dailyGain = ((current.close - previous.close) / previous.close) * 100;
		
		if (dailyGain >= minGain) {
			consecutiveDays++;
		} else {
			break;
		}
	}
	
	return consecutiveDays;
}

/**
 * Calculate average volume over specified days
 */
function calculateAverageVolume(data: StockDataPoint[], days: number): number {
	if (data.length === 0) return 0;
	
	const recentData = data.slice(-days);
	const totalVolume = recentData.reduce((sum, point) => sum + point.volume, 0);
	return totalVolume / recentData.length;
}

/**
 * Calculate momentum score based on multiple factors
 */
function calculateMomentumScore(
	dailyGain: number,
	consecutiveDays: number,
	volumeRatio: number,
	priceData: StockDataPoint[]
): number {
	// Base score from daily gain (max 40 points)
	const gainScore = Math.min(dailyGain * 2, 40);
	
	// Consecutive days score (max 30 points)
	const consecutiveScore = Math.min(consecutiveDays * 7, 30);
	
	// Volume score (max 20 points)
	const volumeScore = Math.min((volumeRatio - 1) * 10, 20);
	
	// Price acceleration score (max 10 points)
	let accelerationScore = 0;
	if (priceData.length >= 5) {
		const recent = priceData.slice(-5);
		const gains = [];
		for (let i = 1; i < recent.length; i++) {
			const gain = ((recent[i].close - recent[i-1].close) / recent[i-1].close) * 100;
			gains.push(gain);
		}
		// Check if gains are accelerating
		const avgEarly = (gains[0] + gains[1]) / 2;
		const avgLate = (gains[2] + gains[3]) / 2;
		if (avgLate > avgEarly && avgLate > 0) {
			accelerationScore = 10;
		}
	}
	
	return Math.round(gainScore + consecutiveScore + volumeScore + accelerationScore);
}

/**
 * Determine risk level based on momentum score and other factors
 */
function determineRiskLevel(
	momentumScore: number,
	consecutiveDays: number,
	volumeRatio: number
): 'high' | 'medium' | 'low' {
	// High momentum + high volume + multiple consecutive days = High risk (but high reward potential)
	if (momentumScore >= 80 && consecutiveDays >= 3 && volumeRatio >= 2.0) {
		return 'high';
	}
	
	// Medium conditions
	if (momentumScore >= 60 && consecutiveDays >= 2) {
		return 'medium';
	}
	
	// Everything else is low risk
	return 'low';
}

/**
 * Get company name for a ticker (placeholder - in real implementation would fetch from API)
 */
function getCompanyName(ticker: string): string {
	const names: Record<string, string> = {
		// Banking
		VCB: 'Vietcombank',
		BID: 'BIDV',
		TCB: 'Techcombank',
		CTG: 'VietinBank',
		VPB: 'VPBank',
		ACB: 'ACB',
		MBB: 'MB Bank',
		SHB: 'SHB',
		TPB: 'TPBank',
		VIB: 'VIB',
		
		// Securities
		SSI: 'SSI Securities',
		VCI: 'VCI Securities',
		HCM: 'HCM Securities',
		MBS: 'MB Securities',
		SHS: 'SHS Securities',
		VND: 'VN Direct',
		CTS: 'CTS Securities',
		BSI: 'BSI Securities',
		FTS: 'FTS Securities',
		TCI: 'TCI Securities',
		
		// Real Estate
		VIC: 'Vingroup',
		VHM: 'Vinhomes',
		VRE: 'Vincom Retail',
		KDH: 'Khang Dien House',
		NVL: 'NovaLand',
		DIG: 'DIC Group',
		KBC: 'Kinh Bac City',
		PDR: 'Phu Dong Real Estate',
		SCR: 'Sacomreal',
		CEO: 'C.E.O Group',
	};
	
	return names[ticker] || ticker;
}

/**
 * Analyze a single stock for Final Sprint characteristics
 */
export function analyzeFinalSprintStock(
	ticker: string,
	data: StockDataPoint[]
): FinalSprintResult | null {
	if (data.length < FINAL_SPRINT_CONFIG.MIN_CONSECUTIVE_DAYS + 1) {
		return null;
	}
	
	// Sort data by date (most recent first)
	const sortedData = [...data].sort((a, b) => b.date.getTime() - a.date.getTime());
	const latestData = sortedData[0];
	const previousData = sortedData[1];
	
	if (!latestData || !previousData) {
		return null;
	}
	
	// Calculate daily gain
	const dailyGain = ((latestData.close - previousData.close) / previousData.close) * 100;
	
	// Filter by minimum daily gain
	if (dailyGain < FINAL_SPRINT_CONFIG.MIN_DAILY_GAIN) {
		return null;
	}
	
	// Calculate consecutive strong days
	const consecutiveDays = calculateConsecutiveDays(sortedData, FINAL_SPRINT_CONFIG.MIN_DAILY_GAIN);
	
	// Filter by minimum consecutive days
	if (consecutiveDays < FINAL_SPRINT_CONFIG.MIN_CONSECUTIVE_DAYS) {
		return null;
	}
	
	// Calculate volume metrics
	const averageVolume = calculateAverageVolume(
		sortedData.slice(1), // Exclude today to get baseline
		FINAL_SPRINT_CONFIG.VOLUME_AVERAGE_DAYS
	);
	const volumeRatio = latestData.volume / averageVolume;
	
	// Filter by minimum volume ratio
	if (volumeRatio < FINAL_SPRINT_CONFIG.MIN_VOLUME_RATIO) {
		return null;
	}
	
	// Calculate momentum score
	const momentumScore = calculateMomentumScore(
		dailyGain,
		consecutiveDays,
		volumeRatio,
		sortedData
	);
	
	// Determine risk level
	const riskLevel = determineRiskLevel(momentumScore, consecutiveDays, volumeRatio);
	
	return {
		ticker,
		name: getCompanyName(ticker),
		dailyGain: Math.round(dailyGain * 10) / 10,
		consecutiveDays,
		volumeRatio: Math.round(volumeRatio * 10) / 10,
		momentumScore,
		riskLevel,
		lastPrice: latestData.close,
		volume: latestData.volume,
		averageVolume: Math.round(averageVolume),
		priceData: sortedData.slice(0, 10), // Last 10 days for chart
	};
}

/**
 * Scan a sector for Final Sprint candidates
 */
export async function scanSectorForFinalSprint(
	sectorKey: string,
	getTickerData: (ticker: string) => Promise<StockDataPoint[]>
): Promise<FinalSprintResult[]> {
	const sectorConfig = SECTOR_CONFIGS[sectorKey];
	if (!sectorConfig) {
		throw new Error(`Unknown sector: ${sectorKey}`);
	}
	
	const results: FinalSprintResult[] = [];
	
	// Analyze each ticker in the sector
	for (const ticker of sectorConfig.tickers) {
		try {
			const data = await getTickerData(ticker);
			const analysis = analyzeFinalSprintStock(ticker, data);
			
			if (analysis) {
				results.push(analysis);
			}
		} catch (error) {
			console.warn(`Failed to analyze ${ticker}:`, error);
			// Continue with other tickers
		}
	}
	
	// Sort by momentum score (highest first)
	results.sort((a, b) => b.momentumScore - a.momentumScore);
	
	return results;
}

/**
 * Get available sectors for scanning
 */
export function getAvailableSectors(): Array<{ key: string; name: string; tickers: string[] }> {
	return Object.entries(SECTOR_CONFIGS).map(([key, config]) => ({
		key,
		name: config.name,
		tickers: config.tickers,
	}));
}