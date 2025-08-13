import type { AskAITemplate } from "@/lib/ask-ai-utils";

export const multipleTickerTemplatesEN: AskAITemplate[] = [
	{
		id: "compare-performance",
		title: "Compare performance of these tickers",
		prompt: "Please compare the performance of these tickers based on their chart data and VPA analysis. Which ones are performing better and why?"
	},
	{
		id: "best-investment",
		title: "Which ticker is the best investment?",
		prompt: "Based on the technical analysis and VPA data for all these tickers, which one would be the best investment opportunity right now? Provide detailed reasoning."
	},
	{
		id: "portfolio-allocation",
		title: "Portfolio allocation recommendation",
		prompt: "If I were to create a portfolio with these tickers, what would be the optimal allocation percentage for each? Consider risk, growth potential, and correlation."
	},
	{
		id: "risk-comparison",
		title: "Risk comparison analysis",
		prompt: "Compare the risk levels of these tickers based on their price volatility, volume patterns, and technical indicators. Rank them from lowest to highest risk."
	},
	{
		id: "sector-analysis",
		title: "Sector and correlation analysis",
		prompt: "Analyze these tickers from a sector perspective. How are they correlated? Are there any sector-specific trends affecting their performance?"
	},
	{
		id: "diversification-benefits",
		title: "Diversification benefits",
		prompt: "How well do these tickers complement each other for diversification purposes? Are there any overlapping risks or redundancies?"
	},
	{
		id: "momentum-comparison",
		title: "Momentum comparison",
		prompt: "Compare the momentum signals across these tickers. Which ones show the strongest bullish or bearish momentum based on price and volume action?"
	},
	{
		id: "entry-strategy",
		title: "Multi-ticker entry strategy",
		prompt: "If I want to invest in multiple tickers from this selection, what would be the optimal entry strategy? Should I enter all at once or stagger my entries?"
	},
	{
		id: "correlation-pairs",
		title: "Find correlated pairs",
		prompt: "Identify which tickers tend to move together (positively correlated) and which move in opposite directions (negatively correlated). How can this information be used for trading?"
	},
	{
		id: "market-conditions",
		title: "Performance under different market conditions",
		prompt: "Based on the data, how do these tickers perform under different market conditions (bullish, bearish, sideways)? Which are defensive and which are growth-oriented?"
	}
];