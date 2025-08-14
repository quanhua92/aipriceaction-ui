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
import { formatFinancialValue } from "@/lib/company-data";

interface FinancialChartProps {
	data: Array<Record<string, any>>;
	metrics: Array<{
		key: string;
		label: string;
		color: string;
	}>;
	height?: number;
	title?: string;
}

function CustomTooltip({ active, payload, label }: any) {
	if (active && payload && payload.length) {
		return (
			<div className="bg-background border rounded-lg shadow-lg p-3">
				<p className="font-semibold mb-2">{label}</p>
				{payload.map((entry: any, index: number) => (
					<p key={index} className="text-sm" style={{ color: entry.color }}>
						<span className="font-medium">{entry.name}: </span>
						{entry.value ? formatFinancialValue(entry.value) : 'N/A'}
					</p>
				))}
			</div>
		);
	}
	return null;
}

export function FinancialChart({
	data,
	metrics,
	height = 300,
	title,
}: FinancialChartProps) {
	if (!data || data.length === 0) {
		return (
			<div className="flex items-center justify-center h-[300px] text-muted-foreground">
				No financial data available for charting
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{title && (
				<h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
			)}
			<ResponsiveContainer width="100%" height={height}>
				<LineChart
					data={data}
					margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				>
					<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
					<XAxis
						dataKey="period"
						fontSize={12}
						className="fill-muted-foreground"
					/>
					<YAxis
						tickFormatter={(value) => formatFinancialValue(value)}
						fontSize={12}
						className="fill-muted-foreground"
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					{metrics.map((metric) => (
						<Line
							key={metric.key}
							type="monotone"
							dataKey={metric.key}
							stroke={metric.color}
							strokeWidth={2}
							dot={false}
							name={metric.label}
							connectNulls={false}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}