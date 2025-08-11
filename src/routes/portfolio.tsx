import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useTranslation } from "@/hooks/useTranslation";
import { PieChart, BarChart3, ExternalLink, Target } from "lucide-react";
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
	EducationalGuide,
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
	const { t } = useTranslation();
	const navigate = useNavigate({ from: Route.fullPath });
	const { tickers = [], range = "3M", startDate, endDate } = Route.useSearch();

	// Create date range configuration
	const [dateRangeConfig, setDateRangeConfig] = useState<DateRangeConfig>(
		createDateRangeConfig(range, startDate, endDate),
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
				startDate: config.startDate
					? config.startDate.toISOString().split("T")[0]
					: undefined,
				endDate: config.endDate
					? config.endDate.toISOString().split("T")[0]
					: undefined,
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
			if (
				!newTickers.includes("VNINDEX") &&
				newTickers.some((t) => t !== "VNINDEX")
			) {
				newTickers.push("VNINDEX");
			}
			updateSearchParams({ tickers: newTickers });
		}
	};

	const handleRemoveTicker = (tickerToRemove: string) => {
		updateSearchParams({
			tickers: tickers.filter((t) => t !== tickerToRemove),
		});
	};

	// Filter out VNINDEX for portfolio stocks, keep it separate for benchmark
	const portfolioTickers = tickers.filter((t) => t !== "VNINDEX");
	const hasVnIndex = tickers.includes("VNINDEX");
	const vnindexData = hasVnIndex ? tickerData?.["VNINDEX"] || [] : [];

	if (tickers.length === 0) {
		return (
			<div className="container mx-auto p-6">
				<div className="text-center space-y-6">
					<div>
						<h1 className="text-3xl font-bold mb-2 flex items-center gap-2 justify-center">
							<Target className="h-8 w-8" />
							{t("portfolio.title")}
						</h1>
						<p className="text-muted-foreground">{t("portfolio.subtitle")}</p>
					</div>

					<Card className="max-w-2xl mx-auto">
						<CardContent className="p-8">
							<div className="space-y-6">
								<div>
									<PieChart className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
									<p className="text-xl font-medium text-muted-foreground mb-2">
										{t("portfolio.buildPortfolio")}
									</p>
									<p className="text-sm text-muted-foreground">
										{t("guide.subtitle")}
									</p>
								</div>

								{/* Ticker Search */}
								<div className="space-y-2">
									<label className="text-sm font-medium block">
										{t("portfolio.searchForStocks")}
									</label>
									<TickerSearch
										onSelect={handleAddTicker}
										placeholder={t("portfolio.searchPlaceholder")}
										className="w-full"
										keepOpenAfterSelect={true}
									/>
									<p className="text-xs text-muted-foreground">
										{t("portfolio.searchHint")}
									</p>
								</div>

								<div className="border-t pt-4">
									<p className="text-sm font-medium mb-3">
										{t("portfolio.samplePortfolios")}
									</p>
									<div className="flex flex-wrap gap-2 justify-center">
										<Link
											to="/portfolio"
											search={{
												tickers: ["VCB", "BID", "CTG", "ACB", "VNINDEX"],
												range: "3M",
											}}
										>
											<Button variant="outline" size="sm">
												{t("portfolio.bankingPortfolio")}
											</Button>
										</Link>
										<Link
											to="/portfolio"
											search={{
												tickers: ["VHM", "VIC", "VRE", "KDH", "VNINDEX"],
												range: "3M",
											}}
										>
											<Button variant="outline" size="sm">
												{t("portfolio.realEstatePortfolio")}
											</Button>
										</Link>
										<Link
											to="/portfolio"
											search={{
												tickers: ["SSI", "VCI", "HCM", "MBS", "VNINDEX"],
												range: "3M",
											}}
										>
											<Button variant="outline" size="sm">
												{t("portfolio.securitiesPortfolio")}
											</Button>
										</Link>
										<Link
											to="/portfolio"
											search={{
												tickers: ["HPG", "HSG", "NKG", "POM", "VNINDEX"],
												range: "3M",
											}}
										>
											<Button variant="outline" size="sm">
												{t("portfolio.industrialPortfolio")}
											</Button>
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
					{t("portfolio.title")}
				</h1>
				<p className="text-muted-foreground">
					{t("portfolio.subtitle", { count: portfolioTickers.length })}
				</p>
			</div>

			{/* Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						{t("portfolio.configuration")}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Add Ticker */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							{t("portfolio.addStock")}
						</label>
						<TickerSearch
							onSelect={handleAddTicker}
							placeholder={t("portfolio.addStockPlaceholder")}
							className="w-full"
							keepOpenAfterSelect={true}
						/>
						{!hasVnIndex && (
							<div className="mt-2">
								<Button 
									variant="outline" 
									size="sm" 
									onClick={() => handleAddTicker("VNINDEX")}
									className="text-xs"
								>
									+ VNINDEX
								</Button>
								<p className="text-xs text-muted-foreground mt-1">
									{t("portfolio.addVnindexQuickly")}
								</p>
							</div>
						)}
					</div>

					{/* Current Portfolio */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							{t("portfolio.currentPortfolio", {
								count: portfolioTickers.length,
							})}
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
								{t("portfolio.clickToRemove")}
							</p>
						)}
					</div>

					{/* Controls Row */}
					<div className="flex flex-col sm:flex-row gap-4 items-start">
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">
								{t("portfolio.analysisPeriod")}
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
									range:
										dateRangeConfig.range !== "CUSTOM"
											? dateRangeConfig.range
											: undefined,
									startDate:
										dateRangeConfig.range === "CUSTOM" &&
										dateRangeConfig.startDate
											? dateRangeConfig.startDate.toISOString().split("T")[0]
											: undefined,
									endDate:
										dateRangeConfig.range === "CUSTOM" &&
										dateRangeConfig.endDate
											? dateRangeConfig.endDate.toISOString().split("T")[0]
											: undefined,
								}}
							>
								<Button variant="outline" className="flex items-center gap-2">
									<ExternalLink className="h-4 w-4" />
									{t("portfolio.openInCompare")}
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
						hasVnIndex={hasVnIndex}
					/>

					{/* Ticker Performance Table */}
					<TickerPerformanceTable
						tickerData={tickerData || {}}
						tickers={portfolioTickers}
						timeRange={dateRangeConfig.range}
						isLoading={isLoading}
						title={t("portfolio.stocksPerformance")}
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

					{/* Educational Guide */}
					<EducationalGuide />
				</div>
			)}
		</div>
	);
}

