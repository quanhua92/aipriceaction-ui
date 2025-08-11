import { useMemo } from "react";
import { Target, Trophy, TrendingUp, TrendingDown, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { VPAButton } from "@/components/vpa";
import { Progress } from "@/components/ui/progress";
import {
	calculateStockMetrics,
	calculateRangeChange,
	type StockDataPoint,
	type StockPerformanceMetrics,
} from "@/lib/stock-data";

interface PerformanceAttributionProps {
	portfolioData: Record<string, StockDataPoint[]>;
	benchmarkData: StockDataPoint[];
	portfolioTickers: string[];
}

interface AttributionMetrics {
	stock: StockPerformanceMetrics;
	weightedContribution: number;
	relativePerformance: number;
	performanceRank: number;
}

export function PerformanceAttribution({ 
	portfolioData, 
	benchmarkData, 
	portfolioTickers 
}: PerformanceAttributionProps) {
	const { t } = useTranslation();
	const attributionData = useMemo(() => {
		if (Object.keys(portfolioData).length === 0 || benchmarkData.length === 0 || portfolioTickers.length === 0) {
			return null;
		}

		const equalWeight = 1 / portfolioTickers.length;
		const benchmarkReturn = calculateRangeChange(benchmarkData).changePercent / 100;
		
		// Calculate performance metrics for each stock
		const stockMetrics: AttributionMetrics[] = [];
		
		for (const ticker of portfolioTickers) {
			const stockData = portfolioData[ticker];
			if (stockData && stockData.length > 0) {
				const metrics = calculateStockMetrics(stockData, benchmarkData, ticker, equalWeight);
				
				const attribution: AttributionMetrics = {
					stock: metrics,
					weightedContribution: metrics.totalReturn * equalWeight,
					relativePerformance: metrics.totalReturn - benchmarkReturn,
					performanceRank: 0 // Will be set below
				};
				
				stockMetrics.push(attribution);
			}
		}
		
		// Sort by performance and assign ranks
		stockMetrics.sort((a, b) => b.stock.totalReturn - a.stock.totalReturn);
		stockMetrics.forEach((attribution, index) => {
			attribution.performanceRank = index + 1;
		});
		
		// Calculate portfolio totals
		const totalPortfolioReturn = stockMetrics.reduce((sum, attr) => sum + attr.weightedContribution, 0);
		const bestPerformer = stockMetrics.length > 0 ? stockMetrics[0] : null;
		const worstPerformer = stockMetrics.length > 0 ? stockMetrics[stockMetrics.length - 1] : null;
		
		// Calculate positive/negative contributors
		const positiveContributors = stockMetrics.filter(attr => attr.weightedContribution > 0);
		const negativeContributors = stockMetrics.filter(attr => attr.weightedContribution < 0);
		
		// Calculate attribution breakdown
		const positiveContribution = positiveContributors.reduce((sum, attr) => sum + attr.weightedContribution, 0);
		const negativeContribution = Math.abs(negativeContributors.reduce((sum, attr) => sum + attr.weightedContribution, 0));
		
		return {
			attributions: stockMetrics,
			totalPortfolioReturn,
			benchmarkReturn,
			bestPerformer,
			worstPerformer,
			positiveContributors,
			negativeContributors,
			positiveContribution,
			negativeContribution
		};
	}, [portfolioData, benchmarkData, portfolioTickers]);

	if (!attributionData || !attributionData.bestPerformer || !attributionData.worstPerformer || attributionData.attributions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						{t("attribution.performanceAttribution")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center p-8">
						<p className="text-muted-foreground">
							{!attributionData ? t("attribution.calculatingPerformanceAttribution") : t("attribution.noPortfolioDataAvailable")}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getPerformanceColor = (performance: number): string => {
		return performance >= 0 ? "text-green-600" : "text-red-600";
	};

	const getPerformanceBadge = (rank: number, total: number): { variant: "default" | "secondary" | "outline", icon: any } => {
		if (rank === 1) return { variant: "default", icon: Trophy };
		if (rank <= total * 0.3) return { variant: "secondary", icon: Star };
		return { variant: "outline", icon: null };
	};

	return (
		<div className="space-y-6">
			{/* Attribution Summary */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("metrics.totalReturn")}</p>
								<p className={`text-xl font-bold ${getPerformanceColor(attributionData.totalPortfolioReturn)}`}>
									{attributionData.totalPortfolioReturn >= 0 ? "+" : ""}{(attributionData.totalPortfolioReturn * 100).toFixed(2)}%
								</p>
							</div>
							<div className="p-2 rounded-full bg-blue-100">
								<Target className="h-5 w-5 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("attribution.bestPerformer")}</p>
								<div className="flex items-center gap-2">
									<p className="text-sm font-bold text-green-600">
										{attributionData.bestPerformer.stock.ticker}
									</p>
									<VPAButton 
										ticker={attributionData.bestPerformer.stock.ticker}
										variant="icon"
										mode="popover"
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									+{(attributionData.bestPerformer.stock.totalReturn * 100).toFixed(1)}%
								</p>
							</div>
							<div className="p-2 rounded-full bg-green-100">
								<TrendingUp className="h-5 w-5 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("attribution.worstPerformer")}</p>
								<div className="flex items-center gap-2">
									<p className="text-sm font-bold text-red-600">
										{attributionData.worstPerformer.stock.ticker}
									</p>
									<VPAButton 
										ticker={attributionData.worstPerformer.stock.ticker}
										variant="icon"
										mode="popover"
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									{(attributionData.worstPerformer.stock.totalReturn * 100).toFixed(1)}%
								</p>
							</div>
							<div className="p-2 rounded-full bg-red-100">
								<TrendingDown className="h-5 w-5 text-red-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("metrics.activeReturn")}</p>
								<p className={`text-xl font-bold ${getPerformanceColor(attributionData.totalPortfolioReturn - attributionData.benchmarkReturn)}`}>
									{(attributionData.totalPortfolioReturn - attributionData.benchmarkReturn) >= 0 ? "+" : ""}
									{((attributionData.totalPortfolioReturn - attributionData.benchmarkReturn) * 100).toFixed(2)}%
								</p>
								<p className="text-xs text-muted-foreground">{t("attribution.vsVnIndex")}</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Individual Stock Performance */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5" />
						{t("attribution.individualStockAttribution")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{attributionData.attributions.map((attribution) => {
							const badgeInfo = getPerformanceBadge(attribution.performanceRank, attributionData.attributions.length);
							const IconComponent = badgeInfo.icon;
							
							return (
								<div key={attribution.stock.ticker} className="border rounded-lg p-4">
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<h4 className="font-semibold text-lg">{attribution.stock.ticker}</h4>
											<Badge variant={badgeInfo.variant} className="flex items-center gap-1">
												{IconComponent && <IconComponent className="h-3 w-3" />}
												#{attribution.performanceRank}
											</Badge>
											<Badge variant="outline">
												{((1 / portfolioTickers.length) * 100).toFixed(1)}% {t("attribution.weight")}
											</Badge>
											<VPAButton 
												ticker={attribution.stock.ticker}
												variant="icon"
												mode="popover"
												className="ml-2"
											/>
										</div>
										<div className="text-right">
											<p className={`text-lg font-bold ${getPerformanceColor(attribution.stock.totalReturn)}`}>
												{attribution.stock.totalReturn >= 0 ? "+" : ""}{(attribution.stock.totalReturn * 100).toFixed(2)}%
											</p>
											<p className="text-sm text-muted-foreground">{t("metrics.totalReturn")}</p>
										</div>
									</div>
									
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div>
											<p className="text-sm text-muted-foreground mb-1">{t("attribution.portfolioContribution")}</p>
											<div className="flex items-center gap-2">
												<Progress 
													value={Math.min(Math.abs(attribution.weightedContribution) * 1000, 100)} 
													className={`flex-1 ${attribution.weightedContribution >= 0 ? '' : '[&>div]:bg-red-500'}`}
												/>
												<span className={`text-sm font-medium ${getPerformanceColor(attribution.weightedContribution)}`}>
													{attribution.weightedContribution >= 0 ? "+" : ""}{(attribution.weightedContribution * 100).toFixed(2)}%
												</span>
											</div>
										</div>
										
										<div>
											<p className="text-sm text-muted-foreground mb-1">{t("attribution.vsBenchmark")}</p>
											<span className={`text-sm font-medium ${getPerformanceColor(attribution.relativePerformance)}`}>
												{attribution.relativePerformance >= 0 ? "+" : ""}{(attribution.relativePerformance * 100).toFixed(2)}%
											</span>
										</div>
										
										<div>
											<p className="text-sm text-muted-foreground mb-1">{t("metrics.beta")}</p>
											<span className="text-sm font-medium">
												{attribution.stock.beta.toFixed(2)}
											</span>
										</div>
										
										<div>
											<p className="text-sm text-muted-foreground mb-1">{t("metrics.volatility")}</p>
											<span className="text-sm font-medium">
												{(attribution.stock.volatility * 100).toFixed(1)}%
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{/* Attribution Breakdown */}
			<Card>
				<CardHeader>
					<CardTitle>{t("attribution.performanceBreakdown")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Positive Contributors */}
						<div>
							<h4 className="font-medium mb-4 flex items-center gap-2">
								<TrendingUp className="h-4 w-4 text-green-600" />
								{t("attribution.positiveContributors")} ({attributionData.positiveContributors.length})
							</h4>
							<div className="space-y-2">
								{attributionData.positiveContributors.map((contributor) => (
									<div key={contributor.stock.ticker} className="flex items-center justify-between p-2 bg-green-50 rounded">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">{contributor.stock.ticker}</span>
											<VPAButton 
												ticker={contributor.stock.ticker}
												variant="icon"
												mode="popover"
											/>
										</div>
										<span className="text-sm font-bold text-green-600">
											+{(contributor.weightedContribution * 100).toFixed(2)}%
										</span>
									</div>
								))}
								<div className="border-t pt-2 mt-2">
									<div className="flex items-center justify-between font-semibold">
										<span>{t("attribution.totalPositive")}</span>
										<span className="text-green-600">+{(attributionData.positiveContribution * 100).toFixed(2)}%</span>
									</div>
								</div>
							</div>
						</div>

						{/* Negative Contributors */}
						<div>
							<h4 className="font-medium mb-4 flex items-center gap-2">
								<TrendingDown className="h-4 w-4 text-red-600" />
								{t("attribution.negativeContributors")} ({attributionData.negativeContributors.length})
							</h4>
							<div className="space-y-2">
								{attributionData.negativeContributors.map((contributor) => (
									<div key={contributor.stock.ticker} className="flex items-center justify-between p-2 bg-red-50 rounded">
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">{contributor.stock.ticker}</span>
											<VPAButton 
												ticker={contributor.stock.ticker}
												variant="icon"
												mode="popover"
											/>
										</div>
										<span className="text-sm font-bold text-red-600">
											{(contributor.weightedContribution * 100).toFixed(2)}%
										</span>
									</div>
								))}
								{attributionData.negativeContributors.length > 0 && (
									<div className="border-t pt-2 mt-2">
										<div className="flex items-center justify-between font-semibold">
											<span>{t("attribution.totalNegative")}</span>
											<span className="text-red-600">-{(attributionData.negativeContribution * 100).toFixed(2)}%</span>
										</div>
									</div>
								)}
								{attributionData.negativeContributors.length === 0 && (
									<div className="text-center p-4 text-green-600">
										<p className="text-sm">{t("attribution.allStocksPositive")}</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Key Insights */}
					<div className="mt-6 p-4 bg-muted/50 rounded-lg">
						<h4 className="font-medium mb-3">{t("attribution.keyPerformanceInsights")}</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground mb-1">{t("attribution.topContributorImpact")}:</p>
								<p className="font-medium">
									{attributionData.bestPerformer.stock.ticker} added{" "}
									<span className="text-green-600">
										+{(attributionData.bestPerformer.weightedContribution * 100).toFixed(2)}%
									</span>{" "}
									to portfolio return
								</p>
							</div>
							<div>
								<p className="text-muted-foreground mb-1">Performance Range:</p>
								<p className="font-medium">
									{(attributionData.bestPerformer.stock.totalReturn * 100).toFixed(1)}% to{" "}
									{(attributionData.worstPerformer.stock.totalReturn * 100).toFixed(1)}%
									<span className="text-muted-foreground ml-2">
										({((attributionData.bestPerformer.stock.totalReturn - attributionData.worstPerformer.stock.totalReturn) * 100).toFixed(1)}% spread)
									</span>
								</p>
							</div>
							<div>
								<p className="text-muted-foreground mb-1">Stock Selection Effect:</p>
								<p className="font-medium">
									Portfolio{" "}
									{(attributionData.totalPortfolioReturn - attributionData.benchmarkReturn) >= 0 ? "outperformed" : "underperformed"}{" "}
									benchmark by{" "}
									<span className={getPerformanceColor(attributionData.totalPortfolioReturn - attributionData.benchmarkReturn)}>
										{Math.abs((attributionData.totalPortfolioReturn - attributionData.benchmarkReturn) * 100).toFixed(2)}%
									</span>
								</p>
							</div>
							<div>
								<p className="text-muted-foreground mb-1">Winners vs Losers:</p>
								<p className="font-medium">
									{attributionData.positiveContributors.length} winners,{" "}
									{attributionData.negativeContributors.length} losers
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}