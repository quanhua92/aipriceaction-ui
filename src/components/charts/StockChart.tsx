import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockDataPoint } from "@/lib/stock-data";

interface StockChartProps {
	data: StockDataPoint[];
	title?: string;
	height?: number;
	color?: string;
}

function formatPrice(value: number): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

function formatVolume(value: number): string {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(1)}M`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}
	return value.toString();
}

function CustomTooltip({ active, payload }: any) {
	if (active && payload && payload.length) {
		const data = payload[0].payload as StockDataPoint & { fullDate: string };
		return (
			<div className="bg-background border rounded-lg shadow-lg p-3">
				<p className="font-semibold">
					{format(data.date, "MMM dd, yyyy")}
				</p>
				<p className="text-sm">
					<span className="text-green-600">Open: </span>
					{formatPrice(data.open)}
				</p>
				<p className="text-sm">
					<span className="text-red-600">High: </span>
					{formatPrice(data.high)}
				</p>
				<p className="text-sm">
					<span className="text-blue-600">Low: </span>
					{formatPrice(data.low)}
				</p>
				<p className="text-sm">
					<span className="text-primary">Close: </span>
					{formatPrice(data.close)}
				</p>
				<p className="text-sm">
					<span className="text-muted-foreground">Volume: </span>
					{formatVolume(data.volume)}
				</p>
			</div>
		);
	}
	return null;
}

export function StockChart({
	data,
	title,
	height = 400,
	color = "hsl(var(--primary))",
}: StockChartProps) {
	if (!data || data.length === 0) {
		return (
			<Card>
				<CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-[400px] text-muted-foreground">
						No data available
					</div>
				</CardContent>
			</Card>
		);
	}

	const chartData = data.map((point) => ({
		...point,
		time: format(point.date, "MMM dd"),
		fullDate: format(point.date, "yyyy-MM-dd"),
		timestamp: point.date.getTime(),
	}));

	return (
		<Card>
			<CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={height}>
					<LineChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="time"
							fontSize={12}
							className="fill-muted-foreground"
						/>
						<YAxis
							domain={["dataMin - 1000", "dataMax + 1000"]}
							tickFormatter={formatPrice}
							fontSize={12}
							className="fill-muted-foreground"
						/>
						<Tooltip content={<CustomTooltip />} />
						<Legend />
						<Line
							type="monotone"
							dataKey="close"
							stroke={color}
							strokeWidth={2}
							dot={false}
							name="Close Price"
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
