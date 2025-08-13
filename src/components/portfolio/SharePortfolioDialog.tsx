import { useState, useMemo } from "react";
import { Share2, Copy, Check, Eye, EyeOff } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import {
	type PortfolioItem,
	encodePortfolioItems,
	formatVND,
} from "@/lib/portfolio-utils";

interface SharePortfolioDialogProps {
	items: PortfolioItem[];
	deposit: number;
	currentUrl: string;
	manualDeposit?: boolean;
	tickerData?: Record<string, any[]>;
}

export function SharePortfolioDialog({
	items,
	deposit,
	currentUrl,
	manualDeposit = false,
	tickerData,
}: SharePortfolioDialogProps) {
	const { t } = useTranslation();
	const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(true);
	const [copied, setCopied] = useState(false);

	const shareableUrl = useMemo(() => {
		if (items.length === 0) return currentUrl;

		let shareItems = items;
		let shareDeposit = deposit;

		if (isPrivacyEnabled) {
			// Scale quantities to make deposit = 100M
			const targetDeposit = 100_000_000; // 100M VND
			
			// If deposit = 0, auto-calculate from current portfolio value
			const actualDeposit = deposit > 0 ? deposit : totalValue;
			const scaleFactor = actualDeposit > 0 ? targetDeposit / actualDeposit : 1;
			
			shareItems = items.map(item => ({
				...item,
				// Scale quantities only, keep original prices
				quantity: item.quantity * scaleFactor,
				price: item.price, // Keep original price
			}));
			
			shareDeposit = targetDeposit;
		}

		const encodedTickers = encodePortfolioItems(shareItems);
		const url = new URL(currentUrl, window.location.origin);
		
		// Clear existing params and set new ones
		url.search = '';
		url.searchParams.set('tickers', encodedTickers);
		if (shareDeposit > 0) {
			url.searchParams.set('deposit', shareDeposit.toString());
		}
		// Preserve manual deposit state
		if (manualDeposit) {
			url.searchParams.set('manualDeposit', 'true');
		}
		
		// Add share parameter when privacy scaling is applied
		if (isPrivacyEnabled) {
			url.searchParams.set('share', 'true');
		}

		return url.toString();
	}, [items, deposit, isPrivacyEnabled, manualDeposit, currentUrl]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(shareableUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	};

	const privacyTargetAmount = 100_000_000; // 100M VND
	
	// Helper function to get current market price for a ticker
	const getCurrentMarketPrice = (ticker: string): number => {
		if (!tickerData || !tickerData[ticker] || tickerData[ticker].length === 0) {
			return 0; // No market data available
		}
		const latestData = tickerData[ticker][tickerData[ticker].length - 1];
		return latestData.close || 0;
	};
	
	// Check if we have market data for all tickers
	const hasAllMarketData = items.every(item => {
		if (item.quantity === 0) return true; // Skip watch list items
		return getCurrentMarketPrice(item.ticker) > 0;
	});
	
	// Calculate total value using current market prices (like PortfolioSummaryCard)
	const totalValue = items.reduce((sum, item) => {
		if (item.quantity > 0) {
			const marketPrice = getCurrentMarketPrice(item.ticker);
			// Only use market price if we have it, otherwise don't include in calculation
			if (marketPrice > 0) {
				return sum + (item.quantity * marketPrice);
			}
		}
		return sum;
	}, 0);

	// Calculate scaled total value from scaled quantities for display
	const scaledTotalValue = useMemo(() => {
		if (!isPrivacyEnabled) return totalValue;
		
		const targetDeposit = 100_000_000; // 100M VND
		// If deposit = 0, auto-calculate from current portfolio value
		const actualDeposit = deposit > 0 ? deposit : totalValue;
		const scaleFactor = actualDeposit > 0 ? targetDeposit / actualDeposit : 1;
		
		return items.reduce((sum, item) => {
			if (item.quantity > 0) {
				// Use current market price for scaling calculation
				const marketPrice = getCurrentMarketPrice(item.ticker);
				// Only use market price if we have it
				if (marketPrice > 0) {
					return sum + (item.quantity * scaleFactor * marketPrice);
				}
			}
			return sum;
		}, 0);
	}, [items, deposit, isPrivacyEnabled, totalValue, tickerData]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button 
					size="lg"
					className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
				>
					<Share2 className="h-5 w-5" />
					{t("portfolio.share")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
				<DialogHeader className="pb-4">
					<DialogTitle className="flex items-center gap-3 text-xl">
						<div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
							<Share2 className="h-4 w-4 text-white" />
						</div>
						{t("portfolio.sharePortfolio")}
					</DialogTitle>
					<DialogDescription className="text-base">
						{t("portfolio.shareDescription")}
					</DialogDescription>
				</DialogHeader>
				
				<div className="space-y-6">
					{/* Privacy Settings */}
					<div className="bg-gradient-to-r from-blue-50/50 to-green-50/50 rounded-xl p-4 border border-muted/50">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center">
									{isPrivacyEnabled ? (
										<EyeOff className="h-3 w-3 text-blue-600" />
									) : (
										<Eye className="h-3 w-3 text-blue-600" />
									)}
								</div>
								<Label htmlFor="privacy-mode" className="font-medium cursor-pointer">
									{t("portfolio.privacyMode")}
								</Label>
							</div>
							<Switch
								id="privacy-mode"
								checked={isPrivacyEnabled}
								onCheckedChange={setIsPrivacyEnabled}
							/>
						</div>
						
						<div className={`text-sm rounded-lg p-3 border ${
							isPrivacyEnabled 
								? "bg-amber-50 border-amber-200 text-amber-800" 
								: "bg-green-50 border-green-200 text-green-800"
						}`}>
							<p className="font-semibold mb-1">
								{isPrivacyEnabled ? "🔒 " + t("portfolio.privacyEnabled") : "🔓 " + t("portfolio.privacyDisabled")}
							</p>
							<p className="text-xs">
								{isPrivacyEnabled 
									? t("portfolio.privacyEnabledDescription", { amount: formatVND(privacyTargetAmount) })
									: t("portfolio.privacyDisabledDescription")
								}
							</p>
							{isPrivacyEnabled && totalValue > 0 && (
								<div className="mt-2 pt-2 border-t border-amber-300/50">
									<div className="text-xs opacity-80">
										<strong>{t("portfolio.scalingFactor")}:</strong> {
											manualDeposit 
												? `${(100_000_000 / deposit).toFixed(2)}x (${t("portfolio.depositScaled")})`
												: `${(privacyTargetAmount / totalValue).toFixed(2)}x (${t("portfolio.quantityScaled")})`
										}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Shareable URL */}
					<div className="space-y-3">
						<Label htmlFor="shareable-url" className="text-base font-medium flex items-center gap-2">
							<div className="h-5 w-5 rounded bg-green-100 flex items-center justify-center">
								<svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
									<path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"/>
								</svg>
							</div>
							{t("portfolio.shareableUrl")}
						</Label>
						<div className="flex items-center gap-2">
							<Input
								id="shareable-url"
								value={shareableUrl}
								readOnly
								className="font-mono text-xs bg-muted/50 border-muted"
							/>
							<Button
								size="sm"
								onClick={handleCopy}
								variant={copied ? "default" : "outline"}
								className={`flex items-center gap-2 min-w-[80px] transition-all ${
									copied ? "bg-green-500 hover:bg-green-600" : ""
								}`}
							>
								{copied ? (
									<>
										<Check className="h-4 w-4" />
										{t("common.copied")}
									</>
								) : (
									<>
										<Copy className="h-4 w-4" />
										{t("common.copy")}
									</>
								)}
							</Button>
						</div>
					</div>

					{/* Portfolio Summary */}
					{items.length > 0 && (
						<div className="bg-muted/20 rounded-xl p-4 border-t-4 border-blue-500">
							<h4 className="font-semibold text-base mb-3 flex items-center gap-2">
								<div className="h-5 w-5 rounded bg-blue-100 flex items-center justify-center">
									<svg className="h-3 w-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
									</svg>
								</div>
								{t("portfolio.summaryToShare")}
							</h4>
							<div className="grid grid-cols-2 gap-3 text-sm">
								<div className="bg-background rounded-lg p-3 text-center">
									<div className="text-lg font-bold text-green-600">
										{items.filter(item => item.quantity > 0 && item.price > 0).length}
									</div>
									<div className="text-xs text-muted-foreground">{t("portfolio.totalStocks")}</div>
								</div>
								<div className="bg-background rounded-lg p-3 text-center">
									<div className="text-lg font-bold text-gray-600">
										{items.filter(item => item.quantity === 0 && item.price === 0).length}
									</div>
									<div className="text-xs text-muted-foreground">{t("portfolio.watchListItems")}</div>
								</div>
								<div className="bg-background rounded-lg p-3 text-center col-span-2">
									<div className="text-lg font-bold text-blue-600">
										{hasAllMarketData ? formatVND(scaledTotalValue) : (
											<div className="flex items-center justify-center gap-2">
												<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
												<span className="text-sm text-muted-foreground">Loading...</span>
											</div>
										)}
									</div>
									<div className="text-xs text-muted-foreground">{t("portfolio.totalValue")}</div>
								</div>
								{deposit > 0 && (
									<div className="bg-background rounded-lg p-3 text-center col-span-2">
										<div className="text-base font-semibold text-gray-700">
											{hasAllMarketData ? (
												isPrivacyEnabled 
													? formatVND(100_000_000) // Target deposit
													: formatVND(deposit)
											) : (
												<div className="flex items-center justify-center gap-2">
													<div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
													<span className="text-sm text-muted-foreground">Loading...</span>
												</div>
											)}
										</div>
										<div className="text-xs text-muted-foreground">{t("portfolio.deposit")}</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}