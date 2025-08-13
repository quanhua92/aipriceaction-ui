/**
 * Panic Day Table Component
 * 
 * Displays historical panic days in a sortable, filterable table.
 * Used in /panic index page and can be integrated into other pages
 * for historical analysis and pattern recognition.
 */

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
	ArrowUpDown, 
	ArrowUp, 
	ArrowDown,
	TrendingDown,
	AlertTriangle,
	Calendar
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import type { PanicDayData } from "@/data/panic-days";
import { getPanicTypeColor, getWarningLevelColor } from "@/hooks/use-panic-analysis";
import { useTranslation } from "@/hooks/useTranslation";

interface PanicDayTableProps {
	panicDays: PanicDayData[];
	title?: string;
	description?: string;
	showFilters?: boolean;
	onViewDetails?: (panicDay: PanicDayData) => void;
	maxHeight?: string;
	className?: string;
}

type SortField = 'date' | 'vnindexChange' | 'bsi' | 'ssi' | 'rsi' | 'panicType' | 'strongestWarning';
type SortDirection = 'asc' | 'desc';

function formatPercentage(value: number | null): string {
	if (value === null) return 'N/A';
	return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatDate(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('vi-VN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
}

export function PanicDayTable({
	panicDays,
	title,
	description,
	showFilters = false,
	onViewDetails,
	maxHeight = "600px",
	className
}: PanicDayTableProps) {
	const { t } = useTranslation();
	const [sortField, setSortField] = useState<SortField>('date');
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
	const [filterYear, setFilterYear] = useState<string>('all');
	const [filterPattern, setFilterPattern] = useState<string>('all');

	// Get available years for filtering
	const availableYears = useMemo(() => {
		const years = Array.from(new Set(
			panicDays.map(panic => new Date(panic.date).getFullYear())
		)).sort((a, b) => b - a);
		return years;
	}, [panicDays]);

	// Sort and filter data
	const sortedAndFilteredData = useMemo(() => {
		let filtered = panicDays;

		// Apply year filter
		if (filterYear !== 'all') {
			const year = Number.parseInt(filterYear);
			filtered = filtered.filter(panic => new Date(panic.date).getFullYear() === year);
		}

		// Apply pattern filter
		if (filterPattern !== 'all') {
			filtered = filtered.filter(panic => panic.prePanicPattern === filterPattern);
		}

		// Apply sorting
		return filtered.sort((a, b) => {
			let aValue: any = a[sortField];
			let bValue: any = b[sortField];

			// Handle date sorting
			if (sortField === 'date') {
				aValue = new Date(aValue).getTime();
				bValue = new Date(bValue).getTime();
			}

			// Handle null values
			if (aValue === null && bValue === null) return 0;
			if (aValue === null) return 1;
			if (bValue === null) return -1;

			if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
			if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	}, [panicDays, sortField, sortDirection, filterYear, filterPattern]);

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('desc');
		}
	};

	const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
		<Button
			variant="ghost"
			size="sm"
			onClick={() => handleSort(field)}
			className="h-8 px-2 text-left font-medium hover:bg-gray-100"
		>
			<span className="flex items-center gap-1">
				{children}
				{sortField === field ? (
					sortDirection === 'asc' ? 
					<ArrowUp className="h-3 w-3" /> : 
					<ArrowDown className="h-3 w-3" />
				) : (
					<ArrowUpDown className="h-3 w-3 opacity-50" />
				)}
			</span>
		</Button>
	);

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader className="pb-3 md:pb-6">
				<div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2 text-base md:text-lg">
							<TrendingDown className="h-4 w-4 md:h-5 md:w-5" />
							{title || t('home.panicDaysAnalysis')}
						</CardTitle>
						<CardDescription className="text-xs md:text-sm">{description || t('home.historicalVietnameseMarket')}</CardDescription>
					</div>
					<Badge variant="outline" className="text-xs md:text-sm px-2 py-1 self-start md:self-center">
						{sortedAndFilteredData.length} {t('home.events')}
					</Badge>
				</div>

				{/* Filters */}
				{showFilters && (
					<div className="flex flex-col space-y-3 md:flex-row md:gap-4 md:space-y-0 pt-4">
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4 text-gray-500" />
							<select
								value={filterYear}
								onChange={(e) => setFilterYear(e.target.value)}
								className="border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm min-w-0 flex-1 md:flex-initial"
							>
								<option value="all">{t('home.allYears')}</option>
								{availableYears.map(year => (
									<option key={year} value={year.toString()}>{year}</option>
								))}
							</select>
						</div>

						<div className="flex items-center gap-2">
							<AlertTriangle className="h-4 w-4 text-gray-500" />
							<select
								value={filterPattern}
								onChange={(e) => setFilterPattern(e.target.value)}
								className="border border-gray-300 rounded px-2 md:px-3 py-1 text-xs md:text-sm min-w-0 flex-1 md:flex-initial"
							>
								<option value="all">{t('home.allPatterns')}</option>
								<option value="ESCALATING_TO_CRISIS">{t('home.escalatingToCrisis')}</option>
								<option value="MULTIPLE_WEAKNESS_EVENTS">{t('home.multipleWeakness')}</option>
								<option value="SUSTAINED_DETERIORATION">{t('home.sustainedDeterioration')}</option>
								<option value="ISOLATED_SIGNALS">{t('home.blackSwan')}</option>
							</select>
						</div>
					</div>
				)}
			</CardHeader>

			<CardContent className="p-0">
				{/* Mobile Card Layout */}
				<div className="block md:hidden p-3 space-y-3" style={{ maxHeight, overflow: 'auto' }}>
					{sortedAndFilteredData.map((panic) => (
						<Card key={panic.date} className="p-3 border border-gray-200">
							<div className="flex items-center justify-between mb-2">
								<div className="text-sm font-medium">
									{onViewDetails ? (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => onViewDetails(panic)}
											className="h-auto px-2 py-1 font-medium hover:underline text-blue-600 hover:bg-blue-50 rounded"
										>
											{new Date(panic.date).toLocaleDateString('vi-VN')}
										</Button>
									) : (
										new Date(panic.date).toLocaleDateString('vi-VN')
									)}
								</div>
								{onViewDetails && (
									<Button
										size="sm"
										variant="outline"
										onClick={() => onViewDetails(panic)}
										className="text-xs px-2 py-1 h-6"
									>
										{t('home.view')}
									</Button>
								)}
							</div>
							<div className="grid grid-cols-2 gap-2 text-xs">
								<div>
									<span className="text-gray-500">VNINDEX:</span>
									<span className={`ml-1 font-medium ${panic.vnindexChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
										{panic.vnindexChange >= 0 ? '+' : ''}{panic.vnindexChange.toFixed(2)}%
									</span>
								</div>
								<div>
									<span className="text-gray-500">{t('home.banking')}:</span>
									<span className={`ml-1 font-medium ${
										panic.bsi === null ? 'text-gray-400' : 
										panic.bsi >= 0 ? 'text-green-600' : 'text-red-600'
									}`}>
										{panic.bsi === null ? 'N/A' : `${panic.bsi >= 0 ? '+' : ''}${panic.bsi.toFixed(1)}%`}
									</span>
								</div>
								<div>
									<span className="text-gray-500">{t('home.securities')}:</span>
									<span className={`ml-1 font-medium ${
										panic.ssi === null ? 'text-gray-400' : 
										panic.ssi >= 0 ? 'text-green-600' : 'text-red-600'
									}`}>
										{panic.ssi === null ? 'N/A' : `${panic.ssi >= 0 ? '+' : ''}${panic.ssi.toFixed(1)}%`}
									</span>
								</div>
								<div>
									<span className="text-gray-500">{t('home.realEstate')}:</span>
									<span className={`ml-1 font-medium ${
										panic.rsi === null ? 'text-gray-400' : 
										panic.rsi >= 0 ? 'text-green-600' : 'text-red-600'
									}`}>
										{panic.rsi === null ? 'N/A' : `${panic.rsi >= 0 ? '+' : ''}${panic.rsi.toFixed(1)}%`}
									</span>
								</div>
							</div>
							<div className="flex flex-wrap gap-1 mt-2">
								<Badge className={getPanicTypeColor(panic.panicType)}>
									{t(`panic.panicTypes.${panic.panicType}`)}
								</Badge>
								<Badge className={getWarningLevelColor(panic.strongestWarning)}>
									{t(`panic.warningLevels.${panic.strongestWarning}`)}
								</Badge>
							</div>
						</Card>
					))}
				</div>

				{/* Desktop Table Layout */}
				<div className="hidden md:block overflow-auto" style={{ maxHeight }}>
					<Table>
						<TableHeader className="sticky top-0 bg-white border-b z-10">
							<TableRow>
								<TableHead className="w-[100px]">
									<SortButton field="date">{t('home.date')}</SortButton>
								</TableHead>
								<TableHead className="w-[80px] text-right">
									<SortButton field="vnindexChange">VNINDEX</SortButton>
								</TableHead>
								<TableHead className="w-[90px] text-center">
									<SortButton field="bsi">{t('home.bankingIndicator')}</SortButton>
								</TableHead>
								<TableHead className="w-[95px] text-center">
									<SortButton field="ssi">{t('home.securitiesIndicator')}</SortButton>
								</TableHead>
								<TableHead className="w-[100px] text-center">
									<SortButton field="rsi">{t('home.realEstateIndicator')}</SortButton>
								</TableHead>
								<TableHead className="w-[130px]">
									<SortButton field="panicType">{t('home.classification')}</SortButton>
								</TableHead>
								<TableHead className="w-[120px]">
									<SortButton field="strongestWarning">{t('home.warning')}</SortButton>
								</TableHead>
								<TableHead className="w-[250px]">{t('home.context')}</TableHead>
								<TableHead className="w-[80px]">{t('home.action')}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedAndFilteredData.map((panicDay) => (
								<TableRow 
									key={panicDay.date}
									className="hover:bg-gray-50"
								>
									<TableCell className="font-medium">
										{onViewDetails ? (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => onViewDetails(panicDay)}
												className="h-auto px-2 py-1 font-medium hover:underline text-blue-600 hover:bg-blue-50 rounded"
											>
												{formatDate(panicDay.date)}
											</Button>
										) : (
											formatDate(panicDay.date)
										)}
									</TableCell>
									<TableCell className={cn(
										"text-right font-bold",
										panicDay.vnindexChange < -5 ? "text-red-600" :
										panicDay.vnindexChange < -3 ? "text-orange-600" :
										"text-gray-600"
									)}>
										{formatPercentage(panicDay.vnindexChange)}
									</TableCell>
									<TableCell className={cn(
										"text-center text-sm font-medium",
										panicDay.bsi === null ? "text-gray-400" :
										panicDay.bsi > 0 ? "text-green-600" :
										panicDay.bsi < -3 ? "text-red-600" : "text-orange-600"
									)}>
										{formatPercentage(panicDay.bsi)}
									</TableCell>
									<TableCell className={cn(
										"text-center text-sm font-medium",
										panicDay.ssi === null ? "text-gray-400" :
										panicDay.ssi > 0 ? "text-green-600" :
										panicDay.ssi < -3 ? "text-red-600" : "text-orange-600"
									)}>
										{formatPercentage(panicDay.ssi)}
									</TableCell>
									<TableCell className={cn(
										"text-center text-sm font-medium",
										panicDay.rsi === null ? "text-gray-400" :
										panicDay.rsi > 0 ? "text-green-600" :
										panicDay.rsi < -3 ? "text-red-600" : "text-orange-600"
									)}>
										{formatPercentage(panicDay.rsi)}
									</TableCell>
									<TableCell>
										<Badge className={cn(getPanicTypeColor(panicDay.panicType), "text-xs")}>
											{t(`panic.panicTypes.${panicDay.panicType}`)}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge className={cn(getWarningLevelColor(panicDay.strongestWarning), "text-xs")}>
											{t(`panic.warningLevels.${panicDay.strongestWarning}`)}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-gray-600 max-w-[250px] truncate">
										{panicDay.context}
									</TableCell>
									<TableCell>
										{onViewDetails && (
											<Button
												variant="outline"
												size="sm"
												onClick={() => onViewDetails(panicDay)}
												className="h-8 px-3 py-1"
											>
												{t('home.view')}
											</Button>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}