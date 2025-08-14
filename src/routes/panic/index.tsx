/**
 * Panic Analysis Index Page
 * 
 * Main panic analysis dashboard showing:
 * - Current pre-panic warning status
 * - Historical panic days with filtering
 * - Pattern analysis and statistics
 * - Navigation to detailed analysis
 */

import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
	TrendingDown, 
	AlertTriangle, 
	BarChart3, 
	Calendar,
	Target,
	Shield,
	Eye,
	ExternalLink,
	BookOpen
} from 'lucide-react';
import { 
	PrePanicWarningWidget, 
	PanicDayTable 
} from '@/components/panic';
import { 
	usePanicStatistics, 
	usePanicDayFilters
} from '@/hooks/use-panic-analysis';
import { panicAnalyzer } from '@/lib/panic-analyzer';
import { useTranslation } from '@/hooks/useTranslation';
import { 
	PANIC_DAYS_DATABASE, 
	getPanicDaysByPattern, 
	getPanicDaysByWarning,
	PANIC_STATISTICS,
	type PanicDayData 
} from '@/data/panic-days';
import type { WarningLevel, PatternType } from '@/lib/panic-analyzer';

export const Route = createFileRoute('/panic/')({
	component: PanicIndexPage,
});

function PanicIndexPage() {
	const { t } = useTranslation();
	const [selectedTab, setSelectedTab] = useState('overview');
	const [selectedYear] = useState<number | undefined>(undefined);
	const { isLoading: statsLoading } = usePanicStatistics();

	// Get filtered panic days based on current selection
	const { data: filteredData } = usePanicDayFilters({
		year: selectedYear
	});

	// Separate predictable vs black swan events
	const predictablePanics = PANIC_DAYS_DATABASE.filter(
		panic => panic.strongestWarning !== 'NO_WARNING' && panic.strongestWarning !== 'INSUFFICIENT_DATA'
	);
	
	const blackSwanPanics = PANIC_DAYS_DATABASE.filter(
		panic => panic.strongestWarning === 'NO_WARNING' || panic.strongestWarning === 'INSUFFICIENT_DATA'
	);

	const handleViewDetails = (panicDay: PanicDayData) => {
		// Navigate to detailed analysis page
		window.location.href = `/panic/analyze?date=${panicDay.date}`;
	};

	if (statsLoading) {
		return (
			<div className="container mx-auto p-3 sm:p-6">
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
			{/* Page Header */}
			<div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
				<div className="space-y-2">
					<h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
						<TrendingDown className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
						<span className="leading-tight">{t('panic.title')}</span>
					</h1>
					<p className="text-sm md:text-base text-gray-600">
						{t('panic.subtitle')}
					</p>
				</div>
				<div className="flex justify-start md:justify-end">
					<Badge variant="outline" className="text-sm md:text-lg px-3 py-1 md:px-4 md:py-2">
						{PANIC_STATISTICS.totalPanicDays} {t('panic.historicalEvents')}
					</Badge>
				</div>
			</div>

			{/* Current Warning Status */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
				<div className="lg:col-span-2">
					<PrePanicWarningWidget 
						showTradingAdvice={true}
						compact={true}
						onViewDetails={async () => {
							// Navigate to analysis of most recent available date
							const mostRecentDate = await panicAnalyzer.getMostRecentDate();
							if (mostRecentDate) {
								window.location.href = `/panic/analyze?date=${mostRecentDate}`;
							} else {
								console.error('No recent date available - system should wait for GitHub data');
								// Don't navigate if no data available
							}
						}}
					/>
				</div>
				<div className="space-y-3 md:space-y-4">
					<Card>
						<CardHeader className="pb-2 md:pb-3">
							<CardTitle className="text-base md:text-lg flex items-center gap-2">
								<BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
								{t('panic.systemPerformance')}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 md:space-y-3">
							<div>
								<div className="flex justify-between text-sm">
									<span>{t('panic.predictionAccuracy')}</span>
									<span className="font-bold text-green-600">
										{(PANIC_STATISTICS.predictionAccuracy * 100).toFixed(1)}%
									</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2 mt-1">
									<div 
										className="bg-green-600 h-2 rounded-full" 
										style={{ width: `${PANIC_STATISTICS.predictionAccuracy * 100}%` }}
									/>
								</div>
							</div>
							<div className="text-xs text-gray-600">
								{predictablePanics.length} {t('common.of')} {PANIC_STATISTICS.totalPanicDays} {t('panic.panicEventsPredicted')}
							</div>
							<div className="text-xs text-gray-600">
								{blackSwanPanics.length} {t('panic.blackSwanEvents')}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Historical Analysis Tabs */}
			<Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
					<TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<Eye className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">{t('panic.overview')}</span>
					</TabsTrigger>
					<TabsTrigger value="predictable" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">{t('panic.predictable')} ({predictablePanics.length})</span>
					</TabsTrigger>
					<TabsTrigger value="blackswan" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<Shield className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">{t('panic.blackSwan')} ({blackSwanPanics.length})</span>
					</TabsTrigger>
					<TabsTrigger value="patterns" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<Target className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">{t('panic.patterns')}</span>
					</TabsTrigger>
				</TabsList>

				{/* Overview Tab */}
				<TabsContent value="overview" className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Yearly Statistics */}
						{Object.entries(PANIC_STATISTICS.byYear).map(([year, count]) => (
							<Card key={year} className="cursor-pointer hover:shadow-md transition-shadow">
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-2xl font-bold">{count}</div>
											<div className="text-sm text-gray-600">{year} {t('panic.yearlyEvents')}</div>
										</div>
										<Calendar className="h-8 w-8 text-blue-500" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Educational Card for Overview */}
					<Card className="border-blue-200 bg-blue-50">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-blue-900">
								<BookOpen className="h-5 w-5" />
								{t('panic.educationalGuide')}
							</CardTitle>
							<CardDescription className="text-blue-700">
								{t('panic.understandVietnameseMarket')}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium text-blue-900 mb-2">{t('panic.whatIsPanicAnalysis')}</h4>
										<p className="text-sm text-blue-700">{t('panic.panicAnalysisDescription')}</p>
									</div>
									<div>
										<h4 className="font-medium text-blue-900 mb-2">{t('panic.keyConcepts')}</h4>
										<ul className="text-sm text-blue-700 space-y-1">
											<li>• {t('panic.threePhaseSystem')}: {t('panic.threePhaseDescription')}</li>
											<li>• {t('panic.sectorIndicators')}: {t('panic.sectorIndicatorsDescription')}</li>
											<li>• {t('panic.warningSystem')}: {t('panic.warningSystemDescription')}</li>
											<li>• {t('panic.dataVerification')}: {t('panic.dataVerificationDescription')}</li>
										</ul>
									</div>
								</div>
								<Button 
									variant="outline" 
									className="w-full bg-white text-blue-700 border-blue-300 hover:bg-blue-100"
									onClick={() => window.open('https://github.com/quanhua92/aipriceaction-ui/blob/main/PANIC_ANALYSIS_GUIDE.md', '_blank')}
								>
									<ExternalLink className="h-4 w-4 mr-2" />
									{t('panic.readFullGuide')}
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* All Historical Events */}
					<PanicDayTable
						panicDays={filteredData?.filteredPanics || PANIC_DAYS_DATABASE}
						title={t('panic.allHistoricalEvents')}
						description={t('panic.completeDatabase')}
						showFilters={true}
						onViewDetails={handleViewDetails}
						maxHeight="500px"
					/>
				</TabsContent>

				{/* Predictable Events Tab */}
				<TabsContent value="predictable" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertTriangle className="h-5 w-5 text-orange-500" />
								{t('panic.predictablePanicEvents')} ({predictablePanics.length})
							</CardTitle>
							<CardDescription>
								{t('panic.advanceWarningSignals')}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="text-center p-4 bg-red-50 rounded">
									<div className="text-2xl font-bold text-red-600">
										{getPanicDaysByWarning('STRONG_WARNING' as WarningLevel).length}
									</div>
									<div className="text-sm text-red-700">{t('panic.strongWarning')}</div>
									<div className="text-xs text-gray-600">1-3 {t('panic.advanceNotice')}</div>
								</div>
								<div className="text-center p-4 bg-orange-50 rounded">
									<div className="text-2xl font-bold text-orange-600">
										{getPanicDaysByWarning('EARLY_WARNING' as WarningLevel).length}
									</div>
									<div className="text-sm text-orange-700">{t('panic.earlyWarning')}</div>
									<div className="text-xs text-gray-600">1-14 {t('panic.dayMonitoring')}</div>
								</div>
								<div className="text-center p-4 bg-yellow-50 rounded">
									<div className="text-2xl font-bold text-yellow-600">
										{getPanicDaysByWarning('MODERATE_WARNING' as WarningLevel).length}
									</div>
									<div className="text-sm text-yellow-700">{t('panic.moderateWarning')}</div>
									<div className="text-xs text-gray-600">{t('panic.sectorDivergence')}</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<PanicDayTable
						panicDays={predictablePanics}
						title={t('panic.predictablePanicEvents')}
						description={t('panic.advanceWarningSignals')}
						onViewDetails={handleViewDetails}
						maxHeight="400px"
					/>
				</TabsContent>

				{/* Black Swan Events Tab */}
				<TabsContent value="blackswan" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5 text-gray-500" />
								{t('panic.blackSwanPanicEvents')} ({blackSwanPanics.length})
							</CardTitle>
							<CardDescription>
								{t('panic.unpredictablePanicEvents')}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="bg-gray-50 p-4 rounded mb-4">
								<div className="text-sm text-gray-700 space-y-2">
									<div className="font-medium">{t('panic.commonCharacteristics')}</div>
									<ul className="text-xs space-y-1 ml-4">
										<li>• {t('panic.noWarningSignals')}</li>
										<li>• {t('panic.suddenExternalShocks')}</li>
										<li>• {t('panic.healthySectorIndicators')}</li>
										<li>• {t('panic.cannotBePredicted')}</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<PanicDayTable
						panicDays={blackSwanPanics}
						title={t('panic.blackSwanEvents')}
						description={t('panic.unpredictablePanicEvents')}
						onViewDetails={handleViewDetails}
						maxHeight="400px"
					/>
				</TabsContent>

				{/* Pattern Analysis Tab */}
				<TabsContent value="patterns" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Pattern Distribution */}
						<Card>
							<CardHeader>
								<CardTitle>{t('panic.prePanicPatternDistribution')}</CardTitle>
								<CardDescription>
									{t('panic.warningSignalDevelopment')}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{Object.entries(PANIC_STATISTICS.patternDistribution).map(([pattern, count]) => {
									const percentage = (count / PANIC_STATISTICS.totalPanicDays * 100).toFixed(1);
									return (
										<div key={pattern} className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="font-medium">
													{t(`panic.patternTypes.${pattern}`)}
												</span>
												<span>{count} {t('panic.events')} ({percentage}%)</span>
											</div>
											<div className="w-full bg-gray-200 rounded-full h-2">
												<div 
													className="bg-blue-600 h-2 rounded-full" 
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									);
								})}
							</CardContent>
						</Card>

						{/* Recovery Patterns */}
						<Card>
							<CardHeader>
								<CardTitle>{t('panic.recoveryPatternAnalysis')}</CardTitle>
								<CardDescription>
									{t('panic.stabilizationRecovery')}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>{t('panic.fastStabilization')}</span>
										<span className="text-green-600">{PANIC_STATISTICS.recoveryPatterns.fastStabilization} {t('panic.events')}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>{t('panic.slowStabilization')}</span>
										<span className="text-orange-600">{PANIC_STATISTICS.recoveryPatterns.slowStabilization} {t('panic.events')}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>{t('panic.extendedCrisis')}</span>
										<span className="text-red-600">{PANIC_STATISTICS.recoveryPatterns.extendedCrisis} {t('panic.events')}</span>
									</div>
								</div>
								<div className="text-xs text-gray-600 mt-4">
									{t('panic.fastStabilizationNote')}
									{t('panic.slowStabilizationNote')}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Pattern Examples */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Escalating to Crisis Examples */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">{t('panic.escalatingToCrisisPattern')}</CardTitle>
								<CardDescription>{t('panic.highestPredictionAccuracy')}</CardDescription>
							</CardHeader>
							<CardContent>
								<PanicDayTable
									panicDays={getPanicDaysByPattern('ESCALATING_TO_CRISIS' as PatternType).slice(0, 5)}
									title=""
									description=""
									onViewDetails={handleViewDetails}
									maxHeight="300px"
								/>
							</CardContent>
						</Card>

						{/* Multiple Weakness Events */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">{t('panic.multipleWeaknessEvents')}</CardTitle>
								<CardDescription>{t('panic.extendedDeteriorationPattern')}</CardDescription>
							</CardHeader>
							<CardContent>
								<PanicDayTable
									panicDays={getPanicDaysByPattern('MULTIPLE_WEAKNESS_EVENTS' as PatternType).slice(0, 5)}
									title=""
									description=""
									onViewDetails={handleViewDetails}
									maxHeight="300px"
								/>
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						{t('panic.quickActions')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						<Button 
							variant="outline" 
							onClick={async () => {
								const mostRecentDate = await panicAnalyzer.getMostRecentDate();
								if (mostRecentDate) {
									window.location.href = `/panic/analyze?date=${mostRecentDate}`;
								} else {
									console.error('No recent date available - system should wait for GitHub data');
									// Don't navigate if no data available
								}
							}}
							className="flex items-center gap-2"
						>
							<ExternalLink className="h-4 w-4" />
							{t('panic.analyzeCurrentMarket')}
						</Button>
						<Button 
							variant="outline"
							onClick={() => {
								// Navigate to most recent panic for analysis
								const recentPanic = PANIC_DAYS_DATABASE[PANIC_DAYS_DATABASE.length - 1];
								window.location.href = `/panic/analyze?date=${recentPanic.date}`;
							}}
							className="flex items-center gap-2"
						>
							<Calendar className="h-4 w-4" />
							{t('panic.latestPanicAnalysis')}
						</Button>
						<Button 
							variant="outline"
							onClick={() => {
								// Navigate to strongest warning example
								const strongWarning = getPanicDaysByWarning('STRONG_WARNING' as WarningLevel)[0];
								if (strongWarning) {
									window.location.href = `/panic/analyze?date=${strongWarning.date}`;
								}
							}}
							className="flex items-center gap-2"
						>
							<AlertTriangle className="h-4 w-4" />
							{t('panic.strongWarningExample')}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}