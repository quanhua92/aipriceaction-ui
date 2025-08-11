import {
	ResponsiveContainer,
	ComposedChart,
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

interface CandlestickChartProps {
	data: StockDataPoint[];
	title?: string;
	height?: number;
}

interface CandlestickData extends StockDataPoint {
	candleBody: [number, number];
	isGreen: boolean;
	wickTop: number;
	wickBottom: number;
}

function formatPrice(value: number): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(value);
}

function CustomTooltip({ active, payload }: any) {
	if (active && payload && payload.length) {
		const data = payload[0].payload as CandlestickData;
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
					<span className={data.isGreen ? "text-green-600" : "text-red-600"}>
						{data.isGreen ? "▲" : "▼"}{" "}
						{formatPrice(Math.abs(data.close - data.open))}(
						{(((data.close - data.open) / data.open) * 100).toFixed(2)}%)
					</span>
				</p>
			</div>
		);
	}
	return null;
}

function CandlestickShape(props: any) {
	const { payload, x, y, width, height } = props;
	const data = payload as CandlestickData;

	if (!data) return null;

	const isGreen = data.close >= data.open;
	const color = isGreen ? "#16a34a" : "#dc2626"; // green-600 : red-600

	const bodyHeight =
		(Math.abs(data.close - data.open) / (data.high - data.low)) * height;
	const bodyY =
		y +
		((data.high - Math.max(data.open, data.close)) / (data.high - data.low)) *
			height;

	const wickX = x + width / 2;
	const wickWidth = 1;

	return (
		<g>
			{/* Upper wick */}
			<line
				x1={wickX}
				y1={y}
				x2={wickX}
				y2={bodyY}
				stroke={color}
				strokeWidth={wickWidth}
			/>
			{/* Lower wick */}
			<line
				x1={wickX}
				y1={bodyY + bodyHeight}
				x2={wickX}
				y2={y + height}
				stroke={color}
				strokeWidth={wickWidth}
			/>
			{/* Body */}
			<rect
				x={x + width * 0.2}
				y={bodyY}
				width={width * 0.6}
				height={bodyHeight || 1}
				fill={color}
				stroke={color}
				strokeWidth={1}
			/>
		</g>
	);
}

export function CandlestickChart({
	data,
	title,
	height = 400,
}: CandlestickChartProps) {
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

	const chartData: CandlestickData[] = data.map((point) => {
		const isGreen = point.close >= point.open;
		return {
			...point,
			time: format(point.date, "MMM dd"),
			candleBody: [
				Math.min(point.open, point.close),
				Math.max(point.open, point.close),
			] as [number, number],
			isGreen,
			wickTop: point.high,
			wickBottom: point.low,
		};
	});

	const yDomain = [
		Math.min(...data.map((d) => d.low)) - 1000,
		Math.max(...data.map((d) => d.high)) + 1000,
	];

	return (
		<Card>
			<CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={height}>
					<ComposedChart
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
							domain={yDomain}
							tickFormatter={formatPrice}
							fontSize={12}
							className="fill-muted-foreground"
						/>
						<Tooltip content={<CustomTooltip />} />
						<Bar dataKey="high" shape={<CandlestickShape />}>
							{chartData.map((_, index) => (
								<Cell key={`cell-${index}`} />
							))}
						</Bar>
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
