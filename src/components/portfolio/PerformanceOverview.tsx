import { useMemo } from "react";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { ComparisonChart } from "@/components/charts";
import {
	calculatePortfolioPerformance,
	calculateCumulativeReturns,
	calculateDailyReturns,
	type StockDataPoint,
} from "@/lib/stock-data";

interface PerformanceOverviewProps {
	portfolioData: Record<string, StockDataPoint[]>;
	benchmarkData: StockDataPoint[];
	portfolioTickers: string[];
}

export function PerformanceOverview({ 
	portfolioData, 
	benchmarkData, 
	portfolioTickers 
}: PerformanceOverviewProps) {
	const { t } = useTranslation();
	const portfolioMetrics = useMemo(() => {
		if (Object.keys(portfolioData).length === 0 || benchmarkData.length === 0) {
			return null;
		}
		
		// Filter out benchmark from portfolio data
		const filteredPortfolioData: Record<string, StockDataPoint[]> = {};
		portfolioTickers.forEach(ticker => {
			if (portfolioData[ticker]) {
				filteredPortfolioData[ticker] = portfolioData[ticker];
			}
		});
		
		return calculatePortfolioPerformance(filteredPortfolioData, benchmarkData);
	}, [portfolioData, benchmarkData, portfolioTickers]);

	// Create comparison chart data
	const comparisonChartData = useMemo(() => {
		if (!portfolioMetrics || Object.keys(portfolioData).length === 0 || benchmarkData.length === 0 || portfolioTickers.length === 0) {
			return [];
		}

		// Calculate portfolio daily returns
		const portfolioReturns: number[] = [];
		const benchmarkReturns = calculateDailyReturns(benchmarkData);
		
		// Find common date range
		const filteredPortfolioData: Record<string, StockDataPoint[]> = {};
		portfolioTickers.forEach(ticker => {
			if (portfolioData[ticker]) {
				filteredPortfolioData[ticker] = portfolioData[ticker];
			}
		});
		
		// Handle empty portfolio data safely
		const dataLengths = Object.values(filteredPortfolioData).map(data => data?.length || 0).filter(length => length > 0);
		if (dataLengths.length === 0) {
			return [];
		}
		
		const minLength = Math.min(...dataLengths);
		const equalWeight = 1 / portfolioTickers.length;
		
		for (let i = 1; i < minLength; i++) {
			let weightedReturn = 0;
			for (const ticker of portfolioTickers) {
				const stockData = filteredPortfolioData[ticker];
				if (stockData && stockData.length > i) {
					const dailyReturn = (stockData[i].close - stockData[i-1].close) / stockData[i-1].close;
					weightedReturn += dailyReturn * equalWeight;
				}
			}
			portfolioReturns.push(weightedReturn);
		}

		// Calculate cumulative returns
		const portfolioCumulative = calculateCumulativeReturns(portfolioReturns);
		const benchmarkCumulative = calculateCumulativeReturns(benchmarkReturns.slice(0, portfolioReturns.length));
		
		// Create chart data
		const chartData = [];
		const startDate = portfolioTickers.length > 0 && filteredPortfolioData[portfolioTickers[0]] && filteredPortfolioData[portfolioTickers[0]][1] 
			? filteredPortfolioData[portfolioTickers[0]][1].date 
			: null;
		
		for (let i = 0; i < portfolioCumulative.length; i++) {
			if (startDate) {
				const date = new Date(startDate);
				date.setDate(date.getDate() + i);
				chartData.push({
					time: date.toISOString().split('T')[0],
					date: date,
					Portfolio: portfolioCumulative[i] * 100,
					"VN-Index": benchmarkCumulative[i] * 100,
				});
			}
		}
		
		return chartData;
	}, [portfolioData, benchmarkData, portfolioTickers, portfolioMetrics]);

	if (!portfolioMetrics) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5" />
						{t("portfolio.performanceOverview")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center p-8">
						<p className="text-muted-foreground">{t("loading.portfolioData")}</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const isPortfolioPositive = portfolioMetrics.portfolioReturn >= 0;
	const isBenchmarkPositive = portfolioMetrics.benchmarkReturn >= 0;
	const isActivePositive = portfolioMetrics.activeReturn >= 0;

	return (
		<div className="space-y-6">
			{/* Performance Metrics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("metrics.totalReturn")}</p>
								<p className={`text-xl font-bold ${isPortfolioPositive ? "text-green-600" : "text-red-600"}`}>
									{isPortfolioPositive ? "+" : ""}{(portfolioMetrics.portfolioReturn * 100).toFixed(2)}%
								</p>
							</div>
							<div className={`p-2 rounded-full ${isPortfolioPositive ? "bg-green-100" : "bg-red-100"}`}>
								{isPortfolioPositive ? 
									<TrendingUp className="h-5 w-5 text-green-600" /> : 
									<TrendingDown className="h-5 w-5 text-red-600" />
								}
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">VN-Index {t("metrics.totalReturn")}</p>
								<p className={`text-xl font-bold ${isBenchmarkPositive ? "text-green-600" : "text-red-600"}`}>
									{isBenchmarkPositive ? "+" : ""}{(portfolioMetrics.benchmarkReturn * 100).toFixed(2)}%
								</p>
							</div>
							<div className={`p-2 rounded-full ${isBenchmarkPositive ? "bg-green-100" : "bg-red-100"}`}>
								<Target className="h-5 w-5 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("metrics.activeReturn")}</p>
								<p className={`text-xl font-bold ${isActivePositive ? "text-green-600" : "text-red-600"}`}>
									{isActivePositive ? "+" : ""}{(portfolioMetrics.activeReturn * 100).toFixed(2)}%
								</p>
							</div>
							<div className={`p-2 rounded-full ${isActivePositive ? "bg-green-100" : "bg-red-100"}`}>
								<Award className="h-5 w-5 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("metrics.sharpeRatio")}</p>
								<p className="text-xl font-bold text-blue-600">
									{portfolioMetrics.sharpeRatio.toFixed(3)}
								</p>
								<p className="text-xs text-muted-foreground">
									{portfolioMetrics.sharpeRatio > 1 ? "Excellent" : 
									 portfolioMetrics.sharpeRatio > 0.5 ? "Good" : 
									 portfolioMetrics.sharpeRatio > 0 ? "Fair" : "Poor"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Performance Chart */}
			<Card>
				<CardHeader>
					<CardTitle>{t("portfolio.stocksPerformance")}</CardTitle>
					<div className="flex gap-2">
						<Badge variant="default" className="bg-blue-500">Portfolio</Badge>
						<Badge variant="outline">VN-Index</Badge>
					</div>
				</CardHeader>
				<CardContent>
					{comparisonChartData.length > 0 ? (
						<ComparisonChart
							data={comparisonChartData}
							tickers={["Portfolio", "VN-Index"]}
							height={300}
							colors={["#3B82F6", "#10B981"]}
						/>
					) : (
						<div className="h-[300px] flex items-center justify-center">
							<p className="text-muted-foreground">{t("loading.chartData")}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Detailed Metrics */}
			<Card>
				<CardHeader>
					<CardTitle>{t("portfolio.riskAdjustedPerformance")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="space-y-2">
							<h4 className="font-medium">{t("portfolio.volatilityAnalysis")}</h4>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("portfolio.portfolioVolatility")}</span>
									<span className="text-sm font-medium">{(portfolioMetrics.volatility * 100).toFixed(2)}%</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("portfolio.benchmarkVolatility")}</span>
									<span className="text-sm font-medium">{(portfolioMetrics.benchmarkVolatility * 100).toFixed(2)}%</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("metrics.volatility")} Ratio</span>
									<span className="text-sm font-medium">
										{(portfolioMetrics.volatility / portfolioMetrics.benchmarkVolatility).toFixed(2)}x
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="font-medium">{t("guide.riskMetrics")}</h4>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("metrics.maximumDrawdown")}</span>
									<span className="text-sm font-medium text-red-600">
										-{(portfolioMetrics.maxDrawdown * 100).toFixed(2)}%
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("metrics.informationRatio")}</span>
									<span className="text-sm font-medium">{portfolioMetrics.informationRatio.toFixed(3)}</span>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<h4 className="font-medium">{t("guide.performanceMetrics")}</h4>
							<div className="space-y-1">
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("metrics.totalReturn")} per Risk</span>
									<span className="text-sm font-medium">
										{((portfolioMetrics.portfolioReturn / portfolioMetrics.volatility) * 100).toFixed(2)}%
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-sm text-muted-foreground">{t("metrics.activeReturn")}</span>
									<span className={`text-sm font-medium ${isActivePositive ? "text-green-600" : "text-red-600"}`}>
										{isActivePositive ? "✓" : "✗"} {Math.abs(portfolioMetrics.activeReturn * 100).toFixed(2)}pp
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}