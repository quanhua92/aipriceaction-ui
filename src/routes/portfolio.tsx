import { useState, useCallback, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useTranslation } from "@/hooks/useTranslation";
import { PieChart, BarChart3, ExternalLink, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { TickerPerformanceTable } from "@/components/ui/TickerPerformanceTable";
// import { PrePanicWarningWidget } from "@/components/panic";
import { useMultipleTickerData } from "@/lib/queries";
import {
	PerformanceOverview,
	RiskAnalysis,
	DiversificationAnalysis,
	PerformanceAttribution,
	EducationalGuide,
	PortfolioTable,
	SharePortfolioDialog,
	PortfolioSummaryCard,
} from "@/components/portfolio";
import {
	createDateRangeConfig,
	type TimeRange,
	type DateRangeConfig,
} from "@/lib/stock-data";
import {
	type PortfolioItem,
	decodePortfolioItems,
	encodePortfolioItems,
	separatePortfolioItems,
	debounce,
} from "@/lib/portfolio-utils";

interface PortfolioPageSearch {
	tickers?: string;
	deposit?: number;
	manualDeposit?: boolean;
	range?: TimeRange;
	startDate?: string;
	endDate?: string;
}

export const Route = createFileRoute("/portfolio")({
	validateSearch: (search: Record<string, unknown>): PortfolioPageSearch => {
		return {
			tickers: search.tickers as string,
			deposit: typeof search.deposit === 'number' 
				? search.deposit 
				: typeof search.deposit === 'string' 
					? parseFloat(search.deposit) || 0
					: 0,
			manualDeposit: search.manualDeposit === 'true' || search.manualDeposit === true,
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
	const { tickers: tickersString = "", deposit = 0, manualDeposit = false, range = "3M", startDate, endDate } = Route.useSearch();

	// Parse portfolio items from URL
	const portfolioItems = useMemo(() => 
		decodePortfolioItems(tickersString), 
		[tickersString]
	);

	const { investments } = useMemo(() => 
		separatePortfolioItems(portfolioItems), 
		[portfolioItems]
	);

	// Calculate actual deposit - either manual or auto from portfolio value
	const actualDeposit = useMemo(() => {
		if (manualDeposit) {
			return deposit; // Use user-set deposit
		}
		// Auto-calculate from portfolio total value
		const totalValue = investments.reduce((sum, item) => {
			return sum + (item.quantity * item.price);
		}, 0);
		return totalValue;
	}, [manualDeposit, deposit, investments]);

	// State for UI
	const [dateRangeConfig, setDateRangeConfig] = useState<DateRangeConfig>(
		createDateRangeConfig(range, startDate, endDate),
	);
	const [showPrivacy, setShowPrivacy] = useState(false);

	// Get all unique tickers for data fetching
	const allTickers = useMemo(() => {
		const tickers = portfolioItems.map(item => item.ticker);
		// Always include VNINDEX as benchmark if we have any portfolio items
		if (tickers.length > 0 && !tickers.includes("VNINDEX")) {
			tickers.push("VNINDEX");
		}
		return tickers;
	}, [portfolioItems]);

	const { data: tickerData, isLoading, error } = useMultipleTickerData(
		allTickers,
		dateRangeConfig,
		500,
	);


	// Debounced URL updates to prevent page jumping
	const updateSearchParams = useCallback(
		debounce((updates: Partial<PortfolioPageSearch>) => {
			navigate({
				search: (prev) => ({ ...prev, ...updates }),
				replace: true, // Use replace to avoid page jumping
			});
		}),
		[navigate]
	);

	// Update portfolio items in URL
	const updatePortfolioItems = useCallback((newItems: PortfolioItem[]) => {
		const encoded = encodePortfolioItems(newItems);
		updateSearchParams({ tickers: encoded });
	}, [updateSearchParams]);

	// Update deposit in URL with manual flag
	const updateDeposit = useCallback((newDeposit: number) => {
		updateSearchParams({ 
			deposit: newDeposit, 
			manualDeposit: true 
		});
	}, [updateSearchParams]);

	// Portfolio item management functions
	const handleAddItem = useCallback((ticker: string) => {
		if (!portfolioItems.some(item => item.ticker === ticker)) {
			const newItems = [...portfolioItems, { ticker, quantity: 0, price: 0 }];
			updatePortfolioItems(newItems);
		}
	}, [portfolioItems, updatePortfolioItems]);

	const handleUpdateItem = useCallback((ticker: string, quantity: number, price: number) => {
		const newItems = portfolioItems.map(item => 
			item.ticker === ticker 
				? { ...item, quantity, price }
				: item
		);
		updatePortfolioItems(newItems);
	}, [portfolioItems, updatePortfolioItems]);

	const handleRemoveItem = useCallback((ticker: string) => {
		const newItems = portfolioItems.filter(item => item.ticker !== ticker);
		updatePortfolioItems(newItems);
	}, [portfolioItems, updatePortfolioItems]);

	// Date range management
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

	// Data for analysis components
	const portfolioTickers = investments.map(item => item.ticker);
	const hasVnIndex = allTickers.includes("VNINDEX");
	const vnindexData = hasVnIndex ? tickerData?.["VNINDEX"] || [] : [];

	if (portfolioItems.length === 0) {
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
										onSelect={handleAddItem}
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
												tickers: "VCB,0,0~BID,0,0~CTG,0,0~ACB,0,0~VNINDEX,0,0",
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
												tickers: "VHM,0,0~VIC,0,0~VRE,0,0~KDH,0,0~VNINDEX,0,0",
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
												tickers: "SSI,0,0~VCI,0,0~HCM,0,0~MBS,0,0~VNINDEX,0,0",
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
												tickers: "HPG,0,0~HSG,0,0~NKG,0,0~POM,0,0~VNINDEX,0,0",
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
					{t("portfolio.subtitle", { count: investments.length })}
				</p>
			</div>

			{/* Portfolio Management */}
			<PortfolioTable
				items={portfolioItems}
				onUpdateItem={handleUpdateItem}
				onRemoveItem={handleRemoveItem}
				onAddItem={handleAddItem}
			/>

			{/* Portfolio Summary Card - Screenshot friendly */}
			<PortfolioSummaryCard
				items={portfolioItems}
				deposit={actualDeposit}
				showPrivacy={showPrivacy}
				onTogglePrivacy={setShowPrivacy}
				manualDeposit={manualDeposit}
				onUpdateDeposit={updateDeposit}
			/>

			{/* Share Portfolio */}
			<div className="flex justify-center">
				<SharePortfolioDialog 
					items={portfolioItems}
					deposit={actualDeposit}
					currentUrl={window.location.href}
				/>
			</div>

			{/* Analysis Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						{t("portfolio.analysisPeriod")}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col sm:flex-row gap-4 items-start">
					<div className="flex-1">
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
								tickers: allTickers,
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
				</CardContent>
			</Card>

			{/* Portfolio Analysis Content */}
			{error ? (
				<Card className="border-red-200 bg-red-50">
					<CardContent className="p-6 text-center">
						<div className="space-y-4">
							<div className="text-red-600">
								<svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<h3 className="text-lg font-semibold mb-2">Failed to load stock data</h3>
								<p className="text-sm text-red-600/80 mb-4">Unable to fetch stock market data. Your portfolio configuration is saved, but analysis features are temporarily unavailable.</p>
							</div>
							<div className="text-sm text-muted-foreground">
								<p>You can still:</p>
								<ul className="list-disc list-inside mt-2 space-y-1">
									<li>Add and remove stocks from your portfolio</li>
									<li>Edit quantities and prices</li>
									<li>Use the portfolio management tools above</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			) : isLoading ? (
				<div className="space-y-6">
					{/* Loading Portfolio Summary */}
					<Card className="bg-gradient-to-br from-background via-blue-50/20 to-green-50/20">
						<CardHeader>
							<div className="animate-pulse space-y-3">
								<div className="h-6 bg-muted rounded w-1/3"></div>
								<div className="h-4 bg-muted rounded w-2/3"></div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="animate-pulse space-y-6">
								<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
									{[1, 2, 3, 4].map((i) => (
										<div key={i} className="bg-muted/50 rounded-xl p-4">
											<div className="h-8 bg-muted rounded mb-2"></div>
											<div className="h-4 bg-muted rounded w-2/3"></div>
										</div>
									))}
								</div>
								<div className="h-64 bg-muted/50 rounded-xl"></div>
							</div>
						</CardContent>
					</Card>
					
					{/* Loading Analysis Cards */}
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
				</div>
			) : (!tickerData || Object.keys(tickerData).length === 0) ? (
				<Card className="border-yellow-200 bg-yellow-50">
					<CardContent className="p-6 text-center">
						<div className="space-y-4">
							<div className="text-yellow-700">
								<svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<h3 className="text-lg font-semibold mb-2">No stock data available</h3>
								<p className="text-sm text-yellow-700/80 mb-4">Stock market data could not be loaded for your portfolio. This may be due to network issues or data service unavailability.</p>
							</div>
							<div className="text-sm text-muted-foreground">
								<p>Your portfolio configuration is preserved. Analysis features will be available once data loads.</p>
							</div>
						</div>
					</CardContent>
				</Card>
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

