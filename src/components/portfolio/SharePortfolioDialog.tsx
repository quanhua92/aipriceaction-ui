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
	scalePortfolioForPrivacy,
	formatVND,
} from "@/lib/portfolio-utils";

interface SharePortfolioDialogProps {
	items: PortfolioItem[];
	deposit: number;
	currentUrl: string;
}

export function SharePortfolioDialog({
	items,
	deposit,
	currentUrl,
}: SharePortfolioDialogProps) {
	const { t } = useTranslation();
	const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(true);
	const [copied, setCopied] = useState(false);

	const shareableUrl = useMemo(() => {
		if (items.length === 0) return currentUrl;

		let shareItems = items;
		let shareDeposit = deposit;

		if (isPrivacyEnabled) {
			const scaled = scalePortfolioForPrivacy(items, deposit);
			shareItems = scaled.scaledItems;
			shareDeposit = scaled.scaledDeposit;
		}

		const encodedTickers = encodePortfolioItems(shareItems);
		const url = new URL(currentUrl, window.location.origin);
		
		// Clear existing params and set new ones
		url.search = '';
		url.searchParams.set('tickers', encodedTickers);
		if (shareDeposit > 0) {
			url.searchParams.set('deposit', shareDeposit.toString());
		}

		return url.toString();
	}, [items, deposit, isPrivacyEnabled, currentUrl]);

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
	const totalValue = items.reduce((sum, item) => {
		if (item.quantity > 0 && item.price > 0) {
			return sum + (item.quantity * item.price);
		}
		return sum;
	}, 0);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" className="flex items-center gap-2">
					<Share2 className="h-4 w-4" />
					{t("portfolio.share")}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Share2 className="h-5 w-5" />
						{t("portfolio.sharePortfolio")}
					</DialogTitle>
					<DialogDescription>
						{t("portfolio.shareDescription")}
					</DialogDescription>
				</DialogHeader>
				
				<div className="space-y-6">
					{/* Privacy Settings */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Switch
								id="privacy-mode"
								checked={isPrivacyEnabled}
								onCheckedChange={setIsPrivacyEnabled}
							/>
							<Label htmlFor="privacy-mode" className="flex items-center gap-2">
								{isPrivacyEnabled ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
								{t("portfolio.privacyMode")}
							</Label>
						</div>
						
						<div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
							<p className="font-medium mb-2">
								{isPrivacyEnabled ? t("portfolio.privacyEnabled") : t("portfolio.privacyDisabled")}
							</p>
							<p>
								{isPrivacyEnabled 
									? t("portfolio.privacyEnabledDescription", { amount: formatVND(privacyTargetAmount) })
									: t("portfolio.privacyDisabledDescription")
								}
							</p>
							{isPrivacyEnabled && totalValue > 0 && (
								<div className="mt-2 text-xs opacity-75">
									{t("portfolio.scalingInfo", {
										original: formatVND(totalValue),
										scaled: formatVND(privacyTargetAmount),
										factor: (privacyTargetAmount / totalValue).toFixed(2)
									})}
								</div>
							)}
						</div>
					</div>

					{/* Shareable URL */}
					<div className="space-y-2">
						<Label htmlFor="shareable-url">{t("portfolio.shareableUrl")}</Label>
						<div className="flex items-center gap-2">
							<Input
								id="shareable-url"
								value={shareableUrl}
								readOnly
								className="font-mono text-sm"
							/>
							<Button
								size="sm"
								onClick={handleCopy}
								className="flex items-center gap-2"
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
						<div className="space-y-2 border-t pt-4">
							<h4 className="font-medium">{t("portfolio.summaryToShare")}</h4>
							<div className="text-sm space-y-1">
								<div className="flex justify-between">
									<span>{t("portfolio.totalStocks")}:</span>
									<span>{items.filter(item => item.quantity > 0 && item.price > 0).length}</span>
								</div>
								<div className="flex justify-between">
									<span>{t("portfolio.watchListItems")}:</span>
									<span>{items.filter(item => item.quantity === 0 && item.price === 0).length}</span>
								</div>
								<div className="flex justify-between">
									<span>{t("portfolio.totalValue")}:</span>
									<span>
										{isPrivacyEnabled 
											? formatVND(privacyTargetAmount)
											: formatVND(totalValue)
										}
									</span>
								</div>
								{deposit > 0 && (
									<div className="flex justify-between">
										<span>{t("portfolio.deposit")}:</span>
										<span>
											{isPrivacyEnabled 
												? formatVND(privacyTargetAmount)
												: formatVND(deposit)
											}
										</span>
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