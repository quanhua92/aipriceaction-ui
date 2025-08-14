import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	BookOpen, 
	ChevronDown, 
	ChevronUp, 
	TrendingUp, 
	Shield, 
	Target, 
	PieChart, 
	BarChart3,
	Lightbulb
} from "lucide-react";

interface GuideSection {
	icon: React.ReactNode;
	titleKey: string;
	descriptionKey: string;
	items: {
		titleKey: string;
		descriptionKey: string;
	}[];
}

export function EducationalGuide() {
	const { t } = useTranslation();
	const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
	const [showFullGuide, setShowFullGuide] = useState(false);

	const toggleSection = (sectionKey: string) => {
		const newExpanded = new Set(expandedSections);
		if (newExpanded.has(sectionKey)) {
			newExpanded.delete(sectionKey);
		} else {
			newExpanded.add(sectionKey);
		}
		setExpandedSections(newExpanded);
	};

	const guideSections: GuideSection[] = [
		{
			icon: <TrendingUp className="h-5 w-5" />,
			titleKey: "educationalGuide.performanceOverview.title",
			descriptionKey: "educationalGuide.performanceOverview.description",
			items: [
				{
					titleKey: "educationalGuide.performanceOverview.totalReturn.title",
					descriptionKey: "educationalGuide.performanceOverview.totalReturn.description",
				},
				{
					titleKey: "educationalGuide.performanceOverview.activeReturn.title",
					descriptionKey: "educationalGuide.performanceOverview.activeReturn.description",
				},
				{
					titleKey: "educationalGuide.performanceOverview.sharpeRatio.title",
					descriptionKey: "educationalGuide.performanceOverview.sharpeRatio.description",
				},
			],
		},
		{
			icon: <Shield className="h-5 w-5" />,
			titleKey: "educationalGuide.riskAnalysis.title",
			descriptionKey: "educationalGuide.riskAnalysis.description",
			items: [
				{
					titleKey: "educationalGuide.riskAnalysis.volatility.title",
					descriptionKey: "educationalGuide.riskAnalysis.volatility.description",
				},
				{
					titleKey: "educationalGuide.riskAnalysis.beta.title",
					descriptionKey: "educationalGuide.riskAnalysis.beta.description",
				},
				{
					titleKey: "educationalGuide.riskAnalysis.maximumDrawdown.title",
					descriptionKey: "educationalGuide.riskAnalysis.maximumDrawdown.description",
				},
				{
					titleKey: "educationalGuide.riskAnalysis.valueAtRisk.title",
					descriptionKey: "educationalGuide.riskAnalysis.valueAtRisk.description",
				},
			],
		},
		{
			icon: <Target className="h-5 w-5" />,
			titleKey: "educationalGuide.performanceAttribution.title",
			descriptionKey: "educationalGuide.performanceAttribution.description",
			items: [
				{
					titleKey: "educationalGuide.performanceAttribution.contribution.title",
					descriptionKey: "educationalGuide.performanceAttribution.contribution.description",
				},
				{
					titleKey: "educationalGuide.performanceAttribution.topContributors.title",
					descriptionKey: "educationalGuide.performanceAttribution.topContributors.description",
				},
				{
					titleKey: "educationalGuide.performanceAttribution.worstPerformers.title",
					descriptionKey: "educationalGuide.performanceAttribution.worstPerformers.description",
				},
			],
		},
		{
			icon: <PieChart className="h-5 w-5" />,
			titleKey: "educationalGuide.diversificationAnalysis.title",
			descriptionKey: "educationalGuide.diversificationAnalysis.description",
			items: [
				{
					titleKey: "educationalGuide.diversificationAnalysis.correlation.title",
					descriptionKey: "educationalGuide.diversificationAnalysis.correlation.description",
				},
				{
					titleKey: "educationalGuide.diversificationAnalysis.recommendations.title",
					descriptionKey: "educationalGuide.diversificationAnalysis.recommendations.description",
				},
				{
					titleKey: "educationalGuide.diversificationAnalysis.sectorDistribution.title",
					descriptionKey: "educationalGuide.diversificationAnalysis.sectorDistribution.description",
				},
			],
		},
		{
			icon: <BarChart3 className="h-5 w-5" />,
			titleKey: "educationalGuide.keyMetrics.title",
			descriptionKey: "",
			items: [
				{
					titleKey: "educationalGuide.keyMetrics.informationRatio.title",
					descriptionKey: "educationalGuide.keyMetrics.informationRatio.description",
				},
				{
					titleKey: "educationalGuide.keyMetrics.trackingError.title",
					descriptionKey: "educationalGuide.keyMetrics.trackingError.description",
				},
				{
					titleKey: "educationalGuide.keyMetrics.correlation.title",
					descriptionKey: "educationalGuide.keyMetrics.correlation.description",
				},
			],
		},
	];

	const investmentTips = [
		"educationalGuide.tips.diversification",
		"educationalGuide.tips.riskManagement",
		"educationalGuide.tips.benchmarking",
		"educationalGuide.tips.rebalancing",
		"educationalGuide.tips.longTerm",
	];

	if (!showFullGuide) {
		return (
			<Card className="mt-8">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-6 w-6" />
						{t("educationalGuide.title")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center space-y-4">
						<p className="text-muted-foreground">
							{t("educationalGuide.subtitle")}
						</p>
						<Button onClick={() => setShowFullGuide(true)} variant="outline">
							<BookOpen className="h-4 w-4 mr-2" />
							View Educational Guide
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mt-8">
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-6 w-6" />
						{t("educationalGuide.title")}
					</CardTitle>
					<Button
						onClick={() => setShowFullGuide(false)}
						variant="ghost"
						size="sm"
					>
						<ChevronUp className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-muted-foreground text-sm">
					{t("educationalGuide.subtitle")}
				</p>
			</CardHeader>
			<CardContent className="p-3 md:p-6 space-y-6">
				{/* Guide Sections */}
				<div className="space-y-4">
					{guideSections.map((section, sectionIndex) => (
						<div key={`section-${sectionIndex}`} className="border rounded-lg p-4">
							<button
								type="button"
								onClick={() => toggleSection(sectionIndex.toString())}
								className="flex items-center justify-between w-full text-left"
							>
								<div className="flex items-center gap-2">
									{section.icon}
									<h3 className="text-lg font-semibold">
										{t(section.titleKey)}
									</h3>
								</div>
								{expandedSections.has(sectionIndex.toString()) ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</button>

							{section.descriptionKey && (
								<p className="text-sm text-muted-foreground mt-2">
									{t(section.descriptionKey)}
								</p>
							)}

							{expandedSections.has(sectionIndex.toString()) && (
								<div className="mt-4 space-y-3">
									{section.items.map((item, itemIndex) => (
										<div
											key={`item-${sectionIndex}-${itemIndex}`}
											className="bg-muted/50 rounded-md p-3"
										>
											<h4 className="font-medium text-sm">
												{t(item.titleKey)}
											</h4>
											<p className="text-xs text-muted-foreground mt-1">
												{t(item.descriptionKey)}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>

				{/* Investment Tips */}
				<div className="border-t pt-6">
					<div className="flex items-center gap-2 mb-4">
						<Lightbulb className="h-5 w-5 text-yellow-500" />
						<h3 className="text-lg font-semibold">{t("educationalGuide.tips.title")}</h3>
					</div>
					<div className="grid gap-3">
						{investmentTips.map((tipKey, index) => (
							<div key={`tip-${index}`} className="flex items-start gap-3">
								<Badge variant="outline" className="min-w-fit">
									{index + 1}
								</Badge>
								<p className="text-sm text-muted-foreground">
									{t(tipKey)}
								</p>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}