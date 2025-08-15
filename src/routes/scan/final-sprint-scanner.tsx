import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TrendingUp, Target, Play, ArrowLeft, Building2, Briefcase, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "@tanstack/react-router";
import { useFinalSprintScan } from "@/lib/queries";
import type { FinalSprintResult } from "@/lib/scanners/final-sprint";

export const Route = createFileRoute("/scan/final-sprint-scanner")({
	component: FinalSprintScanner,
});

function FinalSprintScanner() {
	const { t } = useTranslation();
	
	// Track which sector is currently being scanned
	const [activeScan, setActiveScan] = useState<string | null>(null);
	
	// Individual sector scan hooks
	const bankingScan = useFinalSprintScan('banking', activeScan === 'banking');
	const securitiesScan = useFinalSprintScan('securities', activeScan === 'securities');
	const realEstateScan = useFinalSprintScan('realEstate', activeScan === 'realEstate');

	const handleSectorScan = async (sector: string) => {
		setActiveScan(sector);
	};

	const getRiskBadgeColor = (risk: string) => {
		switch (risk) {
			case 'high': return 'bg-red-100 text-red-800';
			case 'medium': return 'bg-yellow-100 text-yellow-800';
			case 'low': return 'bg-green-100 text-green-800';
			default: return 'bg-gray-100 text-gray-800';
		}
	};

	const sectors = [
		{
			id: 'banking',
			title: t("scan.sectors.banking"),
			description: t("scan.finalSprintScanner.bankingDescription"),
			icon: Building2,
			color: 'bg-blue-50 border-blue-200',
			iconColor: 'text-blue-600',
			tickers: ['VCB', 'BID', 'TCB', 'CTG', 'VPB', 'ACB', 'MBB', 'SHB', 'TPB'],
			scanState: bankingScan,
			onScan: () => handleSectorScan('banking'),
		},
		{
			id: 'securities',
			title: t("scan.sectors.securities"),
			description: t("scan.finalSprintScanner.securitiesDescription"),
			icon: Briefcase,
			color: 'bg-green-50 border-green-200',
			iconColor: 'text-green-600',
			tickers: ['SSI', 'VCI', 'HCM', 'MBS', 'SHS', 'VND', 'CTS', 'BSI'],
			scanState: securitiesScan,
			onScan: () => handleSectorScan('securities'),
		},
		{
			id: 'realEstate',
			title: t("scan.sectors.realEstate"),
			description: t("scan.finalSprintScanner.realEstateDescription"),
			icon: Home,
			color: 'bg-purple-50 border-purple-200',
			iconColor: 'text-purple-600',
			tickers: ['VIC', 'VHM', 'VRE', 'KDH', 'NVL', 'DIG', 'KBC', 'PDR'],
			scanState: realEstateScan,
			onScan: () => handleSectorScan('realEstate'),
		},
	];

	return (
		<div className="container mx-auto p-2 md:p-6">
			<div className="space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<Button variant="ghost" size="sm" asChild>
							<Link to="/scan">
								<ArrowLeft className="h-4 w-4 mr-2" />
								{t("common.back")}
							</Link>
						</Button>
					</div>
					
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<TrendingUp className="h-6 w-6" />
							<h1 className="text-2xl font-bold">{t("scan.finalSprintScanner.title")}</h1>
						</div>
						<p className="text-muted-foreground">
							{t("scan.finalSprintScanner.description")}
						</p>
					</div>

					{/* Scanner Info */}
					<Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
						<CardContent className="p-3 md:p-6">
							<div className="space-y-3">
								<h3 className="font-semibold">{t("scan.finalSprintScanner.detectionCriteria")}</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
									<div className="flex items-center space-x-2">
										<Target className="h-4 w-4 text-green-600" />
										<span>{t("scan.finalSprintScanner.criteria.dailyGains")}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Target className="h-4 w-4 text-green-600" />
										<span>{t("scan.finalSprintScanner.criteria.consecutiveDays")}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Target className="h-4 w-4 text-green-600" />
										<span>{t("scan.finalSprintScanner.criteria.volumeSurge")}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Target className="h-4 w-4 text-green-600" />
										<span>{t("scan.finalSprintScanner.criteria.momentum")}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Sector Scanners */}
				<div className="space-y-6">
					{sectors.map((sector) => {
						const Icon = sector.icon;
						return (
							<Card key={sector.id} className={`${sector.color}`}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-3">
											<div className="p-2 bg-white rounded-lg">
												<Icon className={`h-6 w-6 ${sector.iconColor}`} />
											</div>
											<div>
												<CardTitle className="text-xl">{sector.title}</CardTitle>
												<CardDescription>{sector.description}</CardDescription>
											</div>
										</div>
										<Button
											onClick={sector.onScan}
											disabled={sector.scanState.isLoading}
											className="min-w-[120px]"
										>
											{sector.scanState.isLoading ? (
												<div className="flex items-center space-x-2">
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
													<span>{t("scan.scanning")}</span>
												</div>
											) : (
												<div className="flex items-center space-x-2">
													<Play className="h-4 w-4" />
													<span>{t("scan.scanSector")}</span>
												</div>
											)}
										</Button>
									</div>
								</CardHeader>
								
								<CardContent className="p-3 md:p-6 space-y-4">
									{/* Ticker List */}
									<div>
										<h4 className="font-medium mb-2">{t("scan.targetTickers")}</h4>
										<div className="flex flex-wrap gap-2">
											{sector.tickers.map((ticker) => (
												<Badge key={ticker} variant="secondary" className="text-xs">
													{ticker}
												</Badge>
											))}
										</div>
									</div>

									{/* Results */}
									{sector.scanState.data && sector.scanState.data.length > 0 && (
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<h4 className="font-medium">{t("scan.sprintCandidates")}</h4>
												<span className="text-xs text-muted-foreground">
													{t("scan.lastScanned")}: {new Date().toLocaleTimeString()}
												</span>
											</div>
											
											<div className="space-y-2">
												{sector.scanState.data.map((result: FinalSprintResult) => (
													<div key={result.ticker} className="bg-white rounded-lg p-3 border">
														<div className="flex items-center justify-between">
															<div className="space-y-1">
																<div className="flex items-center space-x-2">
																	<span className="font-semibold">{result.ticker}</span>
																	<Badge className={getRiskBadgeColor(result.riskLevel)}>
																		{t(`scan.riskLevel.${result.riskLevel}`)}
																	</Badge>
																</div>
																<p className="text-sm text-muted-foreground">{result.name}</p>
															</div>
															<div className="text-right space-y-1">
																<div className="text-lg font-bold text-green-600">
																	+{result.dailyGain.toFixed(1)}%
																</div>
																<div className="text-xs text-muted-foreground">
																	{t("scan.momentumScore")}: {result.momentumScore}
																</div>
															</div>
														</div>
														
														<div className="mt-2 grid grid-cols-2 gap-4 text-xs">
															<div>
																<span className="text-muted-foreground">{t("scan.consecutiveDays")}: </span>
																<span className="font-medium">{result.consecutiveDays}</span>
															</div>
															<div>
																<span className="text-muted-foreground">{t("scan.volumeRatio")}: </span>
																<span className="font-medium">{result.volumeRatio.toFixed(1)}x</span>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Error Message */}
									{sector.scanState.error && (
										<div className="text-center py-4 text-red-600">
											<p>{t("scan.errorScanning")}: {sector.scanState.error.message}</p>
										</div>
									)}

									{/* No Results Message */}
									{!sector.scanState.isLoading && 
									 !sector.scanState.error && 
									 sector.scanState.data && 
									 sector.scanState.data.length === 0 && (
										<div className="text-center py-4 text-muted-foreground">
											<p>{t("scan.noSprintCandidates")}</p>
										</div>
									)}
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</div>
	);
}