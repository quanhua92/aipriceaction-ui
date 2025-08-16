import { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandlestickChart } from "@/components/charts";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { useTickerData } from "@/lib/queries";
import { createDateRangeConfig, type DateRangeConfig } from "@/lib/stock-data";

export const Route = createFileRoute("/chart")({
	component: ChartDebug,
	validateSearch: (search: Record<string, unknown>) => ({
		ticker: (search.ticker as string) || "VNINDEX",
	}),
});

function ChartDebug() {
	const navigate = useNavigate({ from: "/chart" });
	const { ticker } = Route.useSearch();
	const [dateRangeConfig, setDateRangeConfig] = useState<DateRangeConfig>(
		createDateRangeConfig("1M")
	);

	const { data: tickerData, isLoading } = useTickerData(
		ticker,
		dateRangeConfig,
		1000
	);

	const lastDataPoint = useMemo(() => {
		if (!tickerData || tickerData.length === 0) return null;
		return tickerData[tickerData.length - 1];
	}, [tickerData]);

	const handleTickerSelect = (selectedTicker: string) => {
		navigate({
			search: { ticker: selectedTicker },
		});
	};

	return (
		<div className="container mx-auto p-2 md:p-6 space-y-4">
			{/* Header with Ticker Search */}
			<Card>
				<CardHeader>
					<CardTitle>Chart Debug - Single Ticker Analysis</CardTitle>
				</CardHeader>
				<CardContent className="p-3 md:p-6">
					<TickerSearch
						onSelect={handleTickerSelect}
						placeholder="Search ticker (e.g., VNINDEX, VCB, TCB)"
						className="max-w-md"
					/>
				</CardContent>
			</Card>

			{/* Ticker Info & OHLCV */}
			<Card>
				<CardContent className="p-3 md:p-6">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
						<div>
							<h2 className="text-2xl font-bold">{ticker}</h2>
							{lastDataPoint && (
								<p className="text-sm text-muted-foreground">
									Last trading day: {new Date(lastDataPoint.date).toLocaleDateString('vi-VN')}
								</p>
							)}
						</div>
						<DateRangeSelector
							value={dateRangeConfig}
							onChange={setDateRangeConfig}
							dataRange={tickerData}
							className="w-full md:w-auto"
						/>
					</div>

					{/* OHLCV Data */}
					{isLoading ? (
						<div className="animate-pulse">
							<div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
							<div className="h-4 bg-muted rounded w-3/4"></div>
						</div>
					) : lastDataPoint ? (
						<div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">Open</p>
								<p className="font-semibold text-lg">
									{lastDataPoint.open.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">High</p>
								<p className="font-semibold text-lg text-green-600">
									{lastDataPoint.high.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Low</p>
								<p className="font-semibold text-lg text-red-600">
									{lastDataPoint.low.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Close</p>
								<p className="font-semibold text-lg">
									{lastDataPoint.close.toLocaleString()}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Volume</p>
								<p className="font-semibold text-lg">
									{lastDataPoint.volume.toLocaleString()}
								</p>
							</div>
						</div>
					) : (
						<p className="text-muted-foreground">No data available</p>
					)}
				</CardContent>
			</Card>

			{/* Full Width Chart */}
			<Card>
				<CardContent className="p-0">
					{isLoading ? (
						<div className="h-[500px] flex items-center justify-center">
							<div className="text-muted-foreground">Loading chart data...</div>
						</div>
					) : tickerData && tickerData.length > 0 ? (
						<div className="h-[500px] w-full">
							<CandlestickChart
								data={tickerData}
								height={0} // Will use container height
							/>
						</div>
					) : (
						<div className="h-[500px] flex items-center justify-center">
							<div className="text-muted-foreground">No chart data available</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}