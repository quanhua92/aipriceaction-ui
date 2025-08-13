/**
 * Date utilities for Vietnamese stock market data
 * All dates should be handled as Vietnam time (UTC+7)
 */

export const VIETNAM_TIMEZONE_OFFSET = 7 * 60; // UTC+7 in minutes

/**
 * Parse a date string (YYYY-MM-DD) as Vietnam timezone date
 * This ensures the date is interpreted correctly regardless of browser timezone
 */
export function parseVietnamDate(dateStr: string): Date {
	const [year, month, day] = dateStr.split('-').map(Number);
	
	// Create date in UTC then adjust to Vietnam time
	const utcDate = new Date(Date.UTC(year, month - 1, day));
	
	// Return as Vietnam timezone (this keeps the correct date when formatted)
	return utcDate;
}

/**
 * Format a date as YYYY-MM-DD string in Vietnam timezone
 */
export function formatVietnamDate(date: Date): string {
	// Convert to Vietnam time for formatting
	const vietnamTime = new Date(date.getTime() + (VIETNAM_TIMEZONE_OFFSET * 60 * 1000));
	return vietnamTime.toISOString().split('T')[0];
}

/**
 * Get current date in Vietnam timezone as Date object
 */
export function getVietnamToday(): Date {
	const now = new Date();
	return new Date(now.getTime() + (VIETNAM_TIMEZONE_OFFSET * 60 * 1000));
}

/**
 * Get current date in Vietnam timezone as YYYY-MM-DD string
 */
export function getVietnamTodayString(): string {
	return formatVietnamDate(new Date());
}

/**
 * Compare two dates for filtering (ignoring time components)
 * Both dates are assumed to be in Vietnam timezone context
 */
export function isDateAfterOrEqual(date: Date, compareDate: Date): boolean {
	const dateStr = formatVietnamDate(date);
	const compareStr = formatVietnamDate(compareDate);
	return dateStr >= compareStr;
}

/**
 * Compare two dates for filtering (ignoring time components)
 * Both dates are assumed to be in Vietnam timezone context
 */
export function isDateBeforeOrEqual(date: Date, compareDate: Date): boolean {
	const dateStr = formatVietnamDate(date);
	const compareStr = formatVietnamDate(compareDate);
	return dateStr <= compareStr;
}

/**
 * Create a Vietnam timezone date from year, month, day
 */
export function createVietnamDate(year: number, month: number, day: number): Date {
	return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Get the start of day in Vietnam timezone
 */
export function getVietnamDayStart(date: Date): Date {
	const dateStr = formatVietnamDate(date);
	return parseVietnamDate(dateStr);
}

/**
 * Calculate date difference in days (Vietnam timezone aware)
 */
export function getDateDifferenceInDays(date1: Date, date2: Date): number {
	const str1 = formatVietnamDate(date1);
	const str2 = formatVietnamDate(date2);
	const d1 = parseVietnamDate(str1);
	const d2 = parseVietnamDate(str2);
	const diffTime = Math.abs(d2.getTime() - d1.getTime());
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Sort dates in chronological order (Vietnam timezone aware)
 */
export function sortDatesByVietnamTime(dates: Date[]): Date[] {
	return dates.sort((a, b) => {
		const aStr = formatVietnamDate(a);
		const bStr = formatVietnamDate(b);
		return aStr.localeCompare(bStr);
	});
}