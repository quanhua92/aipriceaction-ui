/**
 * Panic Indicator Card Component
 * 
 * Displays sector indicators (Banking/Securities/Real Estate) with panic classification
 * and warning levels. Reusable across home, sector, portfolio, and panic pages.
 */

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
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
	recoveryData?: {
		stabilizationDays: number;
		recoveryLeader: string;
		nextDayVnindexChange?: number;
	};
	patternType?: string;
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


export function PanicIndicatorCard({
	date,
	vnindexChange,
	bsi,
	ssi,
	rsi,
	panicType,
	warningLevel,
	className,
	recoveryData,
	patternType
}: PanicIndicatorCardProps) {
	const formattedDate = new Date(date).toLocaleDateString('vi-VN');
	
	return (
		<Card className={cn("w-full", className)}>
			<CardContent className="p-6">
				<div className="grid grid-cols-2 gap-6 min-h-[400px]">
					{/* Left Column: VNINDEX - spans 2 rows */}
					<div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center items-center">
						<div className="text-3xl font-bold mb-2">
							VNINDEX {formatPercentage(vnindexChange)}
						</div>
						<div className="text-sm text-gray-600 mb-4">{formattedDate}</div>
						
						{warningLevel && (
							<Badge className={cn("mb-2", getWarningLevelColor(warningLevel))}>
								{warningLevel.replace('_', ' ')}
							</Badge>
						)}
						<Badge className={getPanicTypeColor(panicType)}>
							{panicType.replace('_', ' ')}
						</Badge>

						{/* Sector Indicators */}
						<div className="mt-6 space-y-3 w-full">
							<div className="text-center p-3 border rounded bg-white">
								<div className="flex items-center justify-center gap-1 mb-1">
									{getIndicatorIcon(bsi)}
									<span className="text-xs font-medium text-gray-600">Banking Indicator</span>
								</div>
								<div className={cn("text-lg font-bold", getIndicatorColor(bsi))}>
									{formatPercentage(bsi)}
								</div>
								<div className="text-xs text-gray-500">Banking</div>
							</div>
							
							<div className="text-center p-3 border rounded bg-white">
								<div className="flex items-center justify-center gap-1 mb-1">
									{getIndicatorIcon(ssi)}
									<span className="text-xs font-medium text-gray-600">Securities Indicator</span>
								</div>
								<div className={cn("text-lg font-bold", getIndicatorColor(ssi))}>
									{formatPercentage(ssi)}
								</div>
								<div className="text-xs text-gray-500">Securities</div>
							</div>
							
							<div className="text-center p-3 border rounded bg-white">
								<div className="flex items-center justify-center gap-1 mb-1">
									{getIndicatorIcon(rsi)}
									<span className="text-xs font-medium text-gray-600">Real Estate Indicator</span>
								</div>
								<div className={cn("text-lg font-bold", getIndicatorColor(rsi))}>
									{formatPercentage(rsi)}
								</div>
								<div className="text-xs text-gray-500">Real Estate</div>
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="flex flex-col gap-6">
						{/* Classification - Top Right */}
						<div className={`p-4 border rounded ${!recoveryData ? 'flex-1' : ''}`}>
							<div className="text-sm font-medium text-gray-700 mb-3">Classification</div>
							<div className="space-y-3">
								<div>
									<div className="text-xs text-gray-600 mb-1">Panic Type</div>
									<Badge className={getPanicTypeColor(panicType)}>
										{panicType.replace('_', ' ')}
									</Badge>
								</div>
								{warningLevel && (
									<div>
										<div className="text-xs text-gray-600 mb-1">Warning Level</div>
										<Badge className={getWarningLevelColor(warningLevel)}>
											{warningLevel.replace('_', ' ')}
										</Badge>
									</div>
								)}
								{patternType && (
									<div>
										<div className="text-xs text-gray-600 mb-1">Pattern Type</div>
										<Badge variant="outline">
											{patternType.replace('_', ' ')}
										</Badge>
									</div>
								)}
							</div>
						</div>

						{/* Recovery - Bottom Right (only if data exists) */}
						{recoveryData && (
							<div className="p-4 border rounded">
								<div className="text-sm font-medium text-gray-700 mb-3">Recovery</div>
								<div className="space-y-2 text-sm">
									<div>
										<span className="text-gray-600">Stabilization:</span>
										<span className="ml-2 font-medium">{recoveryData.stabilizationDays} days</span>
									</div>
									<div>
										<span className="text-gray-600">Recovery Leader:</span>
										<span className="ml-2 font-medium">{recoveryData.recoveryLeader}</span>
									</div>
									{recoveryData.nextDayVnindexChange && (
										<div>
											<span className="text-gray-600">Next Day:</span>
											<span className={`ml-2 font-medium ${
												recoveryData.nextDayVnindexChange > 0 ? 'text-green-600' : 'text-red-600'
											}`}>
												{recoveryData.nextDayVnindexChange >= 0 ? '+' : ''}
												{recoveryData.nextDayVnindexChange.toFixed(2)}%
											</span>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}