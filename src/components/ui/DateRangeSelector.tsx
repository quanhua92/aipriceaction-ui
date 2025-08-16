import { useState, useCallback } from "react";
import { CalendarDays, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	type DateRangeConfig,
	type TimeRange,
	formatDateForUrl,
	parseDateString,
	getDataDateBounds,
	type StockDataPoint,
} from "@/lib/stock-data";

interface DateRangeSelectorProps {
	value: DateRangeConfig;
	onChange: (config: DateRangeConfig) => void;
	className?: string;
	dataRange?: StockDataPoint[];
	showNavigationButtons?: boolean;
	showDataInfo?: boolean;
}

const TIME_RANGES: { value: Exclude<TimeRange, "CUSTOM">; label: string }[] = [
	{ value: "1M", label: "1M" },
	{ value: "3M", label: "3M" },
	{ value: "6M", label: "6M" },
	{ value: "1Y", label: "1Y" },
	{ value: "2Y", label: "2Y" },
	{ value: "ALL", label: "ALL" },
];

export function DateRangeSelector({
	value,
	onChange,
	className,
	dataRange,
	showNavigationButtons = false,
	showDataInfo = false,
}: DateRangeSelectorProps) {
	const { t } = useTranslation();
	const [customStartDate, setCustomStartDate] = useState<string>(
		value.range === "CUSTOM" && value.startDate
			? formatDateForUrl(value.startDate)
			: "",
	);
	const [customEndDate, setCustomEndDate] = useState<string>(
		value.range === "CUSTOM" && value.endDate
			? formatDateForUrl(value.endDate)
			: "",
	);
	const [isCustomOpen, setIsCustomOpen] = useState(false);

	const dataBounds = dataRange ? getDataDateBounds(dataRange) : null;

	const handleQuickRangeChange = useCallback(
		(range: Exclude<TimeRange, "CUSTOM">) => {
			onChange({ range });
		},
		[onChange],
	);

	const handleCustomDateChange = useCallback(() => {
		const startDate = customStartDate
			? parseDateString(customStartDate) || undefined
			: undefined;
		const endDate = customEndDate ? parseDateString(customEndDate) || undefined : undefined;

		// Basic validation - ensure dates are valid if provided
		if (customStartDate && !startDate) return; // Invalid start date
		if (customEndDate && !endDate) return; // Invalid end date
		if (startDate && endDate && startDate > endDate) return; // Start after end

		if (startDate || endDate) {
			onChange({
				range: "CUSTOM",
				startDate,
				endDate,
			});
		}
		setIsCustomOpen(false);
	}, [customStartDate, customEndDate, onChange]);

	const resetCustomDates = useCallback(() => {
		setCustomStartDate("");
		setCustomEndDate("");
	}, []);

	const navigateTimeRange = useCallback(
		(direction: "prev" | "next") => {
			if (value.range === "CUSTOM" || !dataRange?.length) return;

			const currentRange = value.range;
			const currentIndex = TIME_RANGES.findIndex(
				(r) => r.value === currentRange,
			);
			
			if (direction === "prev" && currentIndex > 0) {
				onChange({ range: TIME_RANGES[currentIndex - 1].value as Exclude<TimeRange, "CUSTOM"> });
			} else if (direction === "next" && currentIndex < TIME_RANGES.length - 1) {
				onChange({ range: TIME_RANGES[currentIndex + 1].value as Exclude<TimeRange, "CUSTOM"> });
			}
		},
		[value.range, onChange, dataRange],
	);

	const formatDateRange = useCallback(() => {
		if (value.range === "CUSTOM") {
			const start = value.startDate
				? formatDateForUrl(value.startDate)
				: "Start";
			const end = value.endDate ? formatDateForUrl(value.endDate) : "End";
			return `${start} - ${end}`;
		}
		return value.range;
	}, [value]);

	return (
		<div className={cn("space-y-3", className)}>
			{/* Quick Range Buttons */}
			<div className="flex items-center gap-1 flex-wrap">
				{showNavigationButtons && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigateTimeRange("prev")}
						disabled={
							value.range === "CUSTOM" ||
							TIME_RANGES.findIndex((r) => r.value === value.range) === 0
						}
						className="px-2"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
				)}

				{TIME_RANGES.map((range) => (
					<Button
						key={range.value}
						variant={value.range === range.value ? "default" : "outline"}
						size="sm"
						onClick={() => handleQuickRangeChange(range.value)}
						className="px-3 py-1 text-sm"
					>
						{range.label}
					</Button>
				))}

				<Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
					<PopoverTrigger asChild>
						<Button
							variant={value.range === "CUSTOM" ? "default" : "outline"}
							size="sm"
							className="px-3 py-1 text-sm"
						>
							<CalendarDays className="h-4 w-4 mr-1" />
							{t("dateRange.customDateRange")}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-80" align="start">
						<div className="space-y-4">
							<div className="space-y-2">
								<h4 className="font-medium leading-none">{t("dateRange.customDateRange")}</h4>
								<p className="text-sm text-muted-foreground">
									{t("dateRange.dateFormatHint")}
								</p>
							</div>

							<div className="grid gap-2">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="start-date" className="text-right">
										From
									</Label>
									<div className="col-span-3">
										<DateInput
											id="start-date"
											placeholder="2024-01-15"
											value={customStartDate}
											onChange={setCustomStartDate}
											className="font-mono text-sm"
											showError={false}
										/>
									</div>
								</div>
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="end-date" className="text-right">
										To
									</Label>
									<div className="col-span-3">
										<DateInput
											id="end-date"
											placeholder="2024-08-15"
											value={customEndDate}
											onChange={setCustomEndDate}
											className="font-mono text-sm"
											showError={false}
										/>
									</div>
								</div>
							</div>

							{dataBounds && dataBounds.startDate && dataBounds.endDate && (
								<div className="text-xs text-muted-foreground space-y-1">
									<p>{t("dateRange.availableDataRange")}</p>
									<p>
										{formatDateForUrl(dataBounds.startDate)} to{" "}
										{formatDateForUrl(dataBounds.endDate)}
									</p>
								</div>
							)}

							<div className="flex justify-between">
								<Button
									variant="outline"
									size="sm"
									onClick={resetCustomDates}
								>
									{t("dateRange.reset")}
								</Button>
								<Button size="sm" onClick={handleCustomDateChange}>
									{t("dateRange.applyRange")}
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{showNavigationButtons && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigateTimeRange("next")}
						disabled={
							value.range === "CUSTOM" ||
							TIME_RANGES.findIndex((r) => r.value === value.range) ===
								TIME_RANGES.length - 1
						}
						className="px-2"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Current Selection Display */}
			<div className="flex items-center gap-2 text-sm">
				<Calendar className="h-4 w-4 text-muted-foreground" />
				<span className="text-muted-foreground">Range:</span>
				<Badge variant="secondary" className="font-mono">
					{formatDateRange()}
				</Badge>
				{showDataInfo && dataRange && (
					<span className="text-xs text-muted-foreground">
						({dataRange.length} data points)
					</span>
				)}
			</div>
		</div>
	);
}