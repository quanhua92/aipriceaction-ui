import { useState, useMemo, useEffect } from "react";
import { Brain, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface AskAIDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultTicker?: string;
	defaultTab?: "single" | "multi";
}

interface CopyState {
	[templateId: string]: boolean;
}

export function AskAIDialog({
	open,
	onOpenChange,
	defaultTicker = "",
	defaultTab = "single"
}: AskAIDialogProps) {
	const { t, language } = useTranslation();
	const [activeTab, setActiveTab] = useState(defaultTab);
	
	// Initialize selectedTickers with VNINDEX and defaultTicker when dialog opens
	const [selectedTickers, setSelectedTickers] = useState<string[]>(() => {
		const initialTickers: string[] = [];
		if (defaultTicker && defaultTicker !== "VNINDEX") {
			initialTickers.push(defaultTicker);
		}
		initialTickers.push("VNINDEX");
		return initialTickers;
	});
	
	const [copyStates, setCopyStates] = useState<CopyState>({});

	// Reset selectedTickers when dialog opens or defaultTicker changes
	useEffect(() => {
		if (open) {
			const initialTickers: string[] = [];
			if (defaultTicker && defaultTicker !== "VNINDEX") {
				initialTickers.push(defaultTicker);
			}
			initialTickers.push("VNINDEX");
			setSelectedTickers(initialTickers);
		}
	}, [open, defaultTicker]);

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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-none w-[95vw] max-h-none h-[95vh] flex flex-col" style={{ maxWidth: '95vw', width: '95vw', maxHeight: '95vh', height: '95vh' }}>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Brain className="h-5 w-5 text-green-600" />
						{t("askAI.title")}
					</DialogTitle>
				</DialogHeader>

				<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "single" | "multi")} className="flex-1 flex flex-col">
					<TabsList className="grid w-full grid-cols-2 mb-4">
						<TabsTrigger value="single" className="flex items-center gap-2 data-[state=active]:text-green-600">
							<Brain className="h-4 w-4" />
							{t("askAI.singleTicker")}
						</TabsTrigger>
						<TabsTrigger value="multi" className="flex items-center gap-2 data-[state=active]:text-green-600">
							<Brain className="h-4 w-4" />
							{t("askAI.multipleTickers")}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="single" className="flex-1 flex flex-col mt-0">
						<Card className="mb-4">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm flex items-center gap-2">
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

						<ScrollArea className="flex-1">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
								{singleTemplates.map(template => renderTemplateCard(template, singleTickerContext))}
							</div>
						</ScrollArea>
					</TabsContent>

					<TabsContent value="multi" className="flex-1 flex flex-col mt-0">
						<Card className="mb-4">
							<CardHeader className="pb-3">
								<CardTitle className="text-sm">
									{t("askAI.selectTickers")}
									{selectedTickers.length > 0 && (
										<Badge variant="secondary" className="ml-2">
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
									className="w-full"
								/>
								{selectedTickers.length > 0 && (
									<div className="mt-3">
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

						<ScrollArea className="flex-1">
							{selectedTickers.length === 0 ? (
								<div className="flex items-center justify-center h-64">
									<div className="text-center space-y-3">
										<Brain className="h-12 w-12 text-green-600 mx-auto" />
										<div>
											<p className="font-medium text-foreground">
												{t("askAI.noTickersSelected")}
											</p>
											<p className="text-sm text-muted-foreground">
												{t("askAI.useSearchAbove")}
											</p>
										</div>
									</div>
								</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
									{multiTemplates.map(template => renderTemplateCard(template, multipleTickersContext))}
								</div>
							)}
						</ScrollArea>
					</TabsContent>
				</Tabs>

				<div className="border-t pt-4 mt-4">
					<p className="text-xs text-muted-foreground text-center">
						{t("askAI.howToUse")}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}