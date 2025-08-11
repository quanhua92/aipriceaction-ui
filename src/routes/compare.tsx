import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Grid3X3, Settings, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { StockChart } from "@/components/charts";
import { TimeRangeSelector } from "@/components/ui/TimeRangeSelector";
import { MultiTickerSearch } from "@/components/ui/TickerSearch";
import { useMultipleTickerData } from "@/lib/queries";
import type { TimeRange } from "@/lib/stock-data";

type GridLayout = "1x1" | "1x2" | "2x1" | "2x2" | "2x3" | "3x2";

interface ComparePageSearch {
	tickers?: string[];
	layout?: GridLayout;
	range?: TimeRange;
}

export const Route = createFileRoute("/compare")({
	validateSearch: (search: Record<string, unknown>): ComparePageSearch => {
		return {
			tickers: Array.isArray(search.tickers)
				? (search.tickers as string[])
				: [],
			layout: (search.layout as GridLayout) || "2x2",
			range: (search.range as TimeRange) || "1Y",
		};
	},
	component: ComparePage,
});

const LAYOUT_OPTIONS = [
	{ value: "1x1" as GridLayout, label: "1×1", cols: 1, rows: 1 },
	{ value: "1x2" as GridLayout, label: "1×2", cols: 2, rows: 1 },
	{ value: "2x1" as GridLayout, label: "2×1", cols: 1, rows: 2 },
	{ value: "2x2" as GridLayout, label: "2×2", cols: 2, rows: 2 },
	{ value: "2x3" as GridLayout, label: "2×3", cols: 3, rows: 2 },
	{ value: "3x2" as GridLayout, label: "3×2", cols: 2, rows: 3 },
];

function ComparePage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { tickers = [], layout = "2x2", range = "1Y" } = Route.useSearch();

	const { data: tickerData, isLoading } = useMultipleTickerData(
		tickers,
		range,
		500,
	);

	const updateSearchParams = (updates: Partial<ComparePageSearch>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	const currentLayout =
		LAYOUT_OPTIONS.find((opt) => opt.value === layout) || LAYOUT_OPTIONS[3];
	const maxGridItems = currentLayout.cols * currentLayout.rows;

	// Create grid items - fill with tickers and empty slots
	const gridItems = useMemo(() => {
		const items = [];
		for (let i = 0; i < maxGridItems; i++) {
			items.push({
				id: i,
				ticker: tickers[i] || null,
				data: tickers[i] ? tickerData?.[tickers[i]] || [] : [],
			});
		}
		return items;
	}, [tickers, tickerData, maxGridItems]);

	const handleTickersChange = (newTickers: string[]) => {
		updateSearchParams({ tickers: newTickers });
	};

	const setTickerForGrid = (gridIndex: number, ticker: string | null) => {
		const newTickers = [...tickers];

		if (ticker) {
			// Set ticker for specific grid position
			newTickers[gridIndex] = ticker;
		} else {
			// Remove ticker from specific grid position
			newTickers.splice(gridIndex, 1);
		}

		// Remove empty slots at the end
		while (newTickers.length > 0 && !newTickers[newTickers.length - 1]) {
			newTickers.pop();
		}

		updateSearchParams({ tickers: newTickers });
	};

	const getGridClasses = () => {
		const baseClasses = "grid gap-4";
		switch (layout) {
			case "1x1":
				return `${baseClasses} grid-cols-1`;
			case "1x2":
				return `${baseClasses} grid-cols-2`;
			case "2x1":
				return `${baseClasses} grid-cols-1`;
			case "2x2":
				return `${baseClasses} grid-cols-2`;
			case "2x3":
				return `${baseClasses} grid-cols-3`;
			case "3x2":
				return `${baseClasses} grid-cols-2`;
			default:
				return `${baseClasses} grid-cols-2`;
		}
	};

	const chartColors = [
		"#3B82F6", // blue-500
		"#10B981", // emerald-500
		"#F59E0B", // amber-500
		"#EF4444", // red-500
		"#8B5CF6", // violet-500
		"#06B6D4", // cyan-500
		"#F97316", // orange-500
		"#84CC16", // lime-500
	];

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
					<Grid3X3 className="h-8 w-8" />
					Compare Charts
				</h1>
				<p className="text-muted-foreground">
					Compare multiple stock charts side-by-side in a customizable grid
					layout
				</p>
			</div>

			{/* Controls */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						Chart Configuration
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Ticker Selection */}
					<div>
						<label className="text-sm font-medium mb-2 block">
							Select Tickers (Max {maxGridItems})
						</label>
						<MultiTickerSearch
							selectedTickers={tickers}
							onTickersChange={handleTickersChange}
							maxSelection={maxGridItems}
							placeholder="Add tickers to compare..."
							className="w-full"
						/>
					</div>

					{/* Layout and Range Selection */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">
								Grid Layout
							</label>
							<Select
								value={layout}
								onValueChange={(value: GridLayout) =>
									updateSearchParams({ layout: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{LAYOUT_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label} Grid
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex-1">
							<label className="text-sm font-medium mb-2 block">
								Time Range
							</label>
							<TimeRangeSelector
								value={range}
								onChange={(newRange) => updateSearchParams({ range: newRange })}
								className="w-full"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Grid Layout */}
			<div className={getGridClasses()}>
				{gridItems.map((item, index) => (
					<Card key={item.id} className="min-h-[400px]">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									{item.ticker ? (
										<>
											<Badge
												variant="default"
												style={{
													backgroundColor:
														chartColors[index % chartColors.length],
												}}
											>
												{item.ticker}
											</Badge>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setTickerForGrid(index, null)}
												className="h-6 w-6 p-0"
											>
												<X className="h-4 w-4" />
											</Button>
										</>
									) : (
										<div className="text-sm text-muted-foreground">
											Grid {index + 1}
										</div>
									)}
								</div>
								<div className="text-xs text-muted-foreground">
									{currentLayout.label}
								</div>
							</div>
						</CardHeader>
						<CardContent>
							{item.ticker && item.data.length > 0 ? (
								isLoading ? (
									<div className="h-[300px] flex items-center justify-center">
										<div className="text-muted-foreground">Loading...</div>
									</div>
								) : (
									<StockChart
										data={item.data}
										height={300}
										color={chartColors[index % chartColors.length]}
									/>
								)
							) : item.ticker && isLoading ? (
								<div className="h-[300px] flex items-center justify-center">
									<div className="text-muted-foreground">
										Loading {item.ticker}...
									</div>
								</div>
							) : item.ticker ? (
								<div className="h-[300px] flex items-center justify-center">
									<div className="text-center space-y-2">
										<p className="text-muted-foreground">No data available</p>
										<p className="text-xs text-muted-foreground">
											for {item.ticker}
										</p>
									</div>
								</div>
							) : (
								<div className="h-[300px] flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
									<div className="text-center space-y-4">
										<Plus className="h-12 w-12 text-muted-foreground/40 mx-auto" />
										<div>
											<p className="text-muted-foreground">Empty Grid Slot</p>
											<p className="text-xs text-muted-foreground">
												Add a ticker to compare
											</p>
										</div>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				))}
			</div>

			{/* Quick Actions */}
			{tickers.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								onClick={() =>
									updateSearchParams({
										tickers: [
											"VNINDEX",
											...tickers.filter((t) => t !== "VNINDEX"),
										].slice(0, maxGridItems),
									})
								}
							>
								Add VN-Index
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									updateSearchParams({
										tickers: ["VCB", "BID", "CTG", "ACB"].slice(
											0,
											maxGridItems,
										),
									})
								}
							>
								Banking Stocks
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									updateSearchParams({
										tickers: ["VHM", "VIC", "VRE", "KDH"].slice(
											0,
											maxGridItems,
										),
									})
								}
							>
								Real Estate
							</Button>
							<Button
								variant="outline"
								onClick={() => updateSearchParams({ tickers: [] })}
							>
								Clear All
							</Button>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
