/**
 * Panic Indicator Card Component
 * 
 * Displays sector indicators (Banking/Securities/Real Estate) with panic classification
 * and warning levels. Reusable across home, sector, portfolio, and panic pages.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanicType, WarningLevel } from "@/lib/panic-analyzer";
import { getPanicTypeColor, getWarningLevelColor } from "@/hooks/use-panic-analysis";

interface PanicIndicatorCardProps {
	date: string;
	vnindexChange: number;
	bsi: number | null;
	ssi: number | null;
	rsi: number | null;
	panicType: PanicType;
	warningLevel?: WarningLevel;
	className?: string;
	showDetails?: boolean;
}

function formatPercentage(value: number | null): string {
	if (value === null) return 'N/A';
	return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function getIndicatorIcon(value: number | null) {
	if (value === null) return <Minus className="h-4 w-4 text-gray-400" />;
	if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
	if (value < -2) return <TrendingDown className="h-4 w-4 text-red-500" />;
	return <TrendingDown className="h-4 w-4 text-orange-500" />;
}

function getIndicatorColor(value: number | null): string {
	if (value === null) return 'text-gray-500';
	if (value > 0) return 'text-green-600';
	if (value < -3) return 'text-red-600';
	if (value < -1) return 'text-orange-600';
	return 'text-gray-600';
}

function getPanicTypeDescription(type: PanicType): string {
	switch (type) {
		case 'POSITIVE_PANIC':
			return 'Banking stable, Securities/Real Estate oversold - Buy opportunity';
		case 'NEGATIVE_EXTREME':
			return 'All sectors deep red - Defensive positioning only';
		case 'NEGATIVE_MEDIUM':
			return 'Significant cross-sector weakness - Reduce exposure';
		case 'UNCLEAR_PATTERN':
			return 'Mixed sector signals - Selective positioning';
		case 'RECOVERY_SIGNAL':
			return 'Recovery patterns emerging - Monitor for entry';
		case 'NO_PANIC':
			return 'Normal market conditions - Standard strategies';
		default:
			return 'Pattern under analysis';
	}
}

function getWarningDescription(level: WarningLevel): string {
	switch (level) {
		case 'STRONG_WARNING':
			return 'EXTREME - Panic likely within 1-3 days';
		case 'MODERATE_WARNING':
			return 'HIGH - Monitor daily for escalation';
		case 'EARLY_WARNING':
			return 'MEDIUM - Watch for pattern development';
		case 'DEVELOPING_WEAKNESS':
			return 'LOW-MEDIUM - Early stage warning';
		case 'NO_WARNING':
			return 'LOW - No immediate panic signals';
		case 'INSUFFICIENT_DATA':
			return 'UNKNOWN - Insufficient data for analysis';
		default:
			return 'Pattern analysis pending';
	}
}

export function PanicIndicatorCard({
	date,
	vnindexChange,
	bsi,
	ssi,
	rsi,
	panicType,
	warningLevel,
	className,
	showDetails = true
}: PanicIndicatorCardProps) {
	const formattedDate = new Date(date).toLocaleDateString('vi-VN');
	
	return (
		<Card className={cn("w-full", className)}>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="text-lg">
							VNINDEX {formatPercentage(vnindexChange)}
						</CardTitle>
						<CardDescription>{formattedDate}</CardDescription>
					</div>
					<div className="flex items-center gap-2">
						{warningLevel && (
							<Badge className={getWarningLevelColor(warningLevel)}>
								<AlertTriangle className="h-3 w-3 mr-1" />
								{warningLevel.replace('_', ' ')}
							</Badge>
						)}
						<Badge className={getPanicTypeColor(panicType)}>
							{panicType === 'POSITIVE_PANIC' && <Shield className="h-3 w-3 mr-1" />}
							{panicType.replace('_', ' ')}
						</Badge>
					</div>
				</div>
			</CardHeader>
			
			<CardContent className="space-y-4">
				{/* Sector Indicators */}
				<div className="grid grid-cols-3 gap-4">
					<div className="text-center">
						<div className="flex items-center justify-center gap-1 mb-1">
							{getIndicatorIcon(bsi)}
							<span className="text-sm font-medium text-gray-600">Banking Indicator</span>
						</div>
						<div className={cn("text-lg font-bold", getIndicatorColor(bsi))}>
							{formatPercentage(bsi)}
						</div>
						<div className="text-xs text-gray-500">Banking</div>
					</div>
					
					<div className="text-center">
						<div className="flex items-center justify-center gap-1 mb-1">
							{getIndicatorIcon(ssi)}
							<span className="text-sm font-medium text-gray-600">Securities Indicator</span>
						</div>
						<div className={cn("text-lg font-bold", getIndicatorColor(ssi))}>
							{formatPercentage(ssi)}
						</div>
						<div className="text-xs text-gray-500">Securities</div>
					</div>
					
					<div className="text-center">
						<div className="flex items-center justify-center gap-1 mb-1">
							{getIndicatorIcon(rsi)}
							<span className="text-sm font-medium text-gray-600">Real Estate Indicator</span>
						</div>
						<div className={cn("text-lg font-bold", getIndicatorColor(rsi))}>
							{formatPercentage(rsi)}
						</div>
						<div className="text-xs text-gray-500">Real Estate</div>
					</div>
				</div>

				{/* Detailed Analysis */}
				{showDetails && (
					<div className="space-y-3 pt-3 border-t">
						<div>
							<div className="text-sm font-medium text-gray-700 mb-1">
								Panic Classification
							</div>
							<div className="text-xs text-gray-600">
								{getPanicTypeDescription(panicType)}
							</div>
						</div>
						
						{warningLevel && (
							<div>
								<div className="text-sm font-medium text-gray-700 mb-1">
									Risk Level
								</div>
								<div className="text-xs text-gray-600">
									{getWarningDescription(warningLevel)}
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}