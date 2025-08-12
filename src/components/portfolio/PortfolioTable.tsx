import { useState, useRef } from "react";
import { Trash2, Save } from "lucide-react";
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
	parseFormattedNumber,
	getStockSector,
	isWatchListItem,
} from "@/lib/portfolio-utils";

interface PortfolioTableProps {
	items: PortfolioItem[];
	onUpdateItem: (ticker: string, quantity: number, price: number) => void;
	onRemoveItem: (ticker: string) => void;
	onAddItem: (ticker: string) => void;
}

export function PortfolioTable({
	items,
	onUpdateItem,
	onRemoveItem,
	onAddItem,
}: PortfolioTableProps) {
	const { t } = useTranslation();
	const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
	const [localValues, setLocalValues] = useState<{ [key: string]: string }>({});
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Simple input change - direct state update only
	const handleInputChange = (ticker: string, field: 'price' | 'quantity', value: string) => {
		const key = `${ticker}-${field}`;
		setLocalValues(prev => ({ ...prev, [key]: value }));
		setHasUnsavedChanges(true);
	};

	// Save all changes at once
	const handleSaveAll = () => {
		Object.entries(localValues).forEach(([key, value]) => {
			const [ticker, field] = key.split('-');
			const item = items.find(item => item.ticker === ticker);
			if (!item) return;

			const numValue = parseFormattedNumber(value);
			
			if (field === 'price') {
				onUpdateItem(ticker, item.quantity, numValue);
			} else if (field === 'quantity') {
				onUpdateItem(ticker, numValue, item.price);
			}
		});
		
		setLocalValues({});
		setHasUnsavedChanges(false);
	};

	// Get current value for display
	const getCurrentValue = (ticker: string, field: 'price' | 'quantity') => {
		const key = `${ticker}-${field}`;
		if (localValues[key] !== undefined) {
			return localValues[key];
		}
		const item = items.find(item => item.ticker === ticker);
		if (!item) return '';
		const value = field === 'price' ? item.price : item.quantity;
		return value > 0 ? value.toString() : '';
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
							<svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
								<path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
							</svg>
						</div>
						<span className="text-lg font-semibold">{t("portfolio.configuration")}</span>
					</div>
					<div className="flex-1 min-w-0 bg-background/50 rounded-full px-4 py-2 border">
						<TickerSearch
							onSelect={onAddItem}
							placeholder={t("portfolio.addStockPlaceholder")}
							keepOpenAfterSelect={true}
							className="w-full"
						/>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="px-0">
				{/* Mobile Layout: Card-based */}
				<div className="block md:hidden px-4 space-y-4">
					{items.length === 0 ? (
						<div className="text-center py-12">
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
						</div>
					) : (
						items.map((item) => {
							const isWatchList = isWatchListItem(item);
							const value = calculateInvestmentValue(item);
							const sectorInfo = getStockSector(item.ticker);

							return (
								<div key={item.ticker} className="bg-background border rounded-lg p-4 space-y-4">
									{/* Header */}
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${sectorInfo.color} text-white`}>
												{item.ticker.charAt(0)}
											</div>
											<div>
												<h3 className="font-semibold">{item.ticker}</h3>
												<div className="flex items-center gap-2 mt-1">
													<Badge variant="outline" className="text-xs">
														{sectorInfo.sector}
													</Badge>
													{isWatchList && (
														<Badge variant="secondary" className="text-xs">
															{t("portfolio.watchList")}
														</Badge>
													)}
												</div>
											</div>
										</div>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => onRemoveItem(item.ticker)}
											className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>

									{/* Input Fields */}
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="text-sm font-medium text-muted-foreground mb-1 block">
												{t("portfolio.price")}
											</label>
											<Input
												ref={(el) => {
													inputRefs.current[`${item.ticker}-price`] = el;
												}}
												type="text"
												inputMode="numeric"
												value={getCurrentValue(item.ticker, 'price')}
												onChange={(e) => handleInputChange(item.ticker, 'price', e.target.value)}
												placeholder="0"
												className="text-right"
											/>
										</div>
										<div>
											<label className="text-sm font-medium text-muted-foreground mb-1 block">
												{t("portfolio.quantity")}
											</label>
											<Input
												ref={(el) => {
													inputRefs.current[`${item.ticker}-quantity`] = el;
												}}
												type="text"
												inputMode="numeric"
												value={getCurrentValue(item.ticker, 'quantity')}
												onChange={(e) => handleInputChange(item.ticker, 'quantity', e.target.value)}
												placeholder="0"
												className="text-right"
											/>
										</div>
									</div>

									{/* Value Display */}
									{value > 0 && (
										<div className="pt-3 border-t">
											<div className="flex justify-between items-center">
												<span className="text-sm font-medium text-muted-foreground">
													{t("portfolio.value")}
												</span>
												<div className="text-right">
													<div className="font-semibold text-green-600">
														{formatVND(value)}
													</div>
												</div>
											</div>
										</div>
									)}
								</div>
							);
						})
					)}
				</div>

				{/* Desktop Layout: Table */}
				<div className="hidden md:block overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-left font-semibold">
									{t("portfolio.ticker")}
								</TableHead>
								<TableHead className="text-right font-semibold">
									{t("portfolio.price")}
								</TableHead>
								<TableHead className="text-right font-semibold">
									{t("portfolio.quantity")}
								</TableHead>
								<TableHead className="text-right font-semibold">
									{t("portfolio.value")}
								</TableHead>
								<TableHead className="text-center font-semibold w-[120px]">{t("portfolio.actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.length === 0 ? (
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
								items.map((item) => {
									const isWatchList = isWatchListItem(item);
									const value = calculateInvestmentValue(item);

									return (
										<TableRow key={item.ticker}>
											<TableCell>
												<div className="flex items-center gap-3">
													<div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
														isWatchList ? "bg-gray-100 text-gray-600" : "bg-green-500 text-white"
													}`}>
														{item.ticker.charAt(0)}
													</div>
													<div>
														<span className="font-semibold">{item.ticker}</span>
														{isWatchList && (
															<Badge variant="secondary" className="text-xs ml-2">
																{t("portfolio.watchList")}
															</Badge>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Input
													ref={(el) => {
														inputRefs.current[`${item.ticker}-price`] = el;
													}}
													type="text"
													inputMode="numeric"
													value={getCurrentValue(item.ticker, 'price')}
													onChange={(e) => handleInputChange(item.ticker, 'price', e.target.value)}
													placeholder="0"
													className="w-full text-right"
												/>
											</TableCell>
											<TableCell>
												<Input
													ref={(el) => {
														inputRefs.current[`${item.ticker}-quantity`] = el;
													}}
													type="text"
													inputMode="numeric"
													value={getCurrentValue(item.ticker, 'quantity')}
													onChange={(e) => handleInputChange(item.ticker, 'quantity', e.target.value)}
													placeholder="0"
													className="w-full text-right"
												/>
											</TableCell>
											<TableCell className="text-right">
												<span className={`font-semibold ${value > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
													{value > 0 ? formatVND(value) : '—'}
												</span>
											</TableCell>
											<TableCell>
												<Button
													size="sm"
													variant="ghost"
													onClick={() => onRemoveItem(item.ticker)}
													className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})
							)}
						</TableBody>
					</Table>
				</div>

				{/* Save Button at bottom */}
				{hasUnsavedChanges && (
					<div className="px-4 pb-4">
						<Button onClick={handleSaveAll} className="w-full flex items-center justify-center gap-2">
							<Save className="h-4 w-4" />
							{t("portfolio.save")}
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}