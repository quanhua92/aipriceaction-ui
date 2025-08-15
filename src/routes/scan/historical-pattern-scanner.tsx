import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Play, ArrowLeft, Calendar, TrendingUp, Download, Settings, ChevronDown, ChevronUp, Info, Filter, Target, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "@tanstack/react-router";
import { useHistoricalPatternScan, useTickerGroups } from "@/lib/queries";
import type { HistoricalScanResult, HistoricalScanConfig } from "@/lib/scanners/historical-pattern";
import { DEFAULT_HISTORICAL_CONFIG, getDefaultMarketThresholds } from "@/lib/scanners/historical-pattern";

export const Route = createFileRoute("/scan/historical-pattern-scanner")({
	component: HistoricalPatternScanner,
});

function HistoricalPatternScanner() {
	const { t } = useTranslation();
	
	const [config, setConfig] = useState<HistoricalScanConfig>(() => {
		const thresholds = getDefaultMarketThresholds(DEFAULT_HISTORICAL_CONFIG.scanType);
		return {
			...DEFAULT_HISTORICAL_CONFIG,
			bullMarketThreshold: thresholds.bull,
			bearMarketThreshold: thresholds.bear
		};
	});
	const [showSettings, setShowSettings] = useState(false);
	const [showMethodology, setShowMethodology] = useState(false);
	
	// Load ticker groups for sector selection
	const { data: tickerGroups } = useTickerGroups();
	
	// Manual trigger for scanning (not auto-triggered by config changes)
	const [scanTrigger, setScanTrigger] = useState(0);
	const [progress, setProgress] = useState({ completed: 0, total: 0 });
	
	const handleProgress = (completed: number, total: number) => {
		setProgress({ completed, total });
	};
	
	const { data: results, isLoading, error } = useHistoricalPatternScan(config, scanTrigger, handleProgress);

	const handleStartScan = () => {
		setProgress({ completed: 0, total: 0 });
		setScanTrigger(prev => prev + 1);
	};

	// Helper function to translate patterns
	const translatePattern = (pattern: string): string => {
		const patternKey = `scan.patternNames.${pattern}` as any;
		return t(patternKey) || pattern;
	};

	// Helper function to translate notes with complex logic
	const translateNotes = (notes: string): string => {
		// Simple approach: try to identify and translate key phrases
		if (notes.includes('Moderate activity with') && notes.includes('sprint candidates')) {
			// Extract count and sectors from the original note
			const countMatch = notes.match(/(\d+) sprint candidates/);
			const sectorsMatch = notes.match(/Strong performance in ([^.]+) sectors/);
			const bullMatch = notes.includes('Bull market conditions');
			const bearMatch = notes.includes('Bear market created selective');
			
			let translatedNote = '';
			if (countMatch) {
				translatedNote = t('scan.noteTemplates.moderateActivity', { count: countMatch[1] });
			}
			if (sectorsMatch) {
				translatedNote += ' ' + t('scan.noteTemplates.strongPerformanceIn', { sectors: sectorsMatch[1] });
			}
			if (bullMatch) {
				translatedNote += ' ' + t('scan.noteTemplates.bullMarketConditions');
			}
			if (bearMatch) {
				translatedNote += ' ' + t('scan.noteTemplates.bearMarketConditions');
			}
			return translatedNote.trim();
		}
		
		if (notes.includes('No significant sprint patterns detected')) {
			const periodMatch = notes.match(/detected in ([^.]+)\./);
			if (periodMatch) {
				return t('scan.noteTemplates.noSignificantPatterns', { period: periodMatch[1] });
			}
		}
		
		if (notes.includes('High activity period with')) {
			const countMatch = notes.match(/(\d+) sprint candidates/);
			if (countMatch) {
				return t('scan.noteTemplates.highActivityPeriod', { count: countMatch[1] });
			}
		}
		
		return notes; // Fallback to original if no translation pattern matches
	};

	const getMarketConditionBadge = (condition: string) => {
		switch (condition) {
			case 'bull':
				return <Badge className="bg-green-100 text-green-800">{t("scan.bullMarket")}</Badge>;
			case 'bear':
				return <Badge className="bg-red-100 text-red-800">{t("scan.bearMarket")}</Badge>;
			case 'sideways':
				return <Badge className="bg-gray-100 text-gray-800">{t("scan.sideways")}</Badge>;
			default:
				return <Badge variant="secondary">{condition}</Badge>;
		}
	};

	const getTotalCandidatesBadge = (count: number) => {
		if (count === 0) return <Badge variant="secondary">0</Badge>;
		if (count <= 3) return <Badge className="bg-yellow-100 text-yellow-800">{count}</Badge>;
		if (count <= 7) return <Badge className="bg-blue-100 text-blue-800">{count}</Badge>;
		return <Badge className="bg-purple-100 text-purple-800">{count}</Badge>;
	};

	const exportToCSV = () => {
		if (!results) return;
		
		const headers = ['Period', 'Market Condition', 'VN-Index Change %', 'Total Candidates', 'Banking', 'Securities', 'Real Estate', 'Best Performer', 'Patterns', 'Notes'];
		
		const csvData = results.map(result => [
			result.period,
			result.marketCondition,
			result.vnIndexChange.toFixed(2),
			result.totalCandidates.toString(),
			result.sprintCandidates.banking.join(';'),
			result.sprintCandidates.securities.join(';'),
			result.sprintCandidates.realEstate.join(';'),
			result.bestPerformer ? `${result.bestPerformer.ticker} (+${result.bestPerformer.gain.toFixed(1)}%)` : '',
			result.patterns.join(';'),
			result.notes,
		]);
		
		const csvContent = [headers, ...csvData]
			.map(row => row.map(cell => `"${cell}"`).join(','))
			.join('\n');
		
		const blob = new Blob([csvContent], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `historical-pattern-scan-${config.startYear}-${config.endYear}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="container mx-auto p-2 md:p-6">
			<div className="space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="sm" asChild>
							<Link to="/scan">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{t("common.back")}
							</Link>
						</Button>
					</div>
					
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<History className="h-6 w-6" />
							<h1 className="text-2xl font-bold">{t("scan.historicalPatternScanner.title")}</h1>
						</div>
						<p className="text-muted-foreground">
							{t("scan.historicalPatternScanner.description")}
						</p>
					</div>
				</div>

				{/* Methodology Info Card */}
				<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
					<Collapsible open={showMethodology} onOpenChange={setShowMethodology}>
						<CollapsibleTrigger asChild>
							<CardHeader className="pb-3 cursor-pointer hover:bg-blue-100/50 transition-colors">
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-2">
										<Info className="h-5 w-5 text-blue-600" />
										<CardTitle className="text-lg text-blue-900">{t("scan.methodology.title")}</CardTitle>
									</div>
									{showMethodology ? (
										<ChevronUp className="h-4 w-4 text-blue-600" />
									) : (
										<ChevronDown className="h-4 w-4 text-blue-600" />
									)}
								</div>
								<CardDescription className="text-blue-700">
									{t("scan.methodology.subtitle")}
								</CardDescription>
							</CardHeader>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<CardContent className="pt-0 space-y-4">
								{/* How it Works */}
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<BarChart3 className="h-4 w-4 text-blue-600" />
										<h4 className="font-semibold text-blue-900">{t("scan.methodology.howItWorks")}</h4>
									</div>
									<div className="space-y-2 text-sm text-gray-700">
										<div className="flex items-start space-x-2">
											<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">1</span>
											<p>{t("scan.methodology.step1")}</p>
										</div>
										<div className="flex items-start space-x-2">
											<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">2</span>
											<p>{t("scan.methodology.step2")}</p>
										</div>
										<div className="flex items-start space-x-2">
											<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">3</span>
											<p>{t("scan.methodology.step3")}</p>
										</div>
										<div className="flex items-start space-x-2">
											<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">4</span>
											<p>{t("scan.methodology.step4")}</p>
										</div>
									</div>
								</div>

								{/* Detection Filters */}
								<div className="space-y-3">
									<div className="flex items-center space-x-2">
										<Filter className="h-4 w-4 text-blue-600" />
										<h4 className="font-semibold text-blue-900">{t("scan.methodology.detectionFilters")}</h4>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
										<div className="bg-white/60 p-3 rounded-lg border border-blue-200">
											<div className="font-medium text-blue-900 mb-1">{t("scan.methodology.filter1Title")}</div>
											<div className="text-gray-600">{t("scan.methodology.filter1Description")}</div>
										</div>
										<div className="bg-white/60 p-3 rounded-lg border border-blue-200">
											<div className="font-medium text-blue-900 mb-1">{t("scan.methodology.filter2Title")}</div>
											<div className="text-gray-600">{t("scan.methodology.filter2Description")}</div>
										</div>
										<div className="bg-white/60 p-3 rounded-lg border border-blue-200">
											<div className="font-medium text-blue-900 mb-1">{t("scan.methodology.filter3Title")}</div>
											<div className="text-gray-600">{t("scan.methodology.filter3Description")}</div>
										</div>
										<div className="bg-white/60 p-3 rounded-lg border border-blue-200">
											<div className="font-medium text-blue-900 mb-1">{t("scan.methodology.filter4Title")}</div>
											<div className="text-gray-600">{t("scan.methodology.filter4Description")}</div>
										</div>
									</div>
								</div>

								{/* Why It Works & What To Do */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-3">
										<div className="flex items-center space-x-2">
											<Target className="h-4 w-4 text-green-600" />
											<h4 className="font-semibold text-green-900">{t("scan.methodology.whyItWorks")}</h4>
										</div>
										<div className="text-sm text-gray-700 space-y-2">
											<p>{t("scan.methodology.whyItWorksDescription1")}</p>
											<p>{t("scan.methodology.whyItWorksDescription2")}</p>
										</div>
									</div>
									<div className="space-y-3">
										<div className="flex items-center space-x-2">
											<TrendingUp className="h-4 w-4 text-purple-600" />
											<h4 className="font-semibold text-purple-900">{t("scan.methodology.whatToDo")}</h4>
										</div>
										<div className="text-sm text-gray-700 space-y-2">
											<p>{t("scan.methodology.whatToDoDescription1")}</p>
											<p>{t("scan.methodology.whatToDoDescription2")}</p>
											<p>{t("scan.methodology.whatToDoDescription3")}</p>
										</div>
									</div>
								</div>
							</CardContent>
						</CollapsibleContent>
					</Collapsible>
				</Card>

				{/* Control Panel */}
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle>{t("scan.scanConfiguration")}</CardTitle>
								<CardDescription>{t("scan.configureScanParameters")}</CardDescription>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowSettings(!showSettings)}
								>
									<Settings className="h-4 w-4 mr-2" />
									{t("scan.settings")}
								</Button>
								{results && results.length > 0 && (
									<Button
										variant="outline"
										size="sm"
										onClick={exportToCSV}
									>
										<Download className="h-4 w-4 mr-2" />
										{t("scan.exportCSV")}
									</Button>
								)}
							</div>
						</div>
					</CardHeader>
					
					<CardContent className="p-3 md:p-6 space-y-4">
						{/* Quick Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
							<div className="space-y-1">
								<p className="text-2xl font-bold">{config.endYear - config.startYear + 1}</p>
								<p className="text-sm text-muted-foreground">{t("scan.yearsToScan")}</p>
							</div>
							<div className="space-y-1">
								<p className="text-2xl font-bold">
									{(() => {
										const years = config.endYear - config.startYear + 1;
										switch (config.scanType) {
											case 'daily': return years * 365;
											case 'weekly': return years * 52;
											case 'monthly': return years * 12;
											case 'quarterly': return years * 4;
											default: return years * 12;
										}
									})()}
								</p>
								<p className="text-sm text-muted-foreground">{t("scan.periodsToScan")}</p>
							</div>
							<div className="space-y-1">
								<p className="text-2xl font-bold">{config.selectedSectors.length}</p>
								<p className="text-sm text-muted-foreground">{t("scan.sectorsToAnalyze")}</p>
							</div>
							<div className="space-y-1">
								<p className="text-2xl font-bold">{config.minGainThreshold}%</p>
								<p className="text-sm text-muted-foreground">{t("scan.gainThreshold")}</p>
							</div>
						</div>

						{/* Settings Panel */}
						{showSettings && (
							<div className="border rounded-lg p-4 space-y-4 bg-muted/50">
								<h4 className="font-medium">{t("scan.advancedSettings")}</h4>
								
								{/* Sector Selection */}
								<div className="space-y-2">
									<Label>{t("scan.selectSectors")}</Label>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
										{tickerGroups && Object.keys(tickerGroups).map((sector) => (
											<div key={sector} className="flex items-center space-x-2">
												<Checkbox
													id={`sector-${sector}`}
													checked={config.selectedSectors.includes(sector)}
													onCheckedChange={(checked) => {
														if (checked) {
															setConfig({
																...config,
																selectedSectors: [...config.selectedSectors, sector]
															});
														} else {
															setConfig({
																...config,
																selectedSectors: config.selectedSectors.filter(s => s !== sector)
															});
														}
													}}
												/>
												<Label 
													htmlFor={`sector-${sector}`} 
													className="text-sm cursor-pointer"
												>
													{t(`sectorNames.${sector}`) || sector}
												</Label>
											</div>
										))}
									</div>
								</div>

								{/* Other Settings */}
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									<div className="space-y-2">
										<Label>{t("scan.startYear")}</Label>
										<Input
											type="number"
											value={config.startYear}
											onChange={(e) => setConfig({...config, startYear: parseInt(e.target.value)})}
											min={2017}
											max={new Date().getFullYear()}
										/>
									</div>
									<div className="space-y-2">
										<Label>{t("scan.endYear")}</Label>
										<Input
											type="number"
											value={config.endYear}
											onChange={(e) => setConfig({...config, endYear: parseInt(e.target.value)})}
											min={2017}
											max={new Date().getFullYear()}
										/>
									</div>
									<div className="space-y-2">
										<Label>{t("scan.scanType")}</Label>
										<Select
											value={config.scanType}
											onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'quarterly') => {
												const thresholds = getDefaultMarketThresholds(value);
												setConfig({
													...config, 
													scanType: value,
													bullMarketThreshold: thresholds.bull,
													bearMarketThreshold: thresholds.bear
												});
											}}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="daily">{t("scan.daily")}</SelectItem>
												<SelectItem value="weekly">{t("scan.weekly")}</SelectItem>
												<SelectItem value="monthly">{t("scan.monthly")}</SelectItem>
												<SelectItem value="quarterly">{t("scan.quarterly")}</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="space-y-2">
										<Label>{t("scan.gainThreshold")} (%)</Label>
										<Input
											type="number"
											value={config.minGainThreshold}
											onChange={(e) => setConfig({...config, minGainThreshold: parseFloat(e.target.value)})}
											step={0.5}
											min={1}
											max={20}
										/>
									</div>
								</div>

								{/* Market Condition Thresholds */}
								<div className="space-y-3">
									<Label className="text-sm font-medium">{t("scan.marketConditionThresholds")}</Label>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label>{t("scan.bullMarketThreshold")} (%)</Label>
											<Input
												type="number"
												value={config.bullMarketThreshold}
												onChange={(e) => setConfig({...config, bullMarketThreshold: parseFloat(e.target.value)})}
												step={0.1}
												min={0.1}
												max={20}
											/>
										</div>
										<div className="space-y-2">
											<Label>{t("scan.bearMarketThreshold")} (%)</Label>
											<Input
												type="number"
												value={config.bearMarketThreshold}
												onChange={(e) => setConfig({...config, bearMarketThreshold: parseFloat(e.target.value)})}
												step={0.1}
												min={-20}
												max={-0.1}
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Start Scan Button */}
						<div className="flex justify-center">
							<Button
								onClick={handleStartScan}
								disabled={isLoading}
								size="lg"
								className="min-w-[200px]"
							>
								{isLoading ? (
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
										<span>{t("scan.scanningHistory")}</span>
									</div>
								) : (
									<div className="flex items-center space-x-2">
										<Play className="h-4 w-4" />
										<span>{t("scan.startHistoricalScan")}</span>
									</div>
								)}
							</Button>
						</div>

						{/* Progress Bar */}
						{isLoading && progress.total > 0 && (
							<div className="space-y-2">
								<div className="flex justify-between text-sm text-muted-foreground">
									<span>{t("scan.scanningProgress")}</span>
									<span>{progress.completed} / {progress.total}</span>
								</div>
								<div className="relative h-3 w-full overflow-hidden rounded-full bg-green-100">
									<div 
										className="h-full bg-green-600 transition-all duration-300 ease-out"
										style={{ width: `${(progress.completed / progress.total) * 100}%` }}
									/>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Results Table */}
				{results && results.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>{t("scan.historicalResults")}</CardTitle>
							<CardDescription>
								{t("scan.foundResults", { count: results.length, startYear: config.startYear, endYear: config.endYear })}
							</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="min-w-[100px]">{t("scan.period")}</TableHead>
											<TableHead className="min-w-[120px]">{t("scan.marketCondition")}</TableHead>
											<TableHead className="text-right min-w-[100px]">{t("scan.vnIndexChange")}</TableHead>
											<TableHead className="text-center min-w-[80px]">{t("scan.totalCandidates")}</TableHead>
											{config.selectedSectors.map(sector => (
												<TableHead key={sector} className="min-w-[120px]">
													{t(`sectorNames.${sector}`) || sector}
												</TableHead>
											))}
											<TableHead className="min-w-[150px]">{t("scan.bestPerformer")}</TableHead>
											<TableHead className="min-w-[200px]">{t("scan.patterns")}</TableHead>
											<TableHead className="min-w-[300px]">{t("scan.notes")}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{results.map((result: HistoricalScanResult) => (
											<TableRow key={result.period}>
												<TableCell className="font-medium">
													<div className="flex items-center space-x-2">
														<Calendar className="h-4 w-4 text-muted-foreground" />
														<div className="flex flex-col">
															<span className="font-medium">{result.period}</span>
															<span className="text-xs text-muted-foreground">
																{result.startDate.toLocaleDateString('en-US', { 
																	month: 'short', 
																	day: 'numeric' 
																})} - {result.endDate.toLocaleDateString('en-US', { 
																	month: 'short', 
																	day: 'numeric',
																	year: result.startDate.getFullYear() !== result.endDate.getFullYear() ? 'numeric' : undefined
																})}
															</span>
														</div>
													</div>
												</TableCell>
												<TableCell>
													{getMarketConditionBadge(result.marketCondition)}
												</TableCell>
												<TableCell className="text-right">
													<span className={result.vnIndexChange >= 0 ? 'text-green-600' : 'text-red-600'}>
														{result.vnIndexChange >= 0 ? '+' : ''}{result.vnIndexChange.toFixed(1)}%
													</span>
												</TableCell>
												<TableCell className="text-center">
													{getTotalCandidatesBadge(result.totalCandidates)}
												</TableCell>
												{config.selectedSectors.map(sector => (
													<TableCell key={sector}>
														<div className="flex flex-wrap gap-1">
															{(result.sprintCandidates[sector] || []).map(ticker => (
																<Badge key={ticker} variant="outline" className="text-xs">
																	{ticker}
																</Badge>
															))}
														</div>
													</TableCell>
												))}
												<TableCell>
													{result.bestPerformer ? (
														<div className="space-y-1">
															<div className="font-medium">{result.bestPerformer.ticker}</div>
															<div className="text-xs text-green-600">
																+{result.bestPerformer.gain.toFixed(1)}%
															</div>
															<div className="text-xs text-muted-foreground capitalize">
																{result.bestPerformer.sector}
															</div>
														</div>
													) : (
														<span className="text-muted-foreground text-sm">-</span>
													)}
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														{result.patterns.slice(0, 3).map((pattern, index) => (
															<Badge key={index} variant="secondary" className="text-xs mr-1">
																{translatePattern(pattern)}
															</Badge>
														))}
														{result.patterns.length > 3 && (
															<Badge variant="outline" className="text-xs">
																+{result.patterns.length - 3} more
															</Badge>
														)}
													</div>
												</TableCell>
												<TableCell>
													<div className="max-w-[300px] text-sm text-muted-foreground">
														{translateNotes(result.notes)}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Error State */}
				{error && (
					<Card className="border-red-200">
						<CardContent className="p-4 text-center">
							<p className="text-red-600">{t("scan.errorScanning")}: {error.message}</p>
						</CardContent>
					</Card>
				)}

				{/* Empty State */}
				{!isLoading && !results && !error && (
					<Card className="border-dashed">
						<CardContent className="p-8 text-center">
							<TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="font-semibold mb-2">{t("scan.readyToScan")}</h3>
							<p className="text-muted-foreground mb-4">{t("scan.clickStartToBegin")}</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}