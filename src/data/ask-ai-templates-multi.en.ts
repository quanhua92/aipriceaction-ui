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
	},
	{
		id: "pairs-trading",
		title: "Pairs trading opportunities",
		prompt: "Identify potential pairs trading opportunities among these tickers. Which pairs show strong correlation for mean reversion strategies or divergence for momentum plays?"
	},
	{
		id: "sector-rotation",
		title: "Sector rotation analysis",
		prompt: "Based on the performance patterns, which sectors represented by these tickers are in favor and which are out of favor? What does this suggest for sector rotation strategy?"
	},
	{
		id: "market-cap-analysis",
		title: "Market capitalization analysis",
		prompt: "Compare these tickers by market cap and analyze how large-cap vs small-cap stocks are performing. What market cap bias should I consider for my portfolio?"
	},
	{
		id: "beta-analysis",
		title: "Beta and market sensitivity",
		prompt: "Analyze the beta (market sensitivity) of these tickers relative to VNINDEX. Which are high-beta growth stocks and which are low-beta defensive stocks?"
	},
	{
		id: "liquidity-comparison",
		title: "Liquidity comparison",
		prompt: "Compare the liquidity profiles of these tickers based on volume patterns. Which stocks offer the best liquidity for large position entries and exits?"
	},
	{
		id: "event-correlation",
		title: "Event correlation analysis",
		prompt: "How do these tickers react to market events, earnings announcements, or economic news? Are there common reaction patterns or divergent behaviors?"
	},
	{
		id: "hedge-construction",
		title: "Hedge portfolio construction",
		prompt: "How can I use these tickers to construct a market-neutral or hedged portfolio? Which combinations provide the best hedge against market risk?"
	},
	{
		id: "timing-strategy",
		title: "Capital allocation timing",
		prompt: "Based on the technical patterns and momentum, what would be the optimal timing for allocating capital to each of these tickers? Should I invest simultaneously or sequentially?"
	},
	{
		id: "drawdown-analysis",
		title: "Maximum drawdown comparison",
		prompt: "Compare the maximum drawdown periods for these tickers. Which stocks show better downside protection and faster recovery from losses?"
	},
	{
		id: "trend-strength",
		title: "Trend strength comparison",
		prompt: "Compare the trend strength across these tickers. Which stocks are in the strongest uptrends or downtrends based on price action and momentum indicators?"
	},
	{
		id: "rebalancing-strategy",
		title: "Portfolio rebalancing strategy",
		prompt: "If I hold all these tickers in a portfolio, when and how should I rebalance based on their relative performance and technical signals?"
	}
];