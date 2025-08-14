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
	},
	{
		id: "support-resistance",
		title: "Support and resistance levels",
		prompt: "Identify the key support and resistance levels for this ticker based on the historical price data. What are the most significant price levels to watch?"
	},
	{
		id: "chart-patterns",
		title: "Chart pattern recognition",
		prompt: "Are there any recognizable chart patterns (head & shoulders, triangles, flags, wedges, double tops/bottoms) forming in this ticker? What do these patterns suggest?"
	},
	{
		id: "breakout-potential",
		title: "Breakout analysis",
		prompt: "Is this ticker setting up for a potential breakout? Analyze the consolidation patterns, volume, and price action to assess breakout probability and direction."
	},
	{
		id: "stop-loss-strategy",
		title: "Stop loss recommendations",
		prompt: "Based on the technical analysis and volatility patterns, where would be appropriate stop loss levels for both long and short positions in this ticker?"
	},
	{
		id: "sector-comparison",
		title: "Sector performance comparison",
		prompt: "How is this ticker performing relative to its sector and the overall market (VNINDEX)? Is it outperforming or underperforming its peers?"
	},
	{
		id: "liquidity-analysis",
		title: "Liquidity and trading analysis",
		prompt: "Analyze the liquidity of this ticker based on volume patterns and price spreads. Is there sufficient liquidity for smooth entry and exit?"
	},
	{
		id: "institutional-activity",
		title: "Institutional activity analysis",
		prompt: "Based on volume patterns and price movements, what can you infer about institutional or smart money activity in this ticker? Are they accumulating or distributing?"
	},
	{
		id: "fibonacci-analysis",
		title: "Fibonacci retracement analysis",
		prompt: "Apply Fibonacci retracement levels to recent price movements. What are the key Fibonacci levels that might act as support or resistance?"
	},
	{
		id: "volatility-assessment",
		title: "Volatility and risk metrics",
		prompt: "Analyze the volatility patterns of this ticker. How volatile is it compared to historical norms? What does this mean for position sizing?"
	},
	{
		id: "market-context",
		title: "Market context analysis",
		prompt: "How is the broader market context (VNINDEX trend, market sentiment, economic factors) affecting this ticker's price action? Should I consider macro factors?"
	},
	{
		id: "profit-maximization",
		title: "Profit maximization strategy",
		prompt: "Based on all available data (chart, VPA, company fundamentals), what is the highest probability strategy to maximize profits from this ticker? Include optimal position sizing, entry timing, and profit-taking levels."
	},
	{
		id: "risk-reward-ratio",
		title: "Risk-reward ratio analysis",
		prompt: "Calculate the risk-reward ratio for potential trades in this ticker. What is the best risk-reward setup available right now? Where should I place stops and targets for maximum profitability?"
	},
	{
		id: "failure-prevention",
		title: "Common trading failures to avoid",
		prompt: "Based on this ticker's price action and VPA patterns, what are the most common trading mistakes that lead to losses? How can I avoid these failure points and protect my capital?"
	},
	{
		id: "market-timing",
		title: "Optimal market timing",
		prompt: "When is the absolute best time to enter and exit this ticker? Analyze intraday patterns, weekly cycles, and seasonal trends to identify the highest probability timing windows."
	},
	{
		id: "position-sizing",
		title: "Position sizing for maximum safety",
		prompt: "Given this ticker's volatility and my risk tolerance, what position size would maximize returns while protecting against catastrophic losses? Include Kelly criterion analysis if applicable."
	},
	{
		id: "catalyst-analysis",
		title: "Upcoming catalysts and events",
		prompt: "What upcoming events, earnings, or market catalysts could significantly impact this ticker's price? How should I position myself to profit from these potential moves?"
	},
	{
		id: "insider-smart-money",
		title: "Smart money and insider activity",
		prompt: "What does the volume and price action suggest about smart money, institutional, or insider activity? Are they accumulating or distributing? How can I align with smart money flow?"
	},
	{
		id: "profit-protection",
		title: "Profit protection strategy",
		prompt: "If I'm already profitable in this position, what's the best strategy to protect and maximize these gains? Should I use trailing stops, partial profit-taking, or other techniques?"
	},
	{
		id: "contrarian-opportunities",
		title: "Contrarian opportunity analysis",
		prompt: "Is there a contrarian play opportunity in this ticker? When everyone is bearish, is it time to be bullish (or vice versa)? Analyze sentiment vs. technical data for contrarian profits."
	},
	{
		id: "dividend-income-analysis",
		title: "Dividend and income potential",
		prompt: "Analyze this ticker's dividend history and income potential. Is this suitable for income-focused strategies? What's the dividend safety and growth prospects?"
	},
	{
		id: "options-strategies",
		title: "Options trading opportunities",
		prompt: "What options strategies would be most profitable for this ticker's current setup? Analyze covered calls, cash-secured puts, or more complex strategies based on volatility and direction."
	},
	{
		id: "earnings-strategy",
		title: "Earnings play strategy",
		prompt: "How should I trade this ticker around earnings announcements? What's the historical earnings reaction pattern? Should I hold through earnings or close before?"
	},
	{
		id: "capital-preservation",
		title: "Capital preservation priority",
		prompt: "If capital preservation is my top priority, how should I approach this ticker? What's the safest way to participate in potential upside while minimizing downside risk?"
	},
	{
		id: "momentum-scalping",
		title: "Momentum and scalping opportunities",
		prompt: "What short-term momentum and scalping opportunities exist in this ticker? Identify the best intraday patterns and quick profit opportunities based on VPA analysis."
	},
	{
		id: "swing-trading-setup",
		title: "Swing trading optimization",
		prompt: "What's the optimal swing trading setup for this ticker? Analyze the best holding periods, entry/exit patterns, and profit targets for swing trades based on historical patterns."
	},
	{
		id: "value-trap-analysis",
		title: "Value trap detection",
		prompt: "Is this ticker a value trap or genuine opportunity? Analyze whether apparent cheapness is justified by fundamentals or if there are hidden risks that could lead to continued underperformance."
	},
	{
		id: "recovery-potential",
		title: "Recovery and turnaround potential",
		prompt: "If this ticker has been declining, what's the recovery potential? Analyze whether this is a temporary setback or structural decline. What signals would indicate a successful turnaround?"
	}
];