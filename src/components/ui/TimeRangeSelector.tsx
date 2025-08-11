import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TimeRange } from "@/lib/stock-data";

interface TimeRangeSelectorProps {
	value: TimeRange;
	onChange: (range: TimeRange) => void;
	className?: string;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
	{ value: "1M", label: "1M" },
	{ value: "3M", label: "3M" },
	{ value: "6M", label: "6M" },
	{ value: "1Y", label: "1Y" },
	{ value: "2Y", label: "2Y" },
	{ value: "ALL", label: "ALL" },
];

export function TimeRangeSelector({
	value,
	onChange,
	className,
}: TimeRangeSelectorProps) {
	return (
		<div className={cn("flex gap-1", className)}>
			{TIME_RANGES.map((range) => (
				<Button
					key={range.value}
					variant={value === range.value ? "default" : "outline"}
					size="sm"
					onClick={() => onChange(range.value)}
					className="px-3 py-1 text-sm"
				>
					{range.label}
				</Button>
			))}
		</div>
	);
}
