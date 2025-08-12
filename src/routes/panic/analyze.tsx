/**
 * Panic Analysis Detail Page
 * 
 * Detailed analysis page for specific panic events with URL parameters:
 * - /panic/analyze?date=YYYY-MM-DD - Analyze specific date
 * - Complete panic classification and pre-panic analysis
 * - Trading signals and historical context
 * - Pre-panic pattern development visualization
 */

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
	ArrowLeft,
	Calendar,
	TrendingDown,
	AlertTriangle,
	Target,
	BarChart3,
	Clock,
	Shield,
	ExternalLink
} from 'lucide-react';
import {
	PanicIndicatorCard,
	TradingSignalsCard
} from '@/components/panic';
import { 
	usePanicAnalysis, 
	usePrePanicAnalysis,
	getWarningLevelColor,
	getPanicTypeColor
} from '@/hooks/use-panic-analysis';
import { getPanicDayByDate } from '@/data/panic-days';
import type { WarningLevel } from '@/lib/panic-analyzer';

// Route schema with search params validation
export const Route = createFileRoute('/panic/analyze')({
	validateSearch: (search: Record<string, unknown>) => {
		return {
			date: (search.date as string) || new Date().toISOString().split('T')[0]
		};
	},
	component: PanicAnalyzeDetail,
});

interface PrePanicTimelineItemProps {
	timeframe: string;
	date: string;
	vnindexChange: number;
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	signal: WarningLevel;
}

function PrePanicTimelineItem({ 
	timeframe, 
	date, 
	vnindexChange, 
	bsi, 
	ssi, 
	rsi, 
	signal 
}: PrePanicTimelineItemProps) {
	const formatPercentage = (value: number | null) => 
		value === null ? 'N/A' : `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
	
	const formatDate = (dateStr: string) =>
		new Date(dateStr).toLocaleDateString('vi-VN');

	return (
		<div className="flex items-start gap-4 p-4 border-l-4 border-gray-200 relative">
			<div className="absolute -left-2 top-6 w-4 h-4 bg-white border-2 border-gray-300 rounded-full"></div>
			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-medium text-gray-900">{timeframe}</span>
						<Badge className={getWarningLevelColor(signal)} size="sm">
							{signal.replace('_', ' ')}
						</Badge>
					</div>
					<span className="text-sm text-gray-500">{formatDate(date)}</span>
				</div>
				
				<div className="grid grid-cols-4 gap-4 text-sm">
					<div>
						<span className="text-gray-500">VNINDEX:</span>
						<span className={`ml-1 font-medium ${
							vnindexChange > 0 ? 'text-green-600' : 
							vnindexChange < -2 ? 'text-red-600' : 'text-orange-600'
						}`}>
							{formatPercentage(vnindexChange)}
						</span>
					</div>
					<div>
						<span className="text-gray-500">BSI:</span>
						<span className={`ml-1 font-medium ${
							bsi === null ? 'text-gray-400' :
							bsi > 0 ? 'text-green-600' : 
							bsi < -2 ? 'text-red-600' : 'text-orange-600'
						}`}>
							{formatPercentage(bsi)}
						</span>
					</div>
					<div>
						<span className="text-gray-500">SSI:</span>
						<span className={`ml-1 font-medium ${
							ssi === null ? 'text-gray-400' :
							ssi > 0 ? 'text-green-600' : 
							ssi < -2 ? 'text-red-600' : 'text-orange-600'
						}`}>
							{formatPercentage(ssi)}
						</span>
					</div>
					<div>
						<span className="text-gray-500">RSI:</span>
						<span className={`ml-1 font-medium ${
							rsi === null ? 'text-gray-400' :
							rsi > 0 ? 'text-green-600' : 
							rsi < -2 ? 'text-red-600' : 'text-orange-600'
						}`}>
							{formatPercentage(rsi)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

function PanicAnalyzeDetail() {
	const { date } = Route.useSearch();
	const [selectedTab, setSelectedTab] = useState('analysis');
	
	// Get panic analysis for the specified date
	const { data: panicAnalysis, isLoading: panicLoading, error: panicError } = usePanicAnalysis(date);
	const { data: prePanicAnalysis, isLoading: prePanicLoading, error: prePanicError } = usePrePanicAnalysis(date);
	
	// Check if this is a pre-calculated panic day
	const precalculatedData = getPanicDayByDate(date);
	
	const isLoading = panicLoading || prePanicLoading;
	const error = panicError || prePanicError;

	// Format date for display
	const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
						<p className="mt-4 text-gray-600">Analyzing market data for {formattedDate}...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !panicAnalysis) {
		return (
			<div className="container mx-auto p-6">
				<Alert className="max-w-lg mx-auto">
					<AlertTriangle className="h-4 w-4" />
					<AlertDescription>
						Unable to load analysis for {formattedDate}. The date may be invalid or market data may not be available.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button 
						variant="ghost" 
						size="sm"
						onClick={() => window.history.back()}
						className="flex items-center gap-2"
					>
						<ArrowLeft className="h-4 w-4" />
						Back
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
							<TrendingDown className="h-6 w-6 text-red-600" />
							Panic Analysis
						</h1>
						<p className="text-gray-600 flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							{formattedDate}
						</p>
					</div>
				</div>
				
				{precalculatedData && (
					<Badge variant="outline" className="text-sm">
						Historical Event
					</Badge>
				)}
			</div>

			{/* Main Analysis Overview */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Panic Indicators */}
				<div className="lg:col-span-2">
					<PanicIndicatorCard
						date={panicAnalysis.date}
						vnindexChange={panicAnalysis.vnindexChange}
						bsi={panicAnalysis.bsi}
						ssi={panicAnalysis.ssi}
						rsi={panicAnalysis.rsi}
						panicType={panicAnalysis.panicType}
						warningLevel={prePanicAnalysis?.strongestWarning}
						showDetails={true}
					/>
				</div>

				{/* Quick Stats */}
				<div className="space-y-4">
					{/* Classification Summary */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-lg">Classification</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<div className="text-sm text-gray-600 mb-1">Panic Type</div>
								<Badge className={getPanicTypeColor(panicAnalysis.panicType)}>
									{panicAnalysis.panicType.replace('_', ' ')}
								</Badge>
							</div>
							{prePanicAnalysis && (
								<div>
									<div className="text-sm text-gray-600 mb-1">Warning Level</div>
									<Badge className={getWarningLevelColor(prePanicAnalysis.strongestWarning)}>
										{prePanicAnalysis.strongestWarning.replace('_', ' ')}
									</Badge>
								</div>
							)}
							{prePanicAnalysis && (
								<div>
									<div className="text-sm text-gray-600 mb-1">Pattern Type</div>
									<Badge variant="outline">
										{prePanicAnalysis.patternType.replace('_', ' ')}
									</Badge>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Historical Context */}
					{precalculatedData && (
						<Card>
							<CardHeader className="pb-3">
								<CardTitle className="text-lg flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Recovery
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2 text-sm">
								<div>
									<span className="text-gray-600">Stabilization:</span>
									<span className="ml-2 font-medium">
										{precalculatedData.recoveryPattern.stabilizationDays} days
									</span>
								</div>
								<div>
									<span className="text-gray-600">Recovery Leader:</span>
									<span className="ml-2 font-medium">
										{precalculatedData.recoveryPattern.recoveryLeader.replace('_', ' ')}
									</span>
								</div>
								{precalculatedData.recoveryPattern.nextDayVnindexChange && (
									<div>
										<span className="text-gray-600">Next Day:</span>
										<span className={`ml-2 font-medium ${
											precalculatedData.recoveryPattern.nextDayVnindexChange > 0 
												? 'text-green-600' 
												: 'text-red-600'
										}`}>
											{precalculatedData.recoveryPattern.nextDayVnindexChange >= 0 ? '+' : ''}
											{precalculatedData.recoveryPattern.nextDayVnindexChange.toFixed(2)}%
										</span>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Detailed Analysis Tabs */}
			<Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="analysis" className="flex items-center gap-2">
						<BarChart3 className="h-4 w-4" />
						Analysis
					</TabsTrigger>
					<TabsTrigger value="signals" className="flex items-center gap-2">
						<Target className="h-4 w-4" />
						Trading Signals
					</TabsTrigger>
					<TabsTrigger value="prepanic" className="flex items-center gap-2">
						<AlertTriangle className="h-4 w-4" />
						Pre-Panic
					</TabsTrigger>
					<TabsTrigger value="context" className="flex items-center gap-2">
						<Shield className="h-4 w-4" />
						Context
					</TabsTrigger>
				</TabsList>

				{/* Analysis Tab */}
				<TabsContent value="analysis" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Sector Breakdown */}
						<Card>
							<CardHeader>
								<CardTitle>Sector Performance Breakdown</CardTitle>
								<CardDescription>Individual sector indicator analysis</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex justify-between items-center p-3 border rounded">
										<div>
											<div className="font-medium">Banking Sector Indicator (BSI)</div>
											<div className="text-sm text-gray-600">
												VCB, BID, TCB, CTG, VPB - Market cap weighted
											</div>
										</div>
										<div className={`text-xl font-bold ${
											panicAnalysis.bsi === null ? 'text-gray-400' :
											panicAnalysis.bsi > 0 ? 'text-green-600' :
											panicAnalysis.bsi < -3 ? 'text-red-600' : 'text-orange-600'
										}`}>
											{panicAnalysis.bsi === null ? 'N/A' : 
											 `${panicAnalysis.bsi >= 0 ? '+' : ''}${panicAnalysis.bsi.toFixed(2)}%`}
										</div>
									</div>

									<div className="flex justify-between items-center p-3 border rounded">
										<div>
											<div className="font-medium">Securities Sector Indicator (SSI)</div>
											<div className="text-sm text-gray-600">
												SSI, VCI, HCM, MBS, SHS - Market cap weighted
											</div>
										</div>
										<div className={`text-xl font-bold ${
											panicAnalysis.ssi === null ? 'text-gray-400' :
											panicAnalysis.ssi > 0 ? 'text-green-600' :
											panicAnalysis.ssi < -3 ? 'text-red-600' : 'text-orange-600'
										}`}>
											{panicAnalysis.ssi === null ? 'N/A' : 
											 `${panicAnalysis.ssi >= 0 ? '+' : ''}${panicAnalysis.ssi.toFixed(2)}%`}
										</div>
									</div>

									<div className="flex justify-between items-center p-3 border rounded">
										<div>
											<div className="font-medium">Real Estate Sector Indicator (RSI)</div>
											<div className="text-sm text-gray-600">
												VIC, VHM, VRE, KDH, NVL - Market cap weighted
											</div>
										</div>
										<div className={`text-xl font-bold ${
											panicAnalysis.rsi === null ? 'text-gray-400' :
											panicAnalysis.rsi > 0 ? 'text-green-600' :
											panicAnalysis.rsi < -3 ? 'text-red-600' : 'text-orange-600'
										}`}>
											{panicAnalysis.rsi === null ? 'N/A' : 
											 `${panicAnalysis.rsi >= 0 ? '+' : ''}${panicAnalysis.rsi.toFixed(2)}%`}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Pattern Recognition */}
						<Card>
							<CardHeader>
								<CardTitle>Pattern Analysis</CardTitle>
								<CardDescription>Vietnamese market pattern classification</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="p-4 bg-gray-50 rounded">
									<div className="font-medium mb-2">Classification Logic:</div>
									<div className="text-sm text-gray-700 space-y-1">
										{panicAnalysis.panicType === 'POSITIVE_PANIC' && (
											<>
												<div>&check; Banking stable (BSI &gt; -2%)</div>
												<div>&check; Securities oversold (SSI &lt; -3%)</div>
												<div>&check; Real estate oversold (RSI &lt; -4%)</div>
												<div className="font-medium text-green-600 mt-2">
													&rarr; BUY OPPORTUNITY: Banking stability enables recovery
												</div>
											</>
										)}
										{panicAnalysis.panicType === 'NEGATIVE_EXTREME' && (
											<>
												<div>&bull; Banking deep red (BSI &lt; -5%)</div>
												<div>&bull; Securities crashed (SSI &lt; -7%)</div>
												<div>&bull; Real estate crashed (RSI &lt; -8%)</div>
												<div className="font-medium text-red-600 mt-2">
													&rarr; DEFENSIVE ONLY: All sectors in distress
												</div>
											</>
										)}
										{panicAnalysis.panicType === 'NEGATIVE_MEDIUM' && (
											<>
												<div>&bull; Banking weakness (BSI &lt; -3%)</div>
												<div>&bull; Securities weakness (SSI &lt; -5%)</div>
												<div>&bull; Real estate weakness (RSI &lt; -6%)</div>
												<div className="font-medium text-orange-600 mt-2">
													&rarr; REDUCE EXPOSURE: Cross-sector weakness
												</div>
											</>
										)}
										{panicAnalysis.panicType === 'UNCLEAR_PATTERN' && (
											<>
												<div>&bull; Mixed sector signals</div>
												<div>&bull; No clear pattern dominance</div>
												<div className="font-medium text-purple-600 mt-2">
													&rarr; SELECTIVE POSITIONING: Monitor for clarity
												</div>
											</>
										)}
										{panicAnalysis.panicType === 'NO_PANIC' && (
											<>
												<div>&bull; VNINDEX change &lt; 3%</div>
												<div>&bull; Normal market conditions</div>
												<div className="font-medium text-gray-600 mt-2">
													&rarr; STANDARD STRATEGIES: Normal allocation
												</div>
											</>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				{/* Trading Signals Tab */}
				<TabsContent value="signals" className="space-y-4">
					<TradingSignalsCard
						panicType={panicAnalysis.panicType}
						tradingSignals={panicAnalysis.tradingSignals}
						showcaseTickers={precalculatedData?.showcaseTickers}
						showHistoricalContext={!!precalculatedData}
					/>
				</TabsContent>

				{/* Pre-Panic Analysis Tab */}
				<TabsContent value="prepanic" className="space-y-6">
					{prePanicAnalysis ? (
						<div className="space-y-6">
							{/* Trading Advice */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<AlertTriangle className="h-5 w-5 text-orange-500" />
										Pre-Panic Trading Advice
									</CardTitle>
									<CardDescription>
										Risk management recommendations based on pre-panic signals
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<Alert className={`${
										prePanicAnalysis.strongestWarning === 'STRONG_WARNING' ? 'border-red-200 bg-red-50' :
										prePanicAnalysis.strongestWarning === 'MODERATE_WARNING' ? 'border-orange-200 bg-orange-50' :
										'border-blue-200 bg-blue-50'
									}`}>
										<AlertTriangle className="h-4 w-4" />
										<AlertDescription className="space-y-2">
											<div className="font-medium">{prePanicAnalysis.tradingAdvice.action}</div>
											<div className="text-sm">
												<strong>Risk Level:</strong> {prePanicAnalysis.tradingAdvice.riskLevel}
											</div>
										</AlertDescription>
									</Alert>

									<div className="grid grid-cols-2 gap-4 text-sm">
										<div>
											<span className="font-medium text-gray-700">Position Size:</span>
											<div className="text-gray-600">{prePanicAnalysis.tradingAdvice.positionSize}</div>
										</div>
										<div>
											<span className="font-medium text-gray-700">Defensive Stocks:</span>
											<div className="text-gray-600">{prePanicAnalysis.tradingAdvice.defensiveStocks}</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Pre-Panic Timeline */}
							<Card>
								<CardHeader>
									<CardTitle>Pre-Panic Signal Timeline</CardTitle>
									<CardDescription>
										T-1, T-7, T-14 analysis showing pattern development
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-0">
										{Object.entries(prePanicAnalysis.prePanicSignals)
											.reverse() // Show T-14 first, T-1 last
											.map(([timeframe, signalData]) => (
											<PrePanicTimelineItem
												key={timeframe}
												timeframe={timeframe}
												date={signalData.date}
												vnindexChange={signalData.vnindexChange}
												bsi={signalData.bsi}
												ssi={signalData.ssi}
												rsi={signalData.rsi}
												signal={signalData.signal}
											/>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Significant Drops */}
							{prePanicAnalysis.significantDrops.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>14-Day Comprehensive Scan</CardTitle>
										<CardDescription>
											Significant drops (≥2%) detected in 14-day pre-panic period
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{prePanicAnalysis.significantDrops.map((drop, index) => (
												<div key={index} className="p-3 border rounded bg-yellow-50">
													<div className="flex justify-between items-start mb-2">
														<div>
															<span className="font-medium">T-{drop.daysBefore}</span>
															<span className="text-gray-600 ml-2">
																({new Date(drop.date).toLocaleDateString('vi-VN')})
															</span>
														</div>
														<Badge className={getWarningLevelColor(drop.signal)} size="sm">
															{drop.signal.replace('_', ' ')}
														</Badge>
													</div>
													<div className="text-lg font-bold text-red-600 mb-1">
														VNINDEX: {drop.vnindexChange >= 0 ? '+' : ''}{drop.vnindexChange.toFixed(2)}%
													</div>
													<div className="text-sm text-gray-600">
														Additional weakness signal detected during pre-panic scanning
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							)}
						</div>
					) : (
						<Alert>
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>
								Pre-panic analysis not available for this date. This may be a current market analysis or insufficient historical data.
							</AlertDescription>
						</Alert>
					)}
				</TabsContent>

				{/* Historical Context Tab */}
				<TabsContent value="context" className="space-y-4">
					{precalculatedData ? (
						<div className="space-y-6">
							{/* Historical Context */}
							<Card>
								<CardHeader>
									<CardTitle>Historical Context</CardTitle>
									<CardDescription>Market conditions and external factors</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div>
											<div className="font-medium text-gray-700 mb-2">Market Context:</div>
											<div className="text-gray-600 p-3 bg-gray-50 rounded">
												{precalculatedData.context}
											</div>
										</div>
										<div>
											<div className="font-medium text-gray-700 mb-2">Trading Lesson:</div>
											<div className="text-gray-600 p-3 bg-blue-50 rounded">
												{precalculatedData.tradingLesson}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Recovery Pattern */}
							<Card>
								<CardHeader>
									<CardTitle>Recovery Analysis</CardTitle>
									<CardDescription>Post-panic stabilization and recovery patterns</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div className="text-center p-4 border rounded">
											<div className="text-2xl font-bold text-blue-600">
												{precalculatedData.recoveryPattern.stabilizationDays}
											</div>
											<div className="text-sm text-gray-600">Days to Stabilize</div>
										</div>
										<div className="text-center p-4 border rounded">
											<div className="text-lg font-bold text-green-600">
												{precalculatedData.recoveryPattern.recoveryLeader.replace('_', ' ')}
											</div>
											<div className="text-sm text-gray-600">Recovery Leader</div>
										</div>
										<div className="text-center p-4 border rounded">
											<div className={`text-2xl font-bold ${
												precalculatedData.recoveryPattern.nextDayVnindexChange && 
												precalculatedData.recoveryPattern.nextDayVnindexChange > 0 
													? 'text-green-600' 
													: 'text-red-600'
											}`}>
												{precalculatedData.recoveryPattern.nextDayVnindexChange 
													? `${precalculatedData.recoveryPattern.nextDayVnindexChange >= 0 ? '+' : ''}${precalculatedData.recoveryPattern.nextDayVnindexChange.toFixed(2)}%`
													: 'N/A'
												}
											</div>
											<div className="text-sm text-gray-600">Next Day Performance</div>
										</div>
									</div>

									{precalculatedData.recoveryPattern.averageSecuritiesReturn && (
										<div className="p-4 bg-green-50 rounded">
											<div className="font-medium text-green-700">Securities Recovery Performance</div>
											<div className="text-2xl font-bold text-green-600 mt-1">
												+{precalculatedData.recoveryPattern.averageSecuritiesReturn.toFixed(2)}%
											</div>
											<div className="text-sm text-gray-600">Average securities sector recovery</div>
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					) : (
						<Alert>
							<Shield className="h-4 w-4" />
							<AlertDescription>
								This is a current market analysis. Historical context and recovery patterns are only available for verified panic events in our database.
							</AlertDescription>
						</Alert>
					)}
				</TabsContent>
			</Tabs>

			{/* Action Buttons */}
			<Card>
				<CardContent className="py-4">
					<div className="flex flex-wrap gap-3">
						<Button 
							variant="outline"
							onClick={() => window.location.href = '/panic'}
							className="flex items-center gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Panic Overview
						</Button>
						{precalculatedData && (
							<Button 
								variant="outline"
								onClick={() => {
									// Navigate to next panic day
									import('@/data/panic-days').then(({ PANIC_DAYS_DATABASE }) => {
										const currentIndex = PANIC_DAYS_DATABASE.findIndex(
											(p: any) => p.date === date
										);
										if (currentIndex < PANIC_DAYS_DATABASE.length - 1) {
											const nextPanic = PANIC_DAYS_DATABASE[currentIndex + 1];
											window.location.href = `/panic/analyze?date=${nextPanic.date}`;
										}
									});
								}}
								className="flex items-center gap-2"
							>
								<ExternalLink className="h-4 w-4" />
								Next Panic Event
							</Button>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}