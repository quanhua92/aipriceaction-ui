import { useMemo, useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Grid3X3, Settings, X, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandlestickChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { MultiTickerSearch } from "@/components/ui/TickerSearch";
import { TickerPerformanceTable } from "@/components/ui/TickerPerformanceTable";
import { useMultipleTickerData } from "@/lib/queries";
import {
	createDateRangeConfig,
	type TimeRange,
} from "@/lib/stock-data";

interface ComparePageSearch {
	tickers?: string[];
	range?: TimeRange;
	startDate?: string;
	endDate?: string;
}

export const Route = createFileRoute("/compare")({
	validateSearch: (search: Record<string, unknown>): ComparePageSearch => {
		return {
			tickers: Array.isArray(search.tickers)
				? (search.tickers as string[])
				: [],
			range: (search.range as TimeRange) || "3M",
			startDate: search.startDate as string,
			endDate: search.endDate as string,
		};
	},
	component: ComparePage,
});


function ComparePage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { tickers = [], range = "3M", startDate, endDate } = Route.useSearch();
	
	// Track screen size for responsive chart heights
	const [isMobile, setIsMobile] = useState(false);
	
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 640);
		};
		
		checkIsMobile();
		window.addEventListener('resize', checkIsMobile);
		
		return () => window.removeEventListener('resize', checkIsMobile);
	}, []);

	// Create date range configuration
	const dateRangeConfig = createDateRangeConfig(range, startDate, endDate);

	const { data: tickerData, isLoading } = useMultipleTickerData(
		tickers,
		dateRangeConfig,
		500,
	);

	const updateSearchParams = (updates: Partial<ComparePageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	// Create grid items - one for each ticker
	const gridItems = useMemo(() => {
		return tickers.map((ticker, index) => ({
			id: index,
			ticker,
			data: tickerData?.[ticker] || [],
		}));
	}, [tickers, tickerData]);

	const handleTickersChange = (newTickers: string[]) => {
		updateSearchParams({ tickers: newTickers });
	};

	const removeTicker = (tickerToRemove: string) => {
		const newTickers = tickers.filter(t => t !== tickerToRemove);
		updateSearchParams({ tickers: newTickers });
	};


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

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
					<Grid3X3 className="h-8 w-8" />
					Compare Charts
				</h1>
				<p className="text-muted-foreground">
					Compare unlimited stock charts in a responsive 2-column grid (1 column on mobile)
				</p>
			</div>

			{/* Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						Chart Configuration
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Ticker Selection */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Select Tickers
						</label>
						<MultiTickerSearch
							selectedTickers={tickers}
							onTickersChange={handleTickersChange}
							maxSelection={100}
							placeholder="Add tickers to compare..."
							className="w-full"
						/>
					</div>

					{/* Date Range Selection */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Date Range
						</label>
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
							className="w-full"
							showNavigationButtons={true}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			{tickers.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Link 
								to="/portfolio" 
								search={{ 
									tickers: tickers,
									range: dateRangeConfig.range !== "CUSTOM" ? dateRangeConfig.range : undefined,
									startDate: dateRangeConfig.range === "CUSTOM" && dateRangeConfig.startDate 
										? dateRangeConfig.startDate.toISOString().split('T')[0] 
										: undefined,
									endDate: dateRangeConfig.range === "CUSTOM" && dateRangeConfig.endDate 
										? dateRangeConfig.endDate.toISOString().split('T')[0] 
										: undefined,
								}}
							>
								<Button variant="outline" className="flex items-center gap-2">
									<Target className="h-4 w-4" />
									Open in Portfolio
								</Button>
							</Link>
							<Button
								variant="outline"
								onClick={() =>
									updateSearchParams({
										tickers: [
											"VNINDEX",
											...tickers.filter((t) => t !== "VNINDEX"),
										],
									})
								}
							>
								Add VN-Index
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									updateSearchParams({
										tickers: ["VCB", "BID", "CTG", "ACB"],
									})
								}
							>
								Banking Stocks
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									updateSearchParams({
										tickers: ["VHM", "VIC", "VRE", "KDH"],
									})
								}
							>
								Real Estate
							</Button>
							<Button
								variant="outline"
								onClick={() => updateSearchParams({ tickers: [] })}
							>
								Clear All
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Ticker Performance Table */}
			{tickers.length > 0 && (
				<TickerPerformanceTable
					tickerData={tickerData || {}}
					tickers={tickers}
					timeRange={dateRangeConfig.range}
					isLoading={isLoading}
					title="Selected Stocks Performance"
				/>
			)}

			{/* Grid Layout - Responsive 2 columns on desktop, 1 on mobile */}
			{gridItems.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{gridItems.map((item, index) => (
						<Card key={item.id} className="min-h-[300px] sm:min-h-[400px]">
							<CardHeader className="pb-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Badge
											variant="default"
											style={{
												backgroundColor:
													chartColors[index % chartColors.length],
											}}
										>
											{item.ticker}
										</Badge>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => removeTicker(item.ticker)}
											className="h-6 w-6 p-0"
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
									<div className="text-xs text-muted-foreground">
										#{index + 1}
									</div>
								</div>
							</CardHeader>
							<CardContent>
								{item.data.length > 0 ? (
									isLoading ? (
										<div className="h-[250px] sm:h-[300px] flex items-center justify-center">
											<div className="text-muted-foreground">Loading...</div>
										</div>
									) : (
										<CandlestickChart
											data={item.data}
											height={isMobile ? 250 : 300}
										/>
									)
								) : isLoading ? (
									<div className="h-[250px] sm:h-[300px] flex items-center justify-center">
										<div className="text-muted-foreground">
											Loading {item.ticker}...
										</div>
									</div>
								) : (
									<div className="h-[250px] sm:h-[300px] flex items-center justify-center">
										<div className="text-center space-y-2">
											<p className="text-muted-foreground">No data available</p>
											<p className="text-xs text-muted-foreground">
												for {item.ticker}
											</p>
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card className="min-h-[300px]">
					<CardContent className="h-[300px] flex items-center justify-center">
						<div className="text-center space-y-4">
							<Grid3X3 className="h-16 w-16 text-muted-foreground/40 mx-auto" />
							<div>
								<p className="text-xl font-medium text-muted-foreground mb-2">No tickers selected</p>
								<p className="text-sm text-muted-foreground">
									Add tickers above to start comparing charts in a responsive grid
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
