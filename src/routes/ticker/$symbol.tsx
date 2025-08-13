import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Volume2,
	Calendar,
	ChartCandlestick,
	BarChart3,
	X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandlestickChart, ComparisonChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { MultiTickerSearch } from "@/components/ui/TickerSearch";
import { VPACard } from "@/components/vpa";
import { useTickerData, useTickerGroups, useMultipleTickerData } from "@/lib/queries";
import {
	calculatePriceChange,
	calculateRangeChange,
	getLatestPrice,
	findTickerSector,
	createDateRangeConfig,
	type TimeRange,
} from "@/lib/stock-data";
import { format } from "date-fns";

interface TickerPageSearch {
	range?: TimeRange;
	startDate?: string;
	endDate?: string;
}

export const Route = createFileRoute("/ticker/$symbol")({
	validateSearch: (search: Record<string, unknown>): TickerPageSearch => {
		return {
			range: (search.range as TimeRange) || "3M",
			startDate: search.startDate as string,
			endDate: search.endDate as string,
		};
	},
	component: TickerPage,
});

function TickerPage() {
	const { symbol } = Route.useParams();
	const navigate = useNavigate({ from: Route.fullPath });
	const { range = "3M", startDate, endDate } = Route.useSearch();
	
	// State for ticker comparison
	const [comparisonTickers, setComparisonTickers] = useState<string[]>([]);

	// Create date range configuration
	const dateRangeConfig = createDateRangeConfig(range, startDate, endDate);

	const { data: tickerData, isLoading, error } = useTickerData(symbol, dateRangeConfig);
	const { data: tickerGroups } = useTickerGroups();
	
	// Get data for comparison tickers
	const { data: comparisonData, isLoading: comparisonLoading } = useMultipleTickerData(
		comparisonTickers,
		dateRangeConfig,
		300
	);

	const updateSearchParams = (updates: Partial<TickerPageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	// Helper functions for comparison tickers
	const handleTickersChange = (newTickers: string[]) => {
		setComparisonTickers(newTickers);
	};

	const removeComparisonTicker = (tickerToRemove: string) => {
		setComparisonTickers(prev => prev.filter(t => t !== tickerToRemove));
	};

	const clearAllComparisons = () => {
		setComparisonTickers([]);
	};

	// Chart colors for comparison
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

	const dailyChange = tickerData ? calculatePriceChange(tickerData) : null;
	const rangeChange = tickerData ? calculateRangeChange(tickerData) : null;
	const latestPrice = tickerData ? getLatestPrice(tickerData) : null;
	const sector = tickerGroups ? findTickerSector(tickerGroups, symbol) : null;
	const sectorLabel = sector?.replace(/_/g, " ");

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(value);
	};

	const formatVolume = (value: number) => {
		if (value >= 1000000000) {
			return `${(value / 1000000000).toFixed(2)}B`;
		}
		if (value >= 1000000) {
			return `${(value / 1000000).toFixed(2)}M`;
		}
		if (value >= 1000) {
			return `${(value / 1000).toFixed(2)}K`;
		}
		return value.toString();
	};

	if (error) {
		return (
			<div className="container mx-auto p-6">
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<div className="text-center space-y-4">
							<p className="text-red-600 font-semibold">
								Failed to load data for {symbol}
							</p>
							<p className="text-muted-foreground text-sm">
								{error instanceof Error
									? error.message
									: "Unknown error occurred"}
							</p>
							<Link to="/tickers">
								<Button variant="outline">Back to Tickers</Button>
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
				<div className="flex items-center gap-2 md:gap-4">
					<Link to="/tickers">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="h-4 w-4 mr-1" />
							<span className="hidden sm:inline">Back</span>
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold font-mono">{symbol}</h1>
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
							{sector && (
								<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
									<Badge
										variant="secondary"
										className="cursor-pointer hover:shadow-sm w-fit"
									>
										{sectorLabel}
									</Badge>
								</Link>
							)}
							{latestPrice && (
								<div className="text-sm text-muted-foreground">
									Last updated: {format(latestPrice.date, "MMM dd, yyyy")}
								</div>
							)}
						</div>
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
						dataRange={tickerData}
						showNavigationButtons={true}
						showDataInfo={true}
						className="w-full md:w-auto"
					/>
				</div>
			</div>

			{/* Price Summary */}
			{latestPrice && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card>
						<CardContent className="flex items-center gap-3 p-4">
							<div className="p-2 bg-primary/10 rounded-full">
								<TrendingUp className="h-6 w-6 text-primary" />
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Current Price
								</p>
								<p className="text-2xl font-bold">
									{formatPrice(latestPrice.close)}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-3 p-4">
							<div
								className={`p-2 rounded-full ${(rangeChange?.changePercent ?? 0) >= 0 ? "bg-green-100" : "bg-red-100"}`}
							>
								{(rangeChange?.changePercent ?? 0) >= 0 ? (
									<TrendingUp className="h-6 w-6 text-green-600" />
								) : (
									<TrendingDown className="h-6 w-6 text-red-600" />
								)}
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Change
								</p>
								{/* Daily Change */}
								{dailyChange && (
									<p
										className={`text-sm font-medium ${dailyChange.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
									>
										Daily: {dailyChange.changePercent > 0 ? "+" : ""}
										{formatPrice(dailyChange.change)}
										{" "}({dailyChange.changePercent > 0 ? "+" : ""}
										{dailyChange.changePercent.toFixed(2)}%)
									</p>
								)}
								{/* Range Change */}
								{rangeChange && (
									<p
										className={`text-lg font-semibold ${rangeChange.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
									>
										{range}: {rangeChange.changePercent > 0 ? "+" : ""}
										{formatPrice(rangeChange.change)}
										{" "}({rangeChange.changePercent > 0 ? "+" : ""}
										{rangeChange.changePercent.toFixed(2)}%)
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-3 p-4">
							<div className="p-2 bg-blue-100 rounded-full">
								<Volume2 className="h-6 w-6 text-blue-600" />
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Volume
								</p>
								<p className="text-lg font-semibold">
									{formatVolume(latestPrice.volume)}
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="flex items-center gap-3 p-4">
							<div className="p-2 bg-purple-100 rounded-full">
								<Calendar className="h-6 w-6 text-purple-600" />
							</div>
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Data Range
								</p>
								<p className="text-lg font-semibold">
									{dateRangeConfig.range === "CUSTOM"
										? "Custom"
										: dateRangeConfig.range}
								</p>
								{tickerData && (
									<p className="text-xs text-muted-foreground">
										{tickerData.length} data points
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Charts */}
			<div className="space-y-6">
				{/* VPA Analysis - moved to top */}
				<VPACard 
					ticker={symbol}
					title={`Volume Price Analysis - ${symbol}`}
					defaultExpanded={false}
					showViewButton={true}
				/>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ChartCandlestick className="h-5 w-5" />
							Price & Volume Chart
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-muted-foreground">
									Loading chart data...
								</div>
							</div>
						) : tickerData && tickerData.length > 0 ? (
							<div className="space-y-4">
								<CandlestickChart data={tickerData} height={400} showCard={false} />
							</div>
						) : (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-center space-y-4">
									<p className="text-muted-foreground">
										No data available for {symbol}
									</p>
									<p className="text-sm text-muted-foreground">
										Try selecting a different time range or check if the ticker
										symbol is correct.
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Price & Volume Chart Comparison */}
				{comparisonTickers.length > 0 && (
					<Card>
						<CardHeader>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<CardTitle className="flex items-center gap-2">
									<ChartCandlestick className="h-5 w-5" />
									Price & Volume Chart Comparison
									<Badge variant="secondary" className="text-xs">
										{comparisonTickers.length} chart{comparisonTickers.length > 1 ? 's' : ''}
									</Badge>
								</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={clearAllComparisons}
									className="text-xs"
								>
									<X className="h-4 w-4 mr-1" />
									Clear All Charts
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-8">
							{comparisonTickers.map((ticker) => (
								<div key={ticker} className="space-y-4">
									{/* Ticker Header */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<h3 className="text-xl font-semibold flex items-center gap-2">
												<ChartCandlestick className="h-5 w-5" />
												{ticker}
											</h3>
											{sector && findTickerSector(tickerGroups || {}, ticker) && (
												<Badge variant="outline" className="text-xs">
													{findTickerSector(tickerGroups || {}, ticker)?.replace(/_/g, " ")}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-3">
											{comparisonData && comparisonData[ticker] && comparisonData[ticker].length > 0 && (() => {
												const data = comparisonData[ticker];
												const latestPrice = getLatestPrice(data);
												const priceChange = calculatePriceChange(data);
												
												return (
													<div className="text-right">
														{latestPrice && (
															<div className="font-semibold text-lg">
																{formatPrice(latestPrice.close)}
															</div>
														)}
														{priceChange && (
															<div className={`text-sm ${priceChange.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
																{priceChange.changePercent > 0 ? '+' : ''}{priceChange.changePercent.toFixed(2)}%
															</div>
														)}
													</div>
												);
											})()}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeComparisonTicker(ticker)}
												className="h-8 w-8 p-0 hover:bg-red-100"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>

									{/* Full Width Chart */}
									{comparisonLoading ? (
										<div className="h-[400px] flex items-center justify-center">
											<div className="text-muted-foreground">
												Loading {ticker} chart data...
											</div>
										</div>
									) : comparisonData && comparisonData[ticker] && comparisonData[ticker].length > 0 ? (
										<div className="space-y-4">
											<CandlestickChart 
												data={comparisonData[ticker]} 
												height={400} 
												showCard={false} 
											/>
										</div>
									) : (
										<div className="h-[400px] flex items-center justify-center">
											<div className="text-center space-y-2">
												<p className="text-muted-foreground">
													No data available for {ticker}
												</p>
												<p className="text-sm text-muted-foreground">
													Try a different time range or check if the ticker symbol is correct.
												</p>
											</div>
										</div>
									)}
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{/* Performance Comparison */}
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5" />
								Performance Comparison
								{comparisonTickers.length > 0 && (
									<Badge variant="secondary" className="text-xs">
										{comparisonTickers.length + 1} selected
									</Badge>
								)}
							</CardTitle>
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={clearAllComparisons}
									disabled={comparisonTickers.length === 0}
									className="text-xs"
								>
									<X className="h-4 w-4 mr-1" />
									Clear All
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Ticker Selection */}
						<div>
							<label className="text-sm font-medium mb-2 block">
								Search and select tickers to compare with {symbol}
							</label>
							<MultiTickerSearch
								selectedTickers={comparisonTickers}
								onTickersChange={handleTickersChange}
								maxSelection={7}
								placeholder="Search tickers to compare..."
								className="w-full"
							/>
						</div>


						{/* Comparison Chart */}
						{comparisonLoading ? (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-muted-foreground">
									Loading comparison data...
								</div>
							</div>
						) : comparisonTickers.length > 0 ? (
							<div className="space-y-4">
								{/* Chart Legend */}
								<div className="flex flex-wrap gap-2">
									{[symbol, ...comparisonTickers].slice(0, 8).map((ticker, index) => (
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
								<div className="h-[400px]">
									<ComparisonChart
										data={(() => {
											// Normalize data for comparison - convert to percentage change from first data point
											const normalizedData: any[] = [];
											const allTickers = [symbol, ...comparisonTickers];
											const allTickerData = {
												[symbol]: tickerData,
												...comparisonData
											};

											if (allTickerData && allTickers.length > 0) {
												const maxLength = Math.max(
													...allTickers.map(
														(ticker) => allTickerData[ticker]?.length || 0,
													),
												);

												for (let i = 0; i < maxLength; i++) {
													const dataPoint: any = { time: "", date: null };

													allTickers.slice(0, 8).forEach((ticker) => {
														const data = allTickerData[ticker] || [];
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
										tickers={[symbol, ...comparisonTickers].slice(0, 8)}
										colors={chartColors}
										height={400}
									/>
								</div>
							</div>
						) : (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-center space-y-2">
									<p className="text-muted-foreground">
										Select tickers to compare with {symbol}
									</p>
									<p className="text-sm text-muted-foreground">
										Use the search above to add comparison tickers
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

			</div>

			{/* Additional Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Related Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						{sector && (
							<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
								<Button variant="outline">View {sectorLabel} Sector</Button>
							</Link>
						)}
						<Link
							to="/compare"
							search={{ tickers: [symbol, "VNINDEX"] }}
						>
							<Button variant="outline">Compare with VN-Index</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
