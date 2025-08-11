import { useState } from "react";
import {
	ResponsiveContainer,
	ComposedChart,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
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
		const data = payload[0].payload;
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
			</div>
		);
	}
	return null;
}

// Custom content component that renders candlesticks using SVG directly
const CandlestickContent = (props: any) => {
	const { payload, viewBox, xAxisMap, yAxisMap } = props;
	
	if (!payload || !payload.length || !xAxisMap || !yAxisMap || !viewBox) {
		return null;
	}
	
	const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
	const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
	
	if (!xAxis || !yAxis) return null;
	
	const { x: chartX, y: chartY, width: chartWidth, height: chartHeight } = viewBox;
	
	return (
		<svg
			x={chartX}
			y={chartY}
			width={chartWidth}
			height={chartHeight}
			style={{ overflow: 'visible' }}
		>
			{payload.map((entry: any, index: number) => {
				const data = entry.payload;
				if (!data) return null;
				
				const isGreen = data.close >= data.open;
				const color = isGreen ? "#16a34a" : "#dc2626";
				
				// Calculate positions using the axis scales
				const xPos = xAxis.scale(index);
				const highY = yAxis.scale(data.high);
				const lowY = yAxis.scale(data.low);
				const openY = yAxis.scale(data.open);
				const closeY = yAxis.scale(data.close);
				
				const bodyTop = Math.min(openY, closeY);
				const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
				
				const candleWidth = Math.max(chartWidth / payload.length * 0.6, 2);
				const wickX = xPos;
				const bodyX = xPos - candleWidth / 2;
				
				return (
					<g key={index}>
						{/* Wick */}
						<line
							x1={wickX}
							y1={highY}
							x2={wickX}
							y2={lowY}
							stroke={color}
							strokeWidth={1}
						/>
						{/* Body */}
						<rect
							x={bodyX}
							y={bodyTop}
							width={candleWidth}
							height={bodyHeight}
							fill={color}
							stroke={color}
						/>
					</g>
				);
			})}
		</svg>
	);
};

export function SimpleCandlestickChart({
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

	const chartData = data.map((point, index) => ({
		...point,
		time: format(point.date, "MMM dd"),
		index,
	}));

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
						<CandlestickContent />
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}