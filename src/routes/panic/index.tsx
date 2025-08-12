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
	ExternalLink
} from 'lucide-react';
import { 
	PrePanicWarningWidget, 
	PanicDayTable 
} from '@/components/panic';
import { 
	usePanicStatistics, 
	usePanicDayFilters
} from '@/hooks/use-panic-analysis';
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
			<div className="container mx-auto p-6">
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
						<span className="leading-tight">Vietnamese Panic Analysis</span>
					</h1>
					<p className="text-sm md:text-base text-gray-600">
						Comprehensive analysis of Vietnamese market panic events with predictive warning system
					</p>
				</div>
				<div className="flex justify-start md:justify-end">
					<Badge variant="outline" className="text-sm md:text-lg px-3 py-1 md:px-4 md:py-2">
						{PANIC_STATISTICS.totalPanicDays} Historical Events
					</Badge>
				</div>
			</div>

			{/* Current Warning Status */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
				<div className="lg:col-span-2">
					<PrePanicWarningWidget 
						showTradingAdvice={true}
						compact={true}
						onViewDetails={() => {
							// Navigate to current analysis
							const today = new Date().toISOString().split('T')[0];
							window.location.href = `/panic/analyze?date=${today}`;
						}}
					/>
				</div>
				<div className="space-y-3 md:space-y-4">
					<Card>
						<CardHeader className="pb-2 md:pb-3">
							<CardTitle className="text-base md:text-lg flex items-center gap-2">
								<BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
								System Performance
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 md:space-y-3">
							<div>
								<div className="flex justify-between text-sm">
									<span>Prediction Accuracy</span>
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
								{predictablePanics.length} of {PANIC_STATISTICS.totalPanicDays} panic events predicted
							</div>
							<div className="text-xs text-gray-600">
								{blackSwanPanics.length} Black Swan events (unpredictable)
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
						<span className="text-xs md:text-sm">Overview</span>
					</TabsTrigger>
					<TabsTrigger value="predictable" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<AlertTriangle className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">Predictable ({predictablePanics.length})</span>
					</TabsTrigger>
					<TabsTrigger value="blackswan" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<Shield className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">Black Swan ({blackSwanPanics.length})</span>
					</TabsTrigger>
					<TabsTrigger value="patterns" className="flex items-center gap-1 md:gap-2 px-2 py-2 md:px-3">
						<Target className="h-3 w-3 md:h-4 md:w-4" />
						<span className="text-xs md:text-sm">Patterns</span>
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
											<div className="text-sm text-gray-600">{year} Events</div>
										</div>
										<Calendar className="h-8 w-8 text-blue-500" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* All Historical Events */}
					<PanicDayTable
						panicDays={filteredData?.filteredPanics || PANIC_DAYS_DATABASE}
						title="All Historical Panic Events"
						description="Complete database of Vietnamese market panic days with sector analysis"
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
								Predictable Panic Events ({predictablePanics.length})
							</CardTitle>
							<CardDescription>
								Panic events with advance warning signals. These events showed predictive patterns 
								1-14 days before occurrence, enabling defensive positioning.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
								<div className="text-center p-4 bg-red-50 rounded">
									<div className="text-2xl font-bold text-red-600">
										{getPanicDaysByWarning('STRONG_WARNING' as WarningLevel).length}
									</div>
									<div className="text-sm text-red-700">Strong Warning</div>
									<div className="text-xs text-gray-600">1-3 days advance notice</div>
								</div>
								<div className="text-center p-4 bg-orange-50 rounded">
									<div className="text-2xl font-bold text-orange-600">
										{getPanicDaysByWarning('EARLY_WARNING' as WarningLevel).length}
									</div>
									<div className="text-sm text-orange-700">Early Warning</div>
									<div className="text-xs text-gray-600">1-14 days monitoring</div>
								</div>
								<div className="text-center p-4 bg-yellow-50 rounded">
									<div className="text-2xl font-bold text-yellow-600">
										{getPanicDaysByWarning('MODERATE_WARNING' as WarningLevel).length}
									</div>
									<div className="text-sm text-yellow-700">Moderate Warning</div>
									<div className="text-xs text-gray-600">Sector divergence</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<PanicDayTable
						panicDays={predictablePanics}
						title="Predictable Panic Events"
						description="Events with advance warning signals enabling defensive positioning"
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
								Black Swan Events ({blackSwanPanics.length})
							</CardTitle>
							<CardDescription>
								Unpredictable panic events with no advance warning signals. These external shock events 
								could not be predicted by Vietnamese sector analysis and represent the system's limitations.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="bg-gray-50 p-4 rounded mb-4">
								<div className="text-sm text-gray-700 space-y-2">
									<div className="font-medium">Common Characteristics:</div>
									<ul className="text-xs space-y-1 ml-4">
										<li>• All NO_WARNING signals across T-1, T-7, T-14 timeframes</li>
										<li>• Sudden external shocks or policy changes</li>
										<li>• Healthy sector indicators before panic</li>
										<li>• Cannot be predicted by local Vietnamese analysis</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<PanicDayTable
						panicDays={blackSwanPanics}
						title="Black Swan Events"
						description="Unpredictable external shock events with no advance warning"
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
								<CardTitle>Pre-Panic Pattern Distribution</CardTitle>
								<CardDescription>
									Analysis of warning signal development patterns
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{Object.entries(PANIC_STATISTICS.patternDistribution).map(([pattern, count]) => {
									const percentage = (count / PANIC_STATISTICS.totalPanicDays * 100).toFixed(1);
									return (
										<div key={pattern} className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="font-medium">
													{pattern.replace(/_/g, ' ')}
												</span>
												<span>{count} events ({percentage}%)</span>
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
								<CardTitle>Recovery Pattern Analysis</CardTitle>
								<CardDescription>
									Post-panic stabilization and recovery characteristics
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Fast Stabilization (1-2 days)</span>
										<span className="text-green-600">{PANIC_STATISTICS.recoveryPatterns.fastStabilization} events</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>Slow Stabilization (3+ days)</span>
										<span className="text-orange-600">{PANIC_STATISTICS.recoveryPatterns.slowStabilization} events</span>
									</div>
									<div className="flex justify-between text-sm">
										<span>Extended Crisis</span>
										<span className="text-red-600">{PANIC_STATISTICS.recoveryPatterns.extendedCrisis} events</span>
									</div>
								</div>
								<div className="text-xs text-gray-600 mt-4">
									Fast stabilization events show average +12.4% securities recovery.
									Slow stabilization events show average +5.2% securities recovery.
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Pattern Examples */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Escalating to Crisis Examples */}
						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Escalating to Crisis Pattern</CardTitle>
								<CardDescription>Highest prediction accuracy pattern</CardDescription>
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
								<CardTitle className="text-lg">Multiple Weakness Events</CardTitle>
								<CardDescription>Extended deterioration pattern</CardDescription>
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
						Quick Actions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						<Button 
							variant="outline" 
							onClick={() => {
								const today = new Date().toISOString().split('T')[0];
								window.location.href = `/panic/analyze?date=${today}`;
							}}
							className="flex items-center gap-2"
						>
							<ExternalLink className="h-4 w-4" />
							Analyze Current Market
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
							Latest Panic Analysis
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
							Strong Warning Example
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}