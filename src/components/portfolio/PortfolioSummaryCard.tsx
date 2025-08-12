import { useMemo, useState, useEffect } from "react";
import { PieChart, Eye, EyeOff, Edit3 } from "lucide-react";
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
}: PortfolioSummaryCardProps) {
	const { t } = useTranslation();
	const [editingDeposit, setEditingDeposit] = useState(false);
	const [depositValue, setDepositValue] = useState(deposit.toString());

	// Update depositValue when deposit prop changes (but not when editing)
	useEffect(() => {
		if (!editingDeposit) {
			setDepositValue(deposit.toString());
		}
	}, [deposit, editingDeposit]);

	const { investments, totalValue, chartData } = useMemo(() => {
		const investments = items.filter(item => !isWatchListItem(item));
		const totalValue = investments.reduce((sum, item) => sum + calculateInvestmentValue(item), 0);

		const chartData = investments
			.map((item, index) => ({
				name: item.ticker,
				value: calculateInvestmentValue(item),
				percentage: totalValue > 0 ? ((calculateInvestmentValue(item) / totalValue) * 100).toFixed(1) : "0",
				color: COLORS[index % COLORS.length],
			}))
			.filter(item => item.value > 0)
			.sort((a, b) => b.value - a.value);

		return { investments, totalValue, chartData };
	}, [items]);

	const profitLoss = totalValue - deposit;
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
						{displayValue(data.value)} ({showPrivacy ? "●●●" : `${data.percentage}%`})
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
			<CardHeader className="pb-4">
				<CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
							<PieChart className="h-5 w-5 text-white" />
						</div>
						<div>
							<h2 className="text-xl font-bold">{t("portfolio.summary")}</h2>
							<p className="text-sm text-muted-foreground">{t("portfolio.screenshotOptimized")}</p>
						</div>
					</div>
					<div className="flex items-center gap-3 bg-background/50 rounded-full px-4 py-2 border">
						<Switch
							id="privacy-toggle"
							checked={showPrivacy}
							onCheckedChange={onTogglePrivacy}
						/>
						<Label htmlFor="privacy-toggle" className="text-sm flex items-center gap-2 cursor-pointer">
							{showPrivacy ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							{t("portfolio.privacy")}
						</Label>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Portfolio Summary Stats */}
				<div className="mb-6 space-y-3">
					<div className="text-center">
						<div className="text-3xl font-bold text-green-600">
							{displayValue(totalValue)}
						</div>
						<div className="text-muted-foreground text-sm">{t("portfolio.totalValue")}</div>
					</div>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-muted-foreground">{t("portfolio.totalAssets")}:</span>
							<div className="font-medium">{displayValue(totalValue)}</div>
						</div>
						<div>
							<span className="text-muted-foreground">{t("portfolio.totalCapital")}:</span>
							<div className="font-medium">{displayValue(deposit)}</div>
						</div>
					</div>
					<div className="text-center">
						<span className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{profitLoss >= 0 ? '+' : ''}{displayValue(Math.abs(profitLoss))}
						</span>
						<span className={`ml-4 text-xl ${profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
							{showPrivacy ? "●●●" : `${profitLossPercentage >= 0 ? '+' : ''}${profitLossPercentage.toFixed(2)}%`}
						</span>
					</div>
				</div>

				{/* Mobile: Tabs, Desktop: Side by Side */}
				<div className="block lg:hidden">
					<Tabs defaultValue="overview" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="overview">{t("portfolio.overview")}</TabsTrigger>
							<TabsTrigger value="allocation">{t("portfolio.allocation")}</TabsTrigger>
						</TabsList>
						
						<TabsContent value="overview" className="mt-4">
							{/* Overview Table */}
							<div className="bg-background/40 rounded-lg border border-muted/50 overflow-hidden">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-transparent border-muted/50">
											<TableHead className="font-semibold">{t("portfolio.ticker")}</TableHead>
											<TableHead className="font-semibold text-right">{t("portfolio.buyPrice")}</TableHead>
											<TableHead className="font-semibold text-right">{t("portfolio.marketPrice")}</TableHead>
											<TableHead className="font-semibold text-right">{t("portfolio.profitPercent")}</TableHead>
											<TableHead className="font-semibold text-right">{t("portfolio.costBasis")}</TableHead>
											{!showPrivacy && <TableHead className="font-semibold text-right">{t("portfolio.volume")}</TableHead>}
											{!showPrivacy && <TableHead className="font-semibold text-right">{t("portfolio.profitPrice")}</TableHead>}
										</TableRow>
									</TableHeader>
									<TableBody>
										{investments.map((item) => {
											const marketPrice = item.price; // Use buy price as market price
											const profitPrice = 0; // No profit since market price = buy price
											const profitPercent = 0; // No profit percentage
											const totalCost = item.quantity * item.price; // Cost basis (always visible)
											const volume = item.quantity * marketPrice; // Volume (hide in privacy)

											return (
												<TableRow key={item.ticker} className="hover:bg-muted/30">
													<TableCell className="font-medium">{item.ticker}</TableCell>
													<TableCell className="text-right">
														{formatVND(item.price)}
													</TableCell>
													<TableCell className="text-right">
														{formatVND(marketPrice)}
													</TableCell>
													<TableCell className={`text-right font-medium ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
														{`${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`}
													</TableCell>
													<TableCell className="text-right">
														{formatVND(totalCost)}
													</TableCell>
													{!showPrivacy && (
														<TableCell className="text-right">{formatVND(volume)}</TableCell>
													)}
													{!showPrivacy && (
														<TableCell className={`text-right font-medium ${profitPrice >= 0 ? 'text-green-600' : 'text-red-600'}`}>
															{profitPrice >= 0 ? '+' : ''}{formatVND(profitPrice)}
														</TableCell>
													)}
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
								
								{/* Deposit input at bottom */}
								{onUpdateDeposit && (
									<div className="border-t border-muted/50 p-4 bg-muted/10">
										{editingDeposit ? (
											<div className="flex items-center gap-3">
												<span className="text-sm font-medium min-w-0">{t("portfolio.totalDeposit")}:</span>
												<Input
													type="text"
													inputMode="numeric"
													value={depositValue}
													onChange={(e) => setDepositValue(e.target.value)}
													className="flex-1 text-right font-medium"
													autoFocus
												/>
												<div className="flex gap-2">
													<Button size="sm" onClick={handleDepositSubmit}>Save</Button>
													<Button size="sm" variant="outline" onClick={handleDepositCancel}>Cancel</Button>
												</div>
											</div>
										) : (
											<div className="flex items-center justify-between group">
												<span className="text-sm font-medium">
													{t("portfolio.totalDeposit")} {!manualDeposit && "(auto)"}:
												</span>
												<div className="flex items-center gap-2">
													<span className="font-medium">{displayValue(deposit)}</span>
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
						</TabsContent>
						
						<TabsContent value="allocation" className="mt-4">
							{/* Allocation Chart */}
							{chartData.length > 0 && (
								<div className="bg-background/40 rounded-lg border border-muted/50 p-4">
									<div className="h-64">
										<ResponsiveContainer width="100%" height="100%">
											<RechartsPieChart>
												<Pie
													data={chartData}
													cx="50%"
													cy="50%"
													labelLine={false}
													label={renderCustomLabel}
													outerRadius="80%"
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
									<div className="mt-4 space-y-2">
										{chartData.map((item) => (
											<div key={item.name} className="flex justify-between items-center">
												<div className="flex items-center gap-2">
													<div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
													<span className="font-medium">{item.name}</span>
												</div>
												<div className="text-right">
													<span className="font-medium">{displayValue(item.value)}</span>
													<span className="ml-2 text-muted-foreground">
														{showPrivacy ? "●●●" : `${item.percentage}%`}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							)}
						</TabsContent>
					</Tabs>
				</div>

				{/* Desktop: Side by Side */}
				<div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
					{/* Left: Overview Table */}
					<div className="bg-background/40 rounded-lg border border-muted/50 overflow-hidden">
						<div className="p-3 border-b border-muted/50">
							<h3 className="font-semibold">{t("portfolio.overview")}</h3>
						</div>
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-muted/50">
									<TableHead className="font-semibold text-xs">{t("portfolio.ticker")}</TableHead>
									<TableHead className="font-semibold text-xs text-right">{t("portfolio.buyPrice")}</TableHead>
									<TableHead className="font-semibold text-xs text-right">{t("portfolio.profitPercent")}</TableHead>
									<TableHead className="font-semibold text-xs text-right">{t("portfolio.costBasis")}</TableHead>
									{!showPrivacy && <TableHead className="font-semibold text-xs text-right">{t("portfolio.marketValue")}</TableHead>}
									{!showPrivacy && <TableHead className="font-semibold text-xs text-right">{t("portfolio.allocation")}</TableHead>}
								</TableRow>
							</TableHeader>
							<TableBody>
								{investments.map((item) => {
									const marketPrice = item.price; // Use buy price as market price
									const profitPercent = 0; // No profit since market price = buy price
									const marketValue = marketPrice * item.quantity;
									const portfolioPercent = totalValue > 0 ? (marketValue / totalValue) * 100 : 0;
									const costBasis = item.quantity * item.price; // Always visible

									return (
										<TableRow key={item.ticker} className="hover:bg-muted/30">
											<TableCell className="font-medium text-sm">{item.ticker}</TableCell>
											<TableCell className="text-right text-sm">
												{formatVND(item.price)}
											</TableCell>
											<TableCell className={`text-right font-medium text-sm ${profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
												{`${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`}
											</TableCell>
											<TableCell className="text-right text-sm">
												{formatVND(costBasis)}
											</TableCell>
											{!showPrivacy && (
												<TableCell className="text-right text-sm">{formatVND(marketValue)}</TableCell>
											)}
											{!showPrivacy && (
												<TableCell className="text-right text-muted-foreground text-sm">
													{portfolioPercent.toFixed(2)}%
												</TableCell>
											)}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>

					{/* Right: Allocation Chart */}
					<div className="bg-background/40 rounded-lg border border-muted/50 p-4">
						<h3 className="font-semibold mb-4">{t("portfolio.allocation")}</h3>
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
												strokeWidth={1}
											>
												{chartData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={entry.color} />
												))}
											</Pie>
											<Tooltip content={<CustomTooltip />} />
										</RechartsPieChart>
									</ResponsiveContainer>
								</div>
								<div className="mt-4 space-y-1">
									{chartData.slice(0, 5).map((item) => (
										<div key={item.name} className="flex justify-between items-center text-sm">
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
												<span className="font-medium">{item.name}</span>
											</div>
											<span className="text-muted-foreground">
												{showPrivacy ? "●●●" : `${item.percentage}%`}
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