import { useMemo } from "react";
import { PieChart, Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	PieChart as RechartsPieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Tooltip,
	Legend,
} from "recharts";
import { useTranslation } from "@/hooks/useTranslation";
import {
	type PortfolioItem,
	calculateInvestmentValue,
	formatVND,
	isWatchListItem,
} from "@/lib/portfolio-utils";

interface PortfolioSummaryCardProps {
	items: PortfolioItem[];
	deposit: number;
	showPrivacy: boolean;
	onTogglePrivacy: (show: boolean) => void;
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
}: PortfolioSummaryCardProps) {
	const { t } = useTranslation();

	const { investments, watchListItems, totalValue, chartData } = useMemo(() => {
		const investments = items.filter(item => !isWatchListItem(item));
		const watchListItems = items.filter(item => isWatchListItem(item));
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

		return { investments, watchListItems, totalValue, chartData };
	}, [items]);

	const profitLoss = totalValue - deposit;
	const profitLossPercentage = deposit > 0 ? ((profitLoss / deposit) * 100) : 0;

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

	const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
		if (percent < 0.05) return null; // Hide labels for slices smaller than 5%
		
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
			<CardContent className="space-y-6">
				{/* Key Metrics */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					<div className="bg-background/60 rounded-xl p-4 text-center border border-muted/50">
						<div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 mb-1">
							{displayValue(totalValue)}
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground font-medium">
							{t("portfolio.totalValue")}
						</div>
					</div>
					
					<div className="bg-background/60 rounded-xl p-4 text-center border border-muted/50">
						<div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600 mb-1">
							{displayValue(deposit)}
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground font-medium">
							{t("portfolio.deposit")}
						</div>
					</div>

					<div className="bg-background/60 rounded-xl p-4 text-center border border-muted/50">
						<div className={`text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center gap-1 mb-1 ${
							profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
						}`}>
							{profitLoss >= 0 ? (
								<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
							) : (
								<TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
							)}
							<span>{displayValue(Math.abs(profitLoss))}</span>
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground font-medium">
							{t("portfolio.profitLoss")}
						</div>
					</div>

					<div className="bg-background/60 rounded-xl p-4 text-center border border-muted/50">
						<div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 ${
							profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
						}`}>
							{showPrivacy ? "●●%" : `${profitLossPercentage >= 0 ? '+' : ''}${profitLossPercentage.toFixed(1)}%`}
						</div>
						<div className="text-xs sm:text-sm text-muted-foreground font-medium">
							{t("portfolio.returns")}
						</div>
					</div>
				</div>

				{/* Portfolio Composition Chart */}
				{chartData.length > 0 && (
					<div className="bg-background/40 rounded-xl p-4 border border-muted/50">
						<h4 className="font-semibold text-center mb-6 text-lg">{t("portfolio.composition")}</h4>
						<div className="h-64 sm:h-80">
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
									<Legend 
										verticalAlign="bottom" 
										height={50}
										wrapperStyle={{ paddingTop: '20px' }}
										formatter={(value, entry: any) => (
											<span style={{ color: entry.color, fontSize: '12px', fontWeight: '500' }}>
												{value} ({entry.payload.percentage}%)
											</span>
										)}
									/>
								</RechartsPieChart>
							</ResponsiveContainer>
						</div>
					</div>
				)}

				{/* Portfolio Stats */}
				<div className="bg-muted/20 rounded-xl p-4">
					<div className="flex flex-wrap gap-3 justify-center items-center">
						<div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border">
							<div className="w-3 h-3 rounded-full bg-green-500"></div>
							<span className="text-sm font-medium">{t("portfolio.investments")}: <strong>{investments.length}</strong></span>
						</div>
						<div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border">
							<div className="w-3 h-3 rounded-full bg-gray-400"></div>
							<span className="text-sm font-medium">{t("portfolio.watchList")}: <strong>{watchListItems.length}</strong></span>
						</div>
						{deposit > 0 && totalValue > 0 && (
							<div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border">
								<span className="text-sm font-medium">{t("portfolio.invested")}: <strong>{showPrivacy ? "●●%" : `${((totalValue / deposit) * 100).toFixed(0)}%`}</strong></span>
							</div>
						)}
					</div>
				</div>

				{/* Screenshot hint */}
				<div className="text-center border-2 border-dashed border-muted/40 rounded-lg p-3 bg-muted/10">
					<div className="text-sm font-medium text-muted-foreground mb-1">
						📸 {t("portfolio.screenshotHint")}
					</div>
					<div className="text-xs text-muted-foreground">
						{t("portfolio.optimizedForSharing")}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}