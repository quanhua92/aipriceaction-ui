import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Table, BarChart3, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
					aValue = a.dailyChange?.changePercent ?? -Infinity;
					bValue = b.dailyChange?.changePercent ?? -Infinity;
					break;
				
				case 'range':
					aValue = a.rangeChange?.changePercent ?? -Infinity;
					bValue = b.rangeChange?.changePercent ?? -Infinity;
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
			<CardHeader>
				<CardTitle className="text-lg flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Sortable Headers */}
				<div className="grid grid-cols-4 gap-4 p-3 border-b mb-4">
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
				</div>

				{/* Table Rows */}
				<div className="space-y-2">
					{processedTickers.map((tickerInfo) => {
						const { ticker, currentPrice, dailyChange, rangeChange, data } = tickerInfo;
						
						const isDailyPositive = dailyChange?.changePercent ? dailyChange.changePercent >= 0 : false;
						const isRangePositive = rangeChange?.changePercent ? rangeChange.changePercent >= 0 : false;
						const hasData = data.length > 0;

						return (
							<Link key={ticker} to="/ticker/$symbol" params={{ symbol: ticker }}>
								<div className="grid grid-cols-4 gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border items-center">
									{/* Ticker Column */}
									<div>
										<p className="font-medium text-sm">{ticker}</p>
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
								</div>
							</Link>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}