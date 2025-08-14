import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	ArrowLeft,
	TrendingUp,
	TrendingDown,
	Volume2,
	Calendar,
	ChartCandlestick,
	BarChart3,
	X,
	Brain,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandlestickChart, ComparisonChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { MultiTickerSearch } from "@/components/ui/TickerSearch";
import { VPACard } from "@/components/vpa";
import { AskAIButton } from "@/components/ask-ai";
import { useTranslation } from "@/hooks/useTranslation";
import { useTickerData, useTickerGroups, useMultipleTickerData, useCompanyInfo, useFinancialInfo } from "@/lib/queries";
import { formatFinancialValue, formatPercentage, formatCurrency } from "@/lib/company-data";
import {
	calculatePriceChange,
	calculateRangeChange,
	getLatestPrice,
	findTickerSector,
	createDateRangeConfig,
	type TimeRange,
} from "@/lib/stock-data";
import { format } from "date-fns";
import { getColorForIndex } from "@/lib/chart-colors";

interface TickerPageSearch {
	range?: TimeRange;
	startDate?: string;
	endDate?: string;
	compare?: string[];
}

export const Route = createFileRoute("/ticker/$symbol")({
	validateSearch: (search: Record<string, unknown>): TickerPageSearch => {
		return {
			range: (search.range as TimeRange) || "3M",
			startDate: search.startDate as string,
			endDate: search.endDate as string,
			compare: Array.isArray(search.compare) ? (search.compare as string[]) : [],
		};
	},
	component: TickerPage,
});

function TickerPage() {
	const { symbol } = Route.useParams();
	const navigate = useNavigate({ from: Route.fullPath });
	const { range = "3M", startDate, endDate, compare = [] } = Route.useSearch();
	const { t } = useTranslation();
	
	// State for ticker comparison - initialize from URL params
	const [comparisonTickers, setComparisonTickers] = useState<string[]>(compare);

	// Create date range configuration
	const dateRangeConfig = createDateRangeConfig(range, startDate, endDate);

	const { data: tickerData, isLoading, error } = useTickerData(symbol, dateRangeConfig);
	const { data: tickerGroups } = useTickerGroups();
	
	// Fetch company and financial data
	const { data: companyInfo, isLoading: companyLoading } = useCompanyInfo(symbol);
	const { data: financialInfo, isLoading: financialLoading } = useFinancialInfo(symbol);
	
	// Get data for comparison tickers
	const { data: comparisonData, isLoading: comparisonLoading } = useMultipleTickerData(
		comparisonTickers,
		dateRangeConfig,
		300
	);

	const updateSearchParams = (updates: Partial<TickerPageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	// Helper functions for comparison tickers
	const handleTickersChange = (newTickers: string[]) => {
		setComparisonTickers(newTickers);
		updateSearchParams({ compare: newTickers });
	};

	const removeComparisonTicker = (tickerToRemove: string) => {
		const updatedTickers = comparisonTickers.filter(t => t !== tickerToRemove);
		setComparisonTickers(updatedTickers);
		updateSearchParams({ compare: updatedTickers });
	};

	const clearAllComparisons = () => {
		setComparisonTickers([]);
		updateSearchParams({ compare: [] });
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
								{t("tickers.tickerNotFound", { symbol })}
							</p>
							<p className="text-muted-foreground text-sm">
								{error instanceof Error
									? error.message
									: t("errors.failedToLoad")}
							</p>
							<Link to="/tickers">
								<Button variant="outline">{t("common.back")} {t("nav.tickers")}</Button>
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
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
				<div className="flex items-center gap-2 md:gap-4">
					<Link to="/tickers">
						<Button variant="ghost" size="sm">
							<ArrowLeft className="h-4 w-4 mr-1" />
							<span className="hidden sm:inline">Back</span>
						</Button>
					</Link>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold font-mono">{symbol}</h1>
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
							{sector && (
								<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
									<Badge
										variant="secondary"
										className="cursor-pointer hover:shadow-sm w-fit"
									>
										{sectorLabel}
									</Badge>
								</Link>
							)}
							{latestPrice && (
								<div className="text-sm text-muted-foreground">
									{t("tickers.lastUpdated")}: {format(latestPrice.date, "MMM dd, yyyy")}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 w-full md:w-auto">
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
						className="w-full md:w-auto"
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
									{t("tickers.currentPrice")}
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
									{t("common.change")}
								</p>
								{/* Daily Change */}
								{dailyChange && (
									<p
										className={`text-sm font-medium ${dailyChange.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
									>
										{t("common.daily")}: {dailyChange.changePercent > 0 ? "+" : ""}
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
									{t("common.volume")}
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
									{t("tickers.dataRange")}
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
				{/* Company & Financial Info Tabs */}
				<Card>
					<Tabs defaultValue="company" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="company">{t("companyInfo.title")}</TabsTrigger>
							<TabsTrigger value="balance-sheet">{t("financialInfo.balanceSheet")}</TabsTrigger>
							<TabsTrigger value="income-statement">{t("financialInfo.incomeStatement")}</TabsTrigger>
						</TabsList>
						
						<TabsContent value="company" className="mt-6">
							{companyLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="text-muted-foreground">
										{t("companyInfo.loadingCompanyInfo")}
									</div>
								</div>
							) : companyInfo ? (
								<div className="space-y-6">
									{/* Company Profile */}
									<div>
										<h3 className="text-lg font-semibold mb-3">{t("companyInfo.profile")}</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
											{companyInfo.exchange && (
												<div>
													<p className="text-sm font-medium text-muted-foreground">{t("companyInfo.exchange")}</p>
													<p className="text-sm">{companyInfo.exchange}</p>
												</div>
											)}
											{companyInfo.industry && (
												<div>
													<p className="text-sm font-medium text-muted-foreground">{t("companyInfo.industry")}</p>
													<p className="text-sm">{companyInfo.industry}</p>
												</div>
											)}
											{companyInfo.founded && (
												<div>
													<p className="text-sm font-medium text-muted-foreground">{t("companyInfo.founded")}</p>
													<p className="text-sm">{companyInfo.founded}</p>
												</div>
											)}
											{companyInfo.marketCap > 0 && (
												<div>
													<p className="text-sm font-medium text-muted-foreground">{t("companyInfo.marketCap")}</p>
													<p className="text-sm">{formatCurrency(companyInfo.marketCap)}</p>
												</div>
											)}
											{companyInfo.outstandingShares > 0 && (
												<div>
													<p className="text-sm font-medium text-muted-foreground">{t("companyInfo.outstandingShares")}</p>
													<p className="text-sm">{formatFinancialValue(companyInfo.outstandingShares)}</p>
												</div>
											)}
											{companyInfo.currentPrice > 0 && (
												<div>
													<p className="text-sm font-medium text-muted-foreground">{t("companyInfo.currentPrice")}</p>
													<p className="text-sm">{formatCurrency(companyInfo.currentPrice)}</p>
												</div>
											)}
										</div>
										{companyInfo.description && (
											<div className="mt-4">
												<p className="text-sm text-muted-foreground">{companyInfo.description}</p>
											</div>
										)}
									</div>

									{/* Key Ratios */}
									{(companyInfo.peRatio > 0 || companyInfo.pbRatio > 0 || companyInfo.roe > 0) && (
										<div>
											<h3 className="text-lg font-semibold mb-3">Key Financial Ratios</h3>
											<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
												{companyInfo.peRatio > 0 && (
													<div>
														<p className="text-sm font-medium text-muted-foreground">P/E Ratio</p>
														<p className="text-sm">{companyInfo.peRatio.toFixed(2)}</p>
													</div>
												)}
												{companyInfo.pbRatio > 0 && (
													<div>
														<p className="text-sm font-medium text-muted-foreground">P/B Ratio</p>
														<p className="text-sm">{companyInfo.pbRatio.toFixed(2)}</p>
													</div>
												)}
												{companyInfo.roe > 0 && (
													<div>
														<p className="text-sm font-medium text-muted-foreground">ROE</p>
														<p className="text-sm">{formatPercentage(companyInfo.roe)}</p>
													</div>
												)}
												{companyInfo.roa > 0 && (
													<div>
														<p className="text-sm font-medium text-muted-foreground">ROA</p>
														<p className="text-sm">{formatPercentage(companyInfo.roa)}</p>
													</div>
												)}
												{companyInfo.debtToEquity > 0 && (
													<div>
														<p className="text-sm font-medium text-muted-foreground">Debt/Equity</p>
														<p className="text-sm">{companyInfo.debtToEquity.toFixed(2)}</p>
													</div>
												)}
												{companyInfo.currentRatio > 0 && (
													<div>
														<p className="text-sm font-medium text-muted-foreground">Current Ratio</p>
														<p className="text-sm">{companyInfo.currentRatio.toFixed(2)}</p>
													</div>
												)}
											</div>
										</div>
									)}

									{/* Major Shareholders */}
									{companyInfo.shareholders && companyInfo.shareholders.length > 0 && (
										<div>
											<h3 className="text-lg font-semibold mb-3">{t("companyInfo.shareholders")}</h3>
											<div className="space-y-2">
												{companyInfo.shareholders.map((shareholder, index) => (
													<div key={index} className="flex justify-between items-center py-2 border-b border-muted">
														<span className="text-sm">{shareholder.name}</span>
														<span className="text-sm font-medium">{formatPercentage(shareholder.ownership)}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Key Officers */}
									{companyInfo.officers && companyInfo.officers.length > 0 && (
										<div>
											<h3 className="text-lg font-semibold mb-3">{t("companyInfo.officers")}</h3>
											<div className="space-y-2">
												{companyInfo.officers.map((officer, index) => (
													<div key={index} className="flex justify-between items-center py-2 border-b border-muted">
														<span className="text-sm">{officer.name}</span>
														<span className="text-sm text-muted-foreground">{officer.position}</span>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							) : (
								<div className="flex items-center justify-center py-8">
									<div className="text-center space-y-2">
										<p className="text-muted-foreground">{t("companyInfo.noCompanyInfo")}</p>
									</div>
								</div>
							)}
						</TabsContent>
						
						<TabsContent value="balance-sheet" className="mt-6">
							{financialLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="text-muted-foreground">
										{t("financialInfo.loadingFinancialInfo")}
									</div>
								</div>
							) : financialInfo?.balance_sheet && financialInfo.balance_sheet.length > 0 ? (
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">{t("financialInfo.balanceSheet")}</h3>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="border-b">
													<th className="text-left py-2">{t("financialInfo.year")}</th>
													<th className="text-left py-2">{t("financialInfo.quarter")}</th>
													<th className="text-left py-2">{t("financialInfo.assets")}</th>
													<th className="text-left py-2">{t("financialInfo.liabilities")}</th>
													<th className="text-left py-2">{t("financialInfo.equity")}</th>
												</tr>
											</thead>
											<tbody>
												{financialInfo.balance_sheet.slice(-10).map((item, index) => (
													<tr key={index} className="border-b">
														<td className="py-2">{item.year}</td>
														<td className="py-2">Q{item.report_length}</td>
														<td className="py-2">{formatFinancialValue(item.BSA || 0)}</td>
														<td className="py-2">{formatFinancialValue(item.BSB || 0)}</td>
														<td className="py-2">{formatFinancialValue(item.BSC || 0)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-center py-8">
									<div className="text-center space-y-2">
										<p className="text-muted-foreground">{t("financialInfo.noFinancialInfo")}</p>
									</div>
								</div>
							)}
						</TabsContent>
						
						<TabsContent value="income-statement" className="mt-6">
							{financialLoading ? (
								<div className="flex items-center justify-center py-8">
									<div className="text-muted-foreground">
										{t("financialInfo.loadingFinancialInfo")}
									</div>
								</div>
							) : financialInfo?.income_statement && financialInfo.income_statement.length > 0 ? (
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">{t("financialInfo.incomeStatement")}</h3>
									<div className="overflow-x-auto">
										<table className="w-full text-sm">
											<thead>
												<tr className="border-b">
													<th className="text-left py-2">{t("financialInfo.year")}</th>
													<th className="text-left py-2">{t("financialInfo.quarter")}</th>
													<th className="text-left py-2">{t("financialInfo.revenue")}</th>
													<th className="text-left py-2">{t("financialInfo.netProfit")}</th>
													<th className="text-left py-2">{t("financialInfo.grossMargin")}</th>
													<th className="text-left py-2">{t("financialInfo.netMargin")}</th>
												</tr>
											</thead>
											<tbody>
												{financialInfo.income_statement.slice(-10).map((item, index) => (
													<tr key={index} className="border-b">
														<td className="py-2">{item.year}</td>
														<td className="py-2">Q{item.report_length}</td>
														<td className="py-2">{formatFinancialValue(item.ISA1 || 0)}</td>
														<td className="py-2">{formatFinancialValue(item.ISA22 || 0)}</td>
														<td className="py-2">{formatPercentage(((item.ISA1 - item.ISA2) / item.ISA1 * 100) || 0)}</td>
														<td className="py-2">{formatPercentage((item.ISA22 / item.ISA1 * 100) || 0)}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-center py-8">
									<div className="text-center space-y-2">
										<p className="text-muted-foreground">{t("financialInfo.noFinancialInfo")}</p>
									</div>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</Card>

				{/* Ask AI Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Brain className="h-5 w-5 text-green-600" />
							{t("askAI.title")}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-muted-foreground">
								{t("askAI.description", { symbol })}
							</p>
							<AskAIButton 
								ticker={symbol}
								variant="default"
								size="lg"
								className="w-full md:w-auto"
							>
								{t("askAI.askAI")} {t("askAI.aboutTicker", { symbol })}
							</AskAIButton>
						</div>
					</CardContent>
				</Card>

				{/* VPA Analysis */}
				<VPACard 
					ticker={symbol}
					title={`${t("tickers.volumePriceAnalysis")} - ${symbol}`}
					defaultExpanded={false}
					showViewButton={true}
				/>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<ChartCandlestick className="h-5 w-5" />
							{t("tickers.priceVolumeChart")}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{isLoading ? (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-muted-foreground">
									{t("tickers.loadingChartData")}
								</div>
							</div>
						) : tickerData && tickerData.length > 0 ? (
							<div className="space-y-4">
								<CandlestickChart data={tickerData} height={400} showCard={false} />
							</div>
						) : (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-center space-y-4">
									<p className="text-muted-foreground">
										{t("tickers.noDataAvailable", { symbol })}
									</p>
									<p className="text-sm text-muted-foreground">
										{t("tickers.tryDifferentTimeRange")}
									</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Price & Volume Chart Comparison */}
				{comparisonTickers.length > 0 && (
					<Card>
						<CardHeader>
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<CardTitle className="flex items-center gap-2">
									<ChartCandlestick className="h-5 w-5" />
									{t("tickers.priceVolumeChartComparison")}
									<Badge variant="secondary" className="text-xs">
										{t("tickers.chartsCount", { count: comparisonTickers.length })}
									</Badge>
								</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={clearAllComparisons}
									className="text-xs"
								>
									<X className="h-4 w-4 mr-1" />
									{t("tickers.clearAllCharts")}
								</Button>
							</div>
						</CardHeader>
						<CardContent className="space-y-8">
							{comparisonTickers.map((ticker) => (
								<div key={ticker} className="space-y-4">
									{/* Ticker Header */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<h3 className="text-xl font-semibold flex items-center gap-2">
												<ChartCandlestick className="h-5 w-5" />
												{ticker}
											</h3>
											{sector && findTickerSector(tickerGroups || {}, ticker) && (
												<Badge variant="outline" className="text-xs">
													{findTickerSector(tickerGroups || {}, ticker)?.replace(/_/g, " ")}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-3">
											{comparisonData && comparisonData[ticker] && comparisonData[ticker].length > 0 && (() => {
												const data = comparisonData[ticker];
												const latestPrice = getLatestPrice(data);
												const priceChange = calculatePriceChange(data);
												
												return (
													<div className="text-right">
														{latestPrice && (
															<div className="font-semibold text-lg">
																{formatPrice(latestPrice.close)}
															</div>
														)}
														{priceChange && (
															<div className={`text-sm ${priceChange.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
																{priceChange.changePercent > 0 ? '+' : ''}{priceChange.changePercent.toFixed(2)}%
															</div>
														)}
													</div>
												);
											})()}
											<Button
												variant="ghost"
												size="sm"
												onClick={() => removeComparisonTicker(ticker)}
												className="h-8 w-8 p-0 hover:bg-red-100"
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</div>

									{/* Full Width Chart */}
									{comparisonLoading ? (
										<div className="h-[400px] flex items-center justify-center">
											<div className="text-muted-foreground">
												{t("tickers.loadingComparisonData", { ticker })}
											</div>
										</div>
									) : comparisonData && comparisonData[ticker] && comparisonData[ticker].length > 0 ? (
										<div className="space-y-4">
											<CandlestickChart 
												data={comparisonData[ticker]} 
												height={400} 
												showCard={false} 
											/>
										</div>
									) : (
										<div className="h-[400px] flex items-center justify-center">
											<div className="text-center space-y-2">
												<p className="text-muted-foreground">
													{t("tickers.noDataAvailableForTicker", { ticker })}
												</p>
												<p className="text-sm text-muted-foreground">
													{t("tickers.tryDifferentTimeRangeForTicker")}
												</p>
											</div>
										</div>
									)}
								</div>
							))}
						</CardContent>
					</Card>
				)}

				{/* Performance Comparison */}
				<Card>
					<CardHeader>
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<CardTitle className="flex items-center gap-2">
								<BarChart3 className="h-5 w-5" />
								{t("tickers.performanceComparison")}
								{comparisonTickers.length > 0 && (
									<Badge variant="secondary" className="text-xs">
										{comparisonTickers.length + 1} {t("tickers.selected")}
									</Badge>
								)}
							</CardTitle>
							<div className="flex flex-col md:flex-row md:items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={clearAllComparisons}
									disabled={comparisonTickers.length === 0}
									className="text-xs"
								>
									<X className="h-4 w-4 mr-1" />
									{t("common.clearAll")}
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Ticker Selection */}
						<div>
							<div className="flex items-center justify-between mb-3">
								<div>
									<h4 className="text-sm font-medium">{t("tickers.addTickersToCompare")}</h4>
									<p className="text-xs text-muted-foreground">{t("tickers.clickButtonToSearch")}</p>
								</div>
								{comparisonTickers.length > 0 && (
									<Badge variant="secondary" className="text-xs">
										{t("tickers.selectedCount", { count: comparisonTickers.length })}
									</Badge>
								)}
							</div>
							<MultiTickerSearch
								selectedTickers={comparisonTickers}
								onTickersChange={handleTickersChange}
								placeholder={t("tickers.clickHereToSearch")}
								className="w-full"
								persistOpenState={true}
							/>
						</div>


						{/* Comparison Chart */}
						{comparisonLoading ? (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-muted-foreground">
									{t("loading.comparisonData")}
								</div>
							</div>
						) : comparisonTickers.length > 0 ? (
							<div className="space-y-4">
								{/* Chart Legend */}
								<div className="flex flex-wrap gap-2">
									{[symbol, ...comparisonTickers].map((ticker, index) => (
										<Badge
											key={ticker}
											variant="outline"
											className="flex items-center gap-1"
											style={{ borderColor: getColorForIndex(index) }}
										>
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: getColorForIndex(index) }}
											/>
											{ticker}
										</Badge>
									))}
								</div>

								{/* Normalized Comparison Chart */}
								<div className="h-[400px]">
									<ComparisonChart
										data={(() => {
											// Normalize data for comparison - convert to percentage change from first data point
											const normalizedData: any[] = [];
											const allTickers = [symbol, ...comparisonTickers];
											const allTickerData = {
												[symbol]: tickerData,
												...comparisonData
											};

											if (allTickerData && allTickers.length > 0) {
												// First, find the common date range for all tickers
												const tickerWithData = allTickers.filter(ticker => {
													const data = allTickerData[ticker];
													return data && data.length > 0;
												});

												if (tickerWithData.length === 0) return [];

												// Find the shortest data array to ensure all tickers have data for each point
												const minLength = Math.min(
													...tickerWithData.map(ticker => allTickerData[ticker]?.length || 0)
												);

												// Calculate baseline prices (first data point for each ticker)
												const baselinePrices: Record<string, number> = {};
												tickerWithData.forEach(ticker => {
													const data = allTickerData[ticker];
													if (data && data[0]) {
														baselinePrices[ticker] = data[0].close;
													}
												});

												// Build normalized data using the common length
												for (let i = 0; i < minLength; i++) {
													const dataPoint: any = { time: "", date: null };
													let hasValidData = false;

													tickerWithData.forEach(ticker => {
														const data = allTickerData[ticker] || [];
														if (data[i] && baselinePrices[ticker]) {
															const changePercent =
																((data[i].close - baselinePrices[ticker]) /
																	baselinePrices[ticker]) *
																100;
															dataPoint[ticker] = changePercent;
															if (!dataPoint.time) {
																dataPoint.time = data[i].time;
																dataPoint.date = data[i].date;
															}
															hasValidData = true;
														}
													});

													if (hasValidData && dataPoint.time) {
														normalizedData.push(dataPoint);
													}
												}
											}

											return normalizedData;
										})()}
										tickers={[symbol, ...comparisonTickers]}
										colors={[symbol, ...comparisonTickers].map((_, index) => getColorForIndex(index))}
										height={400}
									/>
								</div>
							</div>
						) : (
							<div className="h-[400px] flex items-center justify-center">
								<div className="text-center space-y-3">
									<div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
										<BarChart3 className="h-8 w-8 text-muted-foreground" />
									</div>
									<div>
										<p className="font-medium text-foreground">
											{t("tickers.noTickersSelectedForComparison")}
										</p>
										<p className="text-sm text-muted-foreground">
											{t("tickers.useSearchButtonAbove", { symbol })}
										</p>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

			</div>

			{/* Additional Actions */}
			<Card>
				<CardHeader>
					<CardTitle>{t("tickers.relatedActions")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						{sector && (
							<Link to="/sector/$sectorName" params={{ sectorName: sector }}>
								<Button variant="outline">{t("tickers.viewSector", { sector: sectorLabel })}</Button>
							</Link>
						)}
						<Link
							to="/compare"
							search={{ tickers: [symbol, "VNINDEX"] }}
						>
							<Button variant="outline">{t("tickers.compareWithVnIndex")}</Button>
						</Link>
					</div>
				</CardContent>
			</Card>

		</div>
	);
}
