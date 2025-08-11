import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTickerGroups } from "@/lib/queries";
import { getAllTickers, findTickerSector } from "@/lib/stock-data";

export const Route = createFileRoute("/tickers")({
	component: TickersPage,
});

function TickersPage() {
	const [search, setSearch] = useState("");
	const [selectedSector, setSelectedSector] = useState<string>("ALL");
	const [sortBy, setSortBy] = useState<"ticker" | "sector">("ticker");

	const { data: tickerGroups, isLoading } = useTickerGroups();

	const allTickers = useMemo(() => {
		if (!tickerGroups) return [];
		return getAllTickers(tickerGroups);
	}, [tickerGroups]);

	const filteredTickers = useMemo(() => {
		if (!tickerGroups) return [];

		let tickers = allTickers;

		// Filter by search
		if (search) {
			tickers = tickers.filter((ticker) =>
				ticker.toLowerCase().includes(search.toLowerCase()),
			);
		}

		// Filter by sector
		if (selectedSector !== "ALL") {
			tickers = tickers.filter((ticker) => {
				const sector = findTickerSector(tickerGroups, ticker);
				return sector === selectedSector;
			});
		}

		// Sort
		if (sortBy === "ticker") {
			tickers.sort((a, b) => a.localeCompare(b));
		} else if (sortBy === "sector") {
			tickers.sort((a, b) => {
				const sectorA = findTickerSector(tickerGroups, a) || "";
				const sectorB = findTickerSector(tickerGroups, b) || "";
				return sectorA.localeCompare(sectorB) || a.localeCompare(b);
			});
		}

		return tickers;
	}, [allTickers, tickerGroups, search, selectedSector, sortBy]);

	const sectorOptions = useMemo(() => {
		if (!tickerGroups) return [];
		return Object.keys(tickerGroups).map((sector) => ({
			value: sector,
			label: sector.replace(/_/g, " "),
			count: tickerGroups[sector].length,
		}));
	}, [tickerGroups]);

	const getSectorBadgeColor = (sector: string) => {
		const colors = [
			"bg-blue-100 text-blue-800",
			"bg-green-100 text-green-800",
			"bg-yellow-100 text-yellow-800",
			"bg-red-100 text-red-800",
			"bg-purple-100 text-purple-800",
			"bg-indigo-100 text-indigo-800",
			"bg-pink-100 text-pink-800",
			"bg-gray-100 text-gray-800",
		];

		const hash = sector.split("").reduce((a, b) => {
			a = (a << 5) - a + b.charCodeAt(0);
			return a & a;
		}, 0);

		return colors[Math.abs(hash) % colors.length];
	};

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">Loading tickers...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold mb-2">All Stock Tickers</h1>
				<p className="text-muted-foreground">
					Browse and search through {allTickers.length} Vietnamese stocks across{" "}
					{sectorOptions.length} sectors
				</p>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Search className="h-5 w-5" />
						Search & Filter
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<Input
								placeholder="Search tickers..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="w-full"
							/>
						</div>

						<Select value={selectedSector} onValueChange={setSelectedSector}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select sector" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">All Sectors</SelectItem>
								{sectorOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label} ({option.count})
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={sortBy}
							onValueChange={(value: "ticker" | "sector") => setSortBy(value)}
						>
							<SelectTrigger className="w-[130px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ticker">By Ticker</SelectItem>
								<SelectItem value="sector">By Sector</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Results */}
			<Card>
				<CardHeader>
					<CardTitle>
						{filteredTickers.length} Stock
						{filteredTickers.length !== 1 ? "s" : ""} Found
					</CardTitle>
				</CardHeader>
				<CardContent>
					{filteredTickers.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							No tickers found matching your criteria
						</div>
					) : (
						<div className="space-y-4">
							{/* Table view for larger screens */}
							<div className="hidden md:block">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Ticker</TableHead>
											<TableHead>Sector</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredTickers.map((ticker) => {
											const sector = findTickerSector(tickerGroups!, ticker);
											const sectorLabel = sector?.replace(/_/g, " ");

											return (
												<TableRow key={ticker}>
													<TableCell>
														<Link
															to="/ticker/$symbol"
															params={{ symbol: ticker }}
															className="font-mono font-semibold text-lg hover:underline"
														>
															{ticker}
														</Link>
													</TableCell>
													<TableCell>
														{sector && (
															<Link
																to="/sector/$sectorName"
																params={{ sectorName: sector }}
															>
																<Badge
																	variant="secondary"
																	className={`cursor-pointer hover:shadow-sm ${getSectorBadgeColor(sector)}`}
																>
																	{sectorLabel}
																</Badge>
															</Link>
														)}
													</TableCell>
													<TableCell>
														<div className="flex gap-2">
															<Link
																to="/ticker/$symbol"
																params={{ symbol: ticker }}
															>
																<Button variant="outline" size="sm">
																	<BarChart3 className="h-4 w-4 mr-1" />
																	Chart
																</Button>
															</Link>
														</div>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>

							{/* Card view for smaller screens */}
							<div className="md:hidden space-y-3">
								{filteredTickers.map((ticker) => {
									const sector = findTickerSector(tickerGroups!, ticker);
									const sectorLabel = sector?.replace(/_/g, " ");

									return (
										<Card key={ticker} className="p-4">
											<div className="flex items-center justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-3">
														<Link
															to="/ticker/$symbol"
															params={{ symbol: ticker }}
															className="font-mono font-semibold text-xl hover:underline"
														>
															{ticker}
														</Link>
														{sector && (
															<Link
																to="/sector/$sectorName"
																params={{ sectorName: sector }}
															>
																<Badge
																	variant="secondary"
																	className={`text-xs cursor-pointer hover:shadow-sm ${getSectorBadgeColor(sector)}`}
																>
																	{sectorLabel}
																</Badge>
															</Link>
														)}
													</div>
												</div>
												<Link to="/ticker/$symbol" params={{ symbol: ticker }}>
													<Button variant="outline" size="sm">
														<BarChart3 className="h-4 w-4" />
													</Button>
												</Link>
											</div>
										</Card>
									);
								})}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
