import type { AskAITemplate } from "@/lib/ask-ai-utils";

export const singleTickerTemplatesEN: AskAITemplate[] = [
	{
		id: "should-buy",
		title: "Should I buy this ticker?",
		prompt: "Based on the chart data and volume price action analysis above, should I buy this ticker? Please analyze the recent price movements, volume patterns, and provide a recommendation with reasoning."
	},
	{
		id: "explain-movement",
		title: "Explain this ticker movement",
		prompt: "Please explain the recent price movement of this ticker based on the chart data and VPA analysis. What are the key factors driving the price action?"
	},
	{
		id: "technical-analysis",
		title: "Technical analysis summary",
		prompt: "Provide a comprehensive technical analysis of this ticker based on the chart data and volume patterns. Include support/resistance levels, trend analysis, and momentum indicators."
	},
	{
		id: "risk-assessment",
		title: "Risk assessment",
		prompt: "What are the potential risks and opportunities for this ticker based on the current chart data and VPA analysis? Provide a risk-reward assessment."
	},
	{
		id: "entry-exit-points",
		title: "Entry and exit points",
		prompt: "Based on the technical analysis and VPA data, what would be good entry and exit points for this ticker? Please provide specific price levels and reasoning."
	},
	{
		id: "volume-analysis",
		title: "Volume analysis",
		prompt: "Analyze the volume patterns shown in the data. How does volume relate to price movements? Are there any significant volume spikes or anomalies?"
	},
	{
		id: "trend-direction",
		title: "Trend direction",
		prompt: "What is the current trend direction for this ticker? Is it bullish, bearish, or sideways? Provide evidence from the chart data and VPA analysis."
	},
	{
		id: "short-term-outlook",
		title: "Short-term outlook",
		prompt: "What is your short-term outlook (1-2 weeks) for this ticker based on the recent data? What should I watch for in the coming days?"
	},
	{
		id: "long-term-potential",
		title: "Long-term investment potential",
		prompt: "Evaluate the long-term investment potential of this ticker. Based on the historical data and current patterns, is this suitable for long-term holding?"
	},
	{
		id: "price-targets",
		title: "Price targets",
		prompt: "Based on the technical analysis and support/resistance levels, what are realistic price targets for this ticker in the next 1-3 months?"
	}
];