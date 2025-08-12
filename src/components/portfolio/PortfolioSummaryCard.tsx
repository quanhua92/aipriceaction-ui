import { useMemo } from "react";
import { PieChart, Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
		<Card className="bg-gradient-to-br from-background to-muted/20">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<PieChart className="h-5 w-5" />
						{t("portfolio.summary")}
					</div>
					<div className="flex items-center gap-2">
						<Switch
							id="privacy-toggle"
							checked={showPrivacy}
							onCheckedChange={onTogglePrivacy}
						/>
						<Label htmlFor="privacy-toggle" className="text-sm flex items-center gap-1">
							{showPrivacy ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							{t("portfolio.privacy")}
						</Label>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Key Metrics */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="text-center">
						<div className="text-2xl font-bold">
							{displayValue(totalValue)}
						</div>
						<div className="text-sm text-muted-foreground">
							{t("portfolio.totalValue")}
						</div>
					</div>
					
					<div className="text-center">
						<div className="text-2xl font-bold">
							{displayValue(deposit)}
						</div>
						<div className="text-sm text-muted-foreground">
							{t("portfolio.deposit")}
						</div>
					</div>

					<div className="text-center">
						<div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
							profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
						}`}>
							{profitLoss >= 0 ? (
								<TrendingUp className="h-5 w-5" />
							) : (
								<TrendingDown className="h-5 w-5" />
							)}
							{displayValue(Math.abs(profitLoss))}
						</div>
						<div className="text-sm text-muted-foreground">
							{t("portfolio.profitLoss")}
						</div>
					</div>

					<div className="text-center">
						<div className={`text-2xl font-bold ${
							profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
						}`}>
							{showPrivacy ? "●●%" : `${profitLossPercentage >= 0 ? '+' : ''}${profitLossPercentage.toFixed(1)}%`}
						</div>
						<div className="text-sm text-muted-foreground">
							{t("portfolio.returns")}
						</div>
					</div>
				</div>

				{/* Portfolio Composition Chart */}
				{chartData.length > 0 && (
					<div className="space-y-4">
						<h4 className="font-medium text-center">{t("portfolio.composition")}</h4>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<RechartsPieChart>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={renderCustomLabel}
										outerRadius={80}
										fill="#8884d8"
										dataKey="value"
									>
										{chartData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} />
										))}
									</Pie>
									<Tooltip content={<CustomTooltip />} />
									<Legend 
										verticalAlign="bottom" 
										height={36}
										formatter={(value, entry: any) => (
											<span style={{ color: entry.color }}>
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
				<div className="flex flex-wrap gap-2 justify-center">
					<Badge variant="outline" className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-blue-500"></div>
						{t("portfolio.investments")}: {investments.length}
					</Badge>
					<Badge variant="outline" className="flex items-center gap-1">
						<div className="w-2 h-2 rounded-full bg-gray-400"></div>
						{t("portfolio.watchList")}: {watchListItems.length}
					</Badge>
					{deposit > 0 && totalValue > 0 && (
						<Badge variant="outline">
							{t("portfolio.invested")}: {showPrivacy ? "●●%" : `${((totalValue / deposit) * 100).toFixed(0)}%`}
						</Badge>
					)}
				</div>

				{/* Screenshot hint */}
				<div className="text-center text-xs text-muted-foreground border-t pt-4">
					📸 {t("portfolio.screenshotHint")}
				</div>
			</CardContent>
		</Card>
	);
}