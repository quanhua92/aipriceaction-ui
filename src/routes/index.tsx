import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Search, Grid3X3, Building2, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandlestickChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { useTickerData, useTickerGroups, useSectorData } from "@/lib/queries";
import { useTranslation } from "@/hooks/useTranslation";
import { VPAButton } from "@/components/vpa";
import { 
	calculatePriceChange, 
	calculateRangeChange, 
	createDateRangeConfig, 
	calculateSectorPerformance,
	getSectorDisplayName,
	type DateRangeConfig,
	type TickerPerformance 
} from "@/lib/stock-data";

export const Route = createFileRoute("/")({
	component: Dashboard,
});

interface SectorAnalyticsProps {
	sector: string;
	dateRangeConfig: any;
	timeRange: string;
}

function SectorAnalytics({ sector, dateRangeConfig, timeRange }: SectorAnalyticsProps) {
	const { data: sectorData, isLoading } = useSectorData(sector, dateRangeConfig);
	const { t } = useTranslation();
	
	const sectorPerformance = useMemo(() => {
		if (!sectorData) return null;
		const displayName = t(`sectorNames.${sector}` as any) || getSectorDisplayName(sector);
		return calculateSectorPerformance(sectorData, sector, displayName);
	}, [sectorData, sector, t]);

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
					<p className="text-sm text-muted-foreground">{t("common.noData")}</p>
				</CardContent>
			</Card>
		);
	}

	const isDailyPositive = sectorPerformance.averageDailyChange >= 0;
	const isRangePositive = sectorPerformance.averageRangeChange >= 0;

	return (
		<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
			<Card className="hover:shadow-md transition-shadow cursor-pointer">
				<CardContent className="p-4">
					<div className="flex items-start justify-between mb-3">
						<div className="flex items-center gap-2">
							<Building2 className="h-5 w-5 text-primary" />
							<h3 className="font-semibold text-sm">{sectorPerformance.sectorName}</h3>
						</div>
					</div>
					
					<div className="space-y-2">
						{/* Daily Performance */}
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">{t("common.daily")}:</span>
							<span className={`text-xs font-semibold ${isDailyPositive ? "text-green-600" : "text-red-600"}`}>
								{isDailyPositive ? "+" : ""}{sectorPerformance.averageDailyChange.toFixed(2)}%
							</span>
						</div>
						
						{/* Range Performance */}
						<div className="flex items-center justify-between">
							<span className="text-xs text-muted-foreground">{t(`timeRanges.${timeRange}` as any)}:</span>
							<span className={`text-sm font-bold ${isRangePositive ? "text-green-600" : "text-red-600"}`}>
								{isRangePositive ? "+" : ""}{sectorPerformance.averageRangeChange.toFixed(2)}%
							</span>
						</div>
						
						{/* Additional Info */}
						<div className="pt-1 space-y-1 text-xs text-muted-foreground border-t">
							<div className="flex justify-between">
								<span>{t("common.active")}:</span>
								<span className="font-medium">{sectorPerformance.activeTickersCount}/{sectorPerformance.totalTickers}</span>
							</div>
							
							{sectorPerformance.topPerformers.length > 0 && (
								<div className="flex justify-between">
									<span>Top:</span>
									<span className={`font-medium ${sectorPerformance.topPerformers[0].changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
										{sectorPerformance.topPerformers[0].ticker} ({sectorPerformance.topPerformers[0].changePercent > 0 ? "+" : ""}{sectorPerformance.topPerformers[0].changePercent.toFixed(1)}%)
									</span>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

function TopPerformers({ 
	performers, 
	title, 
	isLoading, 
	dailyPerformers, 
	timeRange 
}: { 
	performers: TickerPerformance[], 
	title: string, 
	isLoading: boolean,
	dailyPerformers: TickerPerformance[],
	timeRange: string
}) {
	const { t } = useTranslation();
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

	// Create a map to quickly find daily performance for each ticker
	const dailyPerformanceMap = dailyPerformers.reduce((acc, perf) => {
		acc[perf.ticker] = perf;
		return acc;
	}, {} as Record<string, TickerPerformance>);

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
						const dailyPerf = dailyPerformanceMap[performer.ticker];
						const isDailyPositive = dailyPerf?.changePercent >= 0;
						const isRangePositive = performer.changePercent >= 0;
						
						return (
							<div key={performer.ticker} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
										{index + 1}
									</div>
									<div>
										<Link to="/ticker/$symbol" params={{ symbol: performer.ticker }} className="hover:underline">
											<p className="font-medium text-sm cursor-pointer">{performer.ticker}</p>
										</Link>
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
								<div className="flex items-center gap-3">
									<div className="grid grid-cols-2 gap-4 items-center">
										{/* Daily Performance */}
										{dailyPerf && (
											<div className="text-center">
												<p className="text-xs text-muted-foreground mb-1">{t("common.daily")}</p>
												<p className={`text-sm font-semibold ${isDailyPositive ? "text-green-600" : "text-red-600"}`}>
													{isDailyPositive ? "+" : ""}{dailyPerf.changePercent.toFixed(2)}%
												</p>
											</div>
										)}
										{/* Range Performance */}
										<div className="text-center">
											<p className="text-xs text-muted-foreground mb-1">{t(`timeRanges.${timeRange}` as any)}</p>
											<p className={`text-sm font-bold ${isRangePositive ? "text-green-600" : "text-red-600"}`}>
												{isRangePositive ? "+" : ""}{performer.changePercent.toFixed(2)}%
											</p>
										</div>
									</div>
									{/* VPA Button */}
									<VPAButton 
										ticker={performer.ticker}
										variant="badge"
										mode="popover"
									/>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}

function Dashboard() {
	const [dateRangeConfig, setDateRangeConfig] = useState<DateRangeConfig>(createDateRangeConfig("1M"));
	const timeRange = dateRangeConfig.range;
	const { t } = useTranslation();
	const { data: vnindexData, isLoading: vnindexLoading } = useTickerData(
		"VNINDEX",
		dateRangeConfig,
	);
	const { data: tickerGroups } = useTickerGroups();

	// Load data for key sectors
	const { data: securitiesData, isLoading: securitiesLoading } = useSectorData("CHUNG_KHOAN", dateRangeConfig);
	const { data: bankingData, isLoading: bankingLoading } = useSectorData("NGAN_HANG", dateRangeConfig);
	const { data: realEstateData, isLoading: realEstateLoading } = useSectorData("BAT_DONG_SAN", dateRangeConfig);

	// Calculate top performers across all sectors - both daily and range
	const topPerformers = useMemo(() => {
		const allData: Record<string, any> = {};
		if (securitiesData) allData.CHUNG_KHOAN = securitiesData;
		if (bankingData) allData.NGAN_HANG = bankingData;  
		if (realEstateData) allData.BAT_DONG_SAN = realEstateData;

		const dailyPerformances: TickerPerformance[] = [];
		const rangePerformances: TickerPerformance[] = [];
		
		Object.values(allData).forEach((sectorData: any) => {
			Object.entries(sectorData).forEach(([ticker, data]: [string, any]) => {
				if (data.length >= 2) {
					// Daily performance (last 2 data points)
					const latest = data[data.length - 1];
					const previous = data[data.length - 2];
					const dailyChange = latest.close - previous.close;
					const dailyChangePercent = (dailyChange / previous.close) * 100;
					
					dailyPerformances.push({
						ticker,
						currentPrice: latest.close,
						change: dailyChange,
						changePercent: dailyChangePercent,
						volume: latest.volume,
					});

					// Range performance (first vs last data point)
					const first = data[0];
					const rangeChange = latest.close - first.close;
					const rangeChangePercent = (rangeChange / first.close) * 100;
					
					rangePerformances.push({
						ticker,
						currentPrice: latest.close,
						change: rangeChange,
						changePercent: rangeChangePercent,
						volume: latest.volume,
					});
				}
			});
		});

		return {
			daily: {
				gainers: [...dailyPerformances].sort((a, b) => b.changePercent - a.changePercent),
				losers: [...dailyPerformances].sort((a, b) => a.changePercent - b.changePercent),
			},
			range: {
				gainers: [...rangePerformances].sort((a, b) => b.changePercent - a.changePercent),
				losers: [...rangePerformances].sort((a, b) => a.changePercent - b.changePercent),
			}
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
		<div className="container mx-auto p-2 md:p-6 space-y-4 md:space-y-6">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">{t("home.title")}</h1>
						<p className="text-muted-foreground">
							{t("home.subtitle")}
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
									<p className="font-semibold">{t("home.sectors")}</p>
									<p className="text-sm text-muted-foreground">
										{sectorCount} {t("home.sectors").toLowerCase()}
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
									<p className="font-semibold">{t("nav.tickers")}</p>
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
									<p className="font-semibold">{t("nav.compareCharts")}</p>
									<p className="text-sm text-muted-foreground">{t("compare.subtitle")}</p>
								</div>
							</CardContent>
						</Card>
					</Link>

					<Card>
						<CardContent className="flex items-center gap-3 p-4">
							<TrendingUp className="h-8 w-8 text-primary" />
							<div>
								<p className="font-semibold">{t("home.vnIndex")}</p>
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
						<h2 className="text-xl font-semibold">{t("home.keySectorPerformance")}</h2>
						<p className="text-sm text-muted-foreground">{t("common.daily")} performance of major sectors</p>
					</div>
					<DateRangeSelector 
						value={dateRangeConfig} 
						onChange={setDateRangeConfig}
						dataRange={vnindexData}
					/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
					<SectorAnalytics sector="CHUNG_KHOAN" dateRangeConfig={dateRangeConfig} timeRange={timeRange} />
					<SectorAnalytics sector="NGAN_HANG" dateRangeConfig={dateRangeConfig} timeRange={timeRange} />
					<SectorAnalytics sector="BAT_DONG_SAN" dateRangeConfig={dateRangeConfig} timeRange={timeRange} />
				</div>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6">
				{/* VN-Index Chart */}
				<div className="lg:col-span-2">
					<Card>
						<CardHeader className="p-3 md:p-6">
							<CardTitle className="flex items-center gap-2 text-sm md:text-base">
								<TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
								{t("home.vnIndex")} {t("home.marketOverview")}
							</CardTitle>
						</CardHeader>
						<CardContent className="p-2 md:p-6">
							{vnindexLoading ? (
								<div className="h-[300px] md:h-[400px] flex items-center justify-center">
									<div className="text-muted-foreground">
										{t("loading.tickerData")}
									</div>
								</div>
							) : vnindexData ? (
								<div className="h-[280px] md:h-[400px] w-full">
									<CandlestickChart
										data={vnindexData}
										height={0} // Will use container height
										showCard={false}
									/>
								</div>
							) : (
								<div className="h-[300px] md:h-[400px] flex items-center justify-center">
									<div className="text-muted-foreground">
										{t("errors.failedToLoad")}
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
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg">{t("home.marketOverview")}</CardTitle>
								<p className="text-sm text-muted-foreground">
									{new Date().toLocaleDateString('vi-VN', {
										weekday: 'long',
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{latestPrice && (
								<>
									<div>
										<p className="text-sm font-medium text-muted-foreground">
											{t("common.current")} {t("common.price")}
										</p>
										<p className="text-2xl font-bold">
											{latestPrice.close.toLocaleString()}
										</p>
									</div>

									<div>
										<p className="text-sm font-medium text-muted-foreground">
											{t("common.change")}
										</p>
										{/* Daily Change */}
										{dailyChange && (
											<p
												className={`text-sm font-medium ${dailyChange.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
											>
												{t("common.daily")}: {dailyChange.changePercent > 0 ? "+" : ""}
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
							<CardTitle className="text-lg">{t("home.quickActions")}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<Link to="/ticker/$symbol" params={{ symbol: "VNINDEX" }}>
								<Button variant="outline" className="w-full justify-start">
									{t("common.view")} {t("home.vnIndex")} Details
								</Button>
							</Link>
							<Link to="/sector/$sectorName" params={{ sectorName: "NGAN_BANG" }}>
								<Button variant="outline" className="w-full justify-start">
									{t("sectorNames.NGAN_HANG")}
								</Button>
							</Link>
							<Link to="/sector/$sectorName" params={{ sectorName: "BAT_DONG_SAN" }}>
								<Button variant="outline" className="w-full justify-start">
									{t("sectorNames.BAT_DONG_SAN")}
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Top Performers Section */}
			<div>
				<h2 className="text-xl font-semibold mb-4">{t("home.topPerformers")}</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
					{/* Daily Gainers/Losers */}
					<TopPerformers 
						performers={topPerformers.daily.gainers} 
						title={`${t("common.daily")} ${t("home.topGainers")}`} 
						isLoading={securitiesLoading || bankingLoading || realEstateLoading}
						dailyPerformers={topPerformers.daily.gainers}
						timeRange={timeRange}
					/>
					<TopPerformers 
						performers={topPerformers.daily.losers} 
						title={`${t("common.daily")} ${t("home.topLosers")}`} 
						isLoading={securitiesLoading || bankingLoading || realEstateLoading}
						dailyPerformers={topPerformers.daily.losers}
						timeRange={timeRange}
					/>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Range Gainers/Losers */}
					<TopPerformers 
						performers={topPerformers.range.gainers} 
						title={`${t(`timeRanges.${timeRange}` as any)} ${t("home.topGainers")}`}
						isLoading={securitiesLoading || bankingLoading || realEstateLoading}
						dailyPerformers={topPerformers.daily.gainers}
						timeRange={timeRange}
					/>
					<TopPerformers 
						performers={topPerformers.range.losers} 
						title={`${t(`timeRanges.${timeRange}` as any)} ${t("home.topLosers")}`}
						isLoading={securitiesLoading || bankingLoading || realEstateLoading}
						dailyPerformers={topPerformers.daily.losers}
						timeRange={timeRange}
					/>
				</div>
			</div>
		</div>
	);
}