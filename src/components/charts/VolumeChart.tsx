import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Cell,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockDataPoint } from "@/lib/stock-data";

interface VolumeChartProps {
	data: StockDataPoint[];
	title?: string;
	height?: number;
}

function formatVolume(value: number): string {
	if (value >= 1000000000) {
		return `${(value / 1000000000).toFixed(1)}B`;
	}
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
		const data = payload[0].payload as StockDataPoint;
		return (
			<div className="bg-background border rounded-lg shadow-lg p-3">
				<p className="font-semibold">
					{format(data.date, "MMM dd, yyyy")}
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

export function VolumeChart({
	data,
	title = "Volume",
	height = 150,
}: VolumeChartProps) {
	if (!data || data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-center h-[150px] text-muted-foreground text-sm">
						No volume data available
					</div>
				</CardContent>
			</Card>
		);
	}

	const chartData = data.map((point, index) => {
		const prevPoint = index > 0 ? data[index - 1] : point;
		const isUp = point.close >= prevPoint.close;

		return {
			...point,
			time: format(point.date, "MMM dd"),
			isUp,
		};
	});

	const maxVolume = Math.max(...data.map((d) => d.volume));

	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-sm">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={height}>
					<BarChart
						data={chartData}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
						<XAxis
							dataKey="time"
							fontSize={10}
							className="fill-muted-foreground"
							interval="preserveStartEnd"
						/>
						<YAxis
							domain={[0, maxVolume * 1.1]}
							tickFormatter={formatVolume}
							fontSize={10}
							className="fill-muted-foreground"
						/>
						<Tooltip content={<CustomTooltip />} />
						<Bar dataKey="volume" radius={[1, 1, 0, 0]}>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.isUp ? "#16a34a" : "#dc2626"} // green-600 : red-600
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
