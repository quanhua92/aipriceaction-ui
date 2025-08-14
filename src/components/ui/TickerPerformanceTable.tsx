import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Table, BarChart3, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AskAIButton } from "@/components/ask-ai";
import { calculatePriceChange, calculateRangeChange } from "@/lib/stock-data";

interface TickerPerformanceTableProps {
	tickerData: Record<string, any[]>;
	tickers: string[];
	timeRange: string;
	isLoading?: boolean;
	title?: string;
}

export function TickerPerformanceTable({ 
	tickerData, 
	tickers, 
	timeRange, 
	isLoading = false,
	title = "Ticker Performance"
}: TickerPerformanceTableProps) {
	const [sortBy, setSortBy] = useState<'ticker' | 'price' | 'daily' | 'range'>('ticker');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	const handleSort = (column: 'ticker' | 'price' | 'daily' | 'range') => {
		if (sortBy === column) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(column);
			setSortDirection('asc');
		}
	};

	const getSortIcon = (column: 'ticker' | 'price' | 'daily' | 'range') => {
		if (sortBy !== column) {
			return <ArrowUpDown className="h-3 w-3" />;
		}
		return sortDirection === 'asc' 
			? <ArrowUp className="h-3 w-3" />
			: <ArrowDown className="h-3 w-3" />;
	};

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{[1, 2, 3, 4, 5].map(i => (
							<div key={i} className="animate-pulse">
								<div className="h-12 bg-muted rounded w-full"></div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	// Process ticker data
	const processedTickers = tickers
		.filter(ticker => ticker !== "VNINDEX") // Exclude VNINDEX from the table
		.map(ticker => {
			const data = tickerData?.[ticker] || [];
			if (data.length === 0) {
				return {
					ticker,
					data: [],
					currentPrice: 0,
					dailyChange: null,
					rangeChange: null,
				};
			}

			const dailyChange = calculatePriceChange(data);
			const rangeChange = calculateRangeChange(data);
			const currentPrice = data[data.length - 1]?.close || 0;

			return {
				ticker,
				data,
				currentPrice,
				dailyChange,
				rangeChange,
			};
		})
		.sort((a, b) => {
			let aValue, bValue;
			
			switch (sortBy) {
				case 'ticker':
					aValue = a.ticker;
					bValue = b.ticker;
					return sortDirection === 'asc' 
						? aValue.localeCompare(bValue)
						: bValue.localeCompare(aValue);
				
				case 'price':
					aValue = a.currentPrice;
					bValue = b.currentPrice;
					break;
				
				case 'daily':
					aValue = a.dailyChange?.changePercent ?? Number.NEGATIVE_INFINITY;
					bValue = b.dailyChange?.changePercent ?? Number.NEGATIVE_INFINITY;
					break;
				
				case 'range':
					aValue = a.rangeChange?.changePercent ?? Number.NEGATIVE_INFINITY;
					bValue = b.rangeChange?.changePercent ?? Number.NEGATIVE_INFINITY;
					break;
					
				default:
					return 0;
			}
			
			// For numeric comparisons
			return sortDirection === 'asc' 
				? (aValue as number) - (bValue as number)
				: (bValue as number) - (aValue as number);
		});

	if (processedTickers.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Table className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
						<p className="text-muted-foreground">No tickers selected</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				{/* Desktop Table View - Hidden on mobile */}
				<div className="hidden sm:block">
					{/* Sortable Headers */}
					<div className="grid gap-4 px-3 py-2 border-b mb-3" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 1fr' }}>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleSort('ticker')}
						className="justify-start p-0 h-auto font-medium"
					>
						Ticker {getSortIcon('ticker')}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleSort('price')}
						className="justify-center p-0 h-auto font-medium"
					>
						Price {getSortIcon('price')}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleSort('daily')}
						className="justify-center p-0 h-auto font-medium"
					>
						Daily {getSortIcon('daily')}
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => handleSort('range')}
						className="justify-center p-0 h-auto font-medium"
					>
						{timeRange} {getSortIcon('range')}
					</Button>
					<div className="flex justify-center">
						<span className="text-sm font-medium text-muted-foreground">Ask AI</span>
					</div>
				</div>

				{/* Table Rows */}
				<div className="space-y-1">
					{processedTickers.map((tickerInfo) => {
						const { ticker, currentPrice, dailyChange, rangeChange, data } = tickerInfo;
						
						const isDailyPositive = dailyChange?.changePercent ? dailyChange.changePercent >= 0 : false;
						const isRangePositive = rangeChange?.changePercent ? rangeChange.changePercent >= 0 : false;
						const hasData = data.length > 0;

						return (
							<div key={ticker} className="grid gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors border items-center" style={{ gridTemplateColumns: '80px 1fr 1fr 1fr 1fr' }}>
									{/* Ticker Column */}
									<div>
										<Link to="/ticker/$symbol" params={{ symbol: ticker }} className="hover:underline">
											<p className="font-medium text-sm cursor-pointer">{ticker}</p>
										</Link>
									</div>
									
									{/* Price Column */}
									<div className="text-center">
										<p className="text-sm">
											{hasData ? (
												new Intl.NumberFormat("vi-VN", {
													style: "currency",
													currency: "VND",
													minimumFractionDigits: 0,
													maximumFractionDigits: 0,
												}).format(currentPrice)
											) : (
												<span className="text-muted-foreground">No data</span>
											)}
										</p>
									</div>
									
									{/* Daily Performance Column */}
									<div className="text-center">
										{hasData && dailyChange ? (
											<p className={`text-sm font-semibold ${isDailyPositive ? "text-green-600" : "text-red-600"}`}>
												{isDailyPositive ? "+" : ""}{dailyChange.changePercent.toFixed(2)}%
											</p>
										) : (
											<p className="text-sm text-muted-foreground">--</p>
										)}
									</div>
									
									{/* Range Performance Column */}
									<div className="text-center">
										{hasData && rangeChange ? (
											<p className={`text-sm font-bold ${isRangePositive ? "text-green-600" : "text-red-600"}`}>
												{isRangePositive ? "+" : ""}{rangeChange.changePercent.toFixed(2)}%
											</p>
										) : (
											<p className="text-sm text-muted-foreground">--</p>
										)}
									</div>
									
									{/* Ask AI Column - Now has more space */}
									<div className="flex justify-center">
										<AskAIButton 
											ticker={ticker}
											size="sm"
										/>
									</div>
								</div>
						);
					})}
				</div>
			</div>

			{/* Mobile Card View - Visible only on mobile */}
			<div className="sm:hidden space-y-3">
				{/* Sorting Controls for Mobile */}
				<div className="flex gap-2 mb-4 overflow-x-auto pb-2">
					<Button
						variant={sortBy === 'ticker' ? 'default' : 'outline'}
						size="sm"
						onClick={() => handleSort('ticker')}
						className="whitespace-nowrap"
					>
						Ticker {getSortIcon('ticker')}
					</Button>
					<Button
						variant={sortBy === 'price' ? 'default' : 'outline'}
						size="sm"
						onClick={() => handleSort('price')}
						className="whitespace-nowrap"
					>
						Price {getSortIcon('price')}
					</Button>
					<Button
						variant={sortBy === 'daily' ? 'default' : 'outline'}
						size="sm"
						onClick={() => handleSort('daily')}
						className="whitespace-nowrap"
					>
						Daily {getSortIcon('daily')}
					</Button>
					<Button
						variant={sortBy === 'range' ? 'default' : 'outline'}
						size="sm"
						onClick={() => handleSort('range')}
						className="whitespace-nowrap"
					>
						{timeRange} {getSortIcon('range')}
					</Button>
				</div>

				{/* Mobile Cards */}
				{processedTickers.map((tickerInfo) => {
					const { ticker, currentPrice, dailyChange, rangeChange, data } = tickerInfo;
					
					const isDailyPositive = dailyChange?.changePercent ? dailyChange.changePercent >= 0 : false;
					const isRangePositive = rangeChange?.changePercent ? rangeChange.changePercent >= 0 : false;
					const hasData = data.length > 0;

					return (
						<div key={ticker} className="bg-white rounded-lg border border-gray-200 p-4">
							{/* Header with Ticker and Ask AI */}
							<div className="flex items-center justify-between mb-3">
								<Link to="/ticker/$symbol" params={{ symbol: ticker }} className="hover:underline">
									<h3 className="font-bold text-lg text-gray-900 cursor-pointer">{ticker}</h3>
								</Link>
								<AskAIButton 
									ticker={ticker}
									size="sm"
								/>
							</div>

							{/* Performance Grid */}
							<div className="grid grid-cols-3 gap-3 text-sm">
								{/* Current Price */}
								<div className="text-center">
									<span className="text-gray-600 block mb-1">Price</span>
									<p className="font-medium">
										{hasData ? (
											new Intl.NumberFormat("vi-VN", {
												style: "currency",
												currency: "VND",
												minimumFractionDigits: 0,
												maximumFractionDigits: 0,
											}).format(currentPrice)
										) : (
											<span className="text-muted-foreground">No data</span>
										)}
									</p>
								</div>

								{/* Daily Performance */}
								<div className="text-center">
									<span className="text-gray-600 block mb-1">Daily</span>
									{hasData && dailyChange ? (
										<p className={`font-semibold ${isDailyPositive ? "text-green-600" : "text-red-600"}`}>
											{isDailyPositive ? "+" : ""}{dailyChange.changePercent.toFixed(2)}%
										</p>
									) : (
										<p className="text-muted-foreground">--</p>
									)}
								</div>

								{/* Range Performance */}
								<div className="text-center">
									<span className="text-gray-600 block mb-1">{timeRange}</span>
									{hasData && rangeChange ? (
										<p className={`font-bold ${isRangePositive ? "text-green-600" : "text-red-600"}`}>
											{isRangePositive ? "+" : ""}{rangeChange.changePercent.toFixed(2)}%
										</p>
									) : (
										<p className="text-muted-foreground">--</p>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</CardContent>
		</Card>
	);
}