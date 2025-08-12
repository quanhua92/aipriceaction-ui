/**
 * Chart Suspense Component
 * 
 * Provides consistent loading states and error boundaries for all chart components.
 * Wraps charts in Suspense boundary with performance-optimized loading fallbacks.
 */

import { Suspense, type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react';

interface ChartSuspenseProps {
	children: ReactNode;
	fallbackTitle?: string;
	fallbackDescription?: string;
	height?: string;
	chartType?: 'line' | 'candlestick' | 'comparison' | 'pie' | 'bar' | 'generic';
	className?: string;
}

const chartIcons = {
	line: LineChart,
	candlestick: BarChart3,
	comparison: TrendingUp,
	pie: PieChart,
	bar: BarChart3,
	generic: BarChart3,
};

function ChartLoadingFallback({ 
	title = "Loading Chart", 
	description = "Preparing chart data...",
	height = "400px",
	chartType = "generic"
}: {
	title: string;
	description: string;
	height: string;
	chartType: ChartSuspenseProps['chartType'];
}) {
	const IconComponent = chartIcons[chartType!];

	return (
		<Card className="w-full">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<IconComponent className="h-4 w-4 text-gray-400" />
					<CardTitle className="text-base text-gray-600">{title}</CardTitle>
				</div>
				<div className="text-sm text-gray-500">{description}</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3" style={{ height }}>
					{/* Chart area skeleton */}
					<Skeleton className="w-full h-full rounded-lg" />
					
					{/* Legend skeleton */}
					<div className="flex justify-center gap-4">
						<div className="flex items-center gap-2">
							<Skeleton className="w-3 h-3 rounded-full" />
							<Skeleton className="w-16 h-4" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="w-3 h-3 rounded-full" />
							<Skeleton className="w-20 h-4" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="w-3 h-3 rounded-full" />
							<Skeleton className="w-12 h-4" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export function ChartSuspense({
	children,
	fallbackTitle = "Loading Chart",
	fallbackDescription = "Preparing chart data...",
	height = "400px",
	chartType = "generic",
	className = ""
}: ChartSuspenseProps) {
	return (
		<div className={className}>
			<Suspense
				fallback={
					<ChartLoadingFallback
						title={fallbackTitle}
						description={fallbackDescription}
						height={height}
						chartType={chartType}
					/>
				}
			>
				{children}
			</Suspense>
		</div>
	);
}