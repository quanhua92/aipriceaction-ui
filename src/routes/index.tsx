import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Search, BarChart3, Grid3X3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CandlestickChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { useTickerData, useTickerGroups } from "@/lib/queries";
import { calculatePriceChange, calculateRangeChange, createDateRangeConfig, type TimeRange } from "@/lib/stock-data";

export const Route = createFileRoute("/")({
	component: Dashboard,
});

function Dashboard() {
	const [timeRange, setTimeRange] = useState<TimeRange>("3M");
	const dateRangeConfig = createDateRangeConfig(timeRange);
	const { data: vnindexData, isLoading: vnindexLoading } = useTickerData(
		"VNINDEX",
		dateRangeConfig,
	);
	const { data: tickerGroups } = useTickerGroups();

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
					<Link to="/tickers">
						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardContent className="flex items-center gap-3 p-4">
								<Search className="h-8 w-8 text-primary" />
								<div>
									<p className="font-semibold">Browse Tickers</p>
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

					<Link to="/sectors">
						<Card className="cursor-pointer hover:shadow-md transition-shadow">
							<CardContent className="flex items-center gap-3 p-4">
								<BarChart3 className="h-8 w-8 text-primary" />
								<div>
									<p className="font-semibold">Sectors</p>
									<p className="text-sm text-muted-foreground">
										{sectorCount} sectors
									</p>
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

			{/* VN-Index Chart */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="h-5 w-5" />
								VN-Index Overview
							</CardTitle>
							<DateRangeSelector 
								value={dateRangeConfig} 
								onChange={(config) => {
									if (config.range !== "CUSTOM") {
										setTimeRange(config.range);
									}
								}}
								dataRange={vnindexData}
							/>
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

				{/* Market Stats */}
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
		</div>
	);
}
