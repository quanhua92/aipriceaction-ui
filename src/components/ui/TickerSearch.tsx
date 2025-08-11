import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useTickerGroups } from "@/lib/queries";
import { getAllTickers, findTickerSector } from "@/lib/stock-data";

interface TickerSearchProps {
	value?: string;
	onSelect: (ticker: string) => void;
	placeholder?: string;
	className?: string;
	keepOpenAfterSelect?: boolean;
}

export function TickerSearch({
	value,
	onSelect,
	placeholder = "Search tickers...",
	className,
	keepOpenAfterSelect = false,
}: TickerSearchProps) {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { data: tickerGroups, isLoading } = useTickerGroups();

	const allTickers = useMemo(() => {
		if (!tickerGroups) return [];
		return getAllTickers(tickerGroups);
	}, [tickerGroups]);

	const filteredTickers = useMemo(() => {
		if (!search) return allTickers.slice(0, 50); // Show first 50 by default

		return allTickers
			.filter((ticker) => ticker.toLowerCase().includes(search.toLowerCase()))
			.slice(0, 20); // Show max 20 when searching
	}, [allTickers, search]);

	const getSectorBadge = (ticker: string) => {
		if (!tickerGroups) return null;
		const sector = findTickerSector(tickerGroups, ticker);
		if (!sector) return null;

		const sectorName = sector.replace(/_/g, " ");
		return (
			<Badge variant="secondary" className="ml-2 text-xs">
				{sectorName}
			</Badge>
		);
	};

	if (isLoading) {
		return (
			<div className={className}>
				<Input placeholder="Loading tickers..." disabled />
			</div>
		);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={`w-full justify-between ${className}`}
				>
					<div className="flex items-center gap-2">
						<Search className="h-4 w-4" />
						{value || placeholder}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0">
				<Command>
					<CommandInput
						placeholder={placeholder}
						value={search}
						onValueChange={setSearch}
					/>
					<CommandList>
						<CommandEmpty>No tickers found.</CommandEmpty>
						<CommandGroup>
							{filteredTickers.map((ticker) => (
								<CommandItem
									key={ticker}
									value={ticker}
									onSelect={(currentValue) => {
										onSelect(currentValue.toUpperCase());
										if (!keepOpenAfterSelect) {
											setOpen(false);
										}
										setSearch("");
									}}
									className="flex items-center justify-between"
								>
									<span className="font-mono">{ticker}</span>
									{getSectorBadge(ticker)}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

interface MultiTickerSearchProps {
	selectedTickers: string[];
	onTickersChange: (tickers: string[]) => void;
	maxSelection?: number;
	placeholder?: string;
	className?: string;
}

export function MultiTickerSearch({
	selectedTickers,
	onTickersChange,
	maxSelection = 10,
	placeholder = "Add tickers...",
	className,
}: MultiTickerSearchProps) {
	const addTicker = (ticker: string) => {
		if (selectedTickers.includes(ticker)) return;
		if (selectedTickers.length >= maxSelection) return;

		onTickersChange([...selectedTickers, ticker]);
	};

	const removeTicker = (ticker: string) => {
		onTickersChange(selectedTickers.filter((t) => t !== ticker));
	};

	return (
		<div className={className}>
			<div className="flex flex-wrap gap-2 mb-2">
				{selectedTickers.map((ticker) => (
					<Badge
						key={ticker}
						variant="default"
						className="flex items-center gap-1"
					>
						{ticker}
						<button
							onClick={() => removeTicker(ticker)}
							className="ml-1 hover:bg-destructive rounded-full w-4 h-4 flex items-center justify-center text-xs"
						>
							×
						</button>
					</Badge>
				))}
			</div>
			<TickerSearch
				onSelect={addTicker}
				placeholder={
					selectedTickers.length >= maxSelection
						? `Maximum ${maxSelection} tickers selected`
						: placeholder
				}
				className="w-full"
				keepOpenAfterSelect={true}
			/>
		</div>
	);
}
