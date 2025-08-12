/**
 * Pre-calculated Vietnamese Market Panic Day Database
 * 
 * Contains all 41 verified panic days (2018-2025) from PANIC_ANALYSIS_WORKBOOK.md
 * with sector indicators, classifications, pre-panic signals, and showcase tickers.
 * 
 * This database enables instant panic analysis without real-time calculations,
 * supporting both the /panic listing page and detailed analysis components.
 */

import type { PanicType, WarningLevel, PatternType } from '../lib/panic-analyzer';

export interface PanicDayData {
	// Core panic information
	date: string;
	vnindexChange: number;
	vnindexClose: number;
	vnindexLow: number;
	intradayDrop: number;
	
	// Market cap-weighted sector indicators 
	bsi: number | null; // Banking Sector Indicator
	ssi: number | null; // Securities Sector Indicator
	rsi: number | null; // Real Estate Sector Indicator
	
	// Analysis classifications
	panicType: PanicType;
	prePanicPattern: PatternType;
	strongestWarning: WarningLevel;
	
	// Context and trading insights
	context: string;
	tradingLesson: string;
	
	// Showcase tickers for demonstrations (best/worst performers)
	showcaseTickers: {
		bestPerformers: Array<{ ticker: string; change: number; reason: string }>;
		worstPerformers: Array<{ ticker: string; change: number; reason: string }>;
		defensiveLeaders: Array<{ ticker: string; change: number; reason: string }>;
	};
	
	// Recovery analysis
	recoveryPattern: {
		stabilizationDays: number;
		recoveryLeader: 'BANKING' | 'SECURITIES' | 'REAL_ESTATE' | 'MIXED' | 'NO_RECOVERY';
		nextDayVnindexChange: number | null;
		averageSecuritiesReturn?: number;
	};
	
	// Pre-panic warning signals (used for predictions)
	prePanicSignals: {
		t1?: { date: string; vnindexChange: number; bsi: number | null; ssi: number | null; rsi: number | null; signal: WarningLevel };
		t7?: { date: string; vnindexChange: number; bsi: number | null; ssi: number | null; rsi: number | null; signal: WarningLevel };
		t14?: { date: string; vnindexChange: number; bsi: number | null; ssi: number | null; rsi: number | null; signal: WarningLevel };
	};
	
	// Significant drops during 14-day pre-panic scan
	significantDrops: Array<{
		date: string;
		daysBefore: number;
		vnindexChange: number;
		bsi: number | null;
		ssi: number | null;
		rsi: number | null;
		signal: WarningLevel;
	}>;
}

/**
 * Complete database of all verified panic days from workbook analysis
 * Sorted chronologically from oldest to newest
 */
export const PANIC_DAYS_DATABASE: PanicDayData[] = [
	// 2018 Panic Days
	{
		date: '2018-02-05',
		vnindexChange: -5.10,
		vnindexClose: 1048.71,
		vnindexLow: 1048.71,
		intradayDrop: -5.10,
		bsi: -6.85,
		ssi: -7.22,
		rsi: -6.30,
		panicType: 'NEGATIVE_MEDIUM',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Global market correction fears, early year volatility - Genesis of Vietnamese panic patterns',
		tradingLesson: 'First major correction confirmed uniform sector crashes. No stabilization leadership yet developed. Historical significance: Genesis of Vietnamese recovery patterns.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'NVL', change: 0.1, reason: 'Anomaly - only positive stock during uniform crash' }
			],
			worstPerformers: [
				{ ticker: 'MBS', change: -9.7, reason: 'Securities sector crashed hardest during correction' },
				{ ticker: 'SHS', change: -9.0, reason: 'High-beta securities leading decline' },
				{ ticker: 'VCB', change: -7.0, reason: 'Even quality banking crashed uniformly' }
			],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: -3.54,
			averageSecuritiesReturn: 6.27
		},
		prePanicSignals: {
			t1: { date: '2018-02-02', vnindexChange: 0.49, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2018-01-25', vnindexChange: 1.58, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2018-01-12', vnindexChange: 0.19, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2018-01-17', daysBefore: 4, vnindexChange: -2.66, bsi: -4.61, ssi: -3.57, rsi: null, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2018-02-06',
		vnindexChange: -3.54,
		vnindexClose: 1011.60,
		vnindexLow: 983.06,
		intradayDrop: -6.26,
		bsi: -4.12,
		ssi: -4.77,
		rsi: -1.39,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Continuation of global correction, margin call cascade - Perfect follow-through prediction',
		tradingLesson: 'First clear evidence of VCB-VIC defensive duo. VCB -1.1%, VIC ±0.0% during panic showed emerging defensive leadership patterns.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: 0.0, reason: 'Ultimate defensive behavior - flat during market panic' },
				{ ticker: 'NVL', change: 0.3, reason: 'Real estate resilience during follow-through panic' }
			],
			worstPerformers: [
				{ ticker: 'BID', change: -6.9, reason: 'Banking continued weakness in extended crisis' },
				{ ticker: 'VCI', change: -6.8, reason: 'Securities standard crash pattern' },
				{ ticker: 'CTG', change: -6.5, reason: 'Banking sector broad weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'VCB', change: -1.1, reason: '71% defensive outperformance vs market -3.54%' },
				{ ticker: 'VIC', change: 0.0, reason: 'Perfect stability during panic - defensive excellence' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 2.86,
			averageSecuritiesReturn: 6.27
		},
		prePanicSignals: {
			t1: { date: '2018-02-05', vnindexChange: -5.10, bsi: -6.85, ssi: -7.22, rsi: -6.30, signal: 'STRONG_WARNING' },
			t7: { date: '2018-01-26', vnindexChange: 1.00, bsi: 3.41, ssi: 1.02, rsi: 0.04, signal: 'NO_WARNING' },
			t14: { date: '2018-01-15', vnindexChange: 1.27, bsi: 2.04, ssi: 2.53, rsi: 1.59, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2018-02-05', daysBefore: 1, vnindexChange: -5.10, bsi: -6.85, ssi: -7.22, rsi: -6.30, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2018-02-09',
		vnindexChange: -1.89,
		vnindexClose: 1003.94,
		vnindexLow: 973.78,
		intradayDrop: -4.83,
		bsi: -1.24,
		ssi: 1.59,
		rsi: -1.17,
		panicType: 'NO_PANIC',
		prePanicPattern: 'MULTIPLE_WEAKNESS_EVENTS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Recovery attempt with emerging securities leadership - Historic pattern development',
		tradingLesson: 'BREAKTHROUGH: Securities Indicator +1.59% while VNINDEX -1.89%. First documented Vietnamese securities leadership pattern. HCM +5.3%, MBS +4.7% established recovery template.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'HCM', change: 5.3, reason: 'Securities recovery leader - explosive rebound' },
				{ ticker: 'MBS', change: 4.7, reason: 'High-beta securities championship recovery' },
				{ ticker: 'VPB', change: 1.0, reason: 'Banking showing mixed recovery signals' }
			],
			worstPerformers: [
				{ ticker: 'VCB', change: -3.2, reason: 'Quality banking giving back gains from recovery attempt' },
				{ ticker: 'VRE', change: -2.5, reason: 'Real estate continued weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'HCM', change: 5.3, reason: 'Securities sector leadership during market weakness' },
				{ ticker: 'MBS', change: 4.7, reason: 'Securities recovery pattern establishment' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: null,
			averageSecuritiesReturn: 1.59
		},
		prePanicSignals: {
			t1: { date: '2018-02-08', vnindexChange: -1.66, bsi: -0.38, ssi: -2.16, rsi: -2.38, signal: 'STRONG_WARNING' },
			t7: { date: '2018-01-31', vnindexChange: -0.02, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2018-01-18', vnindexChange: 1.50, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2018-02-05', daysBefore: 11, vnindexChange: -5.10, bsi: -6.85, ssi: -7.22, rsi: -6.30, signal: 'STRONG_WARNING' },
			{ date: '2018-02-06', daysBefore: 12, vnindexChange: -3.54, bsi: -4.12, ssi: -4.77, rsi: -1.39, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2018-04-19',
		vnindexChange: -3.86,
		vnindexClose: 1094.63,
		vnindexLow: 1094.63,
		intradayDrop: -3.86,
		bsi: -5.66,
		ssi: -2.29,
		rsi: -5.23,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Trade war concerns, earnings season disappointments - Securities defensive emergence confirmed',
		tradingLesson: 'MAJOR CONFIRMATION: Securities Indicator -2.29% vs VNINDEX -3.86% = +1.57% outperformance. First clear securities defensive excellence during panic. Vietnamese patterns maturing.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'NVL', change: 0.0, reason: 'Real estate showing stability during trade war stress' },
				{ ticker: 'KDH', change: -0.7, reason: 'Real estate minimal weakness' },
				{ ticker: 'MBS', change: -0.5, reason: 'Securities defensive strength' }
			],
			worstPerformers: [
				{ ticker: 'VIC', change: -6.9, reason: 'Real estate leading crash - F0 emotion pattern' },
				{ ticker: 'VCB', change: -5.9, reason: 'Banking uniform crash pattern' },
				{ ticker: 'CTG', change: -5.8, reason: 'Banking broad weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'MBS', change: -0.5, reason: 'Securities sector defensive excellence vs -3.86% market' },
				{ ticker: 'SSI', change: -2.1, reason: 'Securities defensive outperformance pattern' },
				{ ticker: 'VCI', change: -2.1, reason: 'Securities showing stability during panic' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: 2.30,
			averageSecuritiesReturn: 2.20
		},
		prePanicSignals: {
			t1: { date: '2018-04-18', vnindexChange: -1.28, bsi: -3.51, ssi: -0.92, rsi: -0.86, signal: 'EARLY_WARNING' },
			t7: { date: '2018-04-10', vnindexChange: -0.52, bsi: 0.91, ssi: -1.79, rsi: -2.17, signal: 'NO_WARNING' },
			t14: { date: '2018-03-30', vnindexChange: 0.64, bsi: -1.00, ssi: 0.74, rsi: 1.71, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2018-05-22',
		vnindexChange: -2.86,
		vnindexClose: 985.91,
		vnindexLow: 976.73,
		intradayDrop: -3.77,
		bsi: -5.36,
		ssi: -5.77,
		rsi: -1.44,
		panicType: 'NO_PANIC',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'US-China trade tensions escalating, emerging market concerns - Real estate defensive surprise',
		tradingLesson: 'SURPRISING DISCOVERY: Real Estate Indicator -1.44% vs VNINDEX -2.86% = +1.42% outperformance. VHM +7.0% anomaly. Real estate resilience during external shocks.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VHM', change: 7.0, reason: 'Massive real estate anomaly - likely company-specific news' },
				{ ticker: 'MBS', change: -1.8, reason: 'Securities showing relative strength during trade war' }
			],
			worstPerformers: [
				{ ticker: 'SHS', change: -8.1, reason: 'Securities crashed hardest during trade tensions' },
				{ ticker: 'BID', change: -7.0, reason: 'Banking uniform crash during external shock' },
				{ ticker: 'VIC', change: -7.0, reason: 'Real estate uniform weakness except VHM anomaly' }
			],
			defensiveLeaders: [
				{ ticker: 'VHM', change: 7.0, reason: 'Exceptional real estate outperformance during panic' },
				{ ticker: 'MBS', change: -1.8, reason: 'Securities defensive characteristics during trade war' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2018-05-21', vnindexChange: -2.46, bsi: -2.34, ssi: -2.03, rsi: -3.70, signal: 'STRONG_WARNING' },
			t7: { date: '2018-05-11', vnindexChange: 1.55, bsi: 3.48, ssi: 0.74, rsi: 2.14, signal: 'NO_WARNING' },
			t14: { date: '2018-05-02', vnindexChange: -2.02, bsi: -5.05, ssi: -3.11, rsi: -1.38, signal: 'EARLY_WARNING' }
		},
		significantDrops: [
			{ date: '2018-05-02', daysBefore: 14, vnindexChange: -2.02, bsi: -5.05, ssi: -3.11, rsi: -1.38, signal: 'EARLY_WARNING' },
			{ date: '2018-05-21', daysBefore: 1, vnindexChange: -2.46, bsi: -2.34, ssi: -2.03, rsi: -3.70, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2018-05-28',
		vnindexChange: -3.34,
		vnindexClose: 931.75,
		vnindexLow: 927.47,
		intradayDrop: -3.78,
		bsi: -6.64,
		ssi: -7.59,
		rsi: 0.94,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'MULTIPLE_WEAKNESS_EVENTS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Foreign capital outflows during trade war - VIC DEFENSIVE MASTERCLASS established',
		tradingLesson: 'BREAKTHROUGH: VIC +3.74% during -3.34% panic = +7.08% outperformance! Real Estate Indicator +0.94% (only positive sector). VIC established as ultimate Vietnamese defensive stock.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: 3.7, reason: 'DEFENSIVE MASTERCLASS - ultimate safe haven during foreign selling' },
				{ ticker: 'VHM', change: -0.4, reason: 'Real estate quality showing minimal weakness' },
				{ ticker: 'NVL', change: -1.9, reason: 'Real estate sector resilience during foreign outflows' }
			],
			worstPerformers: [
				{ ticker: 'MBS', change: -10.0, reason: 'Securities crashed hardest during foreign selling' },
				{ ticker: 'SHS', change: -9.2, reason: 'High-beta securities leading decline' },
				{ ticker: 'CTG', change: -6.9, reason: 'Banking uniform crash during capital outflows' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: 3.7, reason: '+7.08% outperformance - established as ultimate defensive leader' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: 2.19,
			averageSecuritiesReturn: 5.96
		},
		prePanicSignals: {
			t1: { date: '2018-05-25', vnindexChange: -2.23, bsi: -5.94, ssi: null, rsi: null, signal: 'EARLY_WARNING' },
			t7: { date: '2018-05-17', vnindexChange: -2.27, bsi: null, ssi: null, rsi: null, signal: 'DEVELOPING_WEAKNESS' },
			t14: { date: '2018-05-10', vnindexChange: -2.66, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' }
		},
		significantDrops: [
			{ date: '2018-05-25', daysBefore: 1, vnindexChange: -2.23, bsi: -5.94, ssi: null, rsi: null, signal: 'EARLY_WARNING' },
			{ date: '2018-05-22', daysBefore: 4, vnindexChange: -2.86, bsi: -5.36, ssi: -5.77, rsi: -1.44, signal: 'EARLY_WARNING' },
			{ date: '2018-05-21', daysBefore: 5, vnindexChange: -2.46, bsi: -2.34, ssi: -2.03, rsi: -3.70, signal: 'STRONG_WARNING' },
			{ date: '2018-05-17', daysBefore: 7, vnindexChange: -2.27, bsi: null, ssi: null, rsi: null, signal: 'DEVELOPING_WEAKNESS' },
			{ date: '2018-05-10', daysBefore: 14, vnindexChange: -2.66, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2018-10-11',
		vnindexChange: -4.84,
		vnindexClose: 945.89,
		vnindexLow: 938.83,
		intradayDrop: -5.55,
		bsi: -6.67,
		ssi: -7.34,
		rsi: -4.19,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Global October crash, systematic selling across all markets - Black Swan external shock',
		tradingLesson: 'October 2018 confirmed VCB-VIC defensive duo. VIC -3.7% vs VNINDEX -4.84% = +1.14% outperformance. Real Estate Indicator -4.19% vs Banking -6.67% shows real estate defensive superiority.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'NVL', change: -0.3, reason: 'Real estate minimal weakness during global crash' },
				{ ticker: 'VIC', change: -3.7, reason: 'Defensive excellence - outperformed market by +1.14%' }
			],
			worstPerformers: [
				{ ticker: 'SHS', change: -9.3, reason: 'Securities leading crash during global October crash' },
				{ ticker: 'MBS', change: -8.3, reason: 'High-beta securities severe weakness' },
				{ ticker: 'BID', change: -7.0, reason: 'Banking uniform crash pattern' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: -3.7, reason: 'Quality defensive behavior during global crisis' },
				{ ticker: 'VCB', change: -6.5, reason: 'Banking relative strength vs other banks at -7.0%' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2018-10-10', vnindexChange: -0.22, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2018-10-02', vnindexChange: 0.58, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2018-09-21', vnindexChange: -0.18, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},

	// 2020 COVID Panic Days (Selected Key Examples)
	{
		date: '2020-01-30',
		vnindexChange: -3.78,
		vnindexClose: 954.00,
		vnindexLow: 954.00,
		intradayDrop: -3.78,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'First COVID-19 concerns reaching Vietnamese markets after Chinese New Year - Black Swan event',
		tradingLesson: 'Early COVID panic tested whether 2018 VCB defensive patterns would hold under health crisis. First external shock testing modern Vietnamese patterns.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2020-01-22', vnindexChange: 0.52, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2020-01-14', vnindexChange: 0.12, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2020-01-03', vnindexChange: -0.16, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2020-02-24',
		vnindexChange: -3.11,
		vnindexClose: 903.34,
		vnindexLow: 903.34,
		intradayDrop: -3.11,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'COVID-19 declared global pandemic concern, worldwide market selling - Moderate COVID panic',
		tradingLesson: 'Moderate panic day testing whether sector differentiation patterns hold during sustained COVID stress. Flight to quality pattern with large caps vs high beta small caps.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2020-02-21', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2020-02-14', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2020-02-07', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2020-03-09',
		vnindexChange: -6.28,
		vnindexClose: 835.49,
		vnindexLow: 834.67,
		intradayDrop: -6.37,
		bsi: -6.95,
		ssi: -6.89,
		rsi: -6.62,
		panicType: 'NEGATIVE_MEDIUM',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Oil price crash combined with pandemic fears, dual shock - Uniform sector crash',
		tradingLesson: 'NEGATIVE_MEDIUM panic with uniform sector crash. All indicators around -6.8%. VCI -4.2% showed some securities resilience. NVL -1.9% anomaly.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'NVL', change: -1.9, reason: 'Real estate anomaly - unusual outperformance during dual shock' },
				{ ticker: 'VCI', change: -4.2, reason: 'Securities showing relative strength vs sector -6.89%' }
			],
			worstPerformers: [
				{ ticker: 'SHS', change: -9.3, reason: 'Securities crashed hardest during oil/COVID shock' },
				{ ticker: 'MBS', change: -9.2, reason: 'High-beta securities severe weakness' },
				{ ticker: 'VCB', change: -7.0, reason: 'Even quality banking crashed uniformly' }
			],
			defensiveLeaders: [
				{ ticker: 'VCI', change: -4.2, reason: 'Securities relative strength during dual external shock' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 5,
			recoveryLeader: 'NO_RECOVERY',
			nextDayVnindexChange: -5.19
		},
		prePanicSignals: {
			t1: { date: '2020-03-06', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' },
			t7: { date: '2020-02-28', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' },
			t14: { date: '2020-02-21', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2020-03-12',
		vnindexChange: -5.19,
		vnindexClose: 769.25,
		vnindexLow: 762.12,
		intradayDrop: -6.07,
		bsi: -6.81,
		ssi: -6.36,
		rsi: -5.48,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Global travel restrictions, economic shutdown fears - Real estate showing relative strength',
		tradingLesson: 'Real Estate Indicator -5.48% best performance during COVID travel restrictions. VIC -5.4% maintaining relative strength but not outperforming market.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'NVL', change: -0.4, reason: 'Real estate exceptional resilience during travel ban' },
				{ ticker: 'VIC', change: -5.4, reason: 'Quality real estate defensive but underperforming market' }
			],
			worstPerformers: [
				{ ticker: 'TCB', change: -7.1, reason: 'Banking leading crash during shutdown fears' },
				{ ticker: 'VRE', change: -6.9, reason: 'F0 real estate weakness during travel restrictions' }
			],
			defensiveLeaders: [
				{ ticker: 'NVL', change: -0.4, reason: 'Real estate sector resilience during COVID restrictions' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 10,
			recoveryLeader: 'REAL_ESTATE',
			nextDayVnindexChange: -0.97
		},
		prePanicSignals: {
			t1: { date: '2020-03-11', vnindexChange: -3.5, bsi: -3.2, ssi: -4.1, rsi: -2.8, signal: 'STRONG_WARNING' },
			t7: { date: '2020-03-03', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' },
			t14: { date: '2020-02-21', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2020-03-09', daysBefore: 3, vnindexChange: -6.28, bsi: -6.95, ssi: -6.89, rsi: -6.62, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2020-03-13',
		vnindexChange: -5.10,
		vnindexClose: 723.40,
		vnindexLow: 723.40,
		intradayDrop: -5.10,
		bsi: -7.0,
		ssi: -6.0,
		rsi: -5.4,
		panicType: 'NEGATIVE_EXTREME',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'National emergency declarations, lockdown preparations - Institutional capitulation',
		tradingLesson: 'CRITICAL POINT: When even defensive banking crashes, panic is at extreme levels. Even VCB dropped -7.0% showing institutional capitulation during emergency declarations.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [
				{ ticker: 'VCB', change: -7.0, reason: 'Institutional capitulation - even defensive banking crashed' },
				{ ticker: 'SSI', change: -6.0, reason: 'Securities widespread selling during emergency declarations' },
				{ ticker: 'VIC', change: -5.4, reason: 'Real estate held relatively better but still weak' }
			],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 5,
			recoveryLeader: 'NO_RECOVERY',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2020-03-12', vnindexChange: -5.19, bsi: -6.81, ssi: -6.36, rsi: -5.48, signal: 'STRONG_WARNING' },
			t7: { date: '2020-03-04', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' },
			t14: { date: '2020-02-25', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2020-03-09', daysBefore: 4, vnindexChange: -6.28, bsi: -6.95, ssi: -6.89, rsi: -6.62, signal: 'STRONG_WARNING' },
			{ date: '2020-03-12', daysBefore: 1, vnindexChange: -5.19, bsi: -6.81, ssi: -6.36, rsi: -5.48, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2020-03-19',
		vnindexChange: -3.80,
		vnindexClose: 714.00,
		vnindexLow: 714.00,
		intradayDrop: -3.80,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Vietnam announces lockdown measures - Domestic focus on local lockdown impact',
		tradingLesson: 'Extended pandemic panic period continues. Domestic lockdown measures creating continued weakness in extended crisis environment.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'NO_RECOVERY',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2020-03-18', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2020-03-10', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2020-03-02', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2020-03-09', daysBefore: 8, vnindexChange: -6.28, bsi: -6.95, ssi: -6.89, rsi: -6.62, signal: 'STRONG_WARNING' },
			{ date: '2020-03-12', daysBefore: 5, vnindexChange: -5.19, bsi: -6.81, ssi: -6.36, rsi: -5.48, signal: 'STRONG_WARNING' },
			{ date: '2020-03-13', daysBefore: 4, vnindexChange: -5.10, bsi: -7.0, ssi: -6.0, rsi: -5.4, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2020-03-23',
		vnindexChange: -6.08,
		vnindexClose: 663.97,
		vnindexLow: 663.97,
		intradayDrop: -6.08,
		bsi: -7.0,
		ssi: -7.0,
		rsi: -7.0,
		panicType: 'NEGATIVE_EXTREME',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'COVID peak panic, economic shutdown peak - Perfect T-7/T-1 STRONG_WARNING prediction',
		tradingLesson: 'COVID peak panic with T-7 and T-1 STRONG_WARNING signals. Perfect escalation pattern. All sectors uniformly crashed at -7.0% (rare uniform extreme).',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [
				{ ticker: 'VCB', change: -7.0, reason: 'Even ultimate defensive crashed during COVID peak' },
				{ ticker: 'VIC', change: -7.0, reason: 'Quality real estate crashed during systematic crisis' },
				{ ticker: 'SSI', change: -7.0, reason: 'Securities uniform extreme crash' }
			],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 7,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: 4.85,
			averageSecuritiesReturn: 8.2
		},
		prePanicSignals: {
			t1: { date: '2020-03-20', vnindexChange: -4.2, bsi: -4.8, ssi: -5.1, rsi: -3.9, signal: 'STRONG_WARNING' },
			t7: { date: '2020-03-12', vnindexChange: -5.19, bsi: -6.81, ssi: -6.36, rsi: -5.48, signal: 'STRONG_WARNING' },
			t14: { date: '2020-03-05', vnindexChange: 0, bsi: 0, ssi: 0, rsi: 0, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2020-03-09', daysBefore: 10, vnindexChange: -6.28, bsi: -6.95, ssi: -6.89, rsi: -6.62, signal: 'STRONG_WARNING' },
			{ date: '2020-03-12', daysBefore: 7, vnindexChange: -5.19, bsi: -6.81, ssi: -6.36, rsi: -5.48, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2020-03-30',
		vnindexChange: -3.70,
		vnindexClose: 657.40,
		vnindexLow: 657.40,
		intradayDrop: -3.70,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Ongoing pandemic uncertainty, economic damage assessment - Post-capitulation struggles',
		tradingLesson: 'Following the peak panic, market trying to find bottom but continued uncertainty about economic damage. Recovery struggles in post-capitulation environment.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 5,
			recoveryLeader: 'NO_RECOVERY',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2020-03-27', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2020-03-20', vnindexChange: -4.2, bsi: null, ssi: null, rsi: null, signal: 'STRONG_WARNING' },
			t14: { date: '2020-03-13', vnindexChange: -5.10, bsi: -7.0, ssi: -6.0, rsi: -5.4, signal: 'STRONG_WARNING' }
		},
		significantDrops: [
			{ date: '2020-03-23', daysBefore: 5, vnindexChange: -6.08, bsi: -7.0, ssi: -7.0, rsi: -7.0, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2020-04-21',
		vnindexChange: -3.10,
		vnindexClose: 762.00,
		vnindexLow: 762.00,
		intradayDrop: -3.10,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Oil prices went negative, unprecedented market event - External shock with limited Vietnam impact',
		tradingLesson: 'Oil price anomaly affecting all markets but limited Vietnamese impact since oil not major export. External shock testing Vietnamese market resilience.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2020-04-20', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2020-04-13', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2020-04-06', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},

	// 2021 Bull Market Correction Panic Days
	{
		date: '2021-01-19',
		vnindexChange: -6.10,
		vnindexClose: 1117.20,
		vnindexLow: 1117.20,
		intradayDrop: -6.10,
		bsi: -6.70,
		ssi: -7.60,
		rsi: -6.00,
		panicType: 'NEGATIVE_MEDIUM',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Post-COVID bull market correction, profit-taking after major rally - Bull market pattern development',
		tradingLesson: 'Bull market corrections show clear sector patterns - banking stabilizes, securities recover strongly. VCB -6.9%, SSI -7.6% standard crash pattern.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [
				{ ticker: 'SSI', change: -7.6, reason: 'Securities heavy selling during bull market correction' },
				{ ticker: 'VCB', change: -6.9, reason: 'Even quality banking crashed during profit-taking' },
				{ ticker: 'CTG', change: -6.5, reason: 'Banking standard crash pattern' }
			],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: null,
			averageSecuritiesReturn: 7.7
		},
		prePanicSignals: {
			t1: { date: '2021-01-18', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2021-01-08', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2020-12-31', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2021-01-26',
		vnindexChange: -3.60,
		vnindexClose: 1121.00,
		vnindexLow: 1121.00,
		intradayDrop: -3.60,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Follow-through correction in bull market sequence - Continued bull market correction',
		tradingLesson: 'Moderate correction following major panic. Bull market corrections tend to come in sequences with reducing severity.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2021-01-25', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2021-01-15', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2021-01-08', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2021-01-19', daysBefore: 7, vnindexChange: -6.10, bsi: -6.70, ssi: -7.60, rsi: -6.00, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2021-01-28',
		vnindexChange: -6.10,
		vnindexClose: 1022.80,
		vnindexLow: 1022.80,
		intradayDrop: -6.10,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'NEGATIVE_MEDIUM',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Third panic in bull market correction sequence - Extended correction in bull market pattern',
		tradingLesson: 'Extended correction with multiple panic days in sequence. Different from bear market panics - still within bull market framework.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2021-01-27', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2021-01-19', vnindexChange: -6.10, bsi: null, ssi: null, rsi: null, signal: 'STRONG_WARNING' },
			t14: { date: '2021-01-12', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2021-01-19', daysBefore: 9, vnindexChange: -6.10, bsi: -6.70, ssi: -7.60, rsi: -6.00, signal: 'STRONG_WARNING' },
			{ date: '2021-01-26', daysBefore: 2, vnindexChange: -3.60, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2021-02-08',
		vnindexChange: -3.30,
		vnindexClose: 1075.10,
		vnindexLow: 1075.10,
		intradayDrop: -3.30,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'MULTIPLE_WEAKNESS_EVENTS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Final wave of bull market correction - Correction ending, market finding support',
		tradingLesson: 'Final correction wave marking end of bull market correction sequence. Recovery beginning after this final selling wave.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2021-02-05', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2021-01-28', vnindexChange: -6.10, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' },
			t14: { date: '2021-01-21', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2021-01-28', daysBefore: 11, vnindexChange: -6.10, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2021-07-12',
		vnindexChange: -4.90,
		vnindexClose: 1270.10,
		vnindexLow: 1270.10,
		intradayDrop: -4.90,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Mid-year profit-taking, delta variant concerns - Correction from near all-time highs',
		tradingLesson: 'Bull market high correction with delta variant concerns. Banking showing stabilization characteristics during mid-year profit-taking.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2021-07-09', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2021-07-01', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2021-06-24', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2021-07-19',
		vnindexChange: -4.50,
		vnindexClose: 1237.80,
		vnindexLow: 1237.80,
		intradayDrop: -4.50,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Continued correction from bull market highs - Extended correction, second panic in sequence',
		tradingLesson: 'Extended correction following previous panic. Sector rotation patterns maturing with continued weakness from bull market highs.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2021-07-16', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2021-07-08', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2021-07-01', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2021-07-12', daysBefore: 7, vnindexChange: -4.90, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' }
		]
	},

	// 2022 Bear Market and Inflation Panic Days
	{
		date: '2022-04-25',
		vnindexChange: -4.00,
		vnindexClose: 1310.92,
		vnindexLow: 1310.92,
		intradayDrop: -4.00,
		bsi: -4.20,
		ssi: -4.80,
		rsi: -4.00,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Early bear market panic - Inflation concerns, Fed tightening, bear market beginning',
		tradingLesson: 'Bear market explosive recovery pattern. Securities led recovery (+3.40%, MBS +5.59%) stronger than banking (+0.86%). Classic patterns persist in bear markets.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'MBS', change: 5.59, reason: 'High-beta recovery champion on Day +1' },
				{ ticker: 'HCM', change: 5.06, reason: 'Securities broad strength in bear market recovery' },
				{ ticker: 'VPB', change: 6.26, reason: 'Exceptional banking recovery despite bear conditions' }
			],
			worstPerformers: [
				{ ticker: 'VCB', change: -1.60, reason: 'Even VCB weak during bear market conditions on Day +1' }
			],
			defensiveLeaders: [
				{ ticker: 'VRE', change: 6.88, reason: 'Exceptional real estate bounce on Day +1' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 2.32,
			averageSecuritiesReturn: 3.40
		},
		prePanicSignals: {
			t1: { date: '2022-04-22', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-04-15', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-04-08', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2022-05-09',
		vnindexChange: -4.70,
		vnindexClose: 1265.50,
		vnindexLow: 1265.50,
		intradayDrop: -4.70,
		bsi: -5.20,
		ssi: -5.80,
		rsi: -4.20,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Inflation shock - High inflation data, aggressive Fed policy expected, setting up for larger panic',
		tradingLesson: 'Classic 2022 recovery pattern. Securities led explosive recovery (+3.25%, SHS +6.60%) confirming consistency of Vietnamese patterns during inflation crisis.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'SHS', change: 6.60, reason: 'Recovery champion confirmed on Day +1' },
				{ ticker: 'HCM', change: 5.04, reason: 'Securities broad strength during inflation recovery' },
				{ ticker: 'VPB', change: 4.71, reason: 'Banking high-beta recovery participation' }
			],
			worstPerformers: [],
			defensiveLeaders: [
				{ ticker: 'VCB', change: 2.70, reason: 'VCB defensive premium maintained during recovery' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 1.89,
			averageSecuritiesReturn: 3.25
		},
		prePanicSignals: {
			t1: { date: '2022-05-06', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-04-29', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-04-22', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2022-04-25', daysBefore: 14, vnindexChange: -4.00, bsi: -4.20, ssi: -4.80, rsi: -4.00, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2022-05-12',
		vnindexChange: -3.10,
		vnindexClose: 1238.00,
		vnindexLow: 1238.00,
		intradayDrop: -3.10,
		bsi: -3.50,
		ssi: -4.10,
		rsi: -3.20,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Pre-panic weakness - Continued selling pressure, building pressure leading to major May 13 panic',
		tradingLesson: 'Pre-panic setup day showing building weakness before major panic. Classic escalation pattern building.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2022-05-11', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-05-03', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-04-26', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2022-05-09', daysBefore: 3, vnindexChange: -4.70, bsi: -5.20, ssi: -5.80, rsi: -4.20, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2022-05-13',
		vnindexChange: -4.53,
		vnindexClose: 1127.15,
		vnindexLow: 1127.15,
		intradayDrop: -4.53,
		bsi: -6.8,
		ssi: -7.2,
		rsi: -5.1,
		panicType: 'NEGATIVE_MEDIUM',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'STRONG_WARNING',
		context: 'Bear market/inflation panic - Perfect T-14 EARLY_WARNING → T-7 EARLY_WARNING → T-1 STRONG_WARNING escalation',
		tradingLesson: 'Classic escalation pattern: T-14 (EARLY_WARNING) → T-7 (EARLY_WARNING) → T-1 (STRONG_WARNING). Perfect prediction model validation case.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VCB', change: -4.2, reason: 'Quality banking showing relative defensive strength' },
				{ ticker: 'TCB', change: -4.8, reason: 'Banking sector resilience during bear market stress' }
			],
			worstPerformers: [
				{ ticker: 'SHS', change: -8.7, reason: 'Securities crashed hardest during inflation panic' },
				{ ticker: 'MBS', change: -8.1, reason: 'High-beta securities severe weakness' },
				{ ticker: 'VHM', change: -6.2, reason: 'Real estate broad weakness during bear conditions' }
			],
			defensiveLeaders: [
				{ ticker: 'VCB', change: -4.2, reason: 'Banking defensive outperformance vs -4.53% market' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 1.8,
			averageSecuritiesReturn: 4.2
		},
		prePanicSignals: {
			t1: { date: '2022-05-12', vnindexChange: -2.8, bsi: -3.2, ssi: -4.1, rsi: -3.5, signal: 'STRONG_WARNING' },
			t7: { date: '2022-05-04', vnindexChange: -1.9, bsi: -2.1, ssi: -2.8, rsi: -1.2, signal: 'EARLY_WARNING' },
			t14: { date: '2022-04-25', vnindexChange: -1.5, bsi: -1.8, ssi: -2.2, rsi: -1.1, signal: 'EARLY_WARNING' }
		},
		significantDrops: [
			{ date: '2022-05-12', daysBefore: 1, vnindexChange: -2.8, bsi: -3.2, ssi: -4.1, rsi: -3.5, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2022-06-13',
		vnindexChange: -4.50,
		vnindexClose: 1226.00,
		vnindexLow: 1226.00,
		intradayDrop: -4.50,
		bsi: -4.80,
		ssi: -5.20,
		rsi: -4.20,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Bear market continuation - Extended crisis pattern, different from bull market corrections',
		tradingLesson: 'Bear market extended crisis disrupted normal Vietnamese recovery patterns. Traditional recovery patterns failed - securities continued crashing even after banking stabilization attempt.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: 0.26, reason: 'Only bright spot showing quality defense during extended crisis' }
			],
			worstPerformers: [
				{ ticker: 'SSI', change: -6.19, reason: 'Securities continued crashing on Day +1 during bear market' },
				{ ticker: 'VCI', change: -5.75, reason: 'Securities crash continued despite banking stabilization attempt' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: 0.26, reason: 'Quality defense provided only stability during extended crisis' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 10,
			recoveryLeader: 'NO_RECOVERY',
			nextDayVnindexChange: 0.27
		},
		prePanicSignals: {
			t1: { date: '2022-06-10', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-06-03', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-05-27', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2022-05-13', daysBefore: 31, vnindexChange: -4.53, bsi: -6.8, ssi: -7.2, rsi: -5.1, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2022-09-26',
		vnindexChange: -3.50,
		vnindexClose: 1159.10,
		vnindexLow: 1159.10,
		intradayDrop: -3.50,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Late-stage bear market panic - Extended recovery periods characteristic of bear market',
		tradingLesson: 'Late bear market panic showing extended recovery periods and different characteristics from bull market corrections.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 5,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2022-09-23', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-09-16', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-09-09', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2022-10-07',
		vnindexChange: -4.70,
		vnindexClose: 1022.40,
		vnindexLow: 1022.40,
		intradayDrop: -4.70,
		bsi: -6.40,
		ssi: -6.80,
		rsi: -4.10,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'October crash - Global October crash, widespread selling, VIC showing incredible resilience',
		tradingLesson: 'Securities-only recovery pattern. VCI +6.94% demonstrated alternative recovery leadership when traditional banking leadership failed during bear market conditions.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VCI', change: 6.94, reason: 'Ultimate recovery champion on Day +1' },
				{ ticker: 'MBS', change: 6.03, reason: 'High-beta explosive bounce during securities recovery' },
				{ ticker: 'VIC', change: 0.3, reason: 'Incredible resilience during global crash' }
			],
			worstPerformers: [
				{ ticker: 'VCB', change: -6.6, reason: 'Heavy institutional selling during global crash' },
				{ ticker: 'SSI', change: -6.9, reason: 'Standard securities crash pattern' },
				{ ticker: 'SHS', change: -7.0, reason: 'Securities widespread weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: 0.3, reason: 'Defensive excellence during global October crash' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 0.63,
			averageSecuritiesReturn: 4.54
		},
		prePanicSignals: {
			t1: { date: '2022-10-06', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-09-29', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-09-22', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2022-10-21',
		vnindexChange: -3.30,
		vnindexClose: 1013.70,
		vnindexLow: 1013.70,
		intradayDrop: -3.30,
		bsi: null,
		ssi: null,
		rsi: null,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Continued October weakness - Continuation of October selling pressure, extended weakness',
		tradingLesson: 'Extended October crisis with multiple panic periods testing market resilience. Precursor to final crisis resolution.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: null
		},
		prePanicSignals: {
			t1: { date: '2022-10-20', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-10-13', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-10-06', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2022-10-07', daysBefore: 14, vnindexChange: -4.70, bsi: -6.40, ssi: -6.80, rsi: -4.10, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2022-10-24',
		vnindexChange: -3.60,
		vnindexClose: 986.15,
		vnindexLow: 986.15,
		intradayDrop: -3.60,
		bsi: -3.80,
		ssi: -4.20,
		rsi: -3.40,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'MULTIPLE_WEAKNESS_EVENTS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Third October panic - Crisis resolution, ending extended crisis period with VIC defensive excellence',
		tradingLesson: 'Crisis resolution recovery pattern. Classic Vietnamese patterns returned after extended October crisis - Banking → Securities → Real Estate sequence restored.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'CTG', change: 6.92, reason: 'Banking recovery champion on Day +1 after extended crisis' },
				{ ticker: 'HCM', change: 3.75, reason: 'Securities recovery strength following banking leadership' },
				{ ticker: 'VRE', change: 2.91, reason: 'Some F0 real estate recovery participation' }
			],
			worstPerformers: [
				{ ticker: 'VIC', change: -0.53, reason: 'VIC showed 2.77% defensive outperformance vs market -3.30%' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: -0.53, reason: 'Ultimate defensive excellence - 2.77% outperformance during crisis' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: 1.17,
			averageSecuritiesReturn: 0.97
		},
		prePanicSignals: {
			t1: { date: '2022-10-21', vnindexChange: -3.30, bsi: null, ssi: null, rsi: null, signal: 'EARLY_WARNING' },
			t7: { date: '2022-10-14', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-10-07', vnindexChange: -4.70, bsi: -6.40, ssi: -6.80, rsi: -4.10, signal: 'EARLY_WARNING' }
		},
		significantDrops: [
			{ date: '2022-10-07', daysBefore: 17, vnindexChange: -4.70, bsi: -6.40, ssi: -6.80, rsi: -4.10, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2022-11-04',
		vnindexChange: -3.60,
		vnindexClose: 974.60,
		vnindexLow: 974.60,
		intradayDrop: -3.60,
		bsi: -3.80,
		ssi: -4.20,
		rsi: -3.40,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'November selling - Continued bear market pressure, extended weakness period',
		tradingLesson: 'Extended bear market pattern. Only VCB/BID provided stability (±0.0%) while securities continued crashing (-7.51%). Recovery patterns require market recovery conditions.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VCB', change: 0.0, reason: 'Ultimate defensive anchor held during extended bear market' },
				{ ticker: 'BID', change: 0.0, reason: 'Defensive banking stability during continued weakness' }
			],
			worstPerformers: [
				{ ticker: 'SHS', change: -8.83, reason: 'Extreme securities selling during bear market' },
				{ ticker: 'MBS', change: -9.78, reason: 'High-beta securities severe weakness' },
				{ ticker: 'TCB', change: -6.80, reason: 'Secondary banking crashed during extended bear' }
			],
			defensiveLeaders: [
				{ ticker: 'VCB', change: 0.0, reason: 'Only stock providing true defensive stability' },
				{ ticker: 'BID', change: 0.0, reason: 'Banking defensive excellence during bear market grind' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 7,
			recoveryLeader: 'NO_RECOVERY',
			nextDayVnindexChange: -2.20
		},
		prePanicSignals: {
			t1: { date: '2022-11-03', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-10-27', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-10-20', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2022-11-10',
		vnindexChange: -4.30,
		vnindexClose: 935.80,
		vnindexLow: 935.80,
		intradayDrop: -4.30,
		bsi: -4.60,
		ssi: -5.20,
		rsi: -3.80,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		strongestWarning: 'EARLY_WARNING',
		context: 'Late year panic - Tax loss harvesting, VCB and VIC showing consistent defensive characteristics',
		tradingLesson: 'Banking recovery leadership validated. VCB/BID/CTG trinity delivered +3.7% synchronized recovery on Day +1, proving banking stabilization signal.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VCB', change: 3.71, reason: 'Classic big-3 banking recovery leader on Day +1' },
				{ ticker: 'BID', change: 3.73, reason: 'Banking trinity synchronized recovery' },
				{ ticker: 'CTG', change: 3.73, reason: 'Banking recovery leadership confirmed' },
				{ ticker: 'VIC', change: 2.45, reason: 'Real estate recovery leadership on Day +1' }
			],
			worstPerformers: [
				{ ticker: 'VCB', change: -1.4, reason: 'VCB showing extreme defensive strength during panic' },
				{ ticker: 'VIC', change: -0.4, reason: 'VIC defensive excellence during late year panic' },
				{ ticker: 'SSI', change: -6.7, reason: 'Securities standard crash pattern' },
				{ ticker: 'SHS', change: -8.1, reason: 'High-beta securities severe weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'VCB', change: -1.4, reason: 'Ultimate defensive strength vs -4.30% market' },
				{ ticker: 'VIC', change: -0.4, reason: 'Real estate defensive excellence' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'BANKING',
			nextDayVnindexChange: 0.77,
			averageSecuritiesReturn: -2.83
		},
		prePanicSignals: {
			t1: { date: '2022-11-09', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-11-02', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-10-26', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2022-11-04', daysBefore: 6, vnindexChange: -3.60, bsi: -3.80, ssi: -4.20, rsi: -3.40, signal: 'EARLY_WARNING' }
		]
	},
	{
		date: '2022-12-06',
		vnindexChange: -3.10,
		vnindexClose: 1048.70,
		vnindexLow: 1048.70,
		intradayDrop: -3.10,
		bsi: -3.30,
		ssi: -3.80,
		rsi: -2.90,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Year-end correction - Final bear market panic, year-end rebalancing with final selling pressure',
		tradingLesson: 'Sector rotation pattern during bear market ending. Market showed sector rotation signals rather than classic recovery patterns.',
		showcaseTickers: {
			bestPerformers: [],
			worstPerformers: [],
			defensiveLeaders: []
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'MIXED',
			nextDayVnindexChange: -0.73
		},
		prePanicSignals: {
			t1: { date: '2022-12-05', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2022-11-28', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2022-11-21', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},

	// 2023 Panic Days
	{
		date: '2023-08-18',
		vnindexChange: -4.50,
		vnindexClose: 1177.99,
		vnindexLow: 1177.74,
		intradayDrop: -4.52,
		bsi: -4.00,
		ssi: -7.09,
		rsi: -6.70,
		panicType: 'NEGATIVE_MEDIUM',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Economic growth concerns, global uncertainty - VCB ultimate safe haven masterclass',
		tradingLesson: 'VCB GAINED (+0.12%) during -4.50% panic = ultimate safe haven validation. Perfect recovery sequence: Banking → Securities → Real Estate with SHS +3.29% recovery leadership.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VCB', change: 0.12, reason: 'ULTIMATE SAFE HAVEN - gained during market panic' },
				{ ticker: 'SHS', change: 3.29, reason: 'Recovery champion on Day +1' },
				{ ticker: 'CTG', change: 4.26, reason: 'Banking recovery leader on Day +1' }
			],
			worstPerformers: [
				{ ticker: 'MBS', change: -10.0, reason: 'High-beta securities deep crash during panic' },
				{ ticker: 'SHS', change: -9.6, reason: 'Even recovery leaders crashed hard initially' },
				{ ticker: 'VIC', change: -7.0, reason: 'Real estate standard crash, no defensive premium' }
			],
			defensiveLeaders: [
				{ ticker: 'VCB', change: 0.12, reason: '+4.62% outperformance - unprecedented defensive excellence' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 0.15,
			averageSecuritiesReturn: 1.53
		},
		prePanicSignals: {
			t1: { date: '2023-08-17', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2023-08-10', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2023-08-03', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2023-10-26',
		vnindexChange: -4.19,
		vnindexClose: 1055.45,
		vnindexLow: 1049.71,
		intradayDrop: -4.72,
		bsi: -2.07,
		ssi: -7.35,
		rsi: -6.65,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'October selling pressure, seasonal patterns - BID ultimate defensive masterclass',
		tradingLesson: 'BID showed unprecedented stability (-0.47% during -4.19% panic). Perfect setup for securities recovery with VCI +4.70% leading instead of usual SHS pattern.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'BID', change: 3.56, reason: 'Ultimate recovery leader on Day +1' },
				{ ticker: 'VCI', change: 4.70, reason: 'Securities recovery champion (different leader than usual)' },
				{ ticker: 'SHS', change: 2.74, reason: 'Strong recovery but not leading this time' }
			],
			worstPerformers: [
				{ ticker: 'BID', change: -0.47, reason: 'Incredible stability during -4.19% panic' },
				{ ticker: 'VCB', change: -1.52, reason: 'Quality banking defensive outperformance' },
				{ ticker: 'SHS', change: -9.27, reason: 'Most oversold, setup for recovery leadership' },
				{ ticker: 'VHM', change: -6.22, reason: 'F0 panic selling continued on Day +1' }
			],
			defensiveLeaders: [
				{ ticker: 'BID', change: -0.47, reason: 'Ultimate defensive haven during seasonal panic' },
				{ ticker: 'VCB', change: -1.52, reason: '2.67% defensive outperformance vs market' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'SECURITIES',
			nextDayVnindexChange: 0.49,
			averageSecuritiesReturn: 2.97
		},
		prePanicSignals: {
			t1: { date: '2023-10-25', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t7: { date: '2023-10-18', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' },
			t14: { date: '2023-10-11', vnindexChange: 0, bsi: null, ssi: null, rsi: null, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},

	// 2024-2025 Panic Days
	{
		date: '2024-04-15',
		vnindexChange: -4.70,
		vnindexClose: 1151.62,
		vnindexLow: 1151.62,
		intradayDrop: -4.70,
		bsi: -5.2,
		ssi: -4.8,
		rsi: -4.1,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Quality defensive panic with positive signals before - Classic Black Swan event',
		tradingLesson: 'BLACK SWAN: All NO_WARNING signals before sudden -4.70% panic. Quality defensive stocks showed resilience with Real Estate best performance at -4.1%.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: -3.8, reason: 'Quality defensive excellence during black swan event' },
				{ ticker: 'VHM', change: -4.2, reason: 'Real estate showing relative strength' }
			],
			worstPerformers: [
				{ ticker: 'VCB', change: -5.5, reason: 'Even quality banking crashed during sudden panic' },
				{ ticker: 'TCB', change: -5.0, reason: 'Banking sector uniform weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: -3.8, reason: 'Real estate defensive leadership during black swan' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'REAL_ESTATE',
			nextDayVnindexChange: 2.1
		},
		prePanicSignals: {
			t1: { date: '2024-04-12', vnindexChange: 0.8, bsi: 1.2, ssi: 0.5, rsi: 1.1, signal: 'NO_WARNING' },
			t7: { date: '2024-04-05', vnindexChange: 1.2, bsi: 1.5, ssi: 0.8, rsi: 1.3, signal: 'NO_WARNING' },
			t14: { date: '2024-03-29', vnindexChange: 0.5, bsi: 0.8, ssi: 0.2, rsi: 0.7, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2025-04-03',
		vnindexChange: -6.68,
		vnindexClose: 1229.84,
		vnindexLow: 1229.41,
		intradayDrop: -6.71,
		bsi: -6.95,
		ssi: -7.67,
		rsi: -6.96,
		panicType: 'NEGATIVE_MEDIUM',
		strongestWarning: 'NO_WARNING',
		prePanicPattern: 'ISOLATED_SIGNALS',
		context: 'Major 2025 market stress, institutional selling wave',
		tradingLesson: 'Black swan event with no pre-warning signals. Real estate showed relative strength.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: -5.8, reason: 'Real estate defensive leadership during crisis' }
			],
			worstPerformers: [
				{ ticker: 'SSI', change: -8.1, reason: 'Securities crashed hardest during selling wave' },
				{ ticker: 'VCB', change: -7.2, reason: 'Banking broad weakness during institutional selling' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: -5.8, reason: 'Best defensive performance during black swan event' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 3,
			recoveryLeader: 'REAL_ESTATE',
			nextDayVnindexChange: -1.56,
			averageSecuritiesReturn: 8.5
		},
		prePanicSignals: {
			t1: { date: '2025-04-02', vnindexChange: -0.8, bsi: -1.2, ssi: -0.9, rsi: -1.1, signal: 'NO_WARNING' },
			t7: { date: '2025-03-25', vnindexChange: 0.5, bsi: 0.8, ssi: 0.2, rsi: 0.7, signal: 'NO_WARNING' },
			t14: { date: '2025-03-18', vnindexChange: 1.2, bsi: 1.5, ssi: 0.8, rsi: 1.3, signal: 'NO_WARNING' }
		},
		significantDrops: []
	},
	{
		date: '2025-04-08',
		vnindexChange: -6.43,
		vnindexClose: 1132.79,
		vnindexLow: 1130.98,
		intradayDrop: -6.58,
		bsi: -6.94,
		ssi: -7.68,
		rsi: -6.15,
		panicType: 'NEGATIVE_MEDIUM',
		strongestWarning: 'STRONG_WARNING',
		prePanicPattern: 'ESCALATING_TO_CRISIS',
		context: 'Crisis acceleration, extended selling wave after initial panic',
		tradingLesson: 'Perfect escalation pattern with T-1 STRONG_WARNING signal. VIC showed relative strength.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: -5.2, reason: 'Real estate continued defensive leadership' }
			],
			worstPerformers: [
				{ ticker: 'MBS', change: -8.5, reason: 'Securities extended weakness during crisis acceleration' },
				{ ticker: 'VCB', change: -7.3, reason: 'Banking continued broad weakness' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: -5.2, reason: 'Consistent defensive performance during extended crisis' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 2,
			recoveryLeader: 'REAL_ESTATE',
			nextDayVnindexChange: -3.40,
			averageSecuritiesReturn: 6.2
		},
		prePanicSignals: {
			t1: { date: '2025-04-07', vnindexChange: -2.1, bsi: -2.5, ssi: -3.2, rsi: -1.8, signal: 'STRONG_WARNING' },
			t7: { date: '2025-03-31', vnindexChange: -1.2, bsi: -1.8, ssi: -2.1, rsi: -0.9, signal: 'EARLY_WARNING' },
			t14: { date: '2025-03-24', vnindexChange: 0.2, bsi: 0.5, ssi: -0.1, rsi: 0.3, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2025-04-03', daysBefore: 5, vnindexChange: -6.68, bsi: -6.95, ssi: -7.67, rsi: -6.96, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2025-04-09',
		vnindexChange: -3.40,
		vnindexClose: 1094.30,
		vnindexLow: 1073.61,
		intradayDrop: -5.22,
		bsi: -4.15,
		ssi: -6.63,
		rsi: 2.39,
		panicType: 'UNCLEAR_PATTERN',
		strongestWarning: 'STRONG_WARNING',
		prePanicPattern: 'MULTIPLE_WEAKNESS_EVENTS',
		context: 'Third consecutive panic, crisis resolution beginning',
		tradingLesson: 'Real estate indicator turned positive (+2.39%) during panic, signaling recovery. VIC leadership established.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: 3.4, reason: 'Exceptional +3.4% gain during market panic - ultimate defensive excellence' },
				{ ticker: 'TCB', change: -2.1, reason: 'Banking showing relative strength vs market -3.40%' }
			],
			worstPerformers: [
				{ ticker: 'SHS', change: -7.8, reason: 'Securities lagged with severe weakness despite RSI recovery' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: 3.4, reason: 'Historical defensive masterclass - positive during third consecutive panic' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'REAL_ESTATE',
			nextDayVnindexChange: 4.85,
			averageSecuritiesReturn: 12.1
		},
		prePanicSignals: {
			t1: { date: '2025-04-08', vnindexChange: -6.43, bsi: -6.94, ssi: -7.68, rsi: -6.15, signal: 'STRONG_WARNING' },
			t7: { date: '2025-04-01', vnindexChange: -1.8, bsi: -2.2, ssi: -2.8, rsi: -1.5, signal: 'MODERATE_WARNING' },
			t14: { date: '2025-03-25', vnindexChange: 0.5, bsi: 0.8, ssi: 0.2, rsi: 0.7, signal: 'NO_WARNING' }
		},
		significantDrops: [
			{ date: '2025-04-03', daysBefore: 6, vnindexChange: -6.68, bsi: -6.95, ssi: -7.67, rsi: -6.96, signal: 'STRONG_WARNING' },
			{ date: '2025-04-08', daysBefore: 1, vnindexChange: -6.43, bsi: -6.94, ssi: -7.68, rsi: -6.15, signal: 'STRONG_WARNING' }
		]
	},
	{
		date: '2025-07-29',
		vnindexChange: -4.11,
		vnindexClose: 1278.45,
		vnindexLow: 1278.45,
		intradayDrop: -4.11,
		bsi: -4.8,
		ssi: -4.2,
		rsi: -3.9,
		panicType: 'UNCLEAR_PATTERN',
		prePanicPattern: 'ISOLATED_SIGNALS',
		strongestWarning: 'NO_WARNING',
		context: 'Summer correction with no pre-warning - Strong positive momentum before sudden drop',
		tradingLesson: 'BLACK SWAN: Summer correction with strong positive momentum before panic. Real Estate Indicator -3.9% best performance. Classic unpredictable external shock.',
		showcaseTickers: {
			bestPerformers: [
				{ ticker: 'VIC', change: -3.2, reason: 'Ultimate defensive performance during summer correction' },
				{ ticker: 'VHM', change: -3.8, reason: 'Real estate quality showing resilience' }
			],
			worstPerformers: [
				{ ticker: 'VCB', change: -5.1, reason: 'Banking crashed despite positive momentum' },
				{ ticker: 'SSI', change: -4.8, reason: 'Securities standard crash pattern' }
			],
			defensiveLeaders: [
				{ ticker: 'VIC', change: -3.2, reason: 'Real estate defensive excellence - best market performance' }
			]
		},
		recoveryPattern: {
			stabilizationDays: 1,
			recoveryLeader: 'REAL_ESTATE',
			nextDayVnindexChange: 1.9
		},
		prePanicSignals: {
			t1: { date: '2025-07-28', vnindexChange: 1.8, bsi: 2.1, ssi: 1.5, rsi: 1.9, signal: 'NO_WARNING' },
			t7: { date: '2025-07-18', vnindexChange: 2.1, bsi: 2.5, ssi: 1.8, rsi: 2.2, signal: 'NO_WARNING' },
			t14: { date: '2025-07-11', vnindexChange: 1.5, bsi: 1.8, ssi: 1.2, rsi: 1.6, signal: 'NO_WARNING' }
		},
		significantDrops: []
	}
];

/**
 * Get panic days filtered by year
 */
export function getPanicDaysByYear(year: number): PanicDayData[] {
	return PANIC_DAYS_DATABASE.filter(panic => 
		new Date(panic.date).getFullYear() === year
	);
}

/**
 * Get panic days with specific pre-panic pattern
 */
export function getPanicDaysByPattern(pattern: PatternType): PanicDayData[] {
	return PANIC_DAYS_DATABASE.filter(panic => panic.prePanicPattern === pattern);
}

/**
 * Get panic days with specific warning level
 */
export function getPanicDaysByWarning(warning: WarningLevel): PanicDayData[] {
	return PANIC_DAYS_DATABASE.filter(panic => panic.strongestWarning === warning);
}

/**
 * Get panic day by date
 */
export function getPanicDayByDate(date: string): PanicDayData | undefined {
	return PANIC_DAYS_DATABASE.find(panic => panic.date === date);
}

/**
 * Get showcase tickers for demonstrations
 * Returns tickers with significant performance for each panic classification
 */
export function getShowcaseTickers(): {
	positvePanic: string[];
	negativeExtreme: string[];
	blackSwans: string[];
	defensiveLeaders: string[];
} {
	return {
		positvePanic: ['VIC', 'SHS', 'TCB'], // From positive panic examples
		negativeExtreme: ['VCB'], // Ultimate defensive during extreme crises  
		blackSwans: ['VIC', 'VCB', 'VHM'], // Quality defensive during unpredictable events
		defensiveLeaders: ['VIC', 'VCB', 'TCB', 'VHM'] // Consistent defensive excellence
	};
}

/**
 * Summary statistics for dashboard displays
 */
export const PANIC_STATISTICS = {
	totalPanicDays: 41,
	byYear: {
		2018: 7,
		2020: 9, 
		2021: 6,
		2022: 12,
		2023: 2,
		2024: 1,
		2025: 4
	},
	predictionAccuracy: 0.561, // 56.1%
	patternDistribution: {
		ESCALATING_TO_CRISIS: 12, // 29.3%
		MULTIPLE_WEAKNESS_EVENTS: 7, // 17.1%
		SUSTAINED_DETERIORATION: 4, // 9.8%
		ISOLATED_SIGNALS: 18 // 43.9% - Black Swans
	},
	recoveryPatterns: {
		fastStabilization: 28, // 1-2 days
		slowStabilization: 15, // 3+ days
		extendedCrisis: 5 // No stabilization
	}
};