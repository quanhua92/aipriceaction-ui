import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { Brain, Copy, Check, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiTickerSearch } from "@/components/ui/TickerSearch";
import { useTranslation } from "@/hooks/useTranslation";
import { useTickerData, useMultipleTickerData } from "@/lib/queries";
import { useVPAData } from "@/hooks/useVPAData";
import { 
	buildSingleTickerContext, 
	buildMultipleTickersContext, 
	generatePrompt, 
	copyToClipboard,
	type AskAITemplate 
} from "@/lib/ask-ai-utils";
import { createDateRangeConfig } from "@/lib/stock-data";
import { singleTickerTemplatesEN } from "@/data/ask-ai-templates-single.en";
import { singleTickerTemplatesVN } from "@/data/ask-ai-templates-single.vn";
import { multipleTickerTemplatesEN } from "@/data/ask-ai-templates-multi.en";
import { multipleTickerTemplatesVN } from "@/data/ask-ai-templates-multi.vn";

interface SearchParams {
	ticker?: string;
	tab?: "single" | "multi";
}

export const Route = createFileRoute("/ask")({
	component: AskPage,
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			ticker: search.ticker as string,
			tab: (search.tab as "single" | "multi") || "single"
		};
	}
});

interface CopyState {
	[templateId: string]: boolean;
}

function AskPage() {
	const { t, language } = useTranslation();
	const { ticker: defaultTicker = "", tab: defaultTab } = useSearch({ from: "/ask" });
	const [activeTab, setActiveTab] = useState(defaultTab);
	
	// Initialize selectedTickers with VNINDEX and defaultTicker when page loads
	const [selectedTickers, setSelectedTickers] = useState<string[]>(() => {
		const initialTickers: string[] = [];
		if (defaultTicker && defaultTicker !== "VNINDEX") {
			initialTickers.push(defaultTicker);
		}
		initialTickers.push("VNINDEX");
		return initialTickers;
	});
	
	const [copyStates, setCopyStates] = useState<CopyState>({});

	// Reset selectedTickers when defaultTicker changes
	useEffect(() => {
		const initialTickers: string[] = [];
		if (defaultTicker && defaultTicker !== "VNINDEX") {
			initialTickers.push(defaultTicker);
		}
		initialTickers.push("VNINDEX");
		setSelectedTickers(initialTickers);
	}, [defaultTicker]);

	// Get templates based on language
	const singleTemplates = useMemo(() => {
		return language === "vn" ? singleTickerTemplatesVN : singleTickerTemplatesEN;
	}, [language]);

	const multiTemplates = useMemo(() => {
		return language === "vn" ? multipleTickerTemplatesVN : multipleTickerTemplatesEN;
	}, [language]);

	// Data fetching for single ticker
	const dateRangeConfig = useMemo(() => createDateRangeConfig("3M"), []);
	const { data: singleTickerData } = useTickerData(defaultTicker, dateRangeConfig);
	const { data: singleVPAData } = useVPAData(defaultTicker, !!defaultTicker);

	// Data fetching for multiple tickers
	const { data: multipleTickerData } = useMultipleTickerData(selectedTickers, dateRangeConfig);
	const vpaQueries = selectedTickers.map(ticker => useVPAData(ticker));

	// Handle copy with visual feedback
	const handleCopy = async (template: AskAITemplate, context: string) => {
		const prompt = generatePrompt(template.prompt, context);
		const success = await copyToClipboard(prompt);
		
		if (success) {
			setCopyStates(prev => ({ ...prev, [template.id]: true }));
			// Reset the copy state after 2 seconds
			setTimeout(() => {
				setCopyStates(prev => ({ ...prev, [template.id]: false }));
			}, 2000);
		}
	};

	// Build contexts
	const singleTickerContext = useMemo(() => {
		if (!defaultTicker || !singleTickerData) return "";
		return buildSingleTickerContext(
			defaultTicker, 
			singleTickerData, 
			singleVPAData?.content
		);
	}, [defaultTicker, singleTickerData, singleVPAData]);

	const multipleTickersContext = useMemo(() => {
		if (selectedTickers.length === 0 || !multipleTickerData) return "";
		
		const tickersData = selectedTickers.map((ticker, index) => ({
			ticker,
			chartData: multipleTickerData[ticker] || [],
			vpaContent: vpaQueries[index]?.data?.content
		}));

		return buildMultipleTickersContext(tickersData);
	}, [selectedTickers, multipleTickerData, vpaQueries]);

	const renderTemplateCard = (template: AskAITemplate, context: string) => {
		const isCopied = copyStates[template.id];
		
		return (
			<Card key={template.id} className="hover:shadow-md transition-shadow">
				<CardContent className="p-4">
					<div className="flex items-start justify-between gap-3">
						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-sm mb-2 leading-tight">
								{template.title}
							</h4>
							<p className="text-xs text-muted-foreground line-clamp-2">
								{template.prompt.substring(0, 100)}...
							</p>
						</div>
						<Button
							size="sm"
							variant={isCopied ? "default" : "outline"}
							onClick={() => handleCopy(template, context)}
							disabled={!context}
							className={`flex-shrink-0 h-8 min-w-[60px] ${isCopied ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
						>
							{isCopied ? (
								<>
									<Check className="h-3 w-3 mr-1" />
									{t("askAI.copied")}
								</>
							) : (
								<>
									<Copy className="h-3 w-3 mr-1" />
									{t("askAI.copy")}
								</>
							)}
						</Button>
					</div>
					{isCopied && (
						<p className="text-xs text-green-600 mt-2 font-medium">
							{t("askAI.promptCopiedMessage")}
						</p>
					)}
				</CardContent>
			</Card>
		);
	};

	return (
		<div className="container mx-auto p-4 max-w-7xl">
			{/* Header */}
			<div className="flex items-center gap-4 mb-6">
				<Link to="/">
					<Button variant="ghost" size="sm">
						<ArrowLeft className="h-4 w-4 mr-2" />
						{t("common.back")}
					</Button>
				</Link>
				<div className="flex items-center gap-2">
					<Brain className="h-6 w-6 text-green-600" />
					<h1 className="text-2xl font-bold">{t("askAI.title")}</h1>
				</div>
			</div>

			{/* Instructions */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<p className="text-sm text-blue-800">
					{t("askAI.instructions")}
				</p>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "single" | "multi")} className="w-full">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger value="single" className="flex items-center gap-2 data-[state=active]:text-green-600">
						<Brain className="h-4 w-4" />
						{t("askAI.singleTicker")}
					</TabsTrigger>
					<TabsTrigger value="multi" className="flex items-center gap-2 data-[state=active]:text-green-600">
						<Brain className="h-4 w-4" />
						{t("askAI.multipleTickers")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="single" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								{t("askAI.analyzingTicker")}
								{defaultTicker && (
									<Badge variant="secondary" className="font-mono">
										{defaultTicker}
									</Badge>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{!defaultTicker ? (
								<p className="text-sm text-muted-foreground">
									{t("askAI.noTickerSelected")}
								</p>
							) : !singleTickerContext ? (
								<p className="text-sm text-muted-foreground">
									{t("askAI.loadingData")}
								</p>
							) : (
								<p className="text-sm text-green-600">
									{t("askAI.dataReady")} ({singleTickerData?.length || 0} {t("askAI.dataPoints")})
								</p>
							)}
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{singleTemplates.map(template => renderTemplateCard(template, singleTickerContext))}
					</div>
				</TabsContent>

				<TabsContent value="multi" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								{t("askAI.selectTickers")}
								{selectedTickers.length > 0 && (
									<Badge variant="secondary">
										{selectedTickers.length} {t("askAI.selected")}
									</Badge>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<MultiTickerSearch
								selectedTickers={selectedTickers}
								onTickersChange={setSelectedTickers}
								placeholder={t("askAI.searchTickersPlaceholder")}
								className="w-full mb-4"
							/>
							{selectedTickers.length > 0 && (
								<div>
									{multipleTickersContext ? (
										<p className="text-sm text-green-600">
											{t("askAI.dataReady")} ({selectedTickers.length} {t("askAI.tickers")})
										</p>
									) : (
										<p className="text-sm text-muted-foreground">
											{t("askAI.loadingData")}
										</p>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{selectedTickers.length === 0 ? (
						<div className="flex items-center justify-center py-20">
							<div className="text-center space-y-3">
								<Brain className="h-16 w-16 text-green-600 mx-auto" />
								<div>
									<p className="text-xl font-medium text-foreground">
										{t("askAI.noTickersSelected")}
									</p>
									<p className="text-sm text-muted-foreground">
										{t("askAI.useSearchAbove")}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{multiTemplates.map(template => renderTemplateCard(template, multipleTickersContext))}
						</div>
					)}
				</TabsContent>
			</Tabs>

			{/* Footer */}
			<div className="border-t pt-6 mt-8">
				<p className="text-xs text-muted-foreground text-center">
					{t("askAI.howToUse")}
				</p>
			</div>
		</div>
	);
}