import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Volume2,
	Calendar,
	ChartCandlestick,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandlestickChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { VPACard } from "@/components/vpa";
import { useTickerData, useTickerGroups } from "@/lib/queries";
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

	// Create date range configuration
	const dateRangeConfig = createDateRangeConfig(range, startDate, endDate);

	const { data: tickerData, isLoading, error } = useTickerData(symbol, dateRangeConfig);
	const { data: tickerGroups } = useTickerGroups();

	const updateSearchParams = (updates: Partial<TickerPageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

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
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link to="/tickers">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="h-4 w-4 mr-1" />
							Back
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold font-mono">{symbol}</h1>
						<div className="flex items-center gap-2">
							{sector && (
								<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
									<Badge
										variant="secondary"
										className="cursor-pointer hover:shadow-sm"
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

				<div className="flex items-center gap-4">
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
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ChartCandlestick className="h-5 w-5" />
							Price & Volume Chart
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="h-[500px] flex items-center justify-center">
								<div className="text-muted-foreground">
									Loading chart data...
								</div>
							</div>
						) : tickerData && tickerData.length > 0 ? (
							<div className="space-y-4">
								<CandlestickChart data={tickerData} height={500} showCard={false} />
							</div>
						) : (
							<div className="h-[500px] flex items-center justify-center">
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

				{/* VPA Analysis */}
				<VPACard 
					ticker={symbol}
					title={`Volume Price Analysis - ${symbol}`}
					defaultExpanded={false}
					showViewButton={true}
				/>

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
