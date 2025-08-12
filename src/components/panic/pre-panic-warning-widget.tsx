/**
 * Pre-Panic Warning Widget
 * 
 * Displays current pre-panic warning level and trading advice.
 * Designed for integration into home, portfolio, and sector pages
 * as a risk management dashboard widget.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
	AlertTriangle, 
	Shield, 
	Eye,
	ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentWarningLevel, getWarningLevelColor } from "@/hooks/use-panic-analysis";
import type { WarningLevel } from "@/lib/panic-analyzer";

interface PrePanicWarningWidgetProps {
	className?: string;
	showTradingAdvice?: boolean;
	compact?: boolean;
	onViewDetails?: () => void;
}

function getWarningIcon(level: WarningLevel) {
	switch (level) {
		case 'STRONG_WARNING':
			return <AlertTriangle className="h-4 w-4 text-red-500" />;
		case 'MODERATE_WARNING':
		case 'EARLY_WARNING':
			return <AlertTriangle className="h-4 w-4 text-orange-500" />;
		case 'DEVELOPING_WEAKNESS':
			return <Eye className="h-4 w-4 text-blue-500" />;
		case 'NO_WARNING':
			return <Shield className="h-4 w-4 text-green-500" />;
		default:
			return <Eye className="h-4 w-4 text-gray-500" />;
	}
}

function getWarningUrgency(level: WarningLevel): 'high' | 'medium' | 'low' {
	switch (level) {
		case 'STRONG_WARNING':
			return 'high';
		case 'MODERATE_WARNING':
		case 'EARLY_WARNING':
			return 'medium';
		case 'DEVELOPING_WEAKNESS':
		case 'NO_WARNING':
		case 'INSUFFICIENT_DATA':
		default:
			return 'low';
	}
}

export function PrePanicWarningWidget({ 
	className, 
	showTradingAdvice = true,
	compact = false,
	onViewDetails
}: PrePanicWarningWidgetProps) {
	const { data: warningData, isLoading, error } = useCurrentWarningLevel();

	if (isLoading) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="flex items-center justify-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className={cn("w-full", className)}>
				<CardContent className="p-6">
					<Alert>
						<AlertTriangle className="h-4 w-4" />
						<AlertDescription>
							Unable to load current warning level. Please try again later.
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	if (!warningData) {
		return null;
	}

	const { currentWarning, tradingAdvice, sectorIndicators } = warningData;
	const urgency = getWarningUrgency(currentWarning);
	
	return (
		<Card className={cn("w-full", className)}>
			<CardHeader className={cn("pb-2 md:pb-3", compact && "pb-1 md:pb-2")}>
				<div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
					<div className="flex items-center gap-2">
						{getWarningIcon(currentWarning)}
						<CardTitle className={cn("text-base md:text-lg", compact && "text-sm md:text-base")}>
							Pre-Panic Monitor
						</CardTitle>
					</div>
					<Badge className={cn(getWarningLevelColor(currentWarning), "text-xs md:text-sm px-2 py-1")}>
						{currentWarning.replace('_', ' ')}
					</Badge>
				</div>
				{!compact && (
					<CardDescription className="text-xs md:text-sm">
						Data from: {sectorIndicators.date}
					</CardDescription>
				)}
			</CardHeader>

			<CardContent className="space-y-3 md:space-y-4">
				{/* Current Sector Indicators */}
				{!compact && (
					<div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
						<div>
							<div className="text-xs text-gray-500 mb-1">Banking Indicator</div>
							<div className={cn(
								"text-xs md:text-sm font-bold",
								sectorIndicators.bsi === null ? "text-gray-400" :
								sectorIndicators.bsi > 0 ? "text-green-600" :
								sectorIndicators.bsi < -2 ? "text-red-600" : "text-orange-600"
							)}>
								{sectorIndicators.bsi === null ? 'N/A' : 
								 `${sectorIndicators.bsi >= 0 ? '+' : ''}${sectorIndicators.bsi.toFixed(1)}%`}
							</div>
						</div>
						<div>
							<div className="text-xs text-gray-500 mb-1">Securities Indicator</div>
							<div className={cn(
								"text-xs md:text-sm font-bold",
								sectorIndicators.ssi === null ? "text-gray-400" :
								sectorIndicators.ssi > 0 ? "text-green-600" :
								sectorIndicators.ssi < -2 ? "text-red-600" : "text-orange-600"
							)}>
								{sectorIndicators.ssi === null ? 'N/A' : 
								 `${sectorIndicators.ssi >= 0 ? '+' : ''}${sectorIndicators.ssi.toFixed(1)}%`}
							</div>
						</div>
						<div>
							<div className="text-xs text-gray-500 mb-1">Real Estate Indicator</div>
							<div className={cn(
								"text-xs md:text-sm font-bold",
								sectorIndicators.rsi === null ? "text-gray-400" :
								sectorIndicators.rsi > 0 ? "text-green-600" :
								sectorIndicators.rsi < -2 ? "text-red-600" : "text-orange-600"
							)}>
								{sectorIndicators.rsi === null ? 'N/A' : 
								 `${sectorIndicators.rsi >= 0 ? '+' : ''}${sectorIndicators.rsi.toFixed(1)}%`}
							</div>
						</div>
					</div>
				)}

				{/* Warning Alert */}
				{urgency === 'high' && (
					<Alert className="border-red-200 bg-red-50">
						<AlertTriangle className="h-4 w-4 text-red-500" />
						<AlertDescription className="text-red-700">
							<strong>HIGH RISK:</strong> {tradingAdvice.riskLevel}
						</AlertDescription>
					</Alert>
				)}

				{urgency === 'medium' && (
					<Alert className="border-orange-200 bg-orange-50">
						<AlertTriangle className="h-4 w-4 text-orange-500" />
						<AlertDescription className="text-orange-700">
							<strong>MODERATE RISK:</strong> {tradingAdvice.riskLevel}
						</AlertDescription>
					</Alert>
				)}

				{/* Trading Advice */}
				{showTradingAdvice && !compact && (
					<div className="space-y-2">
						<div className="text-xs md:text-sm font-medium text-gray-700">Trading Action</div>
						<div className="text-xs md:text-sm text-gray-600 bg-gray-50 p-2 md:p-3 rounded-md">
							{tradingAdvice.action}
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 text-xs">
							<div>
								<span className="font-medium text-gray-700">Position Size:</span>
								<div className="text-gray-600">{tradingAdvice.positionSize}</div>
							</div>
							<div>
								<span className="font-medium text-gray-700">Defensive Stocks:</span>
								<div className="text-gray-600">{tradingAdvice.defensiveStocks}</div>
							</div>
						</div>
					</div>
				)}

				{/* Compact Trading Advice */}
				{showTradingAdvice && compact && (
					<div className="text-xs md:text-sm text-gray-600">
						{tradingAdvice.action}
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-2 pt-2">
					{onViewDetails && (
						<Button
							variant="outline"
							size="sm"
							onClick={onViewDetails}
							className="flex items-center gap-1 justify-center text-xs md:text-sm px-3 py-2"
						>
							<ExternalLink className="h-3 w-3" />
							<span>View Details</span>
						</Button>
					)}
					
					{urgency === 'high' && (
						<Button
							size="sm"
							className="justify-center text-xs md:text-sm px-3 py-2 bg-red-600 hover:bg-red-700 text-white"
							onClick={() => {
								// Could integrate with portfolio management or alerts
								console.log('Urgent action required:', tradingAdvice);
							}}
						>
							Take Action
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}