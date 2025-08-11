import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, TrendingUp, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useTickerGroups } from "@/lib/queries";

export const Route = createFileRoute("/sectors/")({
	component: SectorsPage,
});

function SectorsPage() {
	const { t } = useTranslation();
	const { data: tickerGroups, isLoading } = useTickerGroups();

	const sectorData = useMemo(() => {
		if (!tickerGroups) return [];

		return Object.entries(tickerGroups).map(([sectorName, tickers]) => ({
			name: sectorName,
			displayName: t(`sectorNames.${sectorName}`) || sectorName.replace(/_/g, " "),
			tickerCount: tickers.length,
			tickers: tickers.slice(0, 5), // Show first 5 tickers as preview
		}));
	}, [tickerGroups]);

	if (isLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">{t("loading.sectorData")}</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
					<Building2 className="h-8 w-8" />
					{t("sectors.title")}
				</h1>
				<p className="text-muted-foreground">
					{t("sectors.subtitle")}
				</p>
			</div>

			{/* Sector Overview */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="p-2 bg-primary/10 rounded-full">
							<Building2 className="h-6 w-6 text-primary" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("sectors.totalSectors")}
							</p>
							<p className="text-2xl font-bold">{sectorData.length}</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="p-2 bg-blue-100 rounded-full">
							<Users className="h-6 w-6 text-blue-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("sectors.totalStocks")}
							</p>
							<p className="text-2xl font-bold">
								{sectorData.reduce((sum, sector) => sum + sector.tickerCount, 0)}
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="flex items-center gap-3 p-4">
						<div className="p-2 bg-green-100 rounded-full">
							<TrendingUp className="h-6 w-6 text-green-600" />
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("sectors.avgPerSector")}
							</p>
							<p className="text-2xl font-bold">
								{sectorData.length > 0 ? Math.round(
									sectorData.reduce((sum, sector) => sum + sector.tickerCount, 0) / sectorData.length
								) : 0}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sectors Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{sectorData.map((sector) => (
					<Card key={sector.name} className="hover:shadow-md transition-shadow">
						<CardHeader className="pb-3">
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg">{sector.displayName}</CardTitle>
								<Badge variant="secondary">{sector.tickerCount} {t("risk.stocks")}</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							{/* Preview tickers */}
							<div className="flex flex-wrap gap-1">
								{sector.tickers.map((ticker) => (
									<Badge key={ticker} variant="outline" className="text-xs">
										{ticker}
									</Badge>
								))}
								{sector.tickerCount > 5 && (
									<Badge variant="outline" className="text-xs text-muted-foreground">
										+{sector.tickerCount - 5} {t("common.more")}
									</Badge>
								)}
							</div>

							{/* Actions */}
							<div className="flex gap-2">
								<Link
									to="/sector/$sectorName"
									params={{ sectorName: sector.name }}
									className="flex-1"
								>
									<div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
										<BarChart3 className="h-4 w-4" />
										{t("sectors.comparePerformance")}
									</div>
								</Link>
								<Link
									to="/tickers"
									search={{ sector: sector.name }}
									className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
								>
									<Users className="h-4 w-4" />
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}