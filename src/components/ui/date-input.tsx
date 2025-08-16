import { useState, forwardRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DateInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
	value?: string;
	onChange?: (value: string) => void;
	onValidationChange?: (isValid: boolean, error: string) => void;
	showError?: boolean;
	errorClassName?: string;
	helpText?: string;
	showDatePicker?: boolean;
}

// Format Date object to YYYY-MM-DD string
const formatDateToString = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD string to Date object
const parseStringToDate = (dateString: string): Date | null => {
	if (!dateString) return null;
	
	const datePattern = /^\d{4}-\d{2}-\d{2}$/;
	if (!datePattern.test(dateString)) return null;
	
	const [year, month, day] = dateString.split('-').map(Number);
	const date = new Date(year, month - 1, day);
	
	// Verify the date is valid and matches the input
	if (date.getFullYear() !== year || 
		date.getMonth() + 1 !== month || 
		date.getDate() !== day) {
		return null;
	}
	
	return date;
};

// Validate date format (YYYY-MM-DD)
const validateDate = (date: string): string => {
	if (!date) return '';
	
	const datePattern = /^\d{4}-\d{2}-\d{2}$/;
	if (!datePattern.test(date)) {
		return 'Date must be in YYYY-MM-DD format';
	}
	
	const parsedDate = parseStringToDate(date);
	if (!parsedDate) {
		return 'Invalid date';
	}
	
	return '';
};

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
	({ 
		className, 
		value = '', 
		onChange, 
		onValidationChange,
		showError = true,
		errorClassName,
		helpText,
		showDatePicker = true,
		...props 
	}, ref) => {
		const [error, setError] = useState<string>('');
		const [isOpen, setIsOpen] = useState(false);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			onChange?.(newValue);
			
			// Clear error when user starts typing
			if (error) {
				setError('');
				onValidationChange?.(true, '');
			}
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			const validationError = validateDate(e.target.value);
			setError(validationError);
			onValidationChange?.(validationError === '', validationError);
			props.onBlur?.(e);
		};

		const handleDateSelect = (selectedDate: Date | undefined) => {
			if (selectedDate) {
				const formattedDate = formatDateToString(selectedDate);
				onChange?.(formattedDate);
				
				// Clear any existing error
				if (error) {
					setError('');
					onValidationChange?.(true, '');
				}
				
				setIsOpen(false);
			}
		};

		const hasError = error !== '';
		const selectedDate = parseStringToDate(value);

		const inputElement = (
			<Input
				ref={ref}
				type="text"
				value={value}
				onChange={handleChange}
				onBlur={handleBlur}
				className={cn(
					"font-mono",
					hasError && "border-red-500 focus:border-red-500",
					showDatePicker && "pr-10",
					className
				)}
				placeholder="YYYY-MM-DD"
				maxLength={10}
				{...props}
			/>
		);

		return (
			<div className="space-y-2">
				{showDatePicker ? (
					<div className="relative">
						{inputElement}
						<Popover open={isOpen} onOpenChange={setIsOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
									onClick={() => setIsOpen(!isOpen)}
									type="button"
								>
									<CalendarIcon className="h-4 w-4 text-muted-foreground" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									selected={selectedDate || undefined}
									onSelect={handleDateSelect}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</div>
				) : (
					inputElement
				)}
				{showError && hasError ? (
					<p className={cn("text-xs text-red-600 font-medium", errorClassName)}>
						{error}
					</p>
				) : helpText ? (
					<p className="text-xs text-muted-foreground">
						{helpText}
					</p>
				) : null}
			</div>
		);
	}
);

DateInput.displayName = "DateInput";