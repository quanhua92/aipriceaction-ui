import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, TrendingUp, Target, Grid3X3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export const Route = createFileRoute("/scan/")({
	component: ScanOverview,
});

function ScanOverview() {
	const { t } = useTranslation();

	const scanners = [
		{
			id: "final-sprint-scanner",
			title: t("scan.finalSprintScanner.title"),
			description: t("scan.finalSprintScanner.description"),
			icon: TrendingUp,
			sectors: [t("scan.sectors.banking"), t("scan.sectors.securities"), t("scan.sectors.realEstate")],
			features: [
				t("scan.finalSprintScanner.features.ceilingLimit"),
				t("scan.finalSprintScanner.features.volumeSurge"),
				t("scan.finalSprintScanner.features.momentum"),
			],
			route: "/scan/final-sprint-scanner",
		},
		{
			id: "historical-pattern-scanner",
			title: t("scan.historicalPatternScanner.title"),
			description: t("scan.historicalPatternScanner.description"),
			icon: Grid3X3,
			sectors: [t("scan.timePeriods"), t("scan.patternAnalysis"), t("scan.marketContext")],
			features: [
				t("scan.historicalPatternScanner.features.timeAnalysis"),
				t("scan.historicalPatternScanner.features.patternDetection"),
				t("scan.historicalPatternScanner.features.marketContext"),
			],
			route: "/scan/historical-pattern-scanner",
		},
	];

	return (
		<div className="container mx-auto p-2 md:p-6">
			<div className="space-y-6">
				{/* Header */}
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<Search className="h-6 w-6" />
						<h1 className="text-2xl font-bold">{t("scan.title")}</h1>
					</div>
					<p className="text-muted-foreground">
						{t("scan.subtitle")}
					</p>
				</div>

				{/* Scanners Grid */}
				<div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
					{scanners.map((scanner) => {
						const Icon = scanner.icon;
						return (
							<Card key={scanner.id} className="hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex items-start space-x-3">
										<div className="p-2 bg-primary/10 rounded-lg">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1">
											<CardTitle className="text-xl">{scanner.title}</CardTitle>
											<CardDescription className="mt-2">
												{scanner.description}
											</CardDescription>
										</div>
									</div>
								</CardHeader>
								<CardContent className="p-3 md:p-6 space-y-4">
									{/* Target Sectors */}
									<div>
										<h4 className="font-semibold mb-2">{t("scan.targetSectors")}</h4>
										<div className="flex flex-wrap gap-2">
											{scanner.sectors.map((sector) => (
												<span
													key={sector}
													className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
												>
													{sector}
												</span>
											))}
										</div>
									</div>

									{/* Key Features */}
									<div>
										<h4 className="font-semibold mb-2">{t("scan.keyFeatures")}</h4>
										<ul className="space-y-1">
											{scanner.features.map((feature, index) => (
												<li key={index} className="flex items-center space-x-2 text-sm">
													<Target className="h-3 w-3 text-green-600" />
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</div>

									{/* Action Button */}
									<div className="pt-2">
										<Button asChild className="w-full">
											<Link to={scanner.route}>
												{t("scan.startScanning")}
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Coming Soon */}
				<Card className="border-dashed">
					<CardContent className="p-4 md:p-6 text-center">
						<div className="space-y-2">
							<h3 className="font-semibold text-muted-foreground">
								{t("scan.moreScanners")}
							</h3>
							<p className="text-sm text-muted-foreground">
								{t("scan.moreScannersSoon")}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}