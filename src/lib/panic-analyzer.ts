/**
 * Vietnamese Market Panic Day Analyzer with Pre-Panic Warning System
 * Perfect TypeScript port of panic_analyzer.py
 * 
 * Fetches all required ticker data and calculates sector indicators for any given date or date range.
 * Includes comprehensive pre-panic analysis to identify early warning signals.
 */

import { fetchTickerData, type StockDataPoint } from './stock-data';

interface PriceChangeData {
	prevClose: number;
	targetClose: number;
	targetLow: number;
	change: number;
	intradayDrop: number;
	volume: number;
}

interface SectorIndicatorData {
	bsi: number | null; // Banking Sector Indicator
	ssi: number | null; // Securities Sector Indicator  
	rsi: number | null; // Real Estate Sector Indicator
}

interface DateAnalysisData {
	date: string;
	vnindexChange: number;
	vnindexData: PriceChangeData;
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	panicType: PanicType;
	allData: Record<string, PriceChangeData>;
	bankingValid: string[];
	securitiesValid: string[];
	realestateValid: string[];
}

interface PrePanicSignal {
	date: string;
	vnindexChange: number;
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	signal: WarningLevel;
}

interface SignificantDrop {
	date: string;
	daysBefore: number;
	vnindexChange: number;
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	signal: WarningLevel;
}

interface PrePanicAnalysisResult {
	prePanicSignals: Record<string, PrePanicSignal>;
	significantDrops: SignificantDrop[];
	strongestWarning: WarningLevel;
	patternType: PatternType;
}

interface TradingAdvice {
	action: string;
	riskLevel: string;
	positionSize: string;
	defensiveStocks: string;
}

export type PanicType = 
	| 'NO_PANIC'
	| 'POSITIVE_PANIC'
	| 'NEGATIVE_MEDIUM' 
	| 'NEGATIVE_EXTREME'
	| 'UNCLEAR_PATTERN'
	| 'RECOVERY_SIGNAL';

export type WarningLevel = 
	| 'STRONG_WARNING'
	| 'MODERATE_WARNING'
	| 'EARLY_WARNING'
	| 'DEVELOPING_WEAKNESS'
	| 'NO_WARNING'
	| 'INSUFFICIENT_DATA';

export type PatternType =
	| 'ESCALATING_TO_CRISIS'
	| 'PERSISTENT_WEAKNESS'
	| 'SUSTAINED_DETERIORATION'
	| 'MULTIPLE_WEAKNESS_EVENTS'
	| 'ISOLATED_SIGNALS'
	| 'NO_SIGNALS_DETECTED';

export class VietnamesePanicAnalyzer {
	// Market cap weighted sector compositions (exact match from Python)
	private readonly bankingWeights = {
		VCB: 0.35, // 325.3T VND
		BID: 0.25, // 252.4T VND
		TCB: 0.20, // 243.0T VND
		CTG: 0.15, // 225.0T VND
		VPB: 0.05  // 146.4T VND
	};

	private readonly securitiesWeights = {
		SSI: 0.40, // 48.0T VND (7x larger than #5)
		VCI: 0.20, // 25.4T VND
		HCM: 0.15, // 15.3T VND
		MBS: 0.15, // 15.3T VND
		SHS: 0.10  // 10.4T VND
	};

	private readonly realestateWeights = {
		VIC: 0.45, // 370.8T VND (Largest Vietnamese stock)
		VHM: 0.35, // 313.4T VND
		VRE: 0.10, // 57.8T VND
		KDH: 0.05, // 29.8T VND
		NVL: 0.05  // 29.5T VND
	};

	private readonly allTickers: string[];

	constructor() {
		this.allTickers = [
			'VNINDEX',
			...Object.keys(this.bankingWeights),
			...Object.keys(this.securitiesWeights), 
			...Object.keys(this.realestateWeights)
		];
	}

	/**
	 * Calculate percentage change for target date
	 */
	private async getPriceChange(tickerData: StockDataPoint[], targetDate: string): Promise<PriceChangeData | null> {
		if (tickerData.length === 0) return null;

		// Sort by date to ensure chronological order
		const sortedData = [...tickerData].sort((a, b) => a.date.getTime() - b.date.getTime());
		
		const targetDateTime = new Date(targetDate).getTime();
		const targetIndex = sortedData.findIndex(d => d.date.getTime() === targetDateTime);
		
		if (targetIndex === -1) {
			console.log(`🔍 getPriceChange: ${targetDate} not found in data. Available dates: ${sortedData.map(d => d.time).slice(-5).join(', ')} (showing last 5)`);
			return null;
		}
		if (targetIndex === 0) {
			console.log(`🔍 getPriceChange: ${targetDate} is the first data point, no previous data for comparison`);
			return null;
		}

		const targetRow = sortedData[targetIndex];
		const prevRow = sortedData[targetIndex - 1];

		const prevClose = prevRow.close;
		const targetClose = targetRow.close;
		const targetLow = targetRow.low;
		const targetVolume = targetRow.volume;

		// Calculate change using close price  
		const change = ((targetClose - prevClose) / prevClose) * 100;
		
		// Also calculate worst intraday drop
		const intradayDrop = ((targetLow - prevClose) / prevClose) * 100;

		return {
			prevClose,
			targetClose,
			targetLow,
			change,
			intradayDrop,
			volume: targetVolume
		};
	}

	/**
	 * Calculate weighted sector indicator
	 */
	private calculateSectorIndicator(
		sectorChanges: Record<string, PriceChangeData | null>,
		weights: Record<string, number>
	): [number | null, string[]] {
		let totalWeight = 0;
		let weightedPerformance = 0;
		const validTickers: string[] = [];

		for (const [ticker, weight] of Object.entries(weights)) {
			if (ticker in sectorChanges && sectorChanges[ticker] !== null) {
				const change = sectorChanges[ticker]!.change;
				weightedPerformance += change * weight;
				totalWeight += weight;
				validTickers.push(ticker);
			}
		}

		if (totalWeight === 0) {
			return [null, []];
		}

		return [weightedPerformance / totalWeight, validTickers];
	}

	/**
	 * Classify panic type based on sector indicators
	 */
	private classifyPanicType(bsi: number | null, ssi: number | null, rsi: number | null, vnindexDrop: number): PanicType {
		if (Math.abs(vnindexDrop) < 3.0) {
			return 'NO_PANIC';
		}

		// Positive panic: Banking stable, others oversold
		if (bsi !== null && ssi !== null && rsi !== null) {
			if (bsi > -2.0 && ssi < -3.0 && rsi < -4.0) {
				return 'POSITIVE_PANIC';
			}

			// Negative extreme: All indicators deep red
			if (bsi < -5.0 && ssi < -7.0 && rsi < -8.0) {
				return 'NEGATIVE_EXTREME';
			}

			// Negative medium: Significant weakness across board
			if (bsi < -3.0 && ssi < -5.0 && rsi < -6.0) {
				return 'NEGATIVE_MEDIUM';
			}
		}

		return 'UNCLEAR_PATTERN';
	}

	/**
	 * Classify pre-panic warning signals based on sector indicators
	 */
	private classifyPrePanicSignal(bsi: number | null, ssi: number | null, rsi: number | null, vnindexDrop: number): WarningLevel {
		// Pre-panic signals look for specific sector weakness patterns
		// that historically precede major panic days

		if (vnindexDrop === null || bsi === null || ssi === null || rsi === null) {
			return 'INSUFFICIENT_DATA';
		}

		// Strong warning: Real estate crashes first (-2%+), others follow
		if (rsi <= -2.0 && (ssi <= -1.5 || bsi <= -1.5) && vnindexDrop <= -1.5) {
			return 'STRONG_WARNING';
		}

		// Moderate warning: Securities weakness with banking holding
		if (ssi <= -1.5 && bsi >= -1.0 && vnindexDrop <= -1.0) {
			return 'MODERATE_WARNING';
		}

		// Early warning: Any sector showing -2%+ weakness
		if (Math.min(bsi, ssi, rsi) <= -2.0 && vnindexDrop <= -1.0) {
			return 'EARLY_WARNING';
		}

		// Developing weakness: VNINDEX -1%+ with sector divergence
		if (vnindexDrop <= -1.0 && (Math.abs(bsi - ssi) >= 1.0 || Math.abs(ssi - rsi) >= 1.0)) {
			return 'DEVELOPING_WEAKNESS';
		}

		return 'NO_WARNING';
	}

	/**
	 * Get trading days before target date, skipping weekends
	 */
	private async getTradingDaysBefore(targetDate: string, daysBack: number): Promise<string[]> {
		try {
			const vnindexData = await fetchTickerData('VNINDEX');
			if (vnindexData.length === 0) return [];

			const targetDateTime = new Date(targetDate).getTime();
			
			// Get all trading days before target date
			const tradingDays = vnindexData
				.filter(d => d.date.getTime() < targetDateTime)
				.sort((a, b) => a.date.getTime() - b.date.getTime());

			if (tradingDays.length === 0) return [];

			// Get the most recent trading days (up to daysBack)
			const recentDays = tradingDays.slice(-daysBack);
			return recentDays.map(d => d.time).reverse();
		} catch (error) {
			console.error('Error getting trading days:', error);
			return [];
		}
	}

	/**
	 * Get the most recent available date from VNINDEX data
	 */
	public async getMostRecentDate(): Promise<string | null> {
		try {
			const vnindexData = await fetchTickerData('VNINDEX');
			if (vnindexData.length === 0) {
				console.error('❌ No VNINDEX data available');
				return null;
			}

			// Sort by date and get the most recent entry
			const sortedData = [...vnindexData].sort((a, b) => a.date.getTime() - b.date.getTime());
			const mostRecentDate = sortedData[sortedData.length - 1].time;
			
			console.log(`📅 Most recent available date: ${mostRecentDate} (total ${vnindexData.length} data points)`);
			console.log(`📊 Date range: ${sortedData[0].time} to ${mostRecentDate}`);
			return mostRecentDate;
		} catch (error) {
			console.error('❌ Error getting most recent date:', error);
			return null;
		}
	}

	/**
	 * Get market data for a single date without printing
	 */
	public async getDateData(targetDate: string): Promise<DateAnalysisData | null> {
		console.log(`🎯 getDateData called with targetDate: ${targetDate}`);
		const allData: Record<string, PriceChangeData> = {};

		// Load data for all tickers
		for (const ticker of this.allTickers) {
			try {
				const tickerData = await fetchTickerData(ticker);
				console.log(`📊 ${ticker}: ${tickerData.length} data points, last date: ${tickerData[tickerData.length - 1]?.time}`);
				const change = await this.getPriceChange(tickerData, targetDate);
				if (change) {
					allData[ticker] = change;
					console.log(`✅ ${ticker}: ${change.change.toFixed(2)}% change`);
				} else {
					console.log(`❌ ${ticker}: No price change data for ${targetDate}`);
				}
			} catch (error) {
				console.warn(`Warning: ${ticker} data not found for ${targetDate}`, error);
			}
		}

		console.log(`📈 Total tickers with data: ${Object.keys(allData).length}/${this.allTickers.length}`);
		
		if (!allData.VNINDEX) {
			console.log(`❌ No VNINDEX data found for ${targetDate}`);
			return null;
		}

		const vnindexData = allData.VNINDEX;
		const vnindexDrop = vnindexData.change;

		// Calculate sector indicators
		const bankingChanges = Object.fromEntries(
			Object.keys(this.bankingWeights).map(ticker => [ticker, allData[ticker] || null])
		);
		const [bsi, bankingValid] = this.calculateSectorIndicator(bankingChanges, this.bankingWeights);

		const securitiesChanges = Object.fromEntries(
			Object.keys(this.securitiesWeights).map(ticker => [ticker, allData[ticker] || null])
		);
		const [ssi, securitiesValid] = this.calculateSectorIndicator(securitiesChanges, this.securitiesWeights);

		const realestateChanges = Object.fromEntries(
			Object.keys(this.realestateWeights).map(ticker => [ticker, allData[ticker] || null])
		);
		const [rsi, realestateValid] = this.calculateSectorIndicator(realestateChanges, this.realestateWeights);

		const panicType = this.classifyPanicType(bsi, ssi, rsi, vnindexDrop);

		return {
			date: targetDate,
			vnindexChange: vnindexDrop,
			vnindexData,
			bsi,
			ssi,
			rsi,
			panicType,
			allData,
			bankingValid,
			securitiesValid,
			realestateValid
		};
	}

	/**
	 * Comprehensive pre-panic analysis for a specific panic date
	 */
	public async analyzePrePanicPattern(panicDate: string): Promise<PrePanicAnalysisResult | null> {
		// Get T-1, T-7, T-14 days before panic
		const tradingDays = await this.getTradingDaysBefore(panicDate, 14);
		if (tradingDays.length === 0) return null;

		const preDates = {
			'T-1': tradingDays.slice(0, 1),
			'T-7': tradingDays.length > 6 ? [tradingDays[6]] : [],
			'T-14': tradingDays.length > 13 ? [tradingDays[13]] : []
		};

		// SCAN ALL 14 DAYS for any 2%+ drops
		const significantDrops: SignificantDrop[] = [];
		
		for (let i = 0; i < tradingDays.length; i++) {
			const date = tradingDays[i];
			const data = await this.getDateData(date);
			if (data && data.vnindexChange <= -2.0) {
				const daysBefore = i + 1;
				const signal = this.classifyPrePanicSignal(
					data.bsi, data.ssi, data.rsi, data.vnindexChange
				);
				significantDrops.push({
					date,
					daysBefore,
					vnindexChange: data.vnindexChange,
					bsi: data.bsi,
					ssi: data.ssi,
					rsi: data.rsi,
					signal
				});
			}
		}

		// Analyze each pre-panic timeframe
		const prePanicSignals: Record<string, PrePanicSignal> = {};

		for (const [timeframe, dates] of Object.entries(preDates)) {
			if (dates.length === 0) continue;

			const date = dates[0];
			const data = await this.getDateData(date);

			if (data) {
				const signal = this.classifyPrePanicSignal(
					data.bsi, data.ssi, data.rsi, data.vnindexChange
				);
				prePanicSignals[timeframe] = {
					date,
					vnindexChange: data.vnindexChange,
					bsi: data.bsi,
					ssi: data.ssi,
					rsi: data.rsi,
					signal
				};
			}
		}

		// Determine strongest warning and pattern type
		const allWarningSignals = [
			...Object.values(prePanicSignals).map(s => s.signal),
			...significantDrops.map(d => d.signal)
		];

		const strongestWarning = this.getStrongestWarning(allWarningSignals);
		const patternType = this.analyzePatternType(prePanicSignals, significantDrops);

		return {
			prePanicSignals,
			significantDrops,
			strongestWarning,
			patternType
		};
	}

	/**
	 * Determine the strongest warning level from a list
	 */
	private getStrongestWarning(warningLevels: WarningLevel[]): WarningLevel {
		const priority = {
			STRONG_WARNING: 4,
			MODERATE_WARNING: 3,
			EARLY_WARNING: 2,
			DEVELOPING_WEAKNESS: 1,
			NO_WARNING: 0,
			INSUFFICIENT_DATA: -1
		};

		const maxPriority = Math.max(...warningLevels.map(w => priority[w] ?? -1));
		
		for (const [warning, p] of Object.entries(priority)) {
			if (p === maxPriority) {
				return warning as WarningLevel;
			}
		}
		return 'NO_WARNING';
	}

	/**
	 * Analyze pattern type based on pre-panic signals and significant drops
	 */
	private analyzePatternType(
		prePanicSignals: Record<string, PrePanicSignal>,
		significantDrops: SignificantDrop[]
	): PatternType {
		// Check for multiple weakness events
		if (significantDrops.length >= 2) {
			return 'MULTIPLE_WEAKNESS_EVENTS';
		}

		// Check for escalating crisis pattern
		const timeframes = ['T-14', 'T-7', 'T-1'];
		const warnings = timeframes
			.filter(tf => tf in prePanicSignals)
			.map(tf => prePanicSignals[tf].signal);

		if (warnings.length >= 2) {
			if (warnings[warnings.length - 1] === 'STRONG_WARNING') {
				return 'ESCALATING_TO_CRISIS';
			}
			if (warnings.includes('STRONG_WARNING') || warnings.includes('MODERATE_WARNING')) {
				return 'PERSISTENT_WEAKNESS';
			}
			if (warnings[0] !== 'NO_WARNING' && warnings[warnings.length - 1] !== 'NO_WARNING') {
				return 'SUSTAINED_DETERIORATION';
			}
		}

		if (warnings.length === 0 && significantDrops.length === 0) {
			return 'NO_SIGNALS_DETECTED';
		}

		return 'ISOLATED_SIGNALS';
	}

	/**
	 * Generate trading advice based on pre-panic analysis
	 */
	public getPrePanicTradingAdvice(strongestWarning: WarningLevel): TradingAdvice {
		const adviceMatrix: Record<WarningLevel, TradingAdvice> = {
			STRONG_WARNING: {
				action: 'REDUCE positions immediately, increase cash to 70%+',
				riskLevel: 'EXTREME - Panic likely within 1-3 days',
				positionSize: 'Maximum 30% equity exposure',
				defensiveStocks: 'VCB only, exit all others'
			},
			MODERATE_WARNING: {
				action: 'Reduce portfolio by 40%, prepare defensive positions',
				riskLevel: 'HIGH - Monitor daily for escalation',
				positionSize: 'Maximum 60% equity exposure',
				defensiveStocks: 'VCB, VIC core holdings only'
			},
			EARLY_WARNING: {
				action: 'Reduce riskiest positions, raise cash to 30%',
				riskLevel: 'MEDIUM - Watch for pattern development',
				positionSize: 'Maximum 70% equity exposure',
				defensiveStocks: 'Emphasize VCB, VIC, TCB quality'
			},
			DEVELOPING_WEAKNESS: {
				action: 'Monitor closely, prepare for defensive rotation',
				riskLevel: 'LOW-MEDIUM - Early stage warning',
				positionSize: 'Normal allocation with caution',
				defensiveStocks: 'Quality focus: Banking/VIC blend'
			},
			NO_WARNING: {
				action: 'Normal trading strategies',
				riskLevel: 'LOW - No immediate panic signals',
				positionSize: 'Normal allocation',
				defensiveStocks: 'Standard diversification'
			},
			INSUFFICIENT_DATA: {
				action: 'Normal trading strategies',
				riskLevel: 'UNKNOWN - Insufficient data for analysis',
				positionSize: 'Conservative allocation recommended',
				defensiveStocks: 'Maintain defensive baseline'
			}
		};

		return adviceMatrix[strongestWarning];
	}

	/**
	 * Complete analysis for a given date
	 */
	public async analyzeDate(targetDate: string): Promise<DateAnalysisData | null> {
		return this.getDateData(targetDate);
	}

	/**
	 * Generate trading signals based on panic classification
	 */
	public generateTradingSignals(panicType: PanicType, _indicators: SectorIndicatorData) {
		const signals = {
			POSITIVE_PANIC: {
				buy: ['VIC', 'SHS', 'TCB'],
				avoid: ['NVL', 'MBS'],
				watch: ['VCB']
			},
			NEGATIVE_EXTREME: {
				buy: ['VCB'],
				avoid: ['ALL_OTHERS'],
				watch: ['Government_intervention_signals']
			},
			NEGATIVE_MEDIUM: {
				buy: [],
				avoid: ['Securities', 'Real_Estate'],
				watch: ['VCB', 'Banking_stabilization']
			},
			RECOVERY_SIGNAL: {
				buy: ['SSI', 'SHS', 'VCI'],
				avoid: [],
				watch: ['F0_volume_return']
			},
			NO_PANIC: {
				buy: [],
				avoid: [],
				watch: ['Normal_market_conditions']
			},
			UNCLEAR_PATTERN: {
				buy: [],
				avoid: [],
				watch: ['Pattern_development']
			}
		};

		return signals[panicType] || { buy: [], avoid: [], watch: [] };
	}
}

// Export singleton instance for use across the app
export const panicAnalyzer = new VietnamesePanicAnalyzer();