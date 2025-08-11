import { useMemo } from "react";
import { AlertTriangle, Shield, Activity, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	calculateStockMetrics,
	calculateDailyReturns,
	calculateVariance,
	type StockDataPoint,
	type StockPerformanceMetrics,
} from "@/lib/stock-data";

interface RiskAnalysisProps {
	portfolioData: Record<string, StockDataPoint[]>;
	benchmarkData: StockDataPoint[];
	portfolioTickers: string[];
}

interface RiskMetric {
	name: string;
	value: number;
	level: "Low" | "Medium" | "High" | "Very High";
	color: string;
	description: string;
}

export function RiskAnalysis({ 
	portfolioData, 
	benchmarkData, 
	portfolioTickers 
}: RiskAnalysisProps) {
	const riskMetrics = useMemo(() => {
		if (Object.keys(portfolioData).length === 0 || benchmarkData.length === 0) {
			return null;
		}

		// Calculate individual stock metrics
		const stockMetrics: StockPerformanceMetrics[] = [];
		const equalWeight = 1 / portfolioTickers.length;
		
		for (const ticker of portfolioTickers) {
			const stockData = portfolioData[ticker];
			if (stockData && stockData.length > 0) {
				const metrics = calculateStockMetrics(stockData, benchmarkData, ticker, equalWeight);
				stockMetrics.push(metrics);
			}
		}

		// Calculate portfolio-level risk metrics
		const portfolioVolatilities = stockMetrics.map(s => s.volatility);
		const portfolioBetas = stockMetrics.map(s => s.beta);
		const portfolioDrawdowns = stockMetrics.map(s => s.maxDrawdown);
		
		const avgVolatility = portfolioVolatilities.length > 0 ? 
			portfolioVolatilities.reduce((sum, vol) => sum + vol, 0) / portfolioVolatilities.length : 0;
		const avgBeta = portfolioBetas.length > 0 ? 
			portfolioBetas.reduce((sum, beta) => sum + beta, 0) / portfolioBetas.length : 1;
		const maxPortfolioDrawdown = portfolioDrawdowns.length > 0 ? 
			Math.max(...portfolioDrawdowns) : 0;
		
		// Calculate portfolio concentration (Herfindahl-Hirschman Index)
		const concentration = portfolioTickers.length > 0 ? 1 / portfolioTickers.length : 1;
		
		// Value at Risk approximation (95% confidence)
		const benchmarkReturns = calculateDailyReturns(benchmarkData);
		const benchmarkVolatility = Math.sqrt(calculateVariance(benchmarkReturns) * 252);
		const valueAtRisk = avgBeta * benchmarkVolatility * 1.65; // 95% VaR approximation

		return {
			stockMetrics,
			avgVolatility,
			avgBeta,
			maxPortfolioDrawdown,
			concentration,
			valueAtRisk,
			benchmarkVolatility
		};
	}, [portfolioData, benchmarkData, portfolioTickers]);

	const riskAssessment: RiskMetric[] = useMemo(() => {
		if (!riskMetrics) return [];

		return [
			{
				name: "Portfolio Volatility",
				value: riskMetrics.avgVolatility * 100,
				level: riskMetrics.avgVolatility > 0.4 ? "Very High" : 
				       riskMetrics.avgVolatility > 0.3 ? "High" : 
				       riskMetrics.avgVolatility > 0.2 ? "Medium" : "Low",
				color: riskMetrics.avgVolatility > 0.4 ? "text-red-600" : 
				       riskMetrics.avgVolatility > 0.3 ? "text-orange-600" : 
				       riskMetrics.avgVolatility > 0.2 ? "text-yellow-600" : "text-green-600",
				description: "Annualized standard deviation of returns"
			},
			{
				name: "Market Beta",
				value: riskMetrics.avgBeta,
				level: riskMetrics.avgBeta > 1.5 ? "Very High" : 
				       riskMetrics.avgBeta > 1.2 ? "High" : 
				       riskMetrics.avgBeta > 0.8 ? "Medium" : "Low",
				color: riskMetrics.avgBeta > 1.5 ? "text-red-600" : 
				       riskMetrics.avgBeta > 1.2 ? "text-orange-600" : 
				       riskMetrics.avgBeta > 0.8 ? "text-yellow-600" : "text-green-600",
				description: "Sensitivity to market movements"
			},
			{
				name: "Maximum Drawdown",
				value: riskMetrics.maxPortfolioDrawdown * 100,
				level: riskMetrics.maxPortfolioDrawdown > 0.4 ? "Very High" : 
				       riskMetrics.maxPortfolioDrawdown > 0.3 ? "High" : 
				       riskMetrics.maxPortfolioDrawdown > 0.2 ? "Medium" : "Low",
				color: riskMetrics.maxPortfolioDrawdown > 0.4 ? "text-red-600" : 
				       riskMetrics.maxPortfolioDrawdown > 0.3 ? "text-orange-600" : 
				       riskMetrics.maxPortfolioDrawdown > 0.2 ? "text-yellow-600" : "text-green-600",
				description: "Largest peak-to-trough decline"
			},
			{
				name: "Concentration Risk",
				value: riskMetrics.concentration * 100,
				level: riskMetrics.concentration > 0.5 ? "Very High" : 
				       riskMetrics.concentration > 0.33 ? "High" : 
				       riskMetrics.concentration > 0.2 ? "Medium" : "Low",
				color: riskMetrics.concentration > 0.5 ? "text-red-600" : 
				       riskMetrics.concentration > 0.33 ? "text-orange-600" : 
				       riskMetrics.concentration > 0.2 ? "text-yellow-600" : "text-green-600",
				description: "Portfolio diversification level"
			}
		];
	}, [riskMetrics]);

	if (!riskMetrics) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5" />
						Risk Analysis
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center p-8">
						<p className="text-muted-foreground">Calculating risk metrics...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{/* Risk Overview Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{riskAssessment.map((risk) => (
					<Card key={risk.name}>
						<CardContent className="p-4">
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">{risk.name}</span>
									<Badge 
										variant={risk.level === "Low" ? "default" : "destructive"}
										className={risk.level === "Low" ? "bg-green-100 text-green-800" : 
												   risk.level === "Medium" ? "bg-yellow-100 text-yellow-800" : ""}
									>
										{risk.level}
									</Badge>
								</div>
								<div className={`text-2xl font-bold ${risk.color}`}>
									{risk.name === "Market Beta" ? 
										risk.value.toFixed(2) : 
										`${risk.value.toFixed(1)}%`
									}
								</div>
								<p className="text-xs text-muted-foreground">{risk.description}</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Individual Stock Risk Analysis */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Activity className="h-5 w-5" />
						Individual Stock Risk Profile
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{riskMetrics.stockMetrics.map((stock) => (
							<div key={stock.ticker} className="border rounded-lg p-4">
								<div className="flex items-center justify-between mb-3">
									<h4 className="font-semibold">{stock.ticker}</h4>
									<div className="flex gap-2">
										<Badge variant="outline">
											β: {stock.beta.toFixed(2)}
										</Badge>
										<Badge variant={stock.maxDrawdown > 0.3 ? "destructive" : "secondary"}>
											Max DD: -{(stock.maxDrawdown * 100).toFixed(1)}%
										</Badge>
									</div>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									<div>
										<p className="text-sm text-muted-foreground mb-1">Volatility</p>
										<div className="flex items-center gap-2">
											<Progress 
												value={Math.min(stock.volatility * 200, 100)} 
												className="flex-1"
											/>
											<span className="text-sm font-medium">
												{(stock.volatility * 100).toFixed(1)}%
											</span>
										</div>
									</div>
									
									<div>
										<p className="text-sm text-muted-foreground mb-1">Beta</p>
										<div className="flex items-center gap-2">
											<Progress 
												value={Math.min(Math.abs(stock.beta) * 50, 100)} 
												className="flex-1"
											/>
											<span className="text-sm font-medium">
												{stock.beta.toFixed(2)}
											</span>
										</div>
									</div>
									
									<div>
										<p className="text-sm text-muted-foreground mb-1">Correlation</p>
										<div className="flex items-center gap-2">
											<Progress 
												value={Math.abs(stock.correlation) * 100} 
												className="flex-1"
											/>
											<span className="text-sm font-medium">
												{(stock.correlation * 100).toFixed(0)}%
											</span>
										</div>
									</div>
									
									<div>
										<p className="text-sm text-muted-foreground mb-1">Sharpe Ratio</p>
										<div className="flex items-center gap-2">
											<span className={`text-sm font-medium ${
												stock.sharpeRatio > 1 ? "text-green-600" : 
												stock.sharpeRatio > 0 ? "text-yellow-600" : "text-red-600"
											}`}>
												{stock.sharpeRatio.toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Risk vs Return Scatter */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Risk-Return Profile
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Risk Distribution */}
						<div>
							<h4 className="font-medium mb-4">Risk Distribution</h4>
							<div className="space-y-3">
								<div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-green-500 rounded-full"></div>
										<span className="text-sm">Low Risk</span>
									</div>
									<span className="text-sm font-medium">
										{riskMetrics.stockMetrics.filter(s => s.volatility < 0.2).length} stocks
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
										<span className="text-sm">Medium Risk</span>
									</div>
									<span className="text-sm font-medium">
										{riskMetrics.stockMetrics.filter(s => s.volatility >= 0.2 && s.volatility < 0.3).length} stocks
									</span>
								</div>
								<div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
									<div className="flex items-center gap-2">
										<div className="w-3 h-3 bg-red-500 rounded-full"></div>
										<span className="text-sm">High Risk</span>
									</div>
									<span className="text-sm font-medium">
										{riskMetrics.stockMetrics.filter(s => s.volatility >= 0.3).length} stocks
									</span>
								</div>
							</div>
						</div>

						{/* Key Risk Insights */}
						<div>
							<h4 className="font-medium mb-4">Risk Insights</h4>
							<div className="space-y-3">
								<div className="p-3 border rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<TrendingDown className="h-4 w-4 text-red-500" />
										<span className="text-sm font-medium">Highest Risk Stock</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{riskMetrics.stockMetrics.length > 0 ? 
											`${riskMetrics.stockMetrics.reduce((prev, current) => 
												prev.volatility > current.volatility ? prev : current
											).ticker} with ${(riskMetrics.stockMetrics.reduce((prev, current) => 
												prev.volatility > current.volatility ? prev : current
											).volatility * 100).toFixed(1)}% volatility` :
											"No stocks to analyze"
										}
									</p>
								</div>
								
								<div className="p-3 border rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<Shield className="h-4 w-4 text-blue-500" />
										<span className="text-sm font-medium">Portfolio Beta</span>
									</div>
									<p className="text-sm text-muted-foreground">
										{riskMetrics.avgBeta > 1 ? 
											`${(riskMetrics.avgBeta * 100 - 100).toFixed(0)}% more volatile than market` :
											`${(100 - riskMetrics.avgBeta * 100).toFixed(0)}% less volatile than market`
										}
									</p>
								</div>
								
								<div className="p-3 border rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<AlertTriangle className="h-4 w-4 text-orange-500" />
										<span className="text-sm font-medium">Value at Risk (95%)</span>
									</div>
									<p className="text-sm text-muted-foreground">
										Potential daily loss: {(riskMetrics.valueAtRisk * 100).toFixed(1)}%
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}