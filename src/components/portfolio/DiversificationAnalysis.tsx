import React, { useMemo } from "react";
import { PieChart, Network, Layers, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	calculateCorrelationMatrix,
	type StockDataPoint,
	type CorrelationMatrix,
} from "@/lib/stock-data";
import { useTickerGroups } from "@/lib/queries";

interface DiversificationAnalysisProps {
	portfolioData: Record<string, StockDataPoint[]>;
	portfolioTickers: string[];
}

interface SectorAllocation {
	sector: string;
	tickers: string[];
	allocation: number;
	displayName: string;
}

function CorrelationHeatmap({ correlationMatrix, t }: { correlationMatrix: CorrelationMatrix; t: any }) {
	const getCorrelationColor = (correlation: number): string => {
		if (correlation >= 0.8) return "bg-red-500";
		if (correlation >= 0.6) return "bg-orange-500";
		if (correlation >= 0.4) return "bg-yellow-500";
		if (correlation >= 0.2) return "bg-green-500";
		if (correlation >= -0.2) return "bg-blue-500";
		if (correlation >= -0.4) return "bg-indigo-500";
		return "bg-purple-500";
	};

	const getCorrelationText = (correlation: number): string => {
		if (correlation >= 0.8) return t("diversification.correlationLevels.veryHigh");
		if (correlation >= 0.6) return t("diversification.correlationLevels.high");
		if (correlation >= 0.4) return t("diversification.correlationLevels.moderate");
		if (correlation >= 0.2) return t("diversification.correlationLevels.low");
		if (correlation >= -0.2) return t("diversification.correlationLevels.minimal");
		if (correlation >= -0.4) return t("diversification.correlationLevels.negative");
		return t("diversification.correlationLevels.strongNegative");
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${correlationMatrix.tickers.length + 1}, minmax(0, 1fr))` }}>
				{/* Header row */}
				<div></div>
				{correlationMatrix.tickers.map((ticker) => (
					<div key={ticker} className="text-xs font-medium text-center p-1 bg-muted rounded">
						{ticker}
					</div>
				))}
				
				{/* Correlation matrix */}
				{correlationMatrix.tickers.map((rowTicker, i) => (
					<React.Fragment key={`row-fragment-${rowTicker}`}>
						<div className="text-xs font-medium text-center p-1 bg-muted rounded">
							{rowTicker}
						</div>
						{correlationMatrix.matrix[i].map((correlation, j) => (
							<div
								key={`${rowTicker}-${correlationMatrix.tickers[j]}`}
								className={`aspect-square rounded flex items-center justify-center text-xs font-medium text-white ${getCorrelationColor(Math.abs(correlation))}`}
								title={`${rowTicker} vs ${correlationMatrix.tickers[j]}: ${correlation.toFixed(2)} (${getCorrelationText(Math.abs(correlation))})`}
							>
								{correlation.toFixed(2)}
							</div>
						))}
					</React.Fragment>
				))}
			</div>
			
			{/* Legend */}
			<div className="flex flex-wrap gap-2 text-xs">
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-red-500 rounded"></div>
					<span>{t("diversification.correlationLevels.veryHigh")} (0.8+)</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-orange-500 rounded"></div>
					<span>{t("diversification.correlationLevels.high")} (0.6+)</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-yellow-500 rounded"></div>
					<span>{t("diversification.correlationLevels.moderate")} (0.4+)</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-green-500 rounded"></div>
					<span>{t("diversification.correlationLevels.low")} (0.2+)</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-3 h-3 bg-blue-500 rounded"></div>
					<span>{t("diversification.correlationLevels.minimal")} (&lt;0.2)</span>
				</div>
			</div>
		</div>
	);
}

export function DiversificationAnalysis({ 
	portfolioData, 
	portfolioTickers 
}: DiversificationAnalysisProps) {
	const { t } = useTranslation();
	const { data: tickerGroups } = useTickerGroups();
	
	const correlationMatrix = useMemo(() => {
		if (Object.keys(portfolioData).length === 0 || portfolioTickers.length < 2) {
			return null;
		}

		// Filter portfolio data to only include portfolio tickers
		const filteredData: Record<string, StockDataPoint[]> = {};
		portfolioTickers.forEach(ticker => {
			if (portfolioData[ticker]) {
				filteredData[ticker] = portfolioData[ticker];
			}
		});

		return calculateCorrelationMatrix(filteredData);
	}, [portfolioData, portfolioTickers]);

	const sectorAllocation = useMemo(() => {
		if (!tickerGroups || portfolioTickers.length === 0) {
			return [];
		}

		const sectorMap: Record<string, string[]> = {};
		// Use translation system for sector names

		// Group tickers by sector
		for (const [sector, tickers] of Object.entries(tickerGroups)) {
			const portfolioTickersInSector = portfolioTickers.filter(ticker => 
				tickers.includes(ticker)
			);
			if (portfolioTickersInSector.length > 0) {
				sectorMap[sector] = portfolioTickersInSector;
			}
		}

		// Calculate allocation percentages
		const allocations: SectorAllocation[] = Object.entries(sectorMap).map(([sector, tickers]) => ({
			sector,
			tickers,
			allocation: (tickers.length / portfolioTickers.length) * 100,
			displayName: t(`sectorNames.${sector}`) || sector.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
		}));

		// Add unclassified tickers
		const classifiedTickers = Object.values(sectorMap).flat();
		const unclassifiedTickers = portfolioTickers.filter(ticker => !classifiedTickers.includes(ticker));
		
		if (unclassifiedTickers.length > 0) {
			allocations.push({
				sector: "OTHER",
				tickers: unclassifiedTickers,
				allocation: (unclassifiedTickers.length / portfolioTickers.length) * 100,
				displayName: t("diversification.other") || "Other"
			});
		}

		return allocations.sort((a, b) => b.allocation - a.allocation);
	}, [tickerGroups, portfolioTickers]);

	const diversificationMetrics = useMemo(() => {
		if (!correlationMatrix || correlationMatrix.tickers.length < 2) {
			return null;
		}

		// Calculate average correlation (excluding diagonal)
		let totalCorrelation = 0;
		let count = 0;
		
		for (let i = 0; i < correlationMatrix.matrix.length; i++) {
			for (let j = 0; j < correlationMatrix.matrix[i].length; j++) {
				if (i !== j) {
					totalCorrelation += Math.abs(correlationMatrix.matrix[i][j]);
					count++;
				}
			}
		}
		
		const avgCorrelation = count > 0 ? totalCorrelation / count : 0;
		
		// Calculate diversification score (lower correlation = higher diversification)
		const diversificationScore = Math.max(0, (1 - avgCorrelation) * 100);
		
		// Count high correlations (>0.7)
		let highCorrelations = 0;
		for (let i = 0; i < correlationMatrix.matrix.length; i++) {
			for (let j = i + 1; j < correlationMatrix.matrix[i].length; j++) {
				if (Math.abs(correlationMatrix.matrix[i][j]) > 0.7) {
					highCorrelations++;
				}
			}
		}

		return {
			avgCorrelation,
			diversificationScore,
			highCorrelations,
			totalPairs: count / 2
		};
	}, [correlationMatrix]);

	if (!correlationMatrix || !diversificationMetrics) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<PieChart className="h-5 w-5" />
						{t("portfolio.diversificationAnalysis")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center p-8">
						<p className="text-muted-foreground">
							{portfolioTickers.length < 2 ? 
								t("diversification.needTwoStocks") :
								t("diversification.calculatingMetrics")
							}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const getDiversificationLevel = (score: number): { level: string; color: string } => {
		if (score >= 80) return { level: "Excellent", color: "text-green-600" };
		if (score >= 60) return { level: "Good", color: "text-blue-600" };
		if (score >= 40) return { level: "Fair", color: "text-yellow-600" };
		if (score >= 20) return { level: "Poor", color: "text-orange-600" };
		return { level: "Very Poor", color: "text-red-600" };
	};

	const diversificationLevel = getDiversificationLevel(diversificationMetrics.diversificationScore);

	return (
		<div className="space-y-6">
			{/* Diversification Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("diversification.diversificationScore")}</p>
								<p className={`text-2xl font-bold ${diversificationLevel.color}`}>
									{diversificationMetrics.diversificationScore.toFixed(0)}%
								</p>
								<p className="text-xs text-muted-foreground">{diversificationLevel.level}</p>
							</div>
							<div className="p-2 rounded-full bg-blue-100">
								<Network className="h-5 w-5 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("diversification.averageCorrelation")}</p>
								<p className="text-2xl font-bold text-orange-600">
									{(diversificationMetrics.avgCorrelation * 100).toFixed(0)}%
								</p>
								<p className="text-xs text-muted-foreground">{t("diversification.lowerIsBetter")}</p>
							</div>
							<div className="p-2 rounded-full bg-orange-100">
								<BarChart3 className="h-5 w-5 text-orange-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">{t("diversification.highCorrelations")}</p>
								<p className="text-2xl font-bold text-red-600">
									{diversificationMetrics.highCorrelations}
								</p>
								<p className="text-xs text-muted-foreground">
									{t("diversification.ofPairs", { total: diversificationMetrics.totalPairs })}
								</p>
							</div>
							<div className="p-2 rounded-full bg-red-100">
								<Layers className="h-5 w-5 text-red-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sector Allocation */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<PieChart className="h-5 w-5" />
						{t("diversification.sectorAllocation")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{sectorAllocation.map((allocation) => (
							<div key={allocation.sector} className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h4 className="font-medium">{allocation.displayName}</h4>
										<Badge variant="outline">
											{allocation.tickers.length} {t("risk.stocks")}
										</Badge>
									</div>
									<span className="text-sm font-medium">
										{allocation.allocation.toFixed(1)}%
									</span>
								</div>
								<Progress value={allocation.allocation} className="h-2" />
								<div className="flex flex-wrap gap-1">
									{allocation.tickers.map((ticker) => (
										<Badge key={ticker} variant="secondary" className="text-xs">
											{ticker}
										</Badge>
									))}
								</div>
							</div>
						))}
					</div>
					
					{/* Sector Diversification Insights */}
					<div className="mt-6 p-4 bg-muted/50 rounded-lg">
						<h4 className="font-medium mb-2">{t("diversification.sectorDiversificationAnalysis")}</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">{t("diversification.mostConcentratedSector")}:</p>
								<p className="font-medium">
									{sectorAllocation[0]?.displayName} ({sectorAllocation[0]?.allocation.toFixed(1)}%)
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">{t("diversification.sectorCount")}:</p>
								<p className="font-medium">
									{sectorAllocation.length} {t("diversification.sectors")}
									{sectorAllocation.length < 3 && (
										<span className="text-orange-600 ml-2">⚠ {t("diversification.considerMoreDiversification")}</span>
									)}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Correlation Matrix */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Network className="h-5 w-5" />
						{t("diversification.stockCorrelationMatrix")}
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						{t("diversification.correlationDescription")}
					</p>
				</CardHeader>
				<CardContent>
					<CorrelationHeatmap correlationMatrix={correlationMatrix} t={t} />
				</CardContent>
			</Card>

			{/* Diversification Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle>{t("diversification.recommendations")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{diversificationMetrics.highCorrelations > 0 && (
							<div className="p-4 border-l-4 border-orange-500 bg-orange-50">
								<h4 className="font-medium text-orange-800">{t("diversification.highCorrelation")}</h4>
								<p className="text-sm text-orange-700 mt-1">
									{t("diversification.highCorrelationMessage", { count: diversificationMetrics.highCorrelations })}
								</p>
							</div>
						)}
						
						{sectorAllocation.length < 3 && (
							<div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
								<h4 className="font-medium text-yellow-800">{t("diversification.limitedSector")}</h4>
								<p className="text-sm text-yellow-700 mt-1">
									{t("diversification.limitedSectorMessage", { count: sectorAllocation.length })}
								</p>
							</div>
						)}
						
						{diversificationMetrics.diversificationScore >= 60 && (
							<div className="p-4 border-l-4 border-green-500 bg-green-50">
								<h4 className="font-medium text-green-800">{t("diversification.wellDiversified")}</h4>
								<p className="text-sm text-green-700 mt-1">
									{t("diversification.wellDiversifiedMessage")}
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}