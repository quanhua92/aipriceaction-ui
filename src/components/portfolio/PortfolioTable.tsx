import React, { useState, useMemo, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { TickerSearch } from "@/components/ui/TickerSearch";
import { useTranslation } from "@/hooks/useTranslation";
import {
	type PortfolioItem,
	calculateInvestmentValue,
	formatVND,
	isWatchListItem,
} from "@/lib/portfolio-utils";

interface PortfolioTableProps {
	items: PortfolioItem[];
	onUpdateItem: (ticker: string, quantity: number, price: number) => void;
	onRemoveItem: (ticker: string) => void;
	onAddItem: (ticker: string) => void;
}

type SortField = "ticker" | "quantity" | "price" | "value";
type SortDirection = "asc" | "desc";

export function PortfolioTable({
	items,
	onUpdateItem,
	onRemoveItem,
	onAddItem,
}: PortfolioTableProps) {
	const { t } = useTranslation();
	const [sortField, setSortField] = useState<SortField>("ticker");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
	const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});

	const sortedItems = useMemo(() => {
		return [...items].sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;

			switch (sortField) {
				case "ticker":
					aValue = a.ticker;
					bValue = b.ticker;
					break;
				case "quantity":
					aValue = a.quantity;
					bValue = b.quantity;
					break;
				case "price":
					aValue = a.price;
					bValue = b.price;
					break;
				case "value":
					aValue = calculateInvestmentValue(a);
					bValue = calculateInvestmentValue(b);
					break;
				default:
					aValue = a.ticker;
					bValue = b.ticker;
			}

			if (typeof aValue === "string" && typeof bValue === "string") {
				return sortDirection === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			return sortDirection === "asc" 
				? (aValue as number) - (bValue as number)
				: (bValue as number) - (aValue as number);
		});
	}, [items, sortField, sortDirection]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	// Handle Tab navigation like Google Sheets
	const handleKeyDown = useCallback((
		e: React.KeyboardEvent<HTMLInputElement>, 
		ticker: string, 
		field: 'price' | 'quantity'
	) => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const currentIndex = sortedItems.findIndex(item => item.ticker === ticker);
			
			if (e.shiftKey) {
				// Shift+Tab: Move to previous cell
				if (field === 'quantity') {
					// Move to price of same row
					const priceKey = `${ticker}-price`;
					inputRefs.current[priceKey]?.focus();
				} else if (field === 'price') {
					// Move to quantity of previous row
					if (currentIndex > 0) {
						const prevTicker = sortedItems[currentIndex - 1].ticker;
						const quantityKey = `${prevTicker}-quantity`;
						inputRefs.current[quantityKey]?.focus();
					}
				}
			} else {
				// Tab: Move to next cell
				if (field === 'price') {
					// Move to quantity of same row
					const quantityKey = `${ticker}-quantity`;
					inputRefs.current[quantityKey]?.focus();
				} else if (field === 'quantity') {
					// Move to price of next row
					if (currentIndex < sortedItems.length - 1) {
						const nextTicker = sortedItems[currentIndex + 1].ticker;
						const priceKey = `${nextTicker}-price`;
						inputRefs.current[priceKey]?.focus();
					}
				}
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			// Move to next row same field
			const currentIndex = sortedItems.findIndex(item => item.ticker === ticker);
			if (currentIndex < sortedItems.length - 1) {
				const nextTicker = sortedItems[currentIndex + 1].ticker;
				const nextKey = `${nextTicker}-${field}`;
				inputRefs.current[nextKey]?.focus();
			}
		}
	}, [sortedItems]);

	// Handle input changes (local state only)
	const handleInputChange = useCallback((
		ticker: string, 
		field: 'price' | 'quantity', 
		value: string
	) => {
		const key = `${ticker}-${field}`;
		setLocalValues(prev => ({ ...prev, [key]: value }));
	}, []);

	// Handle input blur (commit to props)
	const handleInputBlur = useCallback((
		ticker: string, 
		field: 'price' | 'quantity', 
		value: string
	) => {
		const item = items.find(item => item.ticker === ticker);
		if (!item) return;

		const numValue = parseFloat(value) || 0;
		
		if (field === 'price') {
			onUpdateItem(ticker, item.quantity, numValue);
		} else {
			onUpdateItem(ticker, numValue, item.price);
		}
	}, [items, onUpdateItem]);

	// Get current value (local or from props)
	const getCurrentValue = useCallback((ticker: string, field: 'price' | 'quantity') => {
		const key = `${ticker}-${field}`;
		if (localValues[key] !== undefined) {
			return localValues[key];
		}
		const item = items.find(item => item.ticker === ticker);
		if (!item) return '';
		return field === 'price' ? item.price.toString() : item.quantity.toString();
	}, [localValues, items]);

	const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
		<Button
			variant="ghost"
			size="sm"
			className="h-auto p-1 font-medium"
			onClick={() => handleSort(field)}
		>
			{children}
			{sortField === field && (
				sortDirection === "asc" ? (
					<ChevronUp className="ml-1 h-3 w-3" />
				) : (
					<ChevronDown className="ml-1 h-3 w-3" />
				)
			)}
		</Button>
	);

	const PortfolioRow = ({ item }: { item: PortfolioItem }) => {
		const isWatchList = isWatchListItem(item);
		const value = calculateInvestmentValue(item);

		return (
			<TableRow 
				key={item.ticker} 
				className="hover:bg-muted/30 transition-colors border-b border-muted/50"
			>
				<TableCell className="px-4 py-3">
					<div className="flex items-center gap-3">
						<div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
							isWatchList 
								? "bg-gray-100 text-gray-600" 
								: "bg-green-500 text-white"
						}`}>
							{item.ticker.charAt(0)}
						</div>
						<div className="flex flex-col">
							<span className="font-semibold">{item.ticker}</span>
							{isWatchList && (
								<Badge variant="secondary" className="text-xs w-fit mt-1">
									{t("portfolio.watchList")}
								</Badge>
							)}
						</div>
					</div>
				</TableCell>
				<TableCell className="px-2 py-3">
					<Input
						ref={(el) => {
							inputRefs.current[`${item.ticker}-price`] = el;
						}}
						type="number"
						value={getCurrentValue(item.ticker, 'price')}
						onChange={(e) => handleInputChange(item.ticker, 'price', e.target.value)}
						onBlur={(e) => handleInputBlur(item.ticker, 'price', e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, item.ticker, 'price')}
						placeholder="0"
						className="w-full text-right border-transparent hover:border-muted focus:border-blue-500 bg-transparent"
						min="0"
						step="1000"
					/>
				</TableCell>
				<TableCell className="px-2 py-3">
					<Input
						ref={(el) => {
							inputRefs.current[`${item.ticker}-quantity`] = el;
						}}
						type="number"
						value={getCurrentValue(item.ticker, 'quantity')}
						onChange={(e) => handleInputChange(item.ticker, 'quantity', e.target.value)}
						onBlur={(e) => handleInputBlur(item.ticker, 'quantity', e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, item.ticker, 'quantity')}
						placeholder="0"
						className="w-full text-right border-transparent hover:border-muted focus:border-blue-500 bg-transparent"
						min="0"
					/>
				</TableCell>
				<TableCell className="px-4 py-3 text-right">
					<span className={`font-semibold ${value > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
						{value > 0 ? formatVND(value) : '—'}
					</span>
				</TableCell>
				<TableCell className="px-4 py-3">
					<Button
						size="sm"
						variant="ghost"
						onClick={() => onRemoveItem(item.ticker)}
						className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<Card className="w-full">
			<CardHeader className="pb-3">
				<CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
							<svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
								<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
							</svg>
						</div>
						<span className="text-lg font-semibold">{t("portfolio.configuration")}</span>
					</div>
					<div className="flex items-center gap-2">
						<TickerSearch
							onSelect={onAddItem}
							placeholder={t("portfolio.addStockPlaceholder")}
							keepOpenAfterSelect={true}
						/>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="px-0">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="bg-muted/30">
							<TableRow className="border-b">
								<TableHead className="px-4 py-3 text-left font-semibold">
									<SortButton field="ticker">{t("portfolio.ticker")}</SortButton>
								</TableHead>
								<TableHead className="px-4 py-3 text-right font-semibold">
									<SortButton field="price">{t("portfolio.price")}</SortButton>
								</TableHead>
								<TableHead className="px-4 py-3 text-right font-semibold">
									<SortButton field="quantity">{t("portfolio.quantity")}</SortButton>
								</TableHead>
								<TableHead className="px-4 py-3 text-right font-semibold">
									<SortButton field="value">{t("portfolio.value")}</SortButton>
								</TableHead>
								<TableHead className="px-4 py-3 text-center font-semibold w-[120px]">{t("portfolio.actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedItems.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-12">
										<div className="flex flex-col items-center gap-4">
											<div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
												<svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
												</svg>
											</div>
											<div className="text-center">
												<p className="text-lg font-medium text-muted-foreground mb-1">{t("portfolio.noStocksInPortfolio")}</p>
												<p className="text-sm text-muted-foreground">{t("portfolio.addFirstStock")}</p>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : (
								sortedItems.map((item) => (
									<PortfolioRow key={item.ticker} item={item} />
								))
							)}
						</TableBody>
					</Table>
				</div>
				
				{items.length > 0 && (
					<div className="px-4 pb-2 space-y-3">
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground bg-muted/20 rounded-lg p-3">
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded bg-green-500"></div>
								<span>{t("portfolio.realInvestments")}: {items.filter(item => !isWatchListItem(item)).length}</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 rounded bg-gray-400"></div>
								<span>{t("portfolio.watchListItems")}: {items.filter(item => isWatchListItem(item)).length}</span>
							</div>
						</div>
						
						<div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200/50">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
									<svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
								</div>
								<span className="text-sm font-medium text-blue-800">{t("portfolio.keyboardNavigation")}</span>
							</div>
							<div className="text-xs text-blue-700 space-y-1">
								<div className="flex items-center gap-4">
									<kbd className="px-2 py-1 bg-white/50 rounded text-xs font-mono">Tab</kbd>
									<span>{t("portfolio.tabToNext")}</span>
								</div>
								<div className="flex items-center gap-4">
									<kbd className="px-2 py-1 bg-white/50 rounded text-xs font-mono">Shift+Tab</kbd>
									<span>{t("portfolio.shiftTabToPrev")}</span>
								</div>
								<div className="flex items-center gap-4">
									<kbd className="px-2 py-1 bg-white/50 rounded text-xs font-mono">Enter</kbd>
									<span>{t("portfolio.enterToNextRow")}</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}