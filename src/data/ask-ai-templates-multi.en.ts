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
	},
	{
		id: "profit-optimization-portfolio",
		title: "Maximum profit portfolio strategy",
		prompt: "Design the ultimate profit-maximizing strategy using these tickers. What allocation, entry timing, and profit-taking approach would generate the highest returns while managing risk?"
	},
	{
		id: "capital-rotation-strategy",
		title: "Capital rotation optimization",
		prompt: "How should I rotate capital between these tickers to maximize gains? Which ticker should get capital first, second, third? When should I move money from one to another for optimal profits?"
	},
	{
		id: "risk-parity-approach",
		title: "Risk parity portfolio construction",
		prompt: "Build a risk parity portfolio with these tickers where each contributes equal risk. What weightings achieve this? How does this compare to market cap weighted or equal weighted approaches?"
	},
	{
		id: "momentum-ranking-system",
		title: "Momentum ranking and rotation",
		prompt: "Rank these tickers by momentum strength and create a rotation system. Which should I overweight, underweight, or avoid entirely? How often should I reassess rankings?"
	},
	{
		id: "defensive-aggressive-split",
		title: "Defensive vs aggressive allocation",
		prompt: "Split these tickers into defensive and aggressive buckets. How should I allocate between defensive and aggressive based on current market conditions? What ratio optimizes risk-adjusted returns?"
	},
	{
		id: "earnings-season-strategy",
		title: "Earnings season portfolio strategy",
		prompt: "How should I position this portfolio around earnings season? Which tickers to hold through earnings, which to sell before, and which to buy after? Optimize for earnings-related profits."
	},
	{
		id: "market-crash-protection",
		title: "Market crash protection strategy",
		prompt: "How can I position this portfolio to profit or at least protect against a market crash? Which tickers provide the best downside protection? Should I hedge or go to cash?"
	},
	{
		id: "sector-momentum-rotation",
		title: "Sector momentum rotation strategy",
		prompt: "Based on sector representation in these tickers, create a sector rotation strategy. Which sectors are gaining momentum and deserve more allocation? Which are losing momentum?"
	},
	{
		id: "volatility-harvesting",
		title: "Volatility harvesting opportunities",
		prompt: "How can I harvest volatility from these tickers for additional profits? Which combinations offer the best volatility arbitrage or mean reversion opportunities?"
	},
	{
		id: "tax-optimization-strategy",
		title: "Tax-optimized trading strategy",
		prompt: "Design a tax-optimized approach for trading these tickers. When to realize gains vs losses? How to optimize for long-term vs short-term capital gains treatment?"
	},
	{
		id: "liquidity-tiered-approach",
		title: "Liquidity-tiered position sizing",
		prompt: "Tier these tickers by liquidity and recommend position sizes accordingly. How should illiquid positions be sized differently? What's the optimal liquidity-based allocation strategy?"
	},
	{
		id: "crisis-opportunity-positioning",
		title: "Crisis opportunity positioning",
		prompt: "If a market crisis occurs, which of these tickers offer the best recovery opportunities? How should I position for maximum gains during market dislocations and subsequent recovery?"
	},
	{
		id: "income-growth-balance",
		title: "Income vs growth optimization",
		prompt: "Balance these tickers for optimal income vs growth. What allocation maximizes total returns (dividends + capital gains)? How should this change based on market cycles?"
	},
	{
		id: "correlation-arbitrage",
		title: "Correlation arbitrage opportunities",
		prompt: "Identify correlation arbitrage opportunities among these tickers. When correlations break down, how can I profit? What pairs offer the best statistical arbitrage potential?"
	},
	{
		id: "market-leadership-rotation",
		title: "Market leadership rotation strategy",
		prompt: "Which of these tickers are market leaders vs laggards? Create a strategy to rotate from leaders to laggards and back. When do leadership changes typically occur?"
	},
	{
		id: "options-overlay-strategy",
		title: "Options overlay for enhanced returns",
		prompt: "Design an options overlay strategy for this stock portfolio. Which tickers are best for covered calls, protective puts, or collar strategies? How much additional income can be generated?"
	},
	{
		id: "drawdown-minimization",
		title: "Maximum drawdown minimization",
		prompt: "Configure this portfolio to minimize maximum drawdown while maintaining return potential. What allocation and trading rules achieve the best risk-adjusted returns?"
	},
	{
		id: "multi-timeframe-strategy",
		title: "Multi-timeframe allocation strategy",
		prompt: "Design different allocation strategies for different timeframes: day trading, swing trading, and long-term investing. How should position sizes and strategies vary by timeframe?"
	},
	{
		id: "smart-rebalancing-triggers",
		title: "Smart rebalancing triggers",
		prompt: "Create intelligent rebalancing triggers beyond calendar-based rebalancing. What technical, fundamental, or market condition signals should trigger rebalancing for maximum efficiency?"
	},
	{
		id: "concentration-vs-diversification",
		title: "Optimal concentration vs diversification",
		prompt: "What's the optimal level of concentration vs diversification with these tickers? Should I focus on top 2-3 performers or spread equally? How does this change with market conditions?"
	}
];