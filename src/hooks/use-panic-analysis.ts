/**
 * React Hook for Vietnamese Market Panic Analysis
 * 
 * Provides reusable panic analysis functionality across home, portfolio,
 * sector, and panic pages. Integrates with TanStack Query for caching
 * and the panic analyzer singleton for calculations.
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { panicAnalyzer, type PanicType, type WarningLevel, type PatternType } from '../lib/panic-analyzer';
import { PANIC_DAYS_DATABASE, getPanicDayByDate } from '../data/panic-days';

export interface PanicAnalysisResult {
	date: string;
	vnindexChange: number;
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	panicType: PanicType;
	tradingSignals: {
		buy: string[];
		avoid: string[];
		watch: string[];
	};
}

export interface PrePanicAnalysisResult {
	strongestWarning: WarningLevel;
	patternType: PatternType;
	tradingAdvice: {
		action: string;
		riskLevel: string;
		positionSize: string;
		defensiveStocks: string;
	};
	prePanicSignals: Record<string, {
		date: string;
		vnindexChange: number;
		bsi: number | null;
		ssi: number | null;
		rsi: number | null;
		signal: WarningLevel;
	}>;
	significantDrops: Array<{
		date: string;
		daysBefore: number;
		vnindexChange: number;
		signal: WarningLevel;
	}>;
}

export interface SectorIndicators {
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	date: string;
}

/**
 * Hook for analyzing a specific date for panic patterns
 */
export function usePanicAnalysis(date: string): UseQueryResult<PanicAnalysisResult, Error> {
	return useQuery<PanicAnalysisResult, Error>({
		queryKey: ['panic-analysis', date],
		queryFn: async (): Promise<PanicAnalysisResult> => {
			console.log('🔍 usePanicAnalysis: Analyzing date', date);
			
			// First check pre-calculated database for faster response
			const precalculated = getPanicDayByDate(date);
			if (precalculated) {
				console.log('✅ Found precalculated data for', date);
				return {
					date: precalculated.date,
					vnindexChange: precalculated.vnindexChange,
					bsi: precalculated.bsi,
					ssi: precalculated.ssi,
					rsi: precalculated.rsi,
					panicType: precalculated.panicType,
					tradingSignals: panicAnalyzer.generateTradingSignals(
						precalculated.panicType,
						{ bsi: precalculated.bsi, ssi: precalculated.ssi, rsi: precalculated.rsi }
					)
				};
			}

			// Fall back to real-time calculation for new dates
			console.log('⏳ No precalculated data, attempting real-time analysis for', date);
			const analysisData = await panicAnalyzer.analyzeDate(date);
			if (!analysisData) {
				console.error('❌ No analysis data available for', date);
				throw new Error(`No data available for date: ${date}. The date may be invalid or market data may not be available.`);
			}
			
			console.log('✅ Real-time analysis successful for', date);

			const tradingSignals = panicAnalyzer.generateTradingSignals(
				analysisData.panicType,
				{ bsi: analysisData.bsi, ssi: analysisData.ssi, rsi: analysisData.rsi }
			);

			return {
				date: analysisData.date,
				vnindexChange: analysisData.vnindexChange,
				bsi: analysisData.bsi,
				ssi: analysisData.ssi,
				rsi: analysisData.rsi,
				panicType: analysisData.panicType,
				tradingSignals
			};
		},
		enabled: !!date,
		staleTime: 1000 * 60 * 60 // 1 hour - panic analysis doesn't change
	});
}

/**
 * Hook for pre-panic analysis and warning signals
 */
export function usePrePanicAnalysis(targetDate: string): UseQueryResult<PrePanicAnalysisResult, Error> {
	return useQuery<PrePanicAnalysisResult, Error>({
		queryKey: ['pre-panic-analysis', targetDate],
		queryFn: async (): Promise<PrePanicAnalysisResult> => {
			// Check pre-calculated database first
			const precalculated = getPanicDayByDate(targetDate);
			if (precalculated) {
				const tradingAdvice = panicAnalyzer.getPrePanicTradingAdvice(precalculated.strongestWarning);
				
				return {
					strongestWarning: precalculated.strongestWarning,
					patternType: precalculated.prePanicPattern,
					tradingAdvice,
					prePanicSignals: {
						'T-1': precalculated.prePanicSignals.t1 || { date: '', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' as WarningLevel },
						'T-7': precalculated.prePanicSignals.t7 || { date: '', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' as WarningLevel },
						'T-14': precalculated.prePanicSignals.t14 || { date: '', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' as WarningLevel }
					},
					significantDrops: precalculated.significantDrops
				};
			}

			// Fall back to real-time calculation
			const prePanicAnalysis = await panicAnalyzer.analyzePrePanicPattern(targetDate);
			if (!prePanicAnalysis) {
				throw new Error(`No pre-panic analysis available for date: ${targetDate}`);
			}

			const tradingAdvice = panicAnalyzer.getPrePanicTradingAdvice(prePanicAnalysis.strongestWarning);

			return {
				strongestWarning: prePanicAnalysis.strongestWarning,
				patternType: prePanicAnalysis.patternType,
				tradingAdvice,
				prePanicSignals: prePanicAnalysis.prePanicSignals,
				significantDrops: prePanicAnalysis.significantDrops
			};
		},
		enabled: !!targetDate,
		staleTime: 1000 * 60 * 60 // 1 hour
	});
}

/**
 * Hook for current market sector indicators (for daily monitoring)
 */
export function useCurrentSectorIndicators(): UseQueryResult<SectorIndicators, Error> {
	const today = new Date().toISOString().split('T')[0];
	
	return useQuery({
		queryKey: ['sector-indicators', today],
		queryFn: async (): Promise<SectorIndicators> => {
			const analysisData = await panicAnalyzer.getDateData(today);
			if (!analysisData) {
				throw new Error('No current market data available');
			}

			return {
				bsi: analysisData.bsi,
				ssi: analysisData.ssi,
				rsi: analysisData.rsi,
				date: today
			};
		},
		staleTime: 1000 * 60 * 5, // 5 minutes - current data refreshes frequently
		refetchInterval: 1000 * 60 * 15 // Refetch every 15 minutes during trading hours
	});
}

/**
 * Hook for panic day statistics and historical patterns
 */
export function usePanicStatistics() {
	return useQuery({
		queryKey: ['panic-statistics'],
		queryFn: async () => {
			const totalPanics = PANIC_DAYS_DATABASE.length;
			const predictedPanics = PANIC_DAYS_DATABASE.filter(
				p => p.strongestWarning !== 'NO_WARNING' && p.strongestWarning !== 'INSUFFICIENT_DATA'
			).length;

			const predictionAccuracy = predictedPanics / totalPanics;

			const yearlyStats = PANIC_DAYS_DATABASE.reduce((acc, panic) => {
				const year = new Date(panic.date).getFullYear();
				acc[year] = (acc[year] || 0) + 1;
				return acc;
			}, {} as Record<number, number>);

			const patternStats = PANIC_DAYS_DATABASE.reduce((acc, panic) => {
				acc[panic.prePanicPattern] = (acc[panic.prePanicPattern] || 0) + 1;
				return acc;
			}, {} as Record<PatternType, number>);

			const warningStats = PANIC_DAYS_DATABASE.reduce((acc, panic) => {
				acc[panic.strongestWarning] = (acc[panic.strongestWarning] || 0) + 1;
				return acc;
			}, {} as Record<WarningLevel, number>);

			return {
				totalPanics,
				predictedPanics,
				predictionAccuracy,
				blackSwanEvents: totalPanics - predictedPanics,
				yearlyDistribution: yearlyStats,
				patternDistribution: patternStats,
				warningDistribution: warningStats,
				mostRecentPanic: PANIC_DAYS_DATABASE[PANIC_DAYS_DATABASE.length - 1],
				worstPanic: PANIC_DAYS_DATABASE.reduce((worst, current) =>
					current.vnindexChange < worst.vnindexChange ? current : worst
				)
			};
		},
		staleTime: 1000 * 60 * 60 * 24 // 24 hours - statistics don't change often
	});
}

/**
 * Hook for getting current pre-panic warning level
 * Used for dashboard alerts and risk management
 */
export function useCurrentWarningLevel(): UseQueryResult<{
	currentWarning: WarningLevel;
	tradingAdvice: ReturnType<typeof panicAnalyzer.getPrePanicTradingAdvice>;
	sectorIndicators: SectorIndicators;
}, Error> {
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const yesterdayStr = yesterday.toISOString().split('T')[0];

	return useQuery<{
		currentWarning: WarningLevel;
		tradingAdvice: ReturnType<typeof panicAnalyzer.getPrePanicTradingAdvice>;
		sectorIndicators: SectorIndicators;
	}, Error>({
		queryKey: ['current-warning-level', yesterdayStr],
		queryFn: async () => {
			console.log('🔍 useCurrentWarningLevel: Attempting to get data for', yesterdayStr);
			
			// Try to get yesterday's data first
			let analysisData = await panicAnalyzer.getDateData(yesterdayStr);
			let dateUsed = yesterdayStr;
			let sectorData: { bsi: number | null; ssi: number | null; rsi: number | null; vnindexChange: number };
			
			// If yesterday's data not available, fall back to most recent panic day
			if (!analysisData) {
				console.log('⚠️ No data for yesterday, falling back to most recent panic day');
				const mostRecent = PANIC_DAYS_DATABASE[PANIC_DAYS_DATABASE.length - 1];
				dateUsed = mostRecent.date;
				
				// Use the most recent panic day data as fallback
				sectorData = {
					bsi: mostRecent.bsi,
					ssi: mostRecent.ssi,
					rsi: mostRecent.rsi,
					vnindexChange: mostRecent.vnindexChange
				};
				
				console.log('✅ Using most recent panic day data:', dateUsed);
			} else {
				console.log('✅ Found data for', dateUsed);
				sectorData = {
					bsi: analysisData.bsi,
					ssi: analysisData.ssi,
					rsi: analysisData.rsi,
					vnindexChange: analysisData.vnindexChange
				};
			}

			// Classify pre-panic warning based on available data
			const currentWarning = panicAnalyzer['classifyPrePanicSignal'](
				sectorData.bsi,
				sectorData.ssi,
				sectorData.rsi,
				sectorData.vnindexChange
			);

			const tradingAdvice = panicAnalyzer.getPrePanicTradingAdvice(currentWarning);

			const sectorIndicators = {
				bsi: sectorData.bsi,
				ssi: sectorData.ssi,
				rsi: sectorData.rsi,
				date: dateUsed
			};

			return {
				currentWarning,
				tradingAdvice,
				sectorIndicators
			};
		},
		staleTime: 1000 * 60 * 60, // 1 hour
		refetchInterval: 1000 * 60 * 30 // Refetch every 30 minutes
	});
}

/**
 * Hook for filtering panic days by criteria
 */
export function usePanicDayFilters(filters: {
	year?: number;
	panicType?: PanicType;
	warningLevel?: WarningLevel;
	patternType?: PatternType;
}) {
	return useQuery({
		queryKey: ['panic-days-filtered', filters],
		queryFn: async () => {
			let filteredPanics = [...PANIC_DAYS_DATABASE];

			if (filters.year) {
				filteredPanics = filteredPanics.filter(
					panic => new Date(panic.date).getFullYear() === filters.year
				);
			}

			if (filters.panicType) {
				filteredPanics = filteredPanics.filter(
					panic => panic.panicType === filters.panicType
				);
			}

			if (filters.warningLevel) {
				filteredPanics = filteredPanics.filter(
					panic => panic.strongestWarning === filters.warningLevel
				);
			}

			if (filters.patternType) {
				filteredPanics = filteredPanics.filter(
					panic => panic.prePanicPattern === filters.patternType
				);
			}

			return {
				filteredPanics,
				totalCount: filteredPanics.length,
				predictionRate: filteredPanics.filter(
					p => p.strongestWarning !== 'NO_WARNING' && p.strongestWarning !== 'INSUFFICIENT_DATA'
				).length / filteredPanics.length
			};
		},
		enabled: Object.keys(filters).length > 0,
		staleTime: 1000 * 60 * 60, // 1 hour
	});
}

/**
 * Utility function to get warning level color for UI components
 */
export function getWarningLevelColor(level: WarningLevel): string {
	switch (level) {
		case 'STRONG_WARNING': return 'bg-red-500 text-white';
		case 'MODERATE_WARNING': return 'bg-yellow-500 text-white';
		case 'EARLY_WARNING': return 'bg-orange-500 text-white';
		case 'DEVELOPING_WEAKNESS': return 'bg-blue-500 text-white';
		case 'NO_WARNING': return 'bg-green-500 text-white';
		case 'INSUFFICIENT_DATA': return 'bg-gray-500 text-white';
		default: return 'bg-gray-400 text-white';
	}
}

/**
 * Utility function to get panic type color for UI components
 */
export function getPanicTypeColor(type: PanicType): string {
	switch (type) {
		case 'POSITIVE_PANIC': return 'bg-green-600 text-white';
		case 'NEGATIVE_MEDIUM': return 'bg-orange-600 text-white';
		case 'NEGATIVE_EXTREME': return 'bg-red-600 text-white';
		case 'UNCLEAR_PATTERN': return 'bg-purple-600 text-white';
		case 'RECOVERY_SIGNAL': return 'bg-blue-600 text-white';
		case 'NO_PANIC': return 'bg-gray-600 text-white';
		default: return 'bg-gray-400 text-white';
	}
}