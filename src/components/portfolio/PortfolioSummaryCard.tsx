import { useMemo, useState } from "react";
import {
	PieChart,
	Eye,
	EyeOff,
	TableProperties,
	TrendingUp,
	TrendingDown,
	Calendar,
	BarChart3,
	List,
	CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	PieChart as RechartsPieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { ComparisonChart } from "@/components/charts/ComparisonChart";
import { useTranslation } from "@/hooks/useTranslation";
import {
	type PortfolioItem,
	calculateInvestmentValue,
	formatVND,
	formatNumber,
	isWatchListItem,
} from "@/lib/portfolio-utils";

interface PortfolioSummaryCardProps {
	items: PortfolioItem[];
	deposit: number;
	remainingCash?: number;
	showPrivacy: boolean;
	onTogglePrivacy: (show: boolean) => void;
	tickerData?: Record<string, any[]>; // Real market data for each ticker
}

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
	"#FFC658",
	"#8DD1E1",
	"#D084D0",
	"#87D068",
];

export function PortfolioSummaryCard({
	items,
	deposit,
	remainingCash = 0,
	showPrivacy,
	onTogglePrivacy,
	tickerData,
}: PortfolioSummaryCardProps) {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState<"compact" | "table" | "card">(
		"compact",
	);
	const [selectedTimeFrame, setSelectedTimeFrame] = useState("2W");

	// Helper function to get current market price for a ticker
	const getCurrentMarketPrice = (ticker: string): number => {
		if (!tickerData || !tickerData[ticker] || tickerData[ticker].length === 0) {
			return 0; // No market data available
		}
		const latestData = tickerData[ticker][tickerData[ticker].length - 1];
		return latestData.close || 0;
	};

	// Check if we have market data for all tickers
	const hasAllMarketData = items
		.filter((item) => !isWatchListItem(item))
		.every((item) => {
			return getCurrentMarketPrice(item.ticker) > 0;
		});

	const { investments, currentMarketValue, chartData, totalCostBasis } =
		useMemo(() => {
			const investments = items.filter((item) => !isWatchListItem(item));

			// Calculate current market value using real prices when available
			const currentMarketValue = investments.reduce((sum, item) => {
				const marketPrice = getCurrentMarketPrice(item.ticker);
				const currentValue =
					marketPrice > 0
						? item.quantity * marketPrice
						: calculateInvestmentValue(item);
				return sum + currentValue;
			}, 0);

			// Calculate total cost basis (money actually spent on stocks)
			const totalCostBasis = investments.reduce((sum, item) => {
				return sum + item.quantity * item.price;
			}, 0);

			const chartData = investments
				.map((item, index) => {
					const marketPrice = getCurrentMarketPrice(item.ticker);
					const currentValue =
						marketPrice > 0
							? item.quantity * marketPrice
							: calculateInvestmentValue(item);
					return {
						name: item.ticker,
						value: currentValue,
						percentage:
							currentMarketValue > 0
								? ((currentValue / currentMarketValue) * 100).toFixed(1)
								: "0",
						color: COLORS[index % COLORS.length],
					};
				})
				.filter((item) => item.value > 0)
				.sort((a, b) => b.value - a.value);

			return { investments, currentMarketValue, chartData, totalCostBasis };
		}, [items, tickerData]);

	// Total portfolio value includes stocks + remaining cash
	const totalPortfolioValue = currentMarketValue + remainingCash;

	const profitLoss = currentMarketValue - totalCostBasis;
	const profitLossPercentage =
		totalCostBasis > 0 ? (profitLoss / totalCostBasis) * 100 : 0;

	const displayValue = (value: number) => {
		if (showPrivacy) {
			return "●●●●●";
		}
		return formatVND(value);
	};


	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="bg-background border rounded-lg p-3 shadow-lg">
					<p className="font-medium">{data.name}</p>
					<p className="text-sm text-muted-foreground">
						{displayValue(data.value)} ({data.percentage}%)
					</p>
				</div>
			);
		}
		return null;
	};

	const renderCustomLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
	}: any) => {
		if (percent < 0.05) return null; // Hide labels for slices smaller than 5%
		if (showPrivacy) return null; // Hide labels in privacy mode

		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill="white"
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline="central"
				className="text-xs font-medium"
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	return (
		<Card className="bg-gradient-to-br from-background via-blue-50/20 to-green-50/20 border-2 border-dashed border-muted/30">
			<CardHeader>
				<CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
							<PieChart className="h-4 w-4 text-white" />
						</div>
						<div>
							<h2 className="text-lg font-bold">{t("portfolio.summary")}</h2>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-2 bg-background/50 rounded-full px-3 py-1 border">
							<Switch
								id="privacy-toggle"
								checked={showPrivacy}
								onCheckedChange={onTogglePrivacy}
							/>
							<Label
								htmlFor="privacy-toggle"
								className="text-xs flex items-center gap-1 cursor-pointer"
							>
								{showPrivacy ? (
									<EyeOff className="h-3 w-3" />
								) : (
									<Eye className="h-3 w-3" />
								)}
								{t("portfolio.privacy")}
							</Label>
						</div>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="px-0">
				{!hasAllMarketData ? (
					<div className="flex items-center justify-center py-12">
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
							<span className="text-lg text-muted-foreground">
								Loading market data...
							</span>
						</div>
					</div>
				) : (
					<>
						{/* Portfolio Summary Stats - Main 3 columns + Reference row */}
						<div className="px-3 mb-3">
							{/* Main Portfolio Values - 3 columns */}
							<div className="grid grid-cols-3 gap-3 text-xs mb-3">
								<div className="text-center bg-green-50 rounded-lg p-2 sm:p-3 border border-green-200">
									<span className="text-muted-foreground block mb-1 text-xs">
										{t("portfolio.equityValue")}
									</span>
									<div className="font-bold text-sm sm:text-lg text-green-600">
										{displayValue(currentMarketValue)}
									</div>
								</div>
								<div className="text-center bg-gray-50 rounded-lg p-2 sm:p-3">
									<span className="text-muted-foreground block mb-1 text-xs">
										{t("portfolio.cashRemaining")}
									</span>
									<div className="font-bold text-sm sm:text-lg text-gray-600">
										{displayValue(remainingCash)}
									</div>
								</div>
								<div className="text-center bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
									<span className="text-muted-foreground block mb-1 text-xs">
										{t("portfolio.totalAssets")}
									</span>
									<div className="font-bold text-sm sm:text-lg text-blue-600">
										{displayValue(totalPortfolioValue)}
									</div>
								</div>
							</div>

							{/* Reference Info - 3 columns */}
							<div className="grid grid-cols-3 gap-3 text-xs">
								<div className="text-center bg-gray-50 rounded-lg p-2">
									<span className="text-muted-foreground block mb-1 text-xs">
										{t("portfolio.totalDeposit")}
									</span>
									<div className="font-medium text-xs sm:text-sm text-gray-600">
										{displayValue(deposit)}
									</div>
								</div>
								<div className="text-center bg-gray-50 rounded-lg p-2">
									<span className="text-muted-foreground block mb-1 text-xs">
										{t("portfolio.gainLoss")}
									</span>
									<div
										className={`font-semibold text-xs sm:text-sm ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
									>
										{profitLoss >= 0 ? "+" : ""}
										{displayValue(Math.abs(profitLoss))}
									</div>
								</div>
								<div className="text-center bg-gray-50 rounded-lg p-2">
									<span className="text-muted-foreground block mb-1 text-xs">
										{t("portfolio.returnPercent")}
									</span>
									<div
										className={`font-semibold text-xs sm:text-sm ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
									>
										{profitLossPercentage >= 0 ? "+" : ""}
										{profitLossPercentage.toFixed(1)}%
									</div>
								</div>
							</div>
						</div>

						{/* Unified Tab Interface for All Devices */}
						<div className="px-3">
							<Tabs defaultValue="overview" className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="overview">
										{t("portfolio.overview")}
									</TabsTrigger>
									<TabsTrigger value="allocation">
										{t("portfolio.allocation")}
									</TabsTrigger>
									<TabsTrigger value="performance">
										{t("portfolio.performance")}
									</TabsTrigger>
								</TabsList>

								<TabsContent value="overview" className="mt-4">
									{/* Toggle View Mode */}
									<div className="flex justify-end mb-3">
										<div className="bg-gray-100 rounded-lg p-1 flex gap-1">
											<Button
												size="sm"
												variant={viewMode === "compact" ? "default" : "ghost"}
												className="px-3 py-1 h-8"
												onClick={() => setViewMode("compact")}
											>
												<List className="h-4 w-4 mr-1" />
												Compact
											</Button>
											<Button
												size="sm"
												variant={viewMode === "table" ? "default" : "ghost"}
												className="px-3 py-1 h-8"
												onClick={() => setViewMode("table")}
											>
												<TableProperties className="h-4 w-4 mr-1" />
												Table
											</Button>
											<Button
												size="sm"
												variant={viewMode === "card" ? "default" : "ghost"}
												className="px-3 py-1 h-8"
												onClick={() => setViewMode("card")}
											>
												<CreditCard className="h-4 w-4 mr-1" />
												Card
											</Button>
										</div>
									</div>

									{viewMode === "compact" ? (
										/* Card-style Overview Table - SSI Layout */
										<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
											{/* Header */}
											<div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
												<div className="grid grid-cols-[auto_1fr_1fr_1.5fr] gap-2 text-xs font-medium text-gray-600">
													<div>{t("portfolio.ticker")}</div>
													<div className="text-center">
														{t("portfolio.volume")}
													</div>
													<div className="text-center">
														<div className="text-xs">
															{t("portfolio.marketPrice")}
														</div>
														<div className="text-xs">
															{t("portfolio.buyPrice")}
														</div>
													</div>
													<div className="text-center">
														<div className="text-xs">
															{t("portfolio.profitPercent")}
														</div>
														<div className="text-xs">
															{t("portfolio.profitPrice")}
														</div>
													</div>
												</div>
											</div>

											{/* Card Rows */}
											<div className="divide-y divide-gray-100">
												{investments.map((item) => {
													const marketPrice =
														getCurrentMarketPrice(item.ticker) || item.price; // Use real market price or fallback to buy price
													const costBasis = item.price; // Cost basis (buy price)
													const profitPrice =
														(marketPrice - costBasis) * item.quantity; // Profit in VND
													const profitPercent =
														costBasis > 0
															? ((marketPrice - costBasis) / costBasis) * 100
															: 0; // Profit percentage
													const volume = item.quantity; // Volume/Quantity

													return (
														<div
															key={item.ticker}
															className="px-3 py-2 hover:bg-gray-50 transition-colors"
														>
															<div className="grid grid-cols-[auto_1fr_1fr_1.5fr] gap-2 items-center">
																{/* Ticker */}
																<div className="font-semibold text-gray-900 text-sm">
																	{item.ticker}
																</div>

																{/* Volume */}
																<div className="text-center">
																	{showPrivacy ? (
																		<span className="text-gray-400 text-xs">
																			●●●
																		</span>
																	) : (
																		<span className="font-medium text-xs">
																			{formatNumber(volume)}
																		</span>
																	)}
																</div>

																{/* Market Price / Buy Price */}
																<div className="text-center space-y-0.5">
																	<div className="font-medium text-gray-900 text-xs">
																		{formatVND(marketPrice)}
																	</div>
																	<div className="text-xs text-gray-500">
																		{formatVND(costBasis)}
																	</div>
																</div>

																{/* Profit % / Profit VND */}
																<div className="text-center space-y-0.5">
																	<div
																		className={`font-semibold text-xs ${profitPercent >= 0 ? "text-green-600" : "text-red-600"}`}
																	>
																		{profitPercent >= 0 ? "+" : ""}
																		{profitPercent.toFixed(1)}%
																	</div>
																	{!showPrivacy && (
																		<div
																			className={`text-xs font-medium ${profitPrice >= 0 ? "text-green-600" : "text-red-600"}`}
																		>
																			{profitPrice >= 0 ? "+" : ""}
																			{formatVND(Math.abs(profitPrice))}
																		</div>
																	)}
																	{showPrivacy && (
																		<div className="text-xs text-gray-400">
																			●●●
																		</div>
																	)}
																</div>
															</div>
														</div>
													);
												})}
											</div>

											{/* Totals row */}
											<div className="border-t border-gray-200 bg-gray-50">
												<div className="px-3 py-2">
													<div className="grid grid-cols-2 gap-4">
														<div className="text-center">
															<span className="text-xs font-medium text-gray-600 block mb-1">
																{t("portfolio.totalCostBasis")}
															</span>
															<div className="font-bold text-sm text-gray-900">
																{displayValue(totalCostBasis)}
															</div>
														</div>
														<div className="text-center">
															<span className="text-xs font-medium text-gray-600 block mb-1">
																{t("portfolio.totalEquityValue")}
															</span>
															<div className="font-bold text-sm text-green-600">
																{displayValue(currentMarketValue)}
															</div>
														</div>
													</div>
												</div>
											</div>

										</div>
									) : viewMode === "table" ? (
										/* Traditional Table View */
										<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
											<Table>
												<TableHeader>
													<TableRow className="hover:bg-transparent border-gray-200">
														<TableHead className="font-semibold text-gray-700">
															{t("portfolio.ticker")}
														</TableHead>
														<TableHead className="font-semibold text-right text-gray-700">
															{t("portfolio.buyPrice")}
														</TableHead>
														<TableHead className="font-semibold text-right text-gray-700">
															{t("portfolio.marketPrice")}
														</TableHead>
														<TableHead className="font-semibold text-right text-gray-700">
															{t("portfolio.profitPercent")}
														</TableHead>
														{!showPrivacy && (
															<TableHead className="font-semibold text-right text-gray-700">
																{t("portfolio.costBasis")}
															</TableHead>
														)}
														{!showPrivacy && (
															<TableHead className="font-semibold text-right text-gray-700">
																{t("portfolio.volume")}
															</TableHead>
														)}
														{!showPrivacy && (
															<TableHead className="font-semibold text-right text-gray-700">
																{t("portfolio.profitPrice")}
															</TableHead>
														)}
													</TableRow>
												</TableHeader>
												<TableBody>
													{investments.map((item) => {
														const marketPrice =
															getCurrentMarketPrice(item.ticker) || item.price; // Use real market price or fallback to buy price
														const costBasis = item.price; // Cost basis (buy price)
														const profitPrice =
															(marketPrice - costBasis) * item.quantity; // Profit in VND
														const profitPercent =
															costBasis > 0
																? ((marketPrice - costBasis) / costBasis) * 100
																: 0; // Profit percentage
														const volume = item.quantity; // Volume/Quantity

														return (
															<TableRow
																key={item.ticker}
																className="hover:bg-gray-50 border-gray-100"
															>
																<TableCell className="font-medium text-gray-900">
																	{item.ticker}
																</TableCell>
																<TableCell className="text-right text-gray-700">
																	{formatVND(costBasis)}
																</TableCell>
																<TableCell className="text-right text-gray-700">
																	{formatVND(marketPrice)}
																</TableCell>
																<TableCell
																	className={`text-right font-medium ${profitPercent >= 0 ? "text-green-600" : "text-red-600"}`}
																>
																	{profitPercent >= 0 ? "+" : ""}
																	{profitPercent.toFixed(2)}%
																</TableCell>
																{!showPrivacy && (
																	<TableCell className="text-right text-gray-700">
																		{formatVND(costBasis * volume)}
																	</TableCell>
																)}
																{!showPrivacy && (
																	<TableCell className="text-right text-gray-700">
																		{formatNumber(volume)}
																	</TableCell>
																)}
																{!showPrivacy && (
																	<TableCell
																		className={`text-right font-medium ${profitPrice >= 0 ? "text-green-600" : "text-red-600"}`}
																	>
																		{profitPrice >= 0 ? "+" : ""}
																		{formatVND(Math.abs(profitPrice))}
																	</TableCell>
																)}
															</TableRow>
														);
													})}
												</TableBody>
											</Table>

											{/* Totals row */}
											<div className="border-t border-gray-200 bg-gray-50">
												<div className="px-4 py-3">
													<div className="grid grid-cols-2 gap-4">
														<div className="text-center">
															<span className="text-sm font-medium text-gray-600 block mb-1">
																{t("portfolio.totalCostBasis")}
															</span>
															<div className="font-bold text-base text-gray-900">
																{displayValue(totalCostBasis)}
															</div>
														</div>
														<div className="text-center">
															<span className="text-sm font-medium text-gray-600 block mb-1">
																{t("portfolio.totalEquityValue")}
															</span>
															<div className="font-bold text-base text-green-600">
																{displayValue(currentMarketValue)}
															</div>
														</div>
													</div>
												</div>
											</div>

										</div>
									) : (
										/* Individual Card Grid Layout */
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
											{investments.map((item) => {
												const marketPrice =
													getCurrentMarketPrice(item.ticker) || item.price;
												const costBasis = item.price;
												const profitPrice =
													(marketPrice - costBasis) * item.quantity;
												const profitPercent =
													costBasis > 0
														? ((marketPrice - costBasis) / costBasis) * 100
														: 0;
												const volume = item.quantity;

												return (
													<div
														key={item.ticker}
														className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
													>
														{/* Header with ticker */}
														<div className="flex items-center justify-between mb-3">
															<h3 className="text-lg font-bold text-gray-900">
																{item.ticker}
															</h3>
															<div
																className={`text-sm font-semibold px-2 py-1 rounded ${
																	profitPercent >= 0
																		? "bg-green-100 text-green-700"
																		: "bg-red-100 text-red-700"
																}`}
															>
																{profitPercent >= 0 ? "+" : ""}
																{profitPercent.toFixed(1)}%
															</div>
														</div>

														{/* Price info */}
														<div className="space-y-2 mb-3">
															<div className="flex justify-between text-sm">
																<span className="text-gray-600">
																	{t("portfolio.marketPrice")}
																</span>
																<span className="font-medium">
																	{formatVND(marketPrice)}
																</span>
															</div>
															<div className="flex justify-between text-sm">
																<span className="text-gray-600">
																	{t("portfolio.buyPrice")}
																</span>
																<span>{formatVND(costBasis)}</span>
															</div>
															{!showPrivacy && (
																<div className="flex justify-between text-sm">
																	<span className="text-gray-600">
																		{t("portfolio.volume")}
																	</span>
																	<span>{formatNumber(volume)}</span>
																</div>
															)}
														</div>

														{/* Profit/Loss */}
														{!showPrivacy && (
															<div className="border-t pt-3">
																<div className="flex justify-between items-center">
																	<span className="text-sm text-gray-600">
																		P&L
																	</span>
																	<div
																		className={`text-right ${profitPrice >= 0 ? "text-green-600" : "text-red-600"}`}
																	>
																		<div className="font-semibold">
																			{profitPrice >= 0 ? "+" : ""}
																			{formatVND(Math.abs(profitPrice))}
																		</div>
																		<div className="text-xs">
																			{profitPercent >= 0 ? "+" : ""}
																			{profitPercent.toFixed(2)}%
																		</div>
																	</div>
																</div>
															</div>
														)}
													</div>
												);
											})}
										</div>
									)}
								</TabsContent>

								<TabsContent value="allocation" className="mt-2">
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
										{/* Stock Allocation Chart */}
										{chartData.length > 0 && (
											<div className="bg-white rounded-lg border border-gray-200 p-2">
												<h4 className="font-medium text-gray-700 mb-1 text-xs text-center">
													{t("portfolio.stockAllocation")}
												</h4>
												<div className="h-44">
													<ResponsiveContainer width="100%" height="100%">
														<RechartsPieChart>
															<Pie
																data={chartData}
																cx="50%"
																cy="50%"
																labelLine={false}
																label={renderCustomLabel}
																outerRadius="85%"
																innerRadius="35%"
																fill="#8884d8"
																dataKey="value"
																stroke="white"
																strokeWidth={1}
															>
																{chartData.map((entry, index) => (
																	<Cell
																		key={`cell-${index}`}
																		fill={entry.color}
																	/>
																))}
															</Pie>
															<Tooltip content={<CustomTooltip />} />
														</RechartsPieChart>
													</ResponsiveContainer>
												</div>
												{/* Compact Legend */}
												<div className="mt-1 grid grid-cols-1 gap-1">
													{chartData.map((item) => (
														<div
															key={item.name}
															className="flex justify-between items-center"
														>
															<div className="flex items-center gap-2">
																<div
																	className="w-3 h-3 rounded-full"
																	style={{ backgroundColor: item.color }}
																></div>
																<span className="text-xs font-medium text-gray-700">
																	{item.name}
																</span>
															</div>
															<div className="text-right">
																<span className="text-xs font-medium text-gray-900">
																	{displayValue(item.value)}
																</span>
																<span className="ml-1 text-xs text-gray-500">
																	{item.percentage}%
																</span>
															</div>
														</div>
													))}
												</div>
											</div>
										)}

										{/* Cash vs Equity Chart */}
										<div className="bg-white rounded-lg border border-gray-200 p-2">
											<h4 className="font-medium text-gray-700 mb-1 text-xs text-center">
												{t("portfolio.cashEquityRatio")}
											</h4>
											<div className="h-44">
												<ResponsiveContainer width="100%" height="100%">
													<RechartsPieChart>
														<Pie
															data={[
																{
																	name: t("portfolio.equityValue"),
																	value: currentMarketValue,
																	color: "#10B981",
																	percentage:
																		totalPortfolioValue > 0
																			? (
																					(currentMarketValue /
																						totalPortfolioValue) *
																					100
																				).toFixed(1)
																			: "0",
																},
																{
																	name: t("portfolio.cashRemaining"),
																	value: remainingCash,
																	color: "#6B7280",
																	percentage:
																		totalPortfolioValue > 0
																			? (
																					(remainingCash /
																						totalPortfolioValue) *
																					100
																				).toFixed(1)
																			: "0",
																},
															]}
															cx="50%"
															cy="50%"
															labelLine={false}
															label={({
																cx,
																cy,
																midAngle,
																innerRadius,
																outerRadius,
																percent,
															}: any) => {
																if (!percent || percent < 0.05) return null;
																if (showPrivacy) return null;

																const RADIAN = Math.PI / 180;
																const radius =
																	innerRadius +
																	(outerRadius - innerRadius) * 0.5;
																const x =
																	cx + radius * Math.cos(-midAngle * RADIAN);
																const y =
																	cy + radius * Math.sin(-midAngle * RADIAN);

																return (
																	<text
																		x={x}
																		y={y}
																		fill="white"
																		textAnchor={x > cx ? "start" : "end"}
																		dominantBaseline="central"
																		className="text-sm font-bold"
																	>
																		{`${(percent * 100).toFixed(0)}%`}
																	</text>
																);
															}}
															outerRadius="85%"
															innerRadius="35%"
															fill="#8884d8"
															dataKey="value"
															stroke="white"
															strokeWidth={1}
														>
															<Cell fill="#10B981" />
															<Cell fill="#6B7280" />
														</Pie>
														<Tooltip
															content={({ active, payload }) => {
																if (active && payload && payload.length) {
																	const data = payload[0].payload;
																	return (
																		<div className="bg-background border rounded-lg p-2 shadow-lg">
																			<p className="text-xs font-medium">
																				{data.name}
																			</p>
																			<p className="text-xs text-muted-foreground">
																				{displayValue(data.value)} (
																				{data.percentage}%)
																			</p>
																		</div>
																	);
																}
																return null;
															}}
														/>
													</RechartsPieChart>
												</ResponsiveContainer>
											</div>
											{/* Compact Legend */}
											<div className="mt-1 grid grid-cols-1 gap-1">
												<div className="flex justify-between items-center">
													<div className="flex items-center gap-2">
														<div className="w-3 h-3 rounded-full bg-green-500"></div>
														<span className="text-xs font-medium text-gray-700">
															{t("portfolio.equityValue")}
														</span>
													</div>
													<div className="text-right">
														<span className="text-xs font-medium text-gray-900">
															{displayValue(currentMarketValue)}
														</span>
														<span className="ml-1 text-xs text-gray-500">
															{totalPortfolioValue > 0
																? (
																		(currentMarketValue / totalPortfolioValue) *
																		100
																	).toFixed(1)
																: "0"}
															%
														</span>
													</div>
												</div>
												<div className="flex justify-between items-center">
													<div className="flex items-center gap-2">
														<div className="w-3 h-3 rounded-full bg-gray-500"></div>
														<span className="text-xs font-medium text-gray-700">
															{t("portfolio.cashRemaining")}
														</span>
													</div>
													<div className="text-right">
														<span className="text-xs font-medium text-gray-900">
															{displayValue(remainingCash)}
														</span>
														<span className="ml-1 text-xs text-gray-500">
															{totalPortfolioValue > 0
																? (
																		(remainingCash / totalPortfolioValue) *
																		100
																	).toFixed(1)
																: "0"}
															%
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</TabsContent>

								<TabsContent value="performance" className="mt-4 space-y-4">
									{/* Performance Cards */}
									<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
										{/* Daily Change - Calculate daily change from ticker data */}
										{(() => {
											// Calculate daily change based on market data
											let dailyChangePercent = 0;
											let dailyChangeAmount = 0;
											let hasValidDailyData = false;

											if (tickerData && investments.length > 0) {
												const totalCurrentValue = investments.reduce(
													(sum, item) => {
														const itemData = tickerData[item.ticker];
														if (itemData && itemData.length >= 2) {
															const currentPrice =
																itemData[itemData.length - 1]?.close || 0;
															const previousPrice =
																itemData[itemData.length - 2]?.close || 0;
															if (currentPrice > 0 && previousPrice > 0) {
																const itemDailyChange =
																	((currentPrice - previousPrice) /
																		previousPrice) *
																	(item.quantity * previousPrice);
																return sum + itemDailyChange;
															}
														}
														return sum;
													},
													0,
												);

												const totalPreviousValue = investments.reduce(
													(sum, item) => {
														const itemData = tickerData[item.ticker];
														if (itemData && itemData.length >= 2) {
															const previousPrice =
																itemData[itemData.length - 2]?.close || 0;
															if (previousPrice > 0) {
																return sum + item.quantity * previousPrice;
															}
														}
														return sum;
													},
													0,
												);

												if (totalPreviousValue > 0) {
													dailyChangePercent =
														(totalCurrentValue / totalPreviousValue) * 100;
													dailyChangeAmount = totalCurrentValue;
													hasValidDailyData = true;
												}
											}

											return (
												<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 md:p-3 border border-blue-200">
													<div className="flex items-center gap-1 md:gap-2 mb-1">
														<Calendar className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
														<span className="text-xs font-medium text-blue-900">
															{t("portfolio.performanceTab.dailyChange")}
														</span>
													</div>
													<div
														className={`text-lg md:text-xl font-bold text-center ${hasValidDailyData && dailyChangePercent >= 0 ? "text-green-600" : "text-red-600"}`}
													>
														{hasValidDailyData
															? `${dailyChangePercent >= 0 ? "+" : ""}${dailyChangePercent.toFixed(1)}%`
															: "--"}
													</div>
													{showPrivacy ? (
														<div className="text-xs text-gray-400 text-center">
															●●●●●
														</div>
													) : hasValidDailyData ? (
														<div
															className={`text-xs text-center ${dailyChangeAmount >= 0 ? "text-green-600" : "text-red-600"}`}
														>
															{dailyChangeAmount >= 0 ? "+" : ""}
															{formatVND(Math.abs(dailyChangeAmount))}
														</div>
													) : (
														<div className="text-xs text-gray-400 text-center">
															No data
														</div>
													)}
												</div>
											);
										})()}

										{/* Total Return */}
										<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 md:p-3 border border-green-200">
											<div className="flex items-center gap-1 md:gap-2 mb-1">
												<TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
												<span className="text-xs font-medium text-green-900">
													{t("portfolio.performanceTab.totalReturn")}
												</span>
											</div>
											<div
												className={`text-lg md:text-xl font-bold text-center ${profitLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}
											>
												{profitLossPercentage >= 0 ? "+" : ""}
												{profitLossPercentage.toFixed(1)}%
											</div>
											{showPrivacy ? (
												<div className="text-xs text-gray-400 text-center">
													●●●●●
												</div>
											) : (
												<div
													className={`text-xs text-center ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
												>
													{profitLoss >= 0 ? "+" : ""}
													{formatVND(Math.abs(profitLoss))}
												</div>
											)}
										</div>

										{/* Best Performer */}
										{(() => {
											const bestPerformer = investments.reduce((best, item) => {
												const marketPrice =
													getCurrentMarketPrice(item.ticker) || item.price;
												const profitPercent =
													item.price > 0
														? ((marketPrice - item.price) / item.price) * 100
														: 0;
												const bestPercent =
													best.price > 0
														? ((getCurrentMarketPrice(best.ticker) -
																best.price) /
																best.price) *
															100
														: -Infinity;
												return profitPercent > bestPercent ? item : best;
											}, investments[0]);

											if (!bestPerformer) return null;

											const marketPrice =
												getCurrentMarketPrice(bestPerformer.ticker) ||
												bestPerformer.price;
											const profitPercent =
												bestPerformer.price > 0
													? ((marketPrice - bestPerformer.price) /
															bestPerformer.price) *
														100
													: 0;
											const profitAmount =
												(marketPrice - bestPerformer.price) *
												bestPerformer.quantity;

											return (
												<div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-2 md:p-3 border border-emerald-200">
													<div className="flex items-center gap-1 md:gap-2 mb-1">
														<TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-emerald-600" />
														<span className="text-xs font-medium text-emerald-900">
															{t("portfolio.performanceTab.bestPerformer")}:{" "}
															{bestPerformer.ticker}
														</span>
													</div>
													<div
														className={`text-lg md:text-xl font-bold text-center ${profitPercent >= 0 ? "text-green-600" : "text-red-600"}`}
													>
														{profitPercent >= 0 ? "+" : ""}
														{profitPercent.toFixed(1)}%
													</div>
													{showPrivacy ? (
														<div className="text-xs text-gray-400 text-center">
															●●●●●
														</div>
													) : (
														<div
															className={`text-xs text-center ${profitAmount >= 0 ? "text-green-600" : "text-red-600"}`}
														>
															{profitAmount >= 0 ? "+" : ""}
															{formatVND(Math.abs(profitAmount))}
														</div>
													)}
												</div>
											);
										})()}

										{/* Worst Performer */}
										{(() => {
											const worstPerformer = investments.reduce(
												(worst, item) => {
													const marketPrice =
														getCurrentMarketPrice(item.ticker) || item.price;
													const profitPercent =
														item.price > 0
															? ((marketPrice - item.price) / item.price) * 100
															: 0;
													const worstPercent =
														worst.price > 0
															? ((getCurrentMarketPrice(worst.ticker) -
																	worst.price) /
																	worst.price) *
																100
															: Infinity;
													return profitPercent < worstPercent ? item : worst;
												},
												investments[0],
											);

											if (!worstPerformer) return null;

											const marketPrice =
												getCurrentMarketPrice(worstPerformer.ticker) ||
												worstPerformer.price;
											const profitPercent =
												worstPerformer.price > 0
													? ((marketPrice - worstPerformer.price) /
															worstPerformer.price) *
														100
													: 0;
											const profitAmount =
												(marketPrice - worstPerformer.price) *
												worstPerformer.quantity;

											return (
												<div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-2 md:p-3 border border-red-200">
													<div className="flex items-center gap-1 md:gap-2 mb-1">
														<TrendingDown className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
														<span className="text-xs font-medium text-red-900">
															{t("portfolio.performanceTab.worstPerformer")}:{" "}
															{worstPerformer.ticker}
														</span>
													</div>
													<div
														className={`text-lg md:text-xl font-bold text-center ${profitPercent >= 0 ? "text-green-600" : "text-red-600"}`}
													>
														{profitPercent >= 0 ? "+" : ""}
														{profitPercent.toFixed(1)}%
													</div>
													{showPrivacy ? (
														<div className="text-xs text-gray-400 text-center">
															●●●●●
														</div>
													) : (
														<div
															className={`text-xs text-center ${profitAmount >= 0 ? "text-green-600" : "text-red-600"}`}
														>
															{profitAmount >= 0 ? "+" : ""}
															{formatVND(Math.abs(profitAmount))}
														</div>
													)}
												</div>
											);
										})()}
									</div>

									{/* Portfolio vs VN-Index Chart with Time Frame Selector */}
									<div className="bg-white rounded-lg border border-gray-200 p-4">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-2">
												<BarChart3 className="h-4 w-4 text-blue-600" />
												<h4 className="font-medium text-gray-700 text-sm">
													{t("portfolio.performanceTab.portfolioVsVnindex")} (
													{selectedTimeFrame})
												</h4>
											</div>
											{/* Time Frame Selector */}
											{(() => {
												const timeFrames = [
													{ label: "1W", days: 5 },
													{ label: "2W", days: 10 },
													{ label: "4W", days: 20 },
													{ label: "1M", days: 22 },
													{ label: "3M", days: 66 },
												];

												return (
													<div className="flex bg-gray-100 rounded-lg p-1">
														{timeFrames.map((tf) => (
															<button
																key={tf.label}
																onClick={() => setSelectedTimeFrame(tf.label)}
																className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
																	selectedTimeFrame === tf.label
																		? "bg-white text-blue-600 shadow-sm"
																		: "text-gray-600 hover:text-gray-800"
																}`}
															>
																{tf.label}
															</button>
														))}
													</div>
												);
											})()}
										</div>

										{/* Simple Portfolio vs VNINDEX chart */}
										{(() => {
											const timeFrames = [
												{ label: "1W", days: 5 },
												{ label: "2W", days: 10 },
												{ label: "4W", days: 20 },
												{ label: "1M", days: 22 },
												{ label: "3M", days: 66 },
											];

											const vnindexData = tickerData?.["VNINDEX"];

											if (
												!vnindexData ||
												vnindexData.length === 0 ||
												investments.length === 0
											) {
												return (
													<div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
														<div className="text-sm text-gray-500">
															{t("portfolio.performanceTab.noDataAvailable")}
														</div>
													</div>
												);
											}

											// Get selected time frame days
											const selectedDays =
												timeFrames.find((tf) => tf.label === selectedTimeFrame)
													?.days || 22;
											const timeFrameData = vnindexData.slice(-selectedDays);

											if (timeFrameData.length === 0) {
												return (
													<div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
														<div className="text-sm text-gray-500">
															{t("portfolio.performanceTab.noDataAvailable")}
														</div>
													</div>
												);
											}

											// Calculate portfolio weighted performance
											const totalInvestment = investments.reduce(
												(sum, item) => sum + item.quantity * item.price,
												0,
											);

											const chartData = [];
											const vnindexBaseline = timeFrameData[0]?.close || 0;

											// Calculate portfolio baseline (weighted average of starting prices)
											let portfolioBaseline = 0;
											investments.forEach((item) => {
												const itemData = tickerData?.[item.ticker];
												if (
													itemData &&
													itemData.length >= timeFrameData.length
												) {
													const itemStartData = itemData.slice(
														-timeFrameData.length,
													)[0];
													const weight =
														(item.quantity * item.price) / totalInvestment;
													portfolioBaseline +=
														(itemStartData?.close || 0) * weight;
												}
											});

											if (vnindexBaseline === 0 || portfolioBaseline === 0) {
												return (
													<div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
														<div className="text-sm text-gray-500">
															{t("portfolio.performanceTab.noDataAvailable")}
														</div>
													</div>
												);
											}

											for (let i = 0; i < timeFrameData.length; i++) {
												const dataPoint: Record<string, any> = {
													time: timeFrameData[i]?.time,
													date: timeFrameData[i]?.date,
												};

												// Add VNINDEX data
												const vnindexPoint = timeFrameData[i];
												if (vnindexPoint) {
													dataPoint["VNINDEX"] =
														((vnindexPoint.close - vnindexBaseline) /
															vnindexBaseline) *
														100;
												}

												// Calculate weighted portfolio performance
												let portfolioValue = 0;
												let hasAllData = true;

												investments.forEach((item) => {
													const itemData = tickerData?.[item.ticker];
													if (
														itemData &&
														itemData.length >= timeFrameData.length
													) {
														const itemCurrentData = itemData.slice(
															-timeFrameData.length,
														)[i];
														const itemStartData = itemData.slice(
															-timeFrameData.length,
														)[0];
														if (itemCurrentData && itemStartData) {
															const weight =
																(item.quantity * item.price) / totalInvestment;
															portfolioValue +=
																(itemCurrentData.close || 0) * weight;
														} else {
															hasAllData = false;
														}
													} else {
														hasAllData = false;
													}
												});

												if (hasAllData && portfolioBaseline > 0) {
													dataPoint["Portfolio"] =
														((portfolioValue - portfolioBaseline) /
															portfolioBaseline) *
														100;
												}

												chartData.push(dataPoint);
											}

											return (
												<div className="space-y-3">
													{/* Legend */}
													<div className="flex flex-wrap gap-3 text-sm">
														<div className="flex items-center gap-2">
															<div className="w-4 h-4 rounded-full bg-purple-500"></div>
															<span className="font-medium text-purple-600">
																Portfolio
															</span>
														</div>
														<div className="flex items-center gap-2">
															<div className="w-4 h-4 rounded-full bg-green-500"></div>
															<span className="font-medium text-green-600">
																VNINDEX
															</span>
														</div>
													</div>

													{/* Chart */}
													<div className="h-64">
														<ComparisonChart
															data={chartData}
															tickers={["Portfolio", "VNINDEX"]}
															colors={["#8B5CF6", "#10B981"]} // Purple, Green
															strokeWidths={{ Portfolio: 2, VNINDEX: 2 }}
															height={256}
														/>
													</div>
												</div>
											);
										})()}
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}

