import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface DateInputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> {
	value?: string;
	onChange?: (value: string) => void;
	onValidationChange?: (isValid: boolean, error: string) => void;
	showError?: boolean;
	errorClassName?: string;
	helpText?: string;
}

// Validate date format (YYYY-MM-DD)
const validateDate = (date: string): string => {
	if (!date) return '';
	
	const datePattern = /^\d{4}-\d{2}-\d{2}$/;
	if (!datePattern.test(date)) {
		return 'Date must be in YYYY-MM-DD format';
	}
	
	const parsedDate = new Date(date);
	if (isNaN(parsedDate.getTime())) {
		return 'Invalid date';
	}
	
	// Check if the date components match the input (catches invalid dates like 2023-02-30)
	const [year, month, day] = date.split('-').map(Number);
	if (parsedDate.getFullYear() !== year || 
		parsedDate.getMonth() + 1 !== month || 
		parsedDate.getDate() !== day) {
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
		...props 
	}, ref) => {
		const [error, setError] = useState<string>('');

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

		const hasError = error !== '';

		return (
			<div className="space-y-2">
				<Input
					ref={ref}
					type="text"
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					className={cn(
						"font-mono",
						hasError && "border-red-500 focus:border-red-500",
						className
					)}
					placeholder="YYYY-MM-DD"
					maxLength={10}
					{...props}
				/>
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