import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PieChart, BarChart3, ExternalLink, Target, BookOpen, TrendingUp, Shield, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { TickerPerformanceTable } from "@/components/ui/TickerPerformanceTable";
import { useMultipleTickerData } from "@/lib/queries";
import {
	PerformanceOverview,
	RiskAnalysis,
	DiversificationAnalysis,
	PerformanceAttribution,
} from "@/components/portfolio";
import {
	createDateRangeConfig,
	type TimeRange,
	type DateRangeConfig,
} from "@/lib/stock-data";

interface PortfolioPageSearch {
	tickers?: string[];
	range?: TimeRange;
	startDate?: string;
	endDate?: string;
}

export const Route = createFileRoute("/portfolio")({
	validateSearch: (search: Record<string, unknown>): PortfolioPageSearch => {
		return {
			tickers: Array.isArray(search.tickers)
				? (search.tickers as string[])
				: [],
			range: (search.range as TimeRange) || "3M",
			startDate: search.startDate as string,
			endDate: search.endDate as string,
		};
	},
	component: PortfolioPage,
});

function PortfolioPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { tickers = [], range = "3M", startDate, endDate } = Route.useSearch();
	
	// Create date range configuration
	const [dateRangeConfig, setDateRangeConfig] = useState<DateRangeConfig>(
		createDateRangeConfig(range, startDate, endDate)
	);

	const { data: tickerData, isLoading } = useMultipleTickerData(
		tickers,
		dateRangeConfig,
		500,
	);

	const updateSearchParams = (updates: Partial<PortfolioPageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	// Update URL when date range changes
	const handleDateRangeChange = (config: DateRangeConfig) => {
		setDateRangeConfig(config);
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
	};

	// Handle adding/removing tickers
	const handleAddTicker = (ticker: string) => {
		if (!tickers.includes(ticker)) {
			const newTickers = [...tickers, ticker];
			// Always ensure VNINDEX is included when we have any portfolio tickers
			if (!newTickers.includes("VNINDEX") && newTickers.some(t => t !== "VNINDEX")) {
				newTickers.push("VNINDEX");
			}
			updateSearchParams({ tickers: newTickers });
		}
	};

	const handleRemoveTicker = (tickerToRemove: string) => {
		updateSearchParams({ tickers: tickers.filter(t => t !== tickerToRemove) });
	};

	// Filter out VNINDEX for portfolio stocks, keep it separate for benchmark
	const portfolioTickers = tickers.filter(t => t !== "VNINDEX");
	const hasVnIndex = tickers.includes("VNINDEX");
	const vnindexData = hasVnIndex ? tickerData?.["VNINDEX"] || [] : [];

	if (tickers.length === 0) {
		return (
			<div className="container mx-auto p-6">
				<div className="text-center space-y-6">
					<div>
						<h1 className="text-3xl font-bold mb-2 flex items-center gap-2 justify-center">
							<Target className="h-8 w-8" />
							Portfolio Analysis
						</h1>
						<p className="text-muted-foreground">
							Comprehensive portfolio performance and risk analysis
						</p>
					</div>
					
					<Card className="max-w-2xl mx-auto">
						<CardContent className="p-8">
							<div className="space-y-6">
								<div>
									<PieChart className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
									<p className="text-xl font-medium text-muted-foreground mb-2">Build Your Portfolio</p>
									<p className="text-sm text-muted-foreground">
										Search and add stocks to analyze performance, risk metrics, and diversification
									</p>
								</div>

								{/* Ticker Search */}
								<div className="space-y-2">
									<label className="text-sm font-medium block">
										Search for Stocks
									</label>
									<TickerSearch 
										onSelect={handleAddTicker}
										placeholder="Type stock symbol (e.g., VCB, VHM, HPG)..."
										className="w-full"
										keepOpenAfterSelect={true}
									/>
									<p className="text-xs text-muted-foreground">
										Start typing to search Vietnamese stocks
									</p>
								</div>

								<div className="border-t pt-4">
									<p className="text-sm font-medium mb-3">Or try these sample portfolios:</p>
									<div className="flex flex-wrap gap-2 justify-center">
										<Link to="/portfolio" search={{ tickers: ["VCB", "BID", "CTG", "ACB", "VNINDEX"], range: "3M" }}>
											<Button variant="outline" size="sm">Banking Portfolio</Button>
										</Link>
										<Link to="/portfolio" search={{ tickers: ["VHM", "VIC", "VRE", "KDH", "VNINDEX"], range: "3M" }}>
											<Button variant="outline" size="sm">Real Estate Portfolio</Button>
										</Link>
										<Link to="/portfolio" search={{ tickers: ["HPG", "HSG", "NKG", "POM", "VNINDEX"], range: "3M" }}>
											<Button variant="outline" size="sm">Industrial Portfolio</Button>
										</Link>
										<Link to="/portfolio" search={{ tickers: ["SSI", "VCI", "HCM", "MBS", "VNINDEX"], range: "3M" }}>
											<Button variant="outline" size="sm">Securities Portfolio</Button>
										</Link>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
					<Target className="h-8 w-8" />
					Portfolio Analysis
				</h1>
				<p className="text-muted-foreground">
					Comprehensive analysis of {portfolioTickers.length} stocks vs VN-Index benchmark
				</p>
			</div>

			{/* Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Portfolio Configuration
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Add Ticker */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Add Stock to Portfolio
						</label>
						<TickerSearch 
							onSelect={handleAddTicker}
							placeholder="Search and add stocks to your portfolio..."
							className="w-full"
							keepOpenAfterSelect={true}
						/>
					</div>

					{/* Current Portfolio */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Current Portfolio ({portfolioTickers.length} stocks)
						</label>
						<div className="flex flex-wrap gap-2 mb-2">
							{portfolioTickers.map((ticker) => (
								<Badge 
									key={ticker} 
									variant="secondary" 
									className="text-sm cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
									onClick={() => handleRemoveTicker(ticker)}
									title={`Click to remove ${ticker}`}
								>
									{ticker} ×
								</Badge>
							))}
							{hasVnIndex && (
								<Badge 
									variant="outline" 
									className="text-sm cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
									onClick={() => handleRemoveTicker("VNINDEX")}
									title="Click to remove VNINDEX benchmark"
								>
									VNINDEX (Benchmark) ×
								</Badge>
							)}
						</div>
						{portfolioTickers.length > 0 && (
							<p className="text-xs text-muted-foreground">
								Click on a stock badge to remove it from your portfolio
							</p>
						)}
					</div>

					{/* Controls Row */}
					<div className="flex flex-col sm:flex-row gap-4 items-start">
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">
								Analysis Period
							</label>
							<DateRangeSelector
								value={dateRangeConfig}
								onChange={handleDateRangeChange}
								dataRange={vnindexData}
								showNavigationButtons={true}
							/>
						</div>
						<div className="flex gap-2">
							<Link 
								to="/compare" 
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
									<ExternalLink className="h-4 w-4" />
									Open in Compare
								</Button>
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Portfolio Analysis Content */}
			{isLoading ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardContent className="p-6">
								<div className="animate-pulse space-y-4">
									<div className="h-4 bg-muted rounded w-1/2"></div>
									<div className="h-32 bg-muted rounded"></div>
									<div className="space-y-2">
										<div className="h-4 bg-muted rounded w-3/4"></div>
										<div className="h-4 bg-muted rounded w-1/2"></div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="space-y-8">
					{/* Performance Overview */}
					<PerformanceOverview
						portfolioData={tickerData || {}}
						benchmarkData={vnindexData}
						portfolioTickers={portfolioTickers}
					/>

					{/* Ticker Performance Table */}
					<TickerPerformanceTable
						tickerData={tickerData || {}}
						tickers={portfolioTickers}
						timeRange={dateRangeConfig.range}
						isLoading={isLoading}
						title="Portfolio Stocks Performance"
					/>

					{/* Risk Analysis */}
					<RiskAnalysis
						portfolioData={tickerData || {}}
						benchmarkData={vnindexData}
						portfolioTickers={portfolioTickers}
					/>

					{/* Performance Attribution */}
					<PerformanceAttribution
						portfolioData={tickerData || {}}
						benchmarkData={vnindexData}
						portfolioTickers={portfolioTickers}
					/>

					{/* Diversification Analysis */}
					<DiversificationAnalysis
						portfolioData={tickerData || {}}
						portfolioTickers={portfolioTickers}
					/>

					{/* Educational Card */}
					<Card className="mt-8">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="h-5 w-5" />
								Portfolio Analysis Guide
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<p className="text-sm text-muted-foreground">
								Understand the key metrics and concepts used in your portfolio analysis:
							</p>

							{/* Performance Metrics */}
							<div>
								<h4 className="font-semibold flex items-center gap-2 mb-3">
									<TrendingUp className="h-4 w-4" />
									Performance Metrics
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<strong>Total Return:</strong> The overall gain or loss on your portfolio over the selected time period, expressed as a percentage.
									</div>
									<div>
										<strong>Active Return:</strong> The difference between your portfolio's return and the VN-Index benchmark. Positive values indicate outperformance.
									</div>
									<div>
										<strong>Sharpe Ratio:</strong> Measures risk-adjusted return. Higher values (&gt;1.0) indicate better risk-adjusted performance.
									</div>
									<div>
										<strong>Information Ratio:</strong> Shows how consistently you outperform the benchmark relative to the additional risk taken.
									</div>
								</div>
							</div>

							{/* Risk Metrics */}
							<div>
								<h4 className="font-semibold flex items-center gap-2 mb-3">
									<Shield className="h-4 w-4" />
									Risk Metrics
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<strong>Volatility:</strong> Measures how much your portfolio's returns fluctuate. Lower volatility indicates more stable returns.
									</div>
									<div>
										<strong>Beta:</strong> Measures sensitivity to market movements. Beta &gt; 1 means more volatile than the market, &lt; 1 means less volatile.
									</div>
									<div>
										<strong>Maximum Drawdown:</strong> The largest peak-to-trough decline in your portfolio's value. Shows worst-case scenario losses.
									</div>
									<div>
										<strong>Value at Risk (95%):</strong> The maximum expected loss on 95% of trading days. Helps estimate potential daily losses.
									</div>
								</div>
							</div>

							{/* Diversification Concepts */}
							<div>
								<h4 className="font-semibold flex items-center gap-2 mb-3">
									<Activity className="h-4 w-4" />
									Diversification & Attribution
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<strong>Correlation:</strong> Measures how stocks move together. Values near 0 indicate good diversification, near 1 means stocks move similarly.
									</div>
									<div>
										<strong>Performance Attribution:</strong> Shows which stocks contributed most to your portfolio's gains or losses.
									</div>
									<div>
										<strong>Sector Allocation:</strong> Distribution of your investments across different industry sectors (Banking, Real Estate, etc.).
									</div>
									<div>
										<strong>Alpha:</strong> The excess return generated by a stock beyond what would be expected based on its beta and market performance.
									</div>
								</div>
							</div>

							{/* Interpretation Guide */}
							<div className="bg-muted/50 rounded-lg p-4">
								<h4 className="font-semibold mb-2">How to Interpret Your Results</h4>
								<div className="space-y-2 text-sm">
									<p><strong>Good Performance:</strong> Positive active return, Sharpe ratio &gt; 1.0, moderate volatility</p>
									<p><strong>Well-Diversified:</strong> Low correlations between stocks, spread across multiple sectors</p>
									<p><strong>Balanced Risk:</strong> Beta around 1.0, maximum drawdown &lt; 30%, reasonable volatility for your risk tolerance</p>
									<p><strong>Time Horizon:</strong> Longer time periods (6M-2Y) provide more meaningful analysis than short periods (1M)</p>
								</div>
							</div>

							{/* Disclaimer */}
							<div className="border-l-4 border-yellow-500 pl-4 text-xs text-muted-foreground">
								<strong>Disclaimer:</strong> This analysis is for educational purposes only and should not be considered investment advice. 
								Past performance does not guarantee future results. Always consult with financial advisors before making investment decisions.
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}