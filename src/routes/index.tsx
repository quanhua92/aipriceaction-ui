import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Search, Grid3X3, Building2, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandlestickChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { useTickerData, useTickerGroups, useSectorData } from "@/lib/queries";
import { 
	calculatePriceChange, 
	calculateRangeChange, 
	createDateRangeConfig, 
	calculateSectorPerformance,
	getSectorDisplayName,
	type TimeRange,
	type TickerPerformance 
} from "@/lib/stock-data";

export const Route = createFileRoute("/")({
	component: Dashboard,
});

interface SectorAnalyticsProps {
	sector: string;
	dateRangeConfig: any;
}

function SectorAnalytics({ sector, dateRangeConfig }: SectorAnalyticsProps) {
	const { data: sectorData, isLoading } = useSectorData(sector, dateRangeConfig);
	
	const sectorPerformance = useMemo(() => {
		if (!sectorData) return null;
		const displayName = getSectorDisplayName(sector);
		return calculateSectorPerformance(sectorData, sector, displayName);
	}, [sectorData, sector]);

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-4">
					<div className="animate-pulse">
						<div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
						<div className="h-6 bg-muted rounded w-1/2"></div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!sectorPerformance) {
		return (
			<Card>
				<CardContent className="p-4">
					<p className="text-sm text-muted-foreground">No data available</p>
				</CardContent>
			</Card>
		);
	}

	const isPositive = sectorPerformance.averageChange >= 0;

	return (
		<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
			<Card className="hover:shadow-md transition-shadow cursor-pointer">
				<CardContent className="p-4">
					<div className="flex items-start justify-between mb-2">
						<div className="flex items-center gap-2">
							<Building2 className="h-5 w-5 text-primary" />
							<h3 className="font-semibold text-sm">{sectorPerformance.sectorName}</h3>
						</div>
						<Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
							{isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
							{isPositive ? "+" : ""}{sectorPerformance.averageChange.toFixed(2)}%
						</Badge>
					</div>
					
					<div className="space-y-1 text-xs text-muted-foreground">
						<div className="flex justify-between">
							<span>Active Tickers:</span>
							<span className="font-medium">{sectorPerformance.activeTickersCount}/{sectorPerformance.totalTickers}</span>
						</div>
						
						{sectorPerformance.topPerformers.length > 0 && (
							<div>
								<span>Top Performer:</span>
								<span className={`font-medium ml-1 ${sectorPerformance.topPerformers[0].changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
									{sectorPerformance.topPerformers[0].ticker} ({sectorPerformance.topPerformers[0].changePercent > 0 ? "+" : ""}{sectorPerformance.topPerformers[0].changePercent.toFixed(1)}%)
								</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

function TopPerformers({ performers, title, isLoading }: { performers: TickerPerformance[], title: string, isLoading: boolean }) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<DollarSign className="h-5 w-5" />
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{[1, 2, 3, 4, 5].map(i => (
							<div key={i} className="animate-pulse">
								<div className="h-4 bg-muted rounded w-full mb-1"></div>
								<div className="h-3 bg-muted rounded w-3/4"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg flex items-center gap-2">
					<DollarSign className="h-5 w-5" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{performers.slice(0, 5).map((performer, index) => {
						const isPositive = performer.changePercent >= 0;
						return (
							<Link key={performer.ticker} to="/ticker/$symbol" params={{ symbol: performer.ticker }}>
								<div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
											{index + 1}
										</div>
										<div>
											<p className="font-medium text-sm">{performer.ticker}</p>
											<p className="text-xs text-muted-foreground">
												{new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
													minimumFractionDigits: 0,
													maximumFractionDigits: 0,
												}).format(performer.currentPrice)}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className={`text-sm font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
											{isPositive ? "+" : ""}{performer.changePercent.toFixed(2)}%
										</p>
										<p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
											{isPositive ? "+" : ""}{new Intl.NumberFormat("vi-VN", {
												style: "currency", 
												currency: "VND",
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											}).format(performer.change)}
										</p>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

function Dashboard() {
	const [timeRange, setTimeRange] = useState<TimeRange>("1M");
	const dateRangeConfig = createDateRangeConfig(timeRange);
	const { data: vnindexData, isLoading: vnindexLoading } = useTickerData(
		"VNINDEX",
		dateRangeConfig,
	);
	const { data: tickerGroups } = useTickerGroups();

	// Load data for key sectors
	const { data: securitiesData, isLoading: securitiesLoading } = useSectorData("CHUNG_KHOAN", dateRangeConfig);
	const { data: bankingData, isLoading: bankingLoading } = useSectorData("NGAN_HANG", dateRangeConfig);
	const { data: realEstateData, isLoading: realEstateLoading } = useSectorData("BAT_DONG_SAN", dateRangeConfig);

	// Calculate top performers across all sectors
	const topPerformers = useMemo(() => {
		const allData: Record<string, any> = {};
		if (securitiesData) allData.CHUNG_KHOAN = securitiesData;
		if (bankingData) allData.NGAN_HANG = bankingData;  
		if (realEstateData) allData.BAT_DONG_SAN = realEstateData;

		const allPerformances: TickerPerformance[] = [];
		Object.values(allData).forEach((sectorData: any) => {
			Object.entries(sectorData).forEach(([ticker, data]: [string, any]) => {
				if (data.length >= 2) {
					const latest = data[data.length - 1];
					const previous = data[data.length - 2];
					const change = latest.close - previous.close;
					const changePercent = (change / previous.close) * 100;
					
					allPerformances.push({
						ticker,
						currentPrice: latest.close,
						change,
						changePercent,
						volume: latest.volume,
					});
				}
			});
		});

		const topGainers = [...allPerformances].sort((a, b) => b.changePercent - a.changePercent);
		const topLosers = [...allPerformances].sort((a, b) => a.changePercent - b.changePercent);

		return {
			gainers: topGainers,
			losers: topLosers,
		};
	}, [securitiesData, bankingData, realEstateData]);

	const dailyChange = vnindexData ? calculatePriceChange(vnindexData) : null;
	const rangeChange = vnindexData ? calculateRangeChange(vnindexData) : null;
	const latestPrice = vnindexData?.[vnindexData.length - 1];

	const sectorCount = tickerGroups ? Object.keys(tickerGroups).length : 0;
	const totalTickers = tickerGroups
		? Object.values(tickerGroups).reduce(
				(sum, tickers) => sum + tickers.length,
				0,
			)
		: 0;

	const handleTickerSelect = (ticker: string) => {
		// Navigate to ticker route
		window.location.href = `/ticker/${ticker}`;
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">AIPriceAction: Vietnamese Stock Market</h1>
						<p className="text-muted-foreground">
							Comprehensive analysis of VN-Index and individual stocks
						</p>
					</div>
					<div className="flex items-center gap-2">
						<TickerSearch onSelect={handleTickerSelect} />
					</div>
				</div>

				{/* Quick Navigation */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Link to="/sectors">
						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardContent className="flex items-center gap-3 p-4">
								<Building2 className="h-8 w-8 text-primary" />
								<div>
									<p className="font-semibold">Sectors</p>
									<p className="text-sm text-muted-foreground">
										{sectorCount} sectors
									</p>
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link to="/tickers">
						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardContent className="flex items-center gap-3 p-4">
								<Search className="h-8 w-8 text-primary" />
								<div>
									<p className="font-semibold">Tickers</p>
									<p className="text-sm text-muted-foreground">
										{totalTickers} stocks
									</p>
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link to="/compare">
						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardContent className="flex items-center gap-3 p-4">
								<Grid3X3 className="h-8 w-8 text-primary" />
								<div>
									<p className="font-semibold">Compare Charts</p>
									<p className="text-sm text-muted-foreground">Side-by-side</p>
								</div>
							</CardContent>
						</Card>
					</Link>

					<Card>
						<CardContent className="flex items-center gap-3 p-4">
							<TrendingUp className="h-8 w-8 text-primary" />
							<div>
								<p className="font-semibold">VN-Index</p>
								<p className="text-sm text-muted-foreground">
									{latestPrice && (
										<span
											className={
												dailyChange && dailyChange.changePercent >= 0
													? "text-green-600"
													: "text-red-600"
											}
										>
											{latestPrice.close.toLocaleString()}
											{dailyChange && (
												<span className="ml-1">
													({dailyChange.changePercent > 0 ? "+" : ""}
													{dailyChange.changePercent.toFixed(2)}%)
												</span>
											)}
										</span>
									)}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Sector Analytics */}
			<div>
				<div className="flex items-center justify-between mb-4">
					<div>
						<h2 className="text-xl font-semibold">Key Sector Performance</h2>
						<p className="text-sm text-muted-foreground">Daily performance of major sectors</p>
					</div>
					<DateRangeSelector 
						value={dateRangeConfig} 
						onChange={(config) => {
							if (config.range !== "CUSTOM") {
								setTimeRange(config.range);
							}
						}}
						dataRange={vnindexData}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<SectorAnalytics sector="CHUNG_KHOAN" dateRangeConfig={dateRangeConfig} />
					<SectorAnalytics sector="NGAN_HANG" dateRangeConfig={dateRangeConfig} />
					<SectorAnalytics sector="BAT_DONG_SAN" dateRangeConfig={dateRangeConfig} />
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* VN-Index Chart */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								VN-Index Overview
							</CardTitle>
						</CardHeader>
						<CardContent>
							{vnindexLoading ? (
								<div className="h-[400px] flex items-center justify-center">
									<div className="text-muted-foreground">
										Loading VN-Index data...
									</div>
								</div>
							) : vnindexData ? (
								<CandlestickChart
									data={vnindexData}
									height={400}
								/>
							) : (
								<div className="h-[400px] flex items-center justify-center">
									<div className="text-muted-foreground">
										Failed to load VN-Index data
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</div>

				{/* Market Stats & Quick Actions */}
				<div className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Market Statistics</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{latestPrice && (
								<>
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Current Price
										</p>
										<p className="text-2xl font-bold">
											{latestPrice.close.toLocaleString()}
										</p>
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
												{new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
													minimumFractionDigits: 0,
													maximumFractionDigits: 2,
												}).format(dailyChange.change)}
												{" "}({dailyChange.changePercent > 0 ? "+" : ""}
												{dailyChange.changePercent.toFixed(2)}%)
											</p>
										)}
										{/* Range Change */}
										{rangeChange && (
											<p
												className={`text-lg font-semibold ${rangeChange.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
											>
												{timeRange}: {rangeChange.changePercent > 0 ? "+" : ""}
												{new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
													minimumFractionDigits: 0,
													maximumFractionDigits: 2,
												}).format(rangeChange.change)}
												{" "}({rangeChange.changePercent > 0 ? "+" : ""}
												{rangeChange.changePercent.toFixed(2)}%)
											</p>
										)}
									</div>

									<div>
										<p className="text-sm font-medium text-muted-foreground">
											Volume
										</p>
										<p className="text-lg font-semibold">
											{latestPrice.volume.toLocaleString()}
										</p>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Quick Actions</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Link to="/ticker/$symbol" params={{ symbol: "VNINDEX" }}>
								<Button variant="outline" className="w-full justify-start">
									View VN-Index Details
								</Button>
							</Link>
							<Link to="/sector/$sectorName" params={{ sectorName: "NGAN_HANG" }}>
								<Button variant="outline" className="w-full justify-start">
									Banking Sector
								</Button>
							</Link>
							<Link to="/sector/$sectorName" params={{ sectorName: "BAT_DONG_SAN" }}>
								<Button variant="outline" className="w-full justify-start">
									Real Estate Sector
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Top Performers Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TopPerformers 
					performers={topPerformers.gainers} 
					title="Top Gainers" 
					isLoading={securitiesLoading || bankingLoading || realEstateLoading}
				/>
				<TopPerformers 
					performers={topPerformers.losers} 
					title="Top Losers" 
					isLoading={securitiesLoading || bankingLoading || realEstateLoading}
				/>
			</div>
		</div>
	);
}