/**
 * Trading Signals Card Component
 * 
 * Displays trading recommendations based on panic analysis.
 * Shows buy opportunities, stocks to avoid, and watchlist items
 * with reasoning and confidence levels.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
	TrendingUp, 
	TrendingDown, 
	Eye, 
	Shield,
	AlertTriangle,
	Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanicType } from "@/lib/panic-analyzer";
import { useTranslation } from "@/hooks/useTranslation";

interface TradingSignalsCardProps {
	panicType: PanicType;
	tradingSignals: {
		buy: string[];
		avoid: string[];
		watch: string[];
	};
	showcaseTickers?: {
		bestPerformers: Array<{ ticker: string; change: number; reason: string }>;
		worstPerformers: Array<{ ticker: string; change: number; reason: string }>;
		defensiveLeaders: Array<{ ticker: string; change: number; reason: string }>;
	};
	className?: string;
	showHistoricalContext?: boolean;
}

function getPanicTypeStrategy(type: PanicType, t: (key: string) => string): {
	strategy: string;
	confidence: 'high' | 'medium' | 'low';
	timeframe: string;
	risk: string;
} {
	switch (type) {
		case 'POSITIVE_PANIC':
			return {
				strategy: t('panic.aggressiveBuyingOpportunity'),
				confidence: 'high',
				timeframe: t('panic.oneDayRecoveryWindow'),
				risk: t('panic.mediumSelectivePositioning')
			};
		case 'NEGATIVE_EXTREME':
			return {
				strategy: t('panic.defensivePositioningOnly'),
				confidence: 'high',
				timeframe: t('panic.oneWeekRecovery'),
				risk: t('panic.extremeCapitalPreservation')
			};
		case 'NEGATIVE_MEDIUM':
			return {
				strategy: t('panic.reduceExposurePrepare'),
				confidence: 'medium',
				timeframe: t('panic.threeDaysMonitoring'),
				risk: t('panic.highCrossSectorWeakness')
			};
		case 'UNCLEAR_PATTERN':
			return {
				strategy: t('panic.mixedSignalsSelective'),
				confidence: 'low',
				timeframe: t('panic.oneToFiveDaysPattern'),
				risk: t('panic.mediumSectorDivergence')
			};
		case 'RECOVERY_SIGNAL':
			return {
				strategy: t('panic.recoveryPatternsEmerging'),
				confidence: 'high',
				timeframe: t('panic.twoToFiveDaysMomentum'),
				risk: t('panic.lowMediumRecoveryPositioning')
			};
		case 'NO_PANIC':
		default:
			return {
				strategy: t('panic.normalMarketStandardDiv'),
				confidence: 'medium',
				timeframe: t('panic.ongoingMonitoring'),
				risk: t('panic.lowRegularMarketConditions')
			};
	}
}

function formatPercentage(value: number): string {
	return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function TradingSignalsCard({
	panicType,
	tradingSignals,
	showcaseTickers,
	className,
	showHistoricalContext = false
}: TradingSignalsCardProps) {
	const { t } = useTranslation();
	const strategy = getPanicTypeStrategy(panicType, t);

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Target className="h-5 w-5" />
						{t('panic.tradingSignals')}
					</CardTitle>
					<Badge 
						variant="outline"
						className={cn(
							strategy.confidence === 'high' ? 'border-green-500 text-green-700' :
							strategy.confidence === 'medium' ? 'border-yellow-500 text-yellow-700' :
							'border-red-500 text-red-700'
						)}
					>
						{t(`panic.${strategy.confidence}Confidence`)}
					</Badge>
				</div>
				<CardDescription>{strategy.strategy}</CardDescription>
			</CardHeader>

			<CardContent className="p-3 md:p-6 space-y-6">
				{/* Strategy Overview */}
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="font-medium text-gray-700">{t('panic.timeframe')}:</span>
						<div className="text-gray-600">{strategy.timeframe}</div>
					</div>
					<div>
						<span className="font-medium text-gray-700">{t('panic.riskLevel')}:</span>
						<div className="text-gray-600">{strategy.risk}</div>
					</div>
				</div>

				{/* High Risk Alert */}
				{(strategy.risk.includes('Extreme') || strategy.risk.includes('High')) && (
					<Alert className="border-red-200 bg-red-50">
						<AlertTriangle className="h-4 w-4 text-red-500" />
						<AlertDescription className="text-red-700">
							<strong>{t('panic.highRisk')}:</strong> {strategy.risk} - {t('panic.exerciseCaution')}
						</AlertDescription>
					</Alert>
				)}

				{/* Trading Actions */}
				<div className="grid gap-4">
					{/* Buy Signals */}
					{tradingSignals.buy.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-2">
								<TrendingUp className="h-4 w-4 text-green-500" />
								<span className="font-medium text-green-700">{t('panic.buyOpportunities')}</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{tradingSignals.buy.map((ticker) => (
									<Badge key={ticker} className="bg-green-100 text-green-800 border-green-300">
										{ticker}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Avoid Signals */}
					{tradingSignals.avoid.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-2">
								<TrendingDown className="h-4 w-4 text-red-500" />
								<span className="font-medium text-red-700">{t('panic.avoidReduce')}</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{tradingSignals.avoid.map((ticker) => (
									<Badge key={ticker} className="bg-red-100 text-red-800 border-red-300">
										{ticker}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Watch List */}
					{tradingSignals.watch.length > 0 && (
						<div>
							<div className="flex items-center gap-2 mb-2">
								<Eye className="h-4 w-4 text-blue-500" />
								<span className="font-medium text-blue-700">{t('panic.watchMonitor')}</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{tradingSignals.watch.map((item) => (
									<Badge key={item} variant="outline" className="border-blue-300 text-blue-700">
										{item}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Historical Context */}
				{showHistoricalContext && showcaseTickers && (
					<div className="space-y-4 pt-4 border-t">
						<div className="text-sm font-medium text-gray-700">{t('panic.historicalPerformanceContext')}</div>
						
						{/* Best Performers */}
						{showcaseTickers.bestPerformers.length > 0 && (
							<div>
								<div className="text-sm text-green-700 font-medium mb-2">✓ {t('panic.historicalBestPerformers')}</div>
								{showcaseTickers.bestPerformers.map((performer) => (
									<div key={performer.ticker} className="text-xs p-2 bg-green-50 rounded mb-1">
										<span className="font-medium">{performer.ticker}</span>
										<span className="text-green-600 ml-2">{formatPercentage(performer.change)}</span>
										<div className="text-gray-600 mt-1">{performer.reason}</div>
									</div>
								))}
							</div>
						)}

						{/* Worst Performers */}
						{showcaseTickers.worstPerformers.length > 0 && (
							<div>
								<div className="text-sm text-red-700 font-medium mb-2">✗ {t('panic.historicalWorstPerformers')}</div>
								{showcaseTickers.worstPerformers.map((performer) => (
									<div key={performer.ticker} className="text-xs p-2 bg-red-50 rounded mb-1">
										<span className="font-medium">{performer.ticker}</span>
										<span className="text-red-600 ml-2">{formatPercentage(performer.change)}</span>
										<div className="text-gray-600 mt-1">{performer.reason}</div>
									</div>
								))}
							</div>
						)}

						{/* Defensive Leaders */}
						{showcaseTickers.defensiveLeaders.length > 0 && (
							<div>
								<div className="text-sm text-blue-700 font-medium mb-2 flex items-center gap-1">
									<Shield className="h-3 w-3" />
									{t('panic.historicalDefensiveLeaders')}
								</div>
								{showcaseTickers.defensiveLeaders.map((leader) => (
									<div key={leader.ticker} className="text-xs p-2 bg-blue-50 rounded mb-1">
										<span className="font-medium">{leader.ticker}</span>
										<span className="text-blue-600 ml-2">{formatPercentage(leader.change)}</span>
										<div className="text-gray-600 mt-1">{leader.reason}</div>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}