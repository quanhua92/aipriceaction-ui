import { useState } from "react";
import {
	ResponsiveContainer,
	ComposedChart,
	Bar,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ReferenceLine,
	Cell,
	ReferenceArea,
} from "recharts";
import { format } from "date-fns";
import { Settings, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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

// Working axis controls with line chart - will implement candlesticks properly next

export function CandlestickChart({
	data,
	title,
	height = 400,
}: CandlestickChartProps) {
	// Calculate auto range
	const minPrice = data?.length ? Math.min(...data.map((d) => d.low)) : 0;
	const maxPrice = data?.length ? Math.max(...data.map((d) => d.high)) : 0;
	const range = maxPrice - minPrice;
	const padding = Math.max(range * 0.05, 100);
	
	const autoMin = minPrice - padding;
	const autoMax = maxPrice + padding;

	// Axis control state
	const [customAxis, setCustomAxis] = useState<{min?: number, max?: number}>({});
	const [tempAxis, setTempAxis] = useState<{min: string, max: string}>({
		min: "",
		max: ""
	});

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

	const chartData = data.map((point, index) => {
		const isGreen = point.close >= point.open;
		return {
			...point,
			time: format(point.date, "MMM dd"),
			isGreen,
			index,
		};
	});

	// Use custom range if set, otherwise use auto range
	const yDomain = [
		customAxis.min ?? autoMin,
		customAxis.max ?? autoMax,
	];

	const handleAxisUpdate = () => {
		const newMin = tempAxis.min ? parseFloat(tempAxis.min) : undefined;
		const newMax = tempAxis.max ? parseFloat(tempAxis.max) : undefined;
		
		setCustomAxis({
			min: newMin,
			max: newMax
		});
	};

	const handleAxisReset = () => {
		setCustomAxis({});
		setTempAxis({ min: "", max: "" });
	};

	// Custom Bar shape that renders rectangular candlesticks
	const CandlestickShape = (props: any) => {
		const { payload, x, y, width } = props;
		if (!payload) return null;
		
		const { high, low, open, close, isGreen } = payload;
		const bodyColor = isGreen ? "#16a34a" : "#dc2626";
		const wickColor = "#666";
		
		// Use Recharts' positioning - x and width come from the chart
		const centerX = x + width / 2;
		const bodyWidth = Math.max(width * 0.6, 3);
		
		// Calculate Y positions using the domain
		const [minY, maxY] = yDomain;
		const chartHeight = height || 340; // Chart area height (400 - margins)
		const topMargin = 5;
		
		// Scale prices to Y coordinates
		const scale = (chartHeight - topMargin * 2) / (maxY - minY);
		const baseY = topMargin;
		
		const highY = baseY + (maxY - high) * scale;
		const lowY = baseY + (maxY - low) * scale;
		const openY = baseY + (maxY - open) * scale;
		const closeY = baseY + (maxY - close) * scale;
		
		const bodyTop = Math.min(openY, closeY);
		const bodyHeight = Math.abs(closeY - openY);
		
		return (
			<g>
				{/* Wick line from high to low */}
				<line
					x1={centerX}
					y1={highY}
					x2={centerX}
					y2={lowY}
					stroke={wickColor}
					strokeWidth={1}
				/>
				{/* Candlestick body */}
				{bodyHeight > 1 ? (
					<rect
						x={centerX - bodyWidth / 2}
						y={bodyTop}
						width={bodyWidth}
						height={bodyHeight}
						fill={bodyColor}
						stroke={bodyColor}
						strokeWidth={0.5}
					/>
				) : (
					// Doji candle - horizontal line when open = close
					<line
						x1={centerX - bodyWidth / 2}
						y1={openY}
						x2={centerX + bodyWidth / 2}
						y2={openY}
						stroke={bodyColor}
						strokeWidth={2}
					/>
				)}
			</g>
		);
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				{title && <CardTitle>{title}</CardTitle>}
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" size="sm">
							<Settings className="h-4 w-4" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="grid gap-4">
							<div className="space-y-2">
								<h4 className="font-medium leading-none">Y-Axis Controls</h4>
								<p className="text-sm text-muted-foreground">
									Adjust the chart's vertical scale
								</p>
							</div>
							<div className="grid gap-2">
								<div className="grid grid-cols-2 items-center gap-2">
									<Label htmlFor="min-price" className="text-xs">Min Price</Label>
									<Input
										id="min-price"
										type="number"
										placeholder={Math.round(autoMin).toLocaleString()}
										value={tempAxis.min}
										onChange={(e) => setTempAxis(prev => ({...prev, min: e.target.value}))}
										className="h-8 text-xs"
									/>
								</div>
								<div className="grid grid-cols-2 items-center gap-2">
									<Label htmlFor="max-price" className="text-xs">Max Price</Label>
									<Input
										id="max-price"
										type="number"
										placeholder={Math.round(autoMax).toLocaleString()}
										value={tempAxis.max}
										onChange={(e) => setTempAxis(prev => ({...prev, max: e.target.value}))}
										className="h-8 text-xs"
									/>
								</div>
								<div className="flex gap-2 pt-2">
									<Button size="sm" onClick={handleAxisUpdate} className="flex-1">
										Apply
									</Button>
									<Button size="sm" variant="outline" onClick={handleAxisReset}>
										<RotateCcw className="h-3 w-3" />
									</Button>
								</div>
								<div className="text-xs text-muted-foreground">
									Current: {Math.round(yDomain[0]).toLocaleString()} - {Math.round(yDomain[1]).toLocaleString()}
								</div>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</CardHeader>
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
						{/* Use Bar with custom shape to render candlesticks at correct positions */}
						<Bar 
							dataKey="close" 
							shape={<CandlestickShape />}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
