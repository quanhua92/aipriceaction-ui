import { useMemo, useState, useEffect } from "react";
import { PieChart, Eye, EyeOff, Edit3, LayoutGrid, TableProperties } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { useTranslation } from "@/hooks/useTranslation";
import {
	type PortfolioItem,
	calculateInvestmentValue,
	formatVND,
	formatNumber,
	isWatchListItem,
	parseFormattedNumber,
} from "@/lib/portfolio-utils";

interface PortfolioSummaryCardProps {
	items: PortfolioItem[];
	deposit: number;
	showPrivacy: boolean;
	onTogglePrivacy: (show: boolean) => void;
	manualDeposit?: boolean;
	onUpdateDeposit?: (deposit: number) => void;
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
	showPrivacy,
	onTogglePrivacy,
	manualDeposit = false,
	onUpdateDeposit,
	tickerData,
}: PortfolioSummaryCardProps) {
	const { t } = useTranslation();
	const [editingDeposit, setEditingDeposit] = useState(false);
	const [depositValue, setDepositValue] = useState(deposit.toString());
	const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

	// Update depositValue when deposit prop changes (but not when editing)
	useEffect(() => {
		if (!editingDeposit) {
			setDepositValue(deposit.toString());
		}
	}, [deposit, editingDeposit]);

	// Helper function to get current market price for a ticker
	const getCurrentMarketPrice = (ticker: string): number => {
		if (!tickerData || !tickerData[ticker] || tickerData[ticker].length === 0) {
			return 0; // No market data available
		}
		const latestData = tickerData[ticker][tickerData[ticker].length - 1];
		return latestData.close || 0;
	};

	const { investments, currentMarketValue, chartData } = useMemo(() => {
		const investments = items.filter(item => !isWatchListItem(item));
		
		// Calculate current market value using real prices when available
		const currentMarketValue = investments.reduce((sum, item) => {
			const marketPrice = getCurrentMarketPrice(item.ticker);
			const currentValue = marketPrice > 0 ? item.quantity * marketPrice : calculateInvestmentValue(item);
			return sum + currentValue;
		}, 0);

		const chartData = investments
			.map((item, index) => {
				const marketPrice = getCurrentMarketPrice(item.ticker);
				const currentValue = marketPrice > 0 ? item.quantity * marketPrice : calculateInvestmentValue(item);
				return {
					name: item.ticker,
					value: currentValue,
					percentage: currentMarketValue > 0 ? ((currentValue / currentMarketValue) * 100).toFixed(1) : "0",
					color: COLORS[index % COLORS.length],
				};
			})
			.filter(item => item.value > 0)
			.sort((a, b) => b.value - a.value);

		return { investments, currentMarketValue, chartData };
	}, [items, tickerData]);

	const profitLoss = currentMarketValue - deposit;
	const profitLossPercentage = deposit > 0 ? ((profitLoss / deposit) * 100) : 0;

	const displayValue = (value: number) => {
		if (showPrivacy) {
			return "●●●●●";
		}
		return formatVND(value);
	};

	const handleDepositSubmit = () => {
		if (onUpdateDeposit) {
			const newDeposit = parseFormattedNumber(depositValue);
			onUpdateDeposit(newDeposit);
		}
		setEditingDeposit(false);
	};

	const handleDepositCancel = () => {
		setDepositValue(deposit.toString());
		setEditingDeposit(false);
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

	const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
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
				textAnchor={x > cx ? 'start' : 'end'} 
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
							<p className="text-xs text-muted-foreground hidden sm:block">{t("portfolio.screenshotOptimized")}</p>
						</div>
					</div>
					<div className="flex items-center gap-2 bg-background/50 rounded-full px-3 py-1 border">
						<Switch
							id="privacy-toggle"
							checked={showPrivacy}
							onCheckedChange={onTogglePrivacy}
						/>
						<Label htmlFor="privacy-toggle" className="text-xs flex items-center gap-1 cursor-pointer">
							{showPrivacy ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
							{t("portfolio.privacy")}
						</Label>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="px-0">
				{/* Portfolio Summary Stats - Compact */}
				<div className="px-6 mb-3 space-y-2">
					<div className="text-center">
						<div className="text-2xl md:text-3xl font-bold text-green-600">
							{displayValue(currentMarketValue)}
						</div>
						<div className="text-muted-foreground text-xs">{t("portfolio.totalValue")}</div>
					</div>
					<div className="grid grid-cols-3 gap-2 text-xs">
						<div className="text-center">
							<span className="text-muted-foreground block">{t("portfolio.totalAssets")}</span>
							<div className="font-medium text-sm">{displayValue(currentMarketValue)}</div>
						</div>
						<div className="text-center">
							<span className="text-muted-foreground block">{t("portfolio.totalCapital")}</span>
							<div className="font-medium text-sm">{displayValue(deposit)}</div>
						</div>
						<div className="text-center">
							<span className="text-muted-foreground block">P&L</span>
							<div className={`font-bold text-sm ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
								{profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(1)}%
							</div>
						</div>
					</div>
				</div>

				{/* Mobile: Tabs, Desktop: Side by Side */}
				<div className="block lg:hidden px-6">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="overview">{t("portfolio.overview")}</TabsTrigger>
							<TabsTrigger value="allocation">{t("portfolio.allocation")}</TabsTrigger>
						</TabsList>
						
						<TabsContent value="overview" className="mt-4">
							{/* Toggle View Mode */}
							<div className="flex justify-end mb-3">
								<div className="bg-gray-100 rounded-lg p-1 flex gap-1">
									<Button
										size="sm"
										variant={viewMode === 'card' ? 'default' : 'ghost'}
										className="px-3 py-1 h-8"
										onClick={() => setViewMode('card')}
									>
										<LayoutGrid className="h-4 w-4 mr-1" />
										Card
									</Button>
									<Button
										size="sm"
										variant={viewMode === 'table' ? 'default' : 'ghost'}
										className="px-3 py-1 h-8"
										onClick={() => setViewMode('table')}
									>
										<TableProperties className="h-4 w-4 mr-1" />
										Table
									</Button>
								</div>
							</div>

							{viewMode === 'card' ? (
								/* Card-style Overview Table - SSI Layout */
								<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
								{/* Header */}
								<div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
									<div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600">
										<div>{t("portfolio.ticker")}</div>
										<div className="text-center">{t("portfolio.volume")}</div>
										<div className="text-center">
											<div className="text-xs">{t("portfolio.marketPrice")}</div>
											<div className="text-xs">{t("portfolio.buyPrice")}</div>
										</div>
										<div className="text-center">
											<div className="text-xs">{t("portfolio.profitPercent")}</div>
											<div className="text-xs">{t("portfolio.profitPrice")}</div>
										</div>
									</div>
								</div>
								
								{/* Card Rows */}
								<div className="divide-y divide-gray-100">
									{investments.map((item) => {
										const marketPrice = getCurrentMarketPrice(item.ticker) || item.price; // Use real market price or fallback to buy price
										const costBasis = item.price; // Cost basis (buy price)
										const profitPrice = (marketPrice - costBasis) * item.quantity; // Profit in VND
										const profitPercent = costBasis > 0 ? ((marketPrice - costBasis) / costBasis) * 100 : 0; // Profit percentage
										const volume = item.quantity; // Volume/Quantity

										return (
											<div key={item.ticker} className="px-3 py-2 hover:bg-gray-50 transition-colors">
												<div className="grid grid-cols-4 gap-2 items-center">
													{/* Ticker */}
													<div className="font-semibold text-gray-900 text-sm">{item.ticker}</div>
													
													{/* Volume */}
													<div className="text-center">
														{showPrivacy ? (
															<span className="text-gray-400 text-xs">●●●</span>
														) : (
															<span className="font-medium text-xs">{formatNumber(volume)}</span>
														)}
													</div>
													
													{/* Market Price / Buy Price */}
													<div className="text-center space-y-0.5">
														<div className="font-medium text-gray-900 text-xs">{formatVND(marketPrice)}</div>
														<div className="text-xs text-gray-500">{formatVND(costBasis)}</div>
													</div>
													
													{/* Profit % / Profit VND */}
													<div className="text-center space-y-0.5">
														<div className={`font-semibold text-xs ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
															{profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
														</div>
														{!showPrivacy && (
															<div className={`text-xs font-medium ${profitPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
																{profitPrice >= 0 ? '+' : ''}{formatVND(Math.abs(profitPrice))}
															</div>
														)}
														{showPrivacy && (
															<div className="text-xs text-gray-400">●●●</div>
														)}
													</div>
												</div>
											</div>
										);
									})}
								</div>
								
								{/* Deposit input at bottom */}
								{onUpdateDeposit && (
									<div className="border-t border-gray-200 p-2 bg-gray-50">
										{editingDeposit ? (
											<div className="flex items-center gap-2">
												<span className="text-xs font-medium min-w-0">{t("portfolio.totalDeposit")}:</span>
												<Input
													type="text"
													inputMode="numeric"
													value={depositValue}
													onChange={(e) => setDepositValue(e.target.value)}
													className="flex-1 text-right font-medium bg-white text-xs h-8"
													autoFocus
												/>
												<div className="flex gap-1">
													<Button size="sm" className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs h-8" onClick={handleDepositSubmit}>Save</Button>
													<Button size="sm" variant="outline" className="px-2 py-1 text-xs h-8" onClick={handleDepositCancel}>Cancel</Button>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-between group">
												<span className="text-xs font-medium text-gray-700">
													{t("portfolio.totalDeposit")} {!manualDeposit && "(auto)"}:
												</span>
												<div className="flex items-center gap-1">
													<span className="font-medium text-gray-900 text-xs">{displayValue(deposit)}</span>
													<Button
														size="sm"
														variant="ghost"
														className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
														onClick={() => setEditingDeposit(true)}
													>
														<Edit3 className="h-2 w-2" />
													</Button>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
							) : (
								/* Traditional Table View */
								<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
									<Table>
										<TableHeader>
											<TableRow className="hover:bg-transparent border-gray-200">
												<TableHead className="font-semibold text-gray-700">{t("portfolio.ticker")}</TableHead>
												<TableHead className="font-semibold text-right text-gray-700">{t("portfolio.buyPrice")}</TableHead>
												<TableHead className="font-semibold text-right text-gray-700">{t("portfolio.marketPrice")}</TableHead>
												<TableHead className="font-semibold text-right text-gray-700">{t("portfolio.profitPercent")}</TableHead>
												<TableHead className="font-semibold text-right text-gray-700">{t("portfolio.costBasis")}</TableHead>
												{!showPrivacy && <TableHead className="font-semibold text-right text-gray-700">{t("portfolio.volume")}</TableHead>}
												{!showPrivacy && <TableHead className="font-semibold text-right text-gray-700">{t("portfolio.profitPrice")}</TableHead>}
											</TableRow>
										</TableHeader>
										<TableBody>
											{investments.map((item) => {
												const marketPrice = getCurrentMarketPrice(item.ticker) || item.price; // Use real market price or fallback to buy price
												const costBasis = item.price; // Cost basis (buy price)
												const profitPrice = (marketPrice - costBasis) * item.quantity; // Profit in VND
												const profitPercent = costBasis > 0 ? ((marketPrice - costBasis) / costBasis) * 100 : 0; // Profit percentage
												const volume = item.quantity; // Volume/Quantity

												return (
													<TableRow key={item.ticker} className="hover:bg-gray-50 border-gray-100">
														<TableCell className="font-medium text-gray-900">{item.ticker}</TableCell>
														<TableCell className="text-right text-gray-700">{formatVND(costBasis)}</TableCell>
														<TableCell className="text-right text-gray-700">{formatVND(marketPrice)}</TableCell>
														<TableCell className={`text-right font-medium ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
															{profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
														</TableCell>
														<TableCell className="text-right text-gray-700">{formatVND(costBasis * volume)}</TableCell>
														{!showPrivacy && (
															<TableCell className="text-right text-gray-700">{formatNumber(volume)}</TableCell>
														)}
														{!showPrivacy && (
															<TableCell className={`text-right font-medium ${profitPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
																{profitPrice >= 0 ? '+' : ''}{formatVND(Math.abs(profitPrice))}
															</TableCell>
														)}
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
									
									{/* Deposit input at bottom */}
									{onUpdateDeposit && (
										<div className="border-t border-gray-200 p-4 bg-gray-50">
											{editingDeposit ? (
												<div className="flex items-center gap-3">
													<span className="text-sm font-medium min-w-0">{t("portfolio.totalDeposit")}:</span>
													<Input
														type="text"
														inputMode="numeric"
														value={depositValue}
														onChange={(e) => setDepositValue(e.target.value)}
														className="flex-1 text-right font-medium bg-white"
														autoFocus
													/>
													<div className="flex gap-2">
														<Button size="default" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2" onClick={handleDepositSubmit}>Save</Button>
														<Button size="sm" variant="outline" onClick={handleDepositCancel}>Cancel</Button>
													</div>
												</div>
											) : (
												<div className="flex items-center justify-between group">
													<span className="text-sm font-medium text-gray-700">
														{t("portfolio.totalDeposit")} {!manualDeposit && "(auto)"}:
													</span>
													<div className="flex items-center gap-2">
														<span className="font-medium text-gray-900">{displayValue(deposit)}</span>
														<Button
															size="sm"
															variant="ghost"
															className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() => setEditingDeposit(true)}
														>
															<Edit3 className="h-3 w-3" />
														</Button>
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							)}
						</TabsContent>
						
						<TabsContent value="allocation" className="mt-4 space-y-4">
							{/* Stock Allocation Chart */}
							{chartData.length > 0 && (
								<div className="bg-white rounded-lg border border-gray-200 p-4">
									<h4 className="font-semibold text-gray-800 mb-3">{t("portfolio.stockAllocation")}</h4>
									<div className="h-48">
										<ResponsiveContainer width="100%" height="100%">
											<RechartsPieChart>
												<Pie
													data={chartData}
													cx="50%"
													cy="50%"
													labelLine={false}
													label={renderCustomLabel}
													outerRadius="70%"
													innerRadius="30%"
													fill="#8884d8"
													dataKey="value"
													stroke="white"
													strokeWidth={2}
												>
													{chartData.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={entry.color} />
													))}
												</Pie>
												<Tooltip content={<CustomTooltip />} />
											</RechartsPieChart>
										</ResponsiveContainer>
									</div>
									{/* Allocation Table */}
									<div className="mt-4 space-y-3">
										{chartData.map((item) => (
											<div key={item.name} className="flex justify-between items-center">
												<div className="flex items-center gap-3">
													<div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
													<span className="font-medium text-gray-900">{item.name}</span>
												</div>
												<div className="text-right">
													<span className="font-medium text-gray-900">{displayValue(item.value)}</span>
													<span className="ml-2 text-gray-600">
														{item.percentage}%
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Cash vs Equity Chart */}
							<div className="bg-white rounded-lg border border-gray-200 p-4">
								<h4 className="font-semibold text-gray-800 mb-3">{t("portfolio.cashEquityRatio")}</h4>
								<div className="h-48">
									<ResponsiveContainer width="100%" height="100%">
										<RechartsPieChart>
											<Pie
												data={[
													{
														name: t("portfolio.equityValue"),
														value: currentMarketValue,
														color: "#10B981",
														percentage: deposit > 0 ? ((currentMarketValue / deposit) * 100).toFixed(1) : "0"
													},
													{
														name: t("portfolio.cashRemaining"),
														value: Math.max(0, deposit - currentMarketValue),
														color: "#6B7280",
														percentage: deposit > 0 ? (((deposit - currentMarketValue) / deposit) * 100).toFixed(1) : "0"
													}
												]}
												cx="50%"
												cy="50%"
												labelLine={false}
												label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
													if (!percent || percent < 0.05) return null;
													if (showPrivacy) return null;
													
													const RADIAN = Math.PI / 180;
													const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
													const x = cx + radius * Math.cos(-midAngle * RADIAN);
													const y = cy + radius * Math.sin(-midAngle * RADIAN);

													return (
														<text 
															x={x} 
															y={y} 
															fill="white" 
															textAnchor={x > cx ? 'start' : 'end'} 
															dominantBaseline="central"
															className="text-xs font-medium"
														>
															{`${(percent * 100).toFixed(0)}%`}
														</text>
													);
												}}
												outerRadius="70%"
												innerRadius="30%"
												fill="#8884d8"
												dataKey="value"
												stroke="white"
												strokeWidth={2}
											>
												<Cell fill="#10B981" />
												<Cell fill="#6B7280" />
											</Pie>
											<Tooltip content={({ active, payload }) => {
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
											}} />
										</RechartsPieChart>
									</ResponsiveContainer>
								</div>
								{/* Cash vs Equity Summary */}
								<div className="mt-4 space-y-3">
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-3">
											<div className="w-4 h-4 rounded-full bg-green-500"></div>
											<span className="font-medium text-gray-900">{t("portfolio.equityValue")}</span>
										</div>
										<div className="text-right">
											<span className="font-medium text-gray-900">{displayValue(currentMarketValue)}</span>
											<span className="ml-2 text-gray-600">
												{deposit > 0 ? ((currentMarketValue / deposit) * 100).toFixed(1) : "0"}%
											</span>
										</div>
									</div>
									<div className="flex justify-between items-center">
										<div className="flex items-center gap-3">
											<div className="w-4 h-4 rounded-full bg-gray-500"></div>
											<span className="font-medium text-gray-900">{t("portfolio.cashRemaining")}</span>
										</div>
										<div className="text-right">
											<span className="font-medium text-gray-900">{displayValue(Math.max(0, deposit - currentMarketValue))}</span>
											<span className="ml-2 text-gray-600">
												{deposit > 0 ? (((deposit - currentMarketValue) / deposit) * 100).toFixed(1) : "0"}%
											</span>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>

				{/* Desktop: Side by Side */}
				<div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 px-6">
					{/* Left: Overview Table with Toggle */}
					<div className="space-y-3">
						{/* Toggle View Mode */}
						<div className="flex justify-end">
							<div className="bg-gray-100 rounded-lg p-1 flex gap-1">
								<Button
									size="sm"
									variant={viewMode === 'card' ? 'default' : 'ghost'}
									className="px-3 py-1 h-8"
									onClick={() => setViewMode('card')}
								>
									<LayoutGrid className="h-4 w-4 mr-1" />
									Card
								</Button>
								<Button
									size="sm"
									variant={viewMode === 'table' ? 'default' : 'ghost'}
									className="px-3 py-1 h-8"
									onClick={() => setViewMode('table')}
								>
									<TableProperties className="h-4 w-4 mr-1" />
									Table
								</Button>
							</div>
						</div>

						{viewMode === 'card' ? (
							/* Card-style Overview Table */
							<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
						<div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
							<h3 className="font-semibold text-gray-800">{t("portfolio.overview")}</h3>
						</div>
						
						{/* Compact Header */}
						<div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
							<div className="grid grid-cols-4 gap-2 text-xs font-medium text-gray-600">
								<div>{t("portfolio.ticker")}</div>
								<div className="text-center">{t("portfolio.volume")}</div>
								<div className="text-center">
									<div>{t("portfolio.marketPrice")}</div>
									<div>{t("portfolio.buyPrice")}</div>
								</div>
								<div className="text-center">
									<div>{t("portfolio.profitPercent")}</div>
									<div>{t("portfolio.profitPrice")}</div>
								</div>
							</div>
						</div>
						
						{/* Card Rows - Compact */}
						<div className="divide-y divide-gray-100">
							{investments.map((item) => {
								const marketPrice = getCurrentMarketPrice(item.ticker) || item.price; // Use real market price or fallback to buy price
								const costBasis = item.price; // Cost basis (buy price)
								const profitPrice = (marketPrice - costBasis) * item.quantity; // Profit in VND
								const profitPercent = costBasis > 0 ? ((marketPrice - costBasis) / costBasis) * 100 : 0; // Profit percentage
								const volume = item.quantity; // Volume/Quantity

								return (
									<div key={item.ticker} className="px-4 py-3 hover:bg-gray-50 transition-colors">
										<div className="grid grid-cols-4 gap-2 items-center text-sm">
											{/* Ticker */}
											<div className="font-semibold text-gray-900">{item.ticker}</div>
											
											{/* Volume */}
											<div className="text-center">
												{showPrivacy ? (
													<span className="text-gray-400">●●●</span>
												) : (
													<span className="font-medium">{formatNumber(volume)}</span>
												)}
											</div>
											
											{/* Market Price / Buy Price */}
											<div className="text-center space-y-0.5">
												<div className="font-medium text-gray-900 text-xs">{formatVND(marketPrice)}</div>
												<div className="text-xs text-gray-500">{formatVND(costBasis)}</div>
											</div>
											
											{/* Profit % / Profit VND */}
											<div className="text-center space-y-0.5">
												<div className={`font-semibold text-xs ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
													{profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
												</div>
												{!showPrivacy && (
													<div className={`text-xs font-medium ${profitPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
														{profitPrice >= 0 ? '+' : ''}{formatVND(Math.abs(profitPrice))}
													</div>
												)}
												{showPrivacy && (
													<div className="text-xs text-gray-400">●●●</div>
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					) : (
						/* Traditional Table View */
						<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
							<div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
								<h3 className="font-semibold text-gray-800">{t("portfolio.overview")}</h3>
							</div>
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent border-gray-200">
										<TableHead className="font-semibold text-xs text-gray-700">{t("portfolio.ticker")}</TableHead>
										<TableHead className="font-semibold text-xs text-right text-gray-700">{t("portfolio.buyPrice")}</TableHead>
										<TableHead className="font-semibold text-xs text-right text-gray-700">{t("portfolio.profitPercent")}</TableHead>
										<TableHead className="font-semibold text-xs text-right text-gray-700">{t("portfolio.costBasis")}</TableHead>
										{!showPrivacy && <TableHead className="font-semibold text-xs text-right text-gray-700">{t("portfolio.volume")}</TableHead>}
										{!showPrivacy && <TableHead className="font-semibold text-xs text-right text-gray-700">{t("portfolio.profitPrice")}</TableHead>}
									</TableRow>
								</TableHeader>
								<TableBody>
									{investments.map((item) => {
										const marketPrice = getCurrentMarketPrice(item.ticker) || item.price; // Use real market price or fallback to buy price
										const costBasis = item.price; // Cost basis (buy price)
										const profitPrice = (marketPrice - costBasis) * item.quantity; // Profit in VND
										const profitPercent = costBasis > 0 ? ((marketPrice - costBasis) / costBasis) * 100 : 0; // Profit percentage
										const volume = item.quantity; // Volume/Quantity

										return (
											<TableRow key={item.ticker} className="hover:bg-gray-50 border-gray-100">
												<TableCell className="font-medium text-sm text-gray-900">{item.ticker}</TableCell>
												<TableCell className="text-right text-sm text-gray-700">{formatVND(costBasis)}</TableCell>
												<TableCell className={`text-right font-medium text-sm ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
													{profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
												</TableCell>
												<TableCell className="text-right text-sm text-gray-700">{formatVND(costBasis * volume)}</TableCell>
												{!showPrivacy && (
													<TableCell className="text-right text-sm text-gray-700">{formatNumber(volume)}</TableCell>
												)}
												{!showPrivacy && (
													<TableCell className={`text-right font-medium text-sm ${profitPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
														{profitPrice >= 0 ? '+' : ''}{formatVND(Math.abs(profitPrice))}
													</TableCell>
												)}
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
					</div>

					{/* Right: Allocation Chart */}
					<div className="bg-white rounded-lg border border-gray-200 p-4">
						<div className="bg-gray-50 px-4 py-3 -mx-4 -mt-4 mb-4 border-b border-gray-200">
							<h3 className="font-semibold text-gray-800">{t("portfolio.allocation")}</h3>
						</div>
						{chartData.length > 0 && (
							<div>
								<div className="h-48">
									<ResponsiveContainer width="100%" height="100%">
										<RechartsPieChart>
											<Pie
												data={chartData}
												cx="50%"
												cy="50%"
												labelLine={false}
												label={renderCustomLabel}
												outerRadius="70%"
												innerRadius="30%"
												fill="#8884d8"
												dataKey="value"
												stroke="white"
												strokeWidth={2}
											>
												{chartData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip content={<CustomTooltip />} />
										</RechartsPieChart>
									</ResponsiveContainer>
								</div>
								<div className="mt-4 space-y-2">
									{chartData.slice(0, 5).map((item) => (
										<div key={item.name} className="flex justify-between items-center text-sm">
											<div className="flex items-center gap-2">
												<div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
												<span className="font-medium text-gray-900">{item.name}</span>
											</div>
											<span className="text-gray-600">
												{item.percentage}%
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}