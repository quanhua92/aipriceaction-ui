import type { StockDataPoint, TickerGroup } from '../stock-data';

export interface HistoricalScanResult {
	period: string; // "2024-01" or "2024-Q1" 
	startDate: Date;
	endDate: Date;
	year: number;
	month: number;
	quarter?: number;
	sprintCandidates: Record<string, string[]>; // Dynamic based on selected sectors
	marketCondition: 'bull' | 'bear' | 'sideways';
	vnIndexChange: number;
	totalCandidates: number;
	bestPerformer: {
		ticker: string;
		sector: string;
		gain: number;
	} | null;
	patterns: string[];
	notes: string;
}

export interface HistoricalScanConfig {
	startYear: number;
	endYear: number;
	scanType: 'daily' | 'weekly' | 'monthly' | 'quarterly';
	selectedSectors: string[]; // Array of sector keys to scan
	minGainThreshold: number;
	minConsecutiveDays: number;
	minVolumeRatio: number;
}

// Default historical scan configuration
export const DEFAULT_HISTORICAL_CONFIG: HistoricalScanConfig = {
	startYear: 2024,
	endYear: new Date().getFullYear(),
	scanType: 'monthly',
	selectedSectors: ['NGAN_HANG', 'CHUNG_KHOAN', 'BAT_DONG_SAN'], // Default to banking, securities, real estate
	minGainThreshold: 6.0,
	minConsecutiveDays: 2,
	minVolumeRatio: 1.5,
};

/**
 * Generate time periods for scanning
 */
export function generateTimePeriods(config: HistoricalScanConfig): Array<{period: string, startDate: Date, endDate: Date}> {
	const periods: Array<{period: string, startDate: Date, endDate: Date}> = [];
	const now = new Date();
	
	if (config.scanType === 'daily') {
		// Daily scanning - last 30 days for recent year, or all days for specific year
		const startYear = config.startYear;
		const endYear = config.endYear;
		
		for (let year = startYear; year <= endYear; year++) {
			const yearStart = new Date(year, 0, 1);
			const yearEnd = year === now.getFullYear() ? now : new Date(year, 11, 31);
			
			// Generate daily periods for the year
			const currentDate = new Date(yearStart);
			while (currentDate <= yearEnd) {
				const startDate = new Date(currentDate);
				const endDate = new Date(currentDate);
				endDate.setHours(23, 59, 59, 999);
				
				periods.push({
					period: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`,
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				});
				
				currentDate.setDate(currentDate.getDate() + 1);
			}
		}
	} else if (config.scanType === 'weekly') {
		// Weekly scanning
		for (let year = config.startYear; year <= config.endYear; year++) {
			const yearStart = new Date(year, 0, 1);
			const yearEnd = year === now.getFullYear() ? now : new Date(year, 11, 31);
			
			// Find first Monday of the year
			let currentDate = new Date(yearStart);
			while (currentDate.getDay() !== 1) { // 1 = Monday
				currentDate.setDate(currentDate.getDate() + 1);
			}
			
			let weekNumber = 1;
			while (currentDate <= yearEnd) {
				const startDate = new Date(currentDate);
				const endDate = new Date(currentDate);
				endDate.setDate(endDate.getDate() + 6); // End of week (Sunday)
				endDate.setHours(23, 59, 59, 999);
				
				// Don't go beyond the year or current date
				if (endDate > yearEnd) {
					endDate.setTime(yearEnd.getTime());
				}
				
				periods.push({
					period: `${year}-W${weekNumber.toString().padStart(2, '0')}`,
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				});
				
				currentDate.setDate(currentDate.getDate() + 7);
				weekNumber++;
			}
		}
	} else if (config.scanType === 'monthly') {
		for (let year = config.startYear; year <= config.endYear; year++) {
			for (let month = 1; month <= 12; month++) {
				// Skip future months in current year
				if (year === config.endYear && month > now.getMonth() + 1) {
					break;
				}
				
				const startDate = new Date(year, month - 1, 1);
				const endDate = new Date(year, month, 0, 23, 59, 59); // Last day of month
				
				periods.push({
					period: `${year}-${month.toString().padStart(2, '0')}`,
					startDate,
					endDate,
				});
			}
		}
	} else if (config.scanType === 'quarterly') {
		for (let year = config.startYear; year <= config.endYear; year++) {
			for (let quarter = 1; quarter <= 4; quarter++) {
				const startMonth = (quarter - 1) * 3;
				const endMonth = quarter * 3 - 1;
				
				// Skip future quarters in current year
				if (year === config.endYear && quarter > Math.ceil((now.getMonth() + 1) / 3)) {
					break;
				}
				
				const startDate = new Date(year, startMonth, 1);
				const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59);
				
				periods.push({
					period: `${year}-Q${quarter}`,
					startDate,
					endDate,
				});
			}
		}
	}
	
	return periods.reverse(); // Most recent first
}

/**
 * Calculate market condition based on VN-Index performance
 */
function analyzeMarketCondition(vnIndexData: StockDataPoint[]): {condition: 'bull' | 'bear' | 'sideways', change: number} {
	if (vnIndexData.length < 2) {
		return { condition: 'sideways', change: 0 };
	}
	
	const firstPrice = vnIndexData[0].close;
	const lastPrice = vnIndexData[vnIndexData.length - 1].close;
	const change = ((lastPrice - firstPrice) / firstPrice) * 100;
	
	let condition: 'bull' | 'bear' | 'sideways';
	if (change > 5) {
		condition = 'bull';
	} else if (change < -5) {
		condition = 'bear';
	} else {
		condition = 'sideways';
	}
	
	return { condition, change };
}

/**
 * Detect patterns in the period
 */
function detectPatterns(
	sprintCandidates: HistoricalScanResult['sprintCandidates'],
	marketCondition: string,
	vnIndexChange: number
): string[] {
	const patterns: string[] = [];
	
	const totalCandidates = Object.values(sprintCandidates).flat().length;
	
	// Pattern detection logic
	if (totalCandidates >= 10) {
		patterns.push('High momentum period');
	}
	
	// Dynamic sector pattern detection
	Object.entries(sprintCandidates).forEach(([sector, candidates]) => {
		if (candidates.length >= 3) {
			// Map sector keys to readable names
			const sectorPatterns: Record<string, string> = {
				'NGAN_HANG': 'Banking sector strength',
				'CHUNG_KHOAN': 'Securities sector boom', 
				'BAT_DONG_SAN': 'Real estate rally',
				'DIEN': 'Energy sector surge',
				'CONG_NGHE': 'Technology momentum',
				'THUC_PHAM': 'Consumer goods strength',
				'DICH_VU': 'Services sector rally',
				'XAY_DUNG': 'Construction boom',
				'THEP': 'Steel sector strength',
				'PHAN_PHOI_XE': 'Automotive distribution rally',
				'DET_MAY': 'Textile momentum',
				'HOA_CHAT': 'Chemical sector strength',
				'NHUA': 'Plastics momentum',
				'THUY_SAN': 'Seafood sector rally',
				'GO': 'Wood industry strength',
				'GIAY': 'Footwear momentum',
				'THAN': 'Coal sector surge',
				'DUONG': 'Sugar sector rally',
				'CAO_SU': 'Rubber momentum',
				'CANG_BIEN': 'Port services strength',
				'HANG_KHONG': 'Aviation rally',
				'LOGISTICS': 'Logistics momentum',
				'BAO_HIEM': 'Insurance strength',
				'DICH_VU_TU_VAN': 'Consulting services rally'
			};
			
			patterns.push(sectorPatterns[sector] || `${sector} sector strength`);
		}
	});
	
	if (marketCondition === 'bull' && totalCandidates >= 5) {
		patterns.push('Bull market sprint phase');
	}
	
	if (marketCondition === 'bear' && totalCandidates >= 3) {
		patterns.push('Counter-trend momentum');
	}
	
	if (vnIndexChange > 10) {
		patterns.push('Strong market surge');
	}
	
	if (vnIndexChange < -10) {
		patterns.push('Market correction period');
	}
	
	// Multi-sector patterns
	const sectorsWithCandidates = Object.entries(sprintCandidates).filter(([_, candidates]) => candidates.length > 0);
	if (sectorsWithCandidates.length >= 3) {
		patterns.push('Cross-sector momentum');
	}
	
	if (totalCandidates === 0) {
		patterns.push('Low momentum period');
	}
	
	return patterns;
}

/**
 * Generate contextual notes for the period
 */
function generateNotes(
	period: string,
	sprintCandidates: HistoricalScanResult['sprintCandidates'],
	marketCondition: string,
	_patterns: string[]
): string {
	const totalCandidates = Object.values(sprintCandidates).flat().length;
	
	let notes = '';
	
	if (totalCandidates === 0) {
		notes = `No significant sprint patterns detected in ${period}. Market showed limited momentum opportunities.`;
	} else if (totalCandidates >= 10) {
		notes = `High activity period with ${totalCandidates} sprint candidates. Strong momentum across multiple sectors.`;
	} else {
		notes = `Moderate activity with ${totalCandidates} sprint candidates. `;
		
		// Add sector-specific insights
		const strongSectors = Object.entries(sprintCandidates)
			.filter(([_, candidates]) => candidates.length >= 2)
			.map(([sector, _]) => sector);
		
		if (strongSectors.length > 0) {
			notes += `Strong performance in ${strongSectors.join(', ')} sectors.`;
		}
	}
	
	// Add market context
	if (marketCondition === 'bull') {
		notes += ' Bull market conditions supported momentum plays.';
	} else if (marketCondition === 'bear') {
		notes += ' Bear market created selective opportunities.';
	}
	
	return notes;
}

/**
 * Scan a specific time period for sprint patterns
 */
export async function scanHistoricalPeriod(
	startDate: Date,
	endDate: Date,
	getTickerData: (ticker: string) => Promise<StockDataPoint[]>,
	getVnIndexData: () => Promise<StockDataPoint[]>,
	config: HistoricalScanConfig,
	tickerGroups: TickerGroup
): Promise<HistoricalScanResult> {
	let period: string;
	switch (config.scanType) {
		case 'daily':
			period = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
			break;
		case 'weekly':
			// Calculate week number
			const firstDayOfYear = new Date(startDate.getFullYear(), 0, 1);
			const pastDaysOfYear = (startDate.getTime() - firstDayOfYear.getTime()) / 86400000;
			const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
			period = `${startDate.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
			break;
		case 'monthly':
			period = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;
			break;
		case 'quarterly':
			period = `${startDate.getFullYear()}-Q${Math.ceil((startDate.getMonth() + 1) / 3)}`;
			break;
		default:
			period = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;
	}
	
	// Initialize result with dynamic sectors
	const sprintCandidates: Record<string, string[]> = {};
	for (const sector of config.selectedSectors) {
		sprintCandidates[sector] = [];
	}

	const result: HistoricalScanResult = {
		period,
		startDate: new Date(startDate),
		endDate: new Date(endDate),
		year: startDate.getFullYear(),
		month: startDate.getMonth() + 1,
		quarter: config.scanType === 'quarterly' ? Math.ceil((startDate.getMonth() + 1) / 3) : undefined,
		sprintCandidates,
		marketCondition: 'sideways',
		vnIndexChange: 0,
		totalCandidates: 0,
		bestPerformer: null,
		patterns: [],
		notes: '',
	};
	
	try {
		// Get VN-Index data for market context
		const vnIndexData = await getVnIndexData();
		const periodVnIndexData = vnIndexData.filter(point => 
			point.date >= startDate && point.date <= endDate
		);
		
		const marketAnalysis = analyzeMarketCondition(periodVnIndexData);
		result.marketCondition = marketAnalysis.condition;
		result.vnIndexChange = marketAnalysis.change;
		
		// Scan selected sectors using actual ticker groups
		let bestGain = 0;
		
		for (const sector of config.selectedSectors) {
			const tickers = tickerGroups[sector] || [];
			if (tickers.length === 0) continue;
			for (const ticker of tickers) {
				try {
					const tickerData = await getTickerData(ticker);
					const periodData = tickerData.filter(point =>
						point.date >= startDate && point.date <= endDate
					);
					
					if (periodData.length < config.minConsecutiveDays + 1) continue;
					
					// Sort by date
					const sortedData = periodData.sort((a, b) => a.date.getTime() - b.date.getTime());
					
					// Look for sprint patterns in this period
					let maxConsecutiveDays = 0;
					let currentConsecutive = 0;
					let maxGain = 0;
					let totalPeriodGain = 0;
					
					// Calculate total period performance
					if (sortedData.length > 0) {
						const firstPrice = sortedData[0].close;
						const lastPrice = sortedData[sortedData.length - 1].close;
						totalPeriodGain = ((lastPrice - firstPrice) / firstPrice) * 100;
					}
					
					
					for (let i = 1; i < sortedData.length; i++) {
						const current = sortedData[i];
						const previous = sortedData[i - 1];
						const dailyGain = ((current.close - previous.close) / previous.close) * 100;
						
						
						if (dailyGain >= config.minGainThreshold) {
							currentConsecutive++;
							maxGain = Math.max(maxGain, dailyGain);
						} else {
							maxConsecutiveDays = Math.max(maxConsecutiveDays, currentConsecutive);
							currentConsecutive = 0;
						}
					}
					maxConsecutiveDays = Math.max(maxConsecutiveDays, currentConsecutive);
					
					
					// Check if this ticker qualifies as a sprint candidate
					if (maxConsecutiveDays >= config.minConsecutiveDays) {
						result.sprintCandidates[sector].push(ticker);
						
						// Track best performer using total period gain if it's higher than max daily gain
						const bestPerformanceGain = Math.max(maxGain, totalPeriodGain);
						if (bestPerformanceGain > bestGain) {
							bestGain = bestPerformanceGain;
							result.bestPerformer = {
								ticker,
								sector,
								gain: bestPerformanceGain,
							};
						}
					}
				} catch (error) {
					console.warn(`Failed to analyze ${ticker} for period ${period}:`, error);
				}
			}
		}
		
		// Calculate total candidates
		result.totalCandidates = Object.values(result.sprintCandidates).flat().length;
		
		// Detect patterns
		result.patterns = detectPatterns(result.sprintCandidates, result.marketCondition, result.vnIndexChange);
		
		// Generate notes
		result.notes = generateNotes(period, result.sprintCandidates, result.marketCondition, result.patterns);
		
	} catch (error) {
		console.error(`Failed to scan period ${period}:`, error);
		result.notes = `Error scanning period: ${error instanceof Error ? error.message : 'Unknown error'}`;
	}
	
	return result;
}

/**
 * Scan multiple historical periods
 */
export async function scanHistoricalPeriods(
	config: HistoricalScanConfig,
	getTickerData: (ticker: string) => Promise<StockDataPoint[]>,
	getVnIndexData: () => Promise<StockDataPoint[]>,
	tickerGroups: TickerGroup,
	onProgress?: (completed: number, total: number) => void
): Promise<HistoricalScanResult[]> {
	const periods = generateTimePeriods(config);
	const results: HistoricalScanResult[] = [];
	
	for (let i = 0; i < periods.length; i++) {
		const { startDate, endDate } = periods[i];
		
		onProgress?.(i, periods.length);
		
		const result = await scanHistoricalPeriod(
			startDate,
			endDate,
			getTickerData,
			getVnIndexData,
			config,
			tickerGroups
		);
		
		results.push(result);
		
		// Add small delay to prevent overwhelming the API
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	
	onProgress?.(periods.length, periods.length);
	
	return results;
}