import React, { useState, useMemo } from "react";
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
	const [editingTicker, setEditingTicker] = useState<string | null>(null);

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

	const handleEdit = (item: PortfolioItem) => {
		setEditingTicker(item.ticker);
	};

	const handleSave = (ticker: string, quantity: string, price: string) => {
		const numQuantity = parseFloat(quantity) || 0;
		const numPrice = parseFloat(price) || 0;
		onUpdateItem(ticker, numQuantity, numPrice);
		setEditingTicker(null);
	};

	const handleCancel = () => {
		setEditingTicker(null);
	};

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

	const EditableRow = ({ item }: { item: PortfolioItem }) => {
		const [quantity, setQuantity] = useState(item.quantity.toString());
		const [price, setPrice] = useState(item.price.toString());

		return (
			<TableRow key={item.ticker} className="border-blue-200 bg-blue-50/30">
				<TableCell className="font-medium">{item.ticker}</TableCell>
				<TableCell>
					<Input
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						placeholder="0"
						className="w-24"
						min="0"
						step="1000"
					/>
				</TableCell>
				<TableCell>
					<Input
						type="number"
						value={quantity}
						onChange={(e) => setQuantity(e.target.value)}
						placeholder="0"
						className="w-20"
						min="0"
					/>
				</TableCell>
				<TableCell>
					{formatVND(parseFloat(quantity) * parseFloat(price) || 0)}
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							onClick={() => handleSave(item.ticker, quantity, price)}
						>
							{t("common.save")}
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={handleCancel}
						>
							{t("common.cancel")}
						</Button>
					</div>
				</TableCell>
			</TableRow>
		);
	};

	const DisplayRow = ({ item }: { item: PortfolioItem }) => {
		const isWatchList = isWatchListItem(item);
		const value = calculateInvestmentValue(item);

		return (
			<TableRow key={item.ticker} className={isWatchList ? "opacity-60" : ""}>
				<TableCell className="font-medium">
					<div className="flex items-center gap-2">
						{item.ticker}
						{isWatchList && (
							<Badge variant="secondary" className="text-xs">
								{t("portfolio.watchList")}
							</Badge>
						)}
					</div>
				</TableCell>
				<TableCell>
					{isWatchList ? "—" : formatVND(item.price)}
				</TableCell>
				<TableCell>
					{isWatchList ? "—" : item.quantity.toLocaleString()}
				</TableCell>
				<TableCell>
					{isWatchList ? "—" : formatVND(value)}
				</TableCell>
				<TableCell>
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => handleEdit(item)}
						>
							{isWatchList ? t("portfolio.addToPortfolio") : t("common.edit")}
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => onRemoveItem(item.ticker)}
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{t("portfolio.configuration")}</span>
					<div className="flex items-center gap-2">
						<TickerSearch
							onSelect={onAddItem}
							placeholder={t("portfolio.addStockPlaceholder")}
							keepOpenAfterSelect={true}
						/>
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>
									<SortButton field="ticker">{t("portfolio.ticker")}</SortButton>
								</TableHead>
								<TableHead>
									<SortButton field="price">{t("portfolio.price")}</SortButton>
								</TableHead>
								<TableHead>
									<SortButton field="quantity">{t("portfolio.quantity")}</SortButton>
								</TableHead>
								<TableHead>
									<SortButton field="value">{t("portfolio.value")}</SortButton>
								</TableHead>
								<TableHead>{t("portfolio.actions")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedItems.length === 0 ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
										{t("portfolio.noStocksInPortfolio")}
									</TableCell>
								</TableRow>
							) : (
								sortedItems.map((item) => (
									editingTicker === item.ticker ? (
										<EditableRow key={item.ticker} item={item} />
									) : (
										<DisplayRow key={item.ticker} item={item} />
									)
								))
							)}
						</TableBody>
					</Table>
				</div>
				
				{items.length > 0 && (
					<div className="mt-4 text-sm text-muted-foreground">
						<p>{t("portfolio.tableHint")}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}