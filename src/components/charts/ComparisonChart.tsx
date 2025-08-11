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

interface ComparisonChartProps {
	data: Array<Record<string, any>>;
	tickers: string[];
	height?: number;
	colors?: string[];
	title?: string;
}

function CustomTooltip({ active, payload, label }: any) {
	if (active && payload && payload.length) {
		const fullDate = payload[0]?.payload?.fullDate || label;
		return (
			<div className="bg-background border rounded-lg shadow-lg p-3">
				<p className="font-semibold mb-2">{fullDate}</p>
				{payload.map((entry: any, index: number) => (
					<p key={index} className="text-sm" style={{ color: entry.color }}>
						<span className="font-medium">{entry.dataKey}: </span>
						{entry.value ? `${entry.value.toFixed(2)}%` : 'N/A'}
					</p>
				))}
			</div>
		);
	}
	return null;
}

export function ComparisonChart({
	data,
	tickers,
	height = 400,
	colors = [
		"#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
		"#8B5CF6", "#06B6D4", "#F97316", "#84CC16"
	],
}: ComparisonChartProps) {
	if (!data || data.length === 0) {
		return (
			<div className="flex items-center justify-center h-[400px] text-muted-foreground">
				No comparison data available
			</div>
		);
	}

	// Format the time labels for better display
	const chartData = data.map((point) => ({
		...point,
		displayTime: point.date ? format(new Date(point.date), "MMM dd") : point.time,
		fullDate: point.date ? format(new Date(point.date), "yyyy-MM-dd") : point.time,
	}));

	return (
		<ResponsiveContainer width="100%" height={height}>
			<LineChart
				data={chartData}
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
				<XAxis
					dataKey="displayTime"
					fontSize={12}
					className="fill-muted-foreground"
				/>
				<YAxis
					tickFormatter={(value) => `${value.toFixed(1)}%`}
					fontSize={12}
					className="fill-muted-foreground"
				/>
				<Tooltip content={<CustomTooltip />} />
				<Legend />
				{tickers.slice(0, 8).map((ticker, index) => (
					<Line
						key={ticker}
						type="monotone"
						dataKey={ticker}
						stroke={colors[index]}
						strokeWidth={2}
						dot={false}
						name={ticker}
						connectNulls={false}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}