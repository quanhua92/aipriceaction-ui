import { useState, useMemo, useEffect } from "react";
import { createFileRoute, useSearch, Link, useNavigate } from "@tanstack/react-router";
import { Brain, Copy, Check, Settings, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiTickerSearch, TickerSearch } from "@/components/ui/TickerSearch";
import { DateInput } from "@/components/ui/date-input";
import { useTranslation } from "@/hooks/useTranslation";
import { useTickerData, useMultipleTickerData, useTickerAIData, useTickerGroups } from "@/lib/queries";
import { useVPAData } from "@/hooks/useVPAData";
import { findTickerSector, getTickersBySector } from "@/lib/stock-data";
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
	tickers?: string[];
	tab?: "single" | "multi";
}

export const Route = createFileRoute("/ask")({
	component: AskPage,
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			ticker: search.ticker as string,
			tickers: Array.isArray(search.tickers) ? (search.tickers as string[]) : [],
			tab: (search.tab as "single" | "multi") || "single"
		};
	}
});

interface CopyState {
	[templateId: string]: boolean;
}

function AskPage() {
	const { t, language } = useTranslation();
	const navigate = useNavigate({ from: Route.fullPath });
	const { ticker: urlTicker, tickers: urlTickers = [], tab: defaultTab } = useSearch({ from: "/ask" });
	const defaultTicker = urlTicker || "VNINDEX";
	const [activeTab, setActiveTab] = useState(defaultTab);
	
	// Initialize selectedTickers from URL tickers or with defaults
	const [selectedTickers, setSelectedTickers] = useState<string[]>(() => {
		// If tickers from URL, use those
		if (urlTickers.length > 0) {
			return urlTickers;
		}
		// Otherwise use default logic
		const initialTickers: string[] = [];
		if (defaultTicker !== "VNINDEX") {
			initialTickers.push(defaultTicker);
		}
		initialTickers.push("VNINDEX");
		return initialTickers;
	});
	
	const [copyStates, setCopyStates] = useState<CopyState>({});
	
	// Ticker groups for same-sector suggestions
	const { data: tickerGroups } = useTickerGroups();
	
	// Configuration states
	const [showConfig, setShowConfig] = useState(false);
	const [chartContextDays, setChartContextDays] = useState(() => {
		const saved = localStorage.getItem('askAI.chartContextDays');
		return saved ? parseInt(saved, 10) : 10;
	});
	const [vpaContextDays, setVpaContextDays] = useState(() => {
		const saved = localStorage.getItem('askAI.vpaContextDays');
		return saved ? parseInt(saved, 10) : 5;
	});
	
	// Company context configuration states
	const [includeBasicInfo, setIncludeBasicInfo] = useState(() => {
		const saved = localStorage.getItem('askAI.includeBasicInfo');
		return saved ? JSON.parse(saved) : true;
	});
	const [includeFinancialRatios, setIncludeFinancialRatios] = useState(() => {
		const saved = localStorage.getItem('askAI.includeFinancialRatios');
		return saved ? JSON.parse(saved) : true;
	});
	const [includeDescription, setIncludeDescription] = useState(() => {
		const saved = localStorage.getItem('askAI.includeDescription');
		return saved ? JSON.parse(saved) : true;
	});
	const [contextDate, setContextDate] = useState(() => {
		const saved = localStorage.getItem('askAI.contextDate');
		return saved || '';
	});

	// Save settings to localStorage when changed
	useEffect(() => {
		localStorage.setItem('askAI.chartContextDays', chartContextDays.toString());
	}, [chartContextDays]);

	useEffect(() => {
		localStorage.setItem('askAI.vpaContextDays', vpaContextDays.toString());
	}, [vpaContextDays]);

	useEffect(() => {
		localStorage.setItem('askAI.includeBasicInfo', JSON.stringify(includeBasicInfo));
	}, [includeBasicInfo]);

	useEffect(() => {
		localStorage.setItem('askAI.includeFinancialRatios', JSON.stringify(includeFinancialRatios));
	}, [includeFinancialRatios]);

	useEffect(() => {
		localStorage.setItem('askAI.includeDescription', JSON.stringify(includeDescription));
	}, [includeDescription]);

	useEffect(() => {
		localStorage.setItem('askAI.contextDate', contextDate);
	}, [contextDate]);

	// Update search params function
	const updateSearchParams = (updates: Partial<SearchParams>) => {
		navigate({
			search: (prev) => ({ ...prev, ...updates }),
		});
	};

	// Reset selectedTickers and activeTab when URL params change
	useEffect(() => {
		// Set active tab from URL parameter
		setActiveTab(defaultTab);
		
		// If tickers from URL, use those
		if (urlTickers.length > 0) {
			setSelectedTickers(urlTickers);
		} else {
			// Otherwise use default logic
			const initialTickers: string[] = [];
			if (defaultTicker !== "VNINDEX") {
				initialTickers.push(defaultTicker);
			}
			initialTickers.push("VNINDEX");
			setSelectedTickers(initialTickers);
		}
	}, [urlTickers, defaultTicker, defaultTab]);

	// Get templates based on language
	const singleTemplates = useMemo(() => {
		return language === "vn" ? singleTickerTemplatesVN : singleTickerTemplatesEN;
	}, [language]);

	const multiTemplates = useMemo(() => {
		return language === "vn" ? multipleTickerTemplatesVN : multipleTickerTemplatesEN;
	}, [language]);

	// Data fetching for single ticker - use ALL data for context date filtering
	const dateRangeConfig = useMemo(() => createDateRangeConfig("ALL"), []);
	const { data: singleTickerData } = useTickerData(defaultTicker, dateRangeConfig, 10000); // Increased for full historical data
	const { data: singleVPAData } = useVPAData(defaultTicker, !!defaultTicker);
	const { data: singleTickerAIData } = useTickerAIData(defaultTicker);

	// Data fetching for multiple tickers (only when on multi tab)
	const multiTickersForFetch = activeTab === "multi" ? selectedTickers : [];
	const { data: multipleTickerData } = useMultipleTickerData(multiTickersForFetch, dateRangeConfig, 10000); // Increased for full historical data
	
	// VPA data for multi tab (fixed number of hooks to avoid violations)
	const vpaQueries = [
		useVPAData(activeTab === "multi" && selectedTickers[0] ? selectedTickers[0] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[1] ? selectedTickers[1] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[2] ? selectedTickers[2] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[3] ? selectedTickers[3] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[4] ? selectedTickers[4] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[5] ? selectedTickers[5] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[6] ? selectedTickers[6] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[7] ? selectedTickers[7] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[8] ? selectedTickers[8] : ''),
		useVPAData(activeTab === "multi" && selectedTickers[9] ? selectedTickers[9] : ''),
	];

	// Ticker AI data for multi tab (fixed number of hooks to avoid violations)
	const tickerAIQueries = [
		useTickerAIData(activeTab === "multi" && selectedTickers[0] ? selectedTickers[0] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[1] ? selectedTickers[1] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[2] ? selectedTickers[2] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[3] ? selectedTickers[3] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[4] ? selectedTickers[4] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[5] ? selectedTickers[5] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[6] ? selectedTickers[6] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[7] ? selectedTickers[7] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[8] ? selectedTickers[8] : ''),
		useTickerAIData(activeTab === "multi" && selectedTickers[9] ? selectedTickers[9] : ''),
	];

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


	// Reset configuration to defaults
	const handleResetConfiguration = () => {
		setChartContextDays(10);
		setVpaContextDays(5);
		setIncludeBasicInfo(true);
		setIncludeFinancialRatios(true);
		setIncludeDescription(true);
		setContextDate('');
		
		// Clear localStorage
		localStorage.removeItem('askAI.chartContextDays');
		localStorage.removeItem('askAI.vpaContextDays');
		localStorage.removeItem('askAI.includeBasicInfo');
		localStorage.removeItem('askAI.includeFinancialRatios');
		localStorage.removeItem('askAI.includeDescription');
		localStorage.removeItem('askAI.contextDate');
	};

	// Get same-sector tickers for quick actions
	const getSameSectorTickers = (ticker: string): string[] => {
		if (!tickerGroups || !ticker) return [];
		
		const sector = findTickerSector(tickerGroups, ticker);
		if (!sector) return [];
		
		const sectorTickers = getTickersBySector(tickerGroups, sector);
		// Return other tickers in the same sector (excluding the current ticker), limit to 4
		return sectorTickers.filter(t => t !== ticker).slice(0, 4);
	};

	// Build contexts
	const singleTickerContext = useMemo(() => {
		if (!defaultTicker || !singleTickerData || !Array.isArray(singleTickerData) || singleTickerData.length === 0) {
			return "";
		}
		return buildSingleTickerContext(
			defaultTicker, 
			singleTickerData, 
			singleVPAData?.content,
			singleTickerAIData,
			chartContextDays,
			vpaContextDays,
			includeBasicInfo,
			includeFinancialRatios,
			includeDescription,
			contextDate || undefined
		);
	}, [defaultTicker, singleTickerData, singleVPAData, singleTickerAIData, chartContextDays, vpaContextDays, includeBasicInfo, includeFinancialRatios, includeDescription, contextDate]);

	const multipleTickersContext = useMemo(() => {
		if (activeTab !== "multi" || selectedTickers.length === 0 || !multipleTickerData) return "";
		
		const tickersData = selectedTickers.map((ticker, index) => ({
			ticker,
			chartData: multipleTickerData[ticker] || [],
			vpaContent: vpaQueries[index]?.data?.content,
			tickerAIData: tickerAIQueries[index]?.data
		}));

		return buildMultipleTickersContext(tickersData, chartContextDays, vpaContextDays, includeBasicInfo, includeFinancialRatios, includeDescription, contextDate || undefined);
	}, [activeTab, selectedTickers, multipleTickerData, vpaQueries, tickerAIQueries, chartContextDays, vpaContextDays, includeBasicInfo, includeFinancialRatios, includeDescription, contextDate]);

	// Handle single ticker change
	const handleSingleTickerChange = (newTicker: string) => {
		// Force tab=single and update ticker param
		updateSearchParams({ ticker: newTicker, tab: "single" });
	};

	// Handle tickers change for multi tab
	const handleTickersChange = (newTickers: string[]) => {
		setSelectedTickers(newTickers);
		// Force tab=multi to ensure we stay on multi tab after navigation
		updateSearchParams({ tickers: newTickers, tab: "multi" });
	};

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
			<div className="flex items-center gap-2 mb-6">
				<Brain className="h-6 w-6 text-green-600" />
				<h1 className="text-2xl font-bold">{t("askAI.title")}</h1>
			</div>

			{/* Instructions */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
				<p className="text-sm text-blue-800">
					{t("askAI.instructions")}
				</p>
			</div>

			{/* Context Date Warning */}
			{contextDate && (
				<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
					<p className="text-sm text-amber-800">
						{t("askAI.contextDateWarning", { date: contextDate })}
					</p>
				</div>
			)}

			{/* Configuration Section */}
			<div className="mb-6">
				<div className="flex justify-end">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setShowConfig(!showConfig)}
						className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
					>
						<Settings className="h-4 w-4" />
						{t("askAI.configuration")}
						{showConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
					</Button>
				</div>
				
				{showConfig && (
					<Card className="mt-4 w-full">
						<CardHeader className="pb-4">
							<div className="flex items-center justify-between">
								<CardTitle className="text-lg flex items-center gap-2">
									<Settings className="h-5 w-5" />
									{t("askAI.contextConfiguration")}
								</CardTitle>
								<Button
									variant="outline"
									size="sm"
									onClick={handleResetConfiguration}
									className="flex items-center gap-2 text-sm"
								>
									<RotateCcw className="h-4 w-4" />
									{t("common.reset")}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{/* Chart Context Settings */}
								<div className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="chart-context-days" className="text-sm font-medium">
											{t("askAI.chartContextDays")}
										</Label>
										<Input
											id="chart-context-days"
											type="number"
											min="0"
											max="1000"
											value={chartContextDays}
											onChange={(e) => setChartContextDays(Math.max(0, Math.min(1000, parseInt(e.target.value) || 0)))}
											className="w-full"
											placeholder="10"
										/>
										<p className="text-xs text-muted-foreground">
											{t("askAI.chartContextDaysDesc")}
										</p>
									</div>
									
									<div className="space-y-2">
										<Label htmlFor="vpa-context-days" className="text-sm font-medium">
											{t("askAI.vpaContextDays")}
										</Label>
										<Input
											id="vpa-context-days"
											type="number"
											min="0"
											max="1000"
											value={vpaContextDays}
											onChange={(e) => setVpaContextDays(Math.max(0, Math.min(1000, parseInt(e.target.value) || 0)))}
											className="w-full"
											placeholder="5"
										/>
										<p className="text-xs text-muted-foreground">
											{t("askAI.vpaContextDaysDesc")}
										</p>
									</div>
									
									<div className="space-y-2">
										<Label htmlFor="context-date" className="text-sm font-medium">
											{t("askAI.contextDate")}
											<span className="text-xs text-muted-foreground font-normal ml-2">
												(YYYY-MM-DD)
											</span>
										</Label>
										<DateInput
											id="context-date"
											value={contextDate}
											onChange={setContextDate}
											helpText={t("askAI.contextDateDesc")}
											className="w-full"
										/>
									</div>
								</div>
								
								{/* Company Context Settings */}
								<div className="md:col-span-2 lg:col-span-2 space-y-4">
									<div className="space-y-3">
										<Label className="text-sm font-medium">
											{t("askAI.companyContextConfig")}
										</Label>
										
										<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
											<div className="flex items-start space-x-3">
												<Checkbox
													id="include-basic-info"
													checked={includeBasicInfo}
													onCheckedChange={setIncludeBasicInfo}
													className="mt-0.5"
												/>
												<div className="flex-1">
													<Label htmlFor="include-basic-info" className="text-sm font-medium cursor-pointer">
														{t("askAI.includeBasicInfo")}
													</Label>
													<p className="text-xs text-muted-foreground">
														{t("askAI.includeBasicInfoDesc")}
													</p>
												</div>
											</div>
											
											<div className="flex items-start space-x-3">
												<Checkbox
													id="include-financial-ratios"
													checked={includeFinancialRatios}
													onCheckedChange={setIncludeFinancialRatios}
													className="mt-0.5"
												/>
												<div className="flex-1">
													<Label htmlFor="include-financial-ratios" className="text-sm font-medium cursor-pointer">
														{t("askAI.includeFinancialRatios")}
													</Label>
													<p className="text-xs text-muted-foreground">
														{t("askAI.includeFinancialRatiosDesc")}
													</p>
												</div>
											</div>
											
											<div className="flex items-start space-x-3 lg:col-span-2">
												<Checkbox
													id="include-description"
													checked={includeDescription}
													onCheckedChange={setIncludeDescription}
													className="mt-0.5"
												/>
												<div className="flex-1">
													<Label htmlFor="include-description" className="text-sm font-medium cursor-pointer">
														{t("askAI.includeDescription")}
													</Label>
													<p className="text-xs text-muted-foreground">
														{t("askAI.includeDescriptionDesc")}
													</p>
												</div>
											</div>
										</div>
									</div>
									
									<div className="pt-2 text-xs text-muted-foreground">
										<p>{t("askAI.settingsAutoSaved")}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
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
						<CardContent className="space-y-4">
							{/* Ticker Search */}
							<div>
								<label className="text-sm font-medium mb-2 block">
									{t("askAI.singleTicker")}
								</label>
								<TickerSearch
									value={defaultTicker || ""}
									onSelect={handleSingleTickerChange}
									placeholder={t("askAI.searchTickersPlaceholder")}
									className="w-full"
								/>
							</div>

							{/* Data Status */}
							{!singleTickerContext ? (
								<p className="text-sm text-muted-foreground">
									{defaultTicker ? t("askAI.loadingData") : t("askAI.noTickerSelected")}
								</p>
							) : (
								<div className="space-y-2">
									<p className="text-sm text-green-600">
										{t("askAI.dataReady")} ({singleTickerData?.length ?? 0} {t("askAI.dataPoints")})
									</p>
									
									{/* Quick Change - Same Sector Tickers */}
									{defaultTicker && getSameSectorTickers(defaultTicker).length > 0 && (
										<div className="flex items-center gap-2 flex-wrap">
											<span className="text-xs text-muted-foreground">{t("askAI.quickChange")}</span>
											{getSameSectorTickers(defaultTicker).map((ticker) => (
												<Button
													key={ticker}
													variant="outline"
													size="sm"
													onClick={() => handleSingleTickerChange(ticker)}
													className="h-6 px-2 text-xs"
												>
													{ticker}
												</Button>
											))}
										</div>
									)}
									
									{defaultTicker && (
										<div className="flex items-center gap-2">
											<span className="text-xs text-muted-foreground">{t("askAI.quickAccess")}</span>
											<Link to="/ticker/$symbol" params={{ symbol: defaultTicker }}>
												<Button variant="outline" size="sm" className="h-6 px-2 text-xs">
													{defaultTicker}
												</Button>
											</Link>
										</div>
									)}
								</div>
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
								onTickersChange={handleTickersChange}
								placeholder={t("askAI.searchTickersPlaceholder")}
								className="w-full mb-4"
								persistOpenState={true}
							/>
							{selectedTickers.length > 0 && (
								<div className="space-y-3">
									{multipleTickersContext ? (
										<div className="space-y-2">
											<p className="text-sm text-green-600">
												{t("askAI.dataReady")} ({selectedTickers.length} {t("askAI.tickers")})
											</p>
											
											{/* Quick Add - Same Sector Tickers */}
											{(() => {
												const allSameSectorTickers = selectedTickers.flatMap(ticker => getSameSectorTickers(ticker));
												const uniqueSameSectorTickers = [...new Set(allSameSectorTickers)]
													.filter(ticker => !selectedTickers.includes(ticker))
													.slice(0, 6); // Limit to 6 suggestions
												
												return uniqueSameSectorTickers.length > 0 && (
													<div className="flex items-center gap-2 flex-wrap">
														<span className="text-xs text-muted-foreground">{t("askAI.quickAdd")}</span>
														{uniqueSameSectorTickers.map((ticker) => (
															<Button
																key={ticker}
																variant="outline"
																size="sm"
																onClick={() => handleTickersChange([...selectedTickers, ticker])}
																className="h-6 px-2 text-xs"
															>
																{ticker}
															</Button>
														))}
													</div>
												);
											})()}
											
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-xs text-muted-foreground">{t("askAI.quickAccess")}</span>
												{selectedTickers.map((ticker) => (
													<Link key={ticker} to="/ticker/$symbol" params={{ symbol: ticker }}>
														<Button variant="outline" size="sm" className="h-6 px-2 text-xs">
															{ticker}
														</Button>
													</Link>
												))}
											</div>
										</div>
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
