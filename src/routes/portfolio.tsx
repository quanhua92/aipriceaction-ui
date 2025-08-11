import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PieChart, BarChart3, ExternalLink, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
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
			updateSearchParams({ tickers: [...tickers, ticker] });
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
								<Badge variant="outline" className="text-sm">
									VNINDEX (Benchmark)
								</Badge>
							)}
						</div>
						{portfolioTickers.length > 0 && (
							<p className="text-xs text-muted-foreground">
								Click on a stock badge to remove it from your portfolio
							</p>
						)}
						{portfolioTickers.length > 0 && !hasVnIndex && (
							<Button 
								variant="outline" 
								size="sm" 
								onClick={() => handleAddTicker("VNINDEX")}
								className="mt-2"
							>
								Add VN-Index Benchmark
							</Button>
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
				</div>
			)}
		</div>
	);
}