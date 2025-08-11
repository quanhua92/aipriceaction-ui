import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Users,
	BarChart3,
	Grid3X3,
	X,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ComparisonChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { useTickerGroups, useMultipleTickerData } from "@/lib/queries";
import { VPAButton } from "@/components/vpa";
import {
	getTickersBySector,
	calculatePriceChange,
	getLatestPrice,
	createDateRangeConfig,
	type TimeRange,
} from "@/lib/stock-data";

interface SectorPageSearch {
	range?: TimeRange;
	startDate?: string;
	endDate?: string;
	compare?: string[];
}

export const Route = createFileRoute("/sector/$sectorName")({
	validateSearch: (search: Record<string, unknown>): SectorPageSearch => {
		return {
			range: (search.range as TimeRange) || "3M",
			startDate: search.startDate as string,
			endDate: search.endDate as string,
			compare: Array.isArray(search.compare)
				? (search.compare as string[])
				: [],
		};
	},
	component: SectorPage,
});

function SectorPage() {
	const { t } = useTranslation();
	const { sectorName } = Route.useParams();
	const navigate = useNavigate({ from: Route.fullPath });
	const searchParams = Route.useSearch();
	const { range = "3M", startDate, endDate, compare = [] } = searchParams;
	
	// Create date range configuration
	const dateRangeConfig = createDateRangeConfig(range, startDate, endDate);

	const { data: tickerGroups, isLoading: groupsLoading } = useTickerGroups();
	const sectorTickers = useMemo(() => {
		return tickerGroups ? getTickersBySector(tickerGroups, sectorName) : [];
	}, [tickerGroups, sectorName]);

	const { data: tickerData, isLoading: dataLoading } = useMultipleTickerData(
		sectorTickers,
		dateRangeConfig,
		300,
	);

	// Use local state for selected tickers - initialize from URL
	const [selectedTickers, setSelectedTickers] = useState<string[]>(compare);

	// Sorting state for the table
	const [sortBy, setSortBy] = useState<'compare' | 'ticker' | 'price' | 'change' | 'changePercent'>('ticker');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	const handleSort = (column: 'compare' | 'ticker' | 'price' | 'change' | 'changePercent') => {
		if (sortBy === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(column);
			setSortDirection('asc');
		}
	};

	const getSortIcon = (column: 'compare' | 'ticker' | 'price' | 'change' | 'changePercent') => {
		if (sortBy !== column) {
			return <ArrowUpDown className="h-3 w-3 ml-1" />;
		}
		return sortDirection === 'asc' 
			? <ArrowUp className="h-3 w-3 ml-1" />
			: <ArrowDown className="h-3 w-3 ml-1" />;
	};

	// Chart displays only what user has selected
	const chartTickers = selectedTickers;

	const updateSearchParams = (updates: Partial<SectorPageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};


	const toggleTicker = (ticker: string, checked: boolean) => {
		const newSelection = checked
			? [...selectedTickers, ticker]
			: selectedTickers.filter(t => t !== ticker);
			
		setSelectedTickers(newSelection);
		updateSearchParams({ compare: newSelection });
	};

	const selectAllTickers = () => {
		setSelectedTickers([...sectorTickers]);
		updateSearchParams({ compare: [...sectorTickers] });
	};

	const clearAllTickers = () => {
		setSelectedTickers([]);
		updateSearchParams({ compare: [] });
	};

	const sectorLabel = t(`sectorNames.${sectorName}`) || sectorName.replace(/_/g, " ");

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const tickerPerformanceData = useMemo(() => {
		if (!tickerData) return [];

		return sectorTickers
			.map((ticker) => {
				const data = tickerData[ticker] || [];
				const latestPrice = getLatestPrice(data);
				const priceChange = calculatePriceChange(data);

				return {
					ticker,
					data,
					latestPrice,
					priceChange,
					selected: selectedTickers.includes(ticker),
				};
			})
			.sort((a, b) => {
				let aValue, bValue;
				
				switch (sortBy) {
					case 'compare':
						// Sort by selected status (selected first when desc)
						aValue = a.selected ? 1 : 0;
						bValue = b.selected ? 1 : 0;
						break;
					
					case 'ticker':
						aValue = a.ticker;
						bValue = b.ticker;
						return sortDirection === 'asc' 
							? aValue.localeCompare(bValue)
							: bValue.localeCompare(aValue);
					
					case 'price':
						aValue = a.latestPrice?.close || 0;
						bValue = b.latestPrice?.close || 0;
						break;
					
					case 'change':
						aValue = a.priceChange?.change || 0;
						bValue = b.priceChange?.change || 0;
						break;
					
					case 'changePercent':
						aValue = a.priceChange?.changePercent || 0;
						bValue = b.priceChange?.changePercent || 0;
						break;
						
					default:
						return 0;
				}
				
				// For numeric comparisons
				return sortDirection === 'asc' 
					? (aValue as number) - (bValue as number)
					: (bValue as number) - (aValue as number);
			});
	}, [tickerData, sectorTickers, selectedTickers, sortBy, sortDirection]);

	const chartColors = [
		"#3B82F6", // blue-500
		"#10B981", // emerald-500
		"#F59E0B", // amber-500
		"#EF4444", // red-500
		"#8B5CF6", // violet-500
		"#06B6D4", // cyan-500
		"#F97316", // orange-500
		"#84CC16", // lime-500
	];

	if (groupsLoading) {
		return (
			<div className="container mx-auto p-2 md:p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">{t("loading.sectorData")}</div>
				</div>
			</div>
		);
	}

	if (!sectorTickers.length) {
		return (
			<div className="container mx-auto p-6">
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<div className="text-center space-y-4">
							<p className="text-red-600 font-semibold">
								{t("sectors.sectorNotFound", { sector: sectorLabel })}
							</p>
							<Link to="/sectors">
								<Button variant="outline">{t("sectors.backToSectors")}</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-2 md:p-6 space-y-4 md:space-y-6">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div className="flex items-center gap-4">
					<Link to="/sectors">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="h-4 w-4 mr-1" />
							{t("common.back")}
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">{sectorLabel}</h1>
						<p className="text-muted-foreground">
							{t("sectors.compareSectorStocks", { count: sectorTickers.length })}
						</p>
					</div>
				</div>

				<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
					<DateRangeSelector
						value={dateRangeConfig}
						onChange={(config) => {
							if (config.range === "CUSTOM") {
								updateSearchParams({
									range: config.range,
									startDate: config.startDate ? config.startDate.toISOString().split('T')[0] : undefined,
									endDate: config.endDate ? config.endDate.toISOString().split('T')[0] : undefined,
								});
							} else {
								updateSearchParams({
									range: config.range,
									startDate: undefined,
									endDate: undefined,
								});
							}
						}}
						showNavigationButtons={true}
						className="w-full md:w-auto"
					/>
				</div>
			</div>

			{/* Stock Selection Table */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<CardTitle>{t("sectors.sectorPerformance")}</CardTitle>
						<div className="flex flex-col md:flex-row gap-4">
							{selectedTickers.length > 0 && (
								<Link
									to="/compare"
									search={{
										tickers: selectedTickers,
										range: range,
										...(range === "CUSTOM" && {
											startDate: startDate,
											endDate: endDate,
										}),
									}}
								>
									<Button variant="outline" size="sm" className="w-full md:w-auto">
										<Grid3X3 className="h-4 w-4 mr-1" />
										{t("sectors.compareInGrid")}
									</Button>
								</Link>
							)}
							<div className="flex gap-2">
								<Button variant="outline" size="sm" onClick={selectAllTickers} className="flex-1 md:flex-none">
									{t("sectors.addAll")}
								</Button>
								<Button variant="ghost" size="sm" onClick={clearAllTickers} className="flex-1 md:flex-none">
									<X className="h-4 w-4 mr-1" />
									{t("common.clearAll")}
								</Button>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-12">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort('compare')}
										className="h-auto p-0 font-medium"
									>
										{t("common.compare")} {getSortIcon('compare')}
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort('ticker')}
										className="h-auto p-0 font-medium"
									>
										{t("common.ticker")} {getSortIcon('ticker')}
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort('price')}
										className="h-auto p-0 font-medium"
									>
										{t("common.price")} {getSortIcon('price')}
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort('change')}
										className="h-auto p-0 font-medium"
									>
										{t("common.change")} {getSortIcon('change')}
									</Button>
								</TableHead>
								<TableHead>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort('changePercent')}
										className="h-auto p-0 font-medium"
									>
										{t("common.changePercent")} {getSortIcon('changePercent')}
									</Button>
								</TableHead>
								<TableHead>{t("common.actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tickerPerformanceData.map((item) => (
								<TableRow key={item.ticker}>
									<TableCell>
										<Checkbox
											checked={item.selected}
											onCheckedChange={(checked) =>
												toggleTicker(item.ticker, checked as boolean)
											}
										/>
									</TableCell>
									<TableCell>
										<Link
											to="/ticker/$symbol"
											params={{ symbol: item.ticker }}
											className="font-mono font-semibold hover:underline"
										>
											{item.ticker}
										</Link>
									</TableCell>
									<TableCell>
										{item.latestPrice
											? formatPrice(item.latestPrice.close)
											: "-"}
									</TableCell>
									<TableCell>
										{item.priceChange ? (
											<span
												className={
													item.priceChange.changePercent >= 0
														? "text-green-600"
														: "text-red-600"
												}
											>
												{item.priceChange.changePercent > 0 ? "+" : ""}
												{formatPrice(item.priceChange.change)}
											</span>
										) : (
											"-"
										)}
									</TableCell>
									<TableCell>
										{item.priceChange ? (
											<div className="flex items-center gap-1">
												{item.priceChange.changePercent >= 0 ? (
													<TrendingUp className="h-4 w-4 text-green-600" />
												) : (
													<TrendingDown className="h-4 w-4 text-red-600" />
												)}
												<span
													className={
														item.priceChange.changePercent >= 0
															? "text-green-600"
															: "text-red-600"
													}
												>
													{item.priceChange.changePercent > 0 ? "+" : ""}
													{item.priceChange.changePercent.toFixed(2)}%
												</span>
											</div>
										) : (
											"-"
										)}
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Link to="/ticker/$symbol" params={{ symbol: item.ticker }}>
												<Button variant="outline" size="sm">
													<BarChart3 className="h-4 w-4 mr-1" />
													{t("common.view")}
												</Button>
											</Link>
											<VPAButton 
												ticker={item.ticker}
												variant="badge"
												mode="popover"
											/>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Sector Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="p-2 bg-primary/10 rounded-full">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("sectors.totalStocks")}
							</p>
							<p className="text-2xl font-bold">{sectorTickers.length}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="p-2 bg-blue-100 rounded-full">
							<BarChart3 className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("sectors.comparing")}
							</p>
							<p className="text-2xl font-bold">{chartTickers.length}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="p-2 bg-green-100 rounded-full">
							<TrendingUp className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("sectors.timeRange")}
							</p>
							<p className="text-2xl font-bold">{range}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Comparison Chart */}
			<Card>
				<CardHeader>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="h-5 w-5" />
							{t("sectors.performanceComparison")}
							{chartTickers.length > 0 && (
								<Badge variant="secondary" className="text-xs">
									{chartTickers.length} {t("sectors.selected")}
								</Badge>
							)}
						</CardTitle>
						<div className="flex flex-col md:flex-row md:items-center gap-2">
							{/* Compare in Grid button moved to Sector Stocks Performance card for consistency */}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{dataLoading ? (
						<div className="h-[500px] flex items-center justify-center">
							<div className="text-muted-foreground">
								{t("loading.comparisonData")}
							</div>
						</div>
					) : chartTickers.length > 0 ? (
						<div className="space-y-4">
							{/* Chart Legend */}
							<div className="flex flex-wrap gap-2">
								{chartTickers.slice(0, 8).map((ticker, index) => (
									<Badge
										key={ticker}
										variant="outline"
										className="flex items-center gap-1"
										style={{ borderColor: chartColors[index] }}
									>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: chartColors[index] }}
										/>
										{ticker}
									</Badge>
								))}
							</div>

							{/* Normalized Comparison Chart */}
							<div className="h-[500px]">
								<ComparisonChart
									data={(() => {
										// Normalize data for comparison - convert to percentage change from first data point
										const normalizedData: any[] = [];

										if (tickerData && chartTickers.length > 0) {
											const maxLength = Math.max(
												...chartTickers.map(
													(ticker) => tickerData[ticker]?.length || 0,
												),
											);

											for (let i = 0; i < maxLength; i++) {
												const dataPoint: any = { time: "", date: null };

												chartTickers.slice(0, 8).forEach((ticker) => {
													const data = tickerData[ticker] || [];
													if (data[i] && data[0]) {
														const changePercent =
															((data[i].close - data[0].close) /
																data[0].close) *
															100;
														dataPoint[ticker] = changePercent;
														if (!dataPoint.time) {
															dataPoint.time = data[i].time;
															dataPoint.date = data[i].date;
														}
													}
												});

												if (dataPoint.time) {
													normalizedData.push(dataPoint);
												}
											}
										}

										return normalizedData;
									})()}
									tickers={chartTickers.slice(0, 8)}
									colors={chartColors}
									height={500}
								/>
							</div>
						</div>
					) : (
						<div className="h-[500px] flex items-center justify-center">
							<div className="text-muted-foreground">
								{t("sectors.selectStocksToCompare")}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
