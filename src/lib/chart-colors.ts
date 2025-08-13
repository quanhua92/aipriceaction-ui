// Shared chart colors and utilities for unlimited ticker support

export const baseChartColors = [
	"#3B82F6", // blue-500
	"#10B981", // emerald-500
	"#F59E0B", // amber-500
	"#EF4444", // red-500
	"#8B5CF6", // violet-500
	"#06B6D4", // cyan-500
	"#F97316", // orange-500
	"#84CC16", // lime-500
	"#EC4899", // pink-500
	"#6366F1", // indigo-500
	"#14B8A6", // teal-500
	"#F97316", // orange-500
	"#8B5CF6", // violet-500
	"#059669", // emerald-600
	"#DC2626", // red-600
	"#7C3AED", // violet-600
	"#0891B2", // cyan-600
	"#EA580C", // orange-600
	"#65A30D", // lime-600
	"#BE185D", // pink-600
];

/**
 * Get a color for any index, supporting unlimited tickers
 * Uses predefined colors for first 20, then generates colors using golden angle
 */
export function getColorForIndex(index: number): string {
	if (index < baseChartColors.length) {
		return baseChartColors[index];
	}
	// Generate a color based on index for unlimited support
	const hue = (index * 137.5) % 360; // Golden angle for good distribution
	return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Generate colors array for a given number of items
 */
export function generateColorsArray(count: number): string[] {
	return Array.from({ length: count }, (_, index) => getColorForIndex(index));
}