export const en = {
  // Navigation
  nav: {
    dashboard: "Dashboard",
    sectors: "Sectors", 
    tickers: "Tickers",
    compareCharts: "Compare Charts",
    portfolioAnalysis: "Portfolio Analysis",
  },

  // Common
  common: {
    loading: "Loading...",
    noData: "No data available",
    loadingData: "Loading data...",
    search: "Search",
    back: "Back",
    apply: "Apply",
    reset: "Reset",
    clearAll: "Clear All",
    more: "more",
    daily: "Daily",
    price: "Price",
    change: "Change",
    changePercent: "Change %",
    volume: "Volume",
    open: "Open",
    high: "High", 
    low: "Low",
    close: "Close",
    actions: "Actions",
    view: "View",
    ticker: "Ticker",
    current: "Current",
    active: "Active",
    compare: "Compare",
  },

  // Home/Dashboard
  home: {
    title: "AIPriceAction: Vietnamese Stock Market",
    subtitle: "Real-time analysis and insights for Vietnamese stock market",
    keySectorPerformance: "Key Sector Performance",
    topPerformers: "Top Performers",
    topGainers: "Top Gainers",
    topLosers: "Top Losers",
    marketOverview: "Market Overview",
    vnIndex: "VN-Index",
    sectors: "Sectors",
    viewAllSectors: "View All Sectors",
    viewAllTickers: "View All Tickers",
    quickActions: "Quick Actions",
    compareStocks: "Compare Stocks",
    analyzePortfolio: "Analyze Portfolio",
  },

  // Portfolio
  portfolio: {
    title: "Portfolio Analysis", 
    subtitle: "Comprehensive analysis of {count} stocks vs VN-Index benchmark",
    buildPortfolio: "Build Your Portfolio",
    searchForStocks: "Search for Stocks",
    searchPlaceholder: "Type stock symbol (e.g., VCB, VHM, HPG)...",
    searchHint: "Start typing to search Vietnamese stocks",
    samplePortfolios: "Or try these sample portfolios:",
    bankingPortfolio: "Banking Portfolio",
    realEstatePortfolio: "Real Estate Portfolio", 
    industrialPortfolio: "Industrial Portfolio",
    securitiesPortfolio: "Securities Portfolio",
    configuration: "Portfolio Configuration",
    addStock: "Add Stock to Portfolio",
    addStockPlaceholder: "Search and add stocks to your portfolio...",
    addVnindexQuickly: "Add VN-Index as benchmark for comparison",
    missingBenchmark: "VN-Index benchmark not found",
    addVnindexForComparison: "Add VN-Index to compare portfolio performance",
    noStocksInPortfolio: "No stocks in portfolio",
    currentPortfolio: "Current Portfolio ({count} stocks)",
    clickToRemove: "Click on a stock badge to remove it from your portfolio",
    clickToRemoveStock: "Click to remove {ticker}",
    analysisPeriod: "Analysis Period",
    openInCompare: "Open in Compare",
    performanceOverview: "Performance Overview", 
    stocksPerformance: "Portfolio Stocks Performance",
    riskAdjustedPerformance: "Risk-Adjusted Performance",
    performanceAttribution: "Performance Attribution",
    diversificationAnalysis: "Diversification Analysis",
    volatilityAnalysis: "Volatility Analysis",
    portfolioVolatility: "Portfolio Volatility", 
    benchmarkVolatility: "Benchmark Volatility",
    vnindexBenchmark: "VNINDEX (Benchmark)",
    removeVnindex: "Click to remove VNINDEX benchmark",
  },

  // Portfolio Metrics
  metrics: {
    totalReturn: "Total Return",
    activeReturn: "Active Return", 
    sharpeRatio: "Sharpe Ratio",
    informationRatio: "Information Ratio",
    volatility: "Volatility",
    beta: "Beta",
    maximumDrawdown: "Maximum Drawdown",
    valueAtRisk: "Value at Risk (95%)",
    correlation: "Correlation",
    alpha: "Alpha",
  },

  // Educational Guide
  guide: {
    title: "Portfolio Analysis Guide",
    subtitle: "Understand the key metrics and concepts used in your portfolio analysis:",
    performanceMetrics: "Performance Metrics",
    riskMetrics: "Risk Metrics", 
    diversificationAttribution: "Diversification & Attribution",
    interpretResults: "How to Interpret Your Results",
    goodPerformance: "Good Performance: Positive active return, Sharpe ratio > 1.0, moderate volatility",
    wellDiversified: "Well-Diversified: Low correlations between stocks, spread across multiple sectors",
    balancedRisk: "Balanced Risk: Beta around 1.0, maximum drawdown < 30%, reasonable volatility for your risk tolerance",
    timeHorizon: "Time Horizon: Longer time periods (6M-2Y) provide more meaningful analysis than short periods (1M)",
    disclaimer: "Disclaimer: This analysis is for educational purposes only and should not be considered investment advice. Past performance does not guarantee future results. Always consult with financial advisors before making investment decisions.",
    
    // Detailed explanations
    totalReturnExplain: "The overall gain or loss on your portfolio over the selected time period, expressed as a percentage.",
    activeReturnExplain: "The difference between your portfolio's return and the VN-Index benchmark. Positive values indicate outperformance.",
    sharpeRatioExplain: "Measures risk-adjusted return. Higher values (>1.0) indicate better risk-adjusted performance.",
    informationRatioExplain: "Shows how consistently you outperform the benchmark relative to the additional risk taken.",
    volatilityExplain: "Measures how much your portfolio's returns fluctuate. Lower volatility indicates more stable returns.",
    betaExplain: "Measures sensitivity to market movements. Beta > 1 means more volatile than the market, < 1 means less volatile.",
    maximumDrawdownExplain: "The largest peak-to-trough decline in your portfolio's value. Shows worst-case scenario losses.",
    valueAtRiskExplain: "The maximum expected loss on 95% of trading days. Helps estimate potential daily losses.",
    correlationExplain: "Measures how stocks move together. Values near 0 indicate good diversification, near 1 means stocks move similarly.",
    performanceAttributionExplain: "Shows which stocks contributed most to your portfolio's gains or losses.",
    sectorAllocationExplain: "Distribution of your investments across different industry sectors (Banking, Real Estate, etc.).",
    alphaExplain: "The excess return generated by a stock beyond what would be expected based on its beta and market performance.",
  },

  // Compare
  compare: {
    title: "Compare Charts",
    subtitle: "Compare unlimited stock charts in a responsive 2-column grid (1 column on mobile)",
    chartConfiguration: "Chart Configuration",
    selectTickers: "Select Tickers",
    dateRange: "Date Range",
    addVnIndex: "Add VN-Index",
    bankingStocks: "Banking Stocks",
    realEstate: "Real Estate",
    noTickersSelected: "No tickers selected",
    noTickersMessage: "Search and select stocks to compare their performance",
    selectedStocks: "Selected Stocks ({count})",
    removeStock: "Remove {ticker}",
    searchPlaceholder: "Add tickers to compare...",
    openInPortfolio: "Open in Portfolio",
    selectedStocksPerformance: "Selected Stocks Performance",
    normalizedComparison: "Normalized Performance Comparison",
    percentageChange: "Percentage change from start date",
  },

  // Sectors
  sectors: {
    totalSectors: "Total Sectors",
    totalStocks: "Total Stocks",
    avgPerSector: "Avg per Sector",
    comparePerformance: "Compare Performance",
    title: "Market Sectors",
    subtitle: "Comprehensive sector analysis and performance metrics",
    loadingSectors: "Loading sectors...",
    sectorPerformance: "Sector Stocks Performance",
    comparing: "Comparing",
    timeRange: "Time Range",
    performanceComparison: "Sector Performance Comparison", 
    selected: "selected",
    selectStocksToCompare: "Select stocks to compare",
    compareInGrid: "Compare in Grid",
    addAll: "Add All",
    sectorNotFound: "Sector \"{sector}\" not found",
    backToSectors: "Back to Sectors",
    compareSectorStocks: "Compare {count} stocks in this sector",
  },

  // Tickers  
  tickers: {
    title: "All Stock Tickers",
    subtitle: "Browse and search through {tickerCount} Vietnamese stocks across {sectorCount} sectors",
    searchAndFilter: "Search & Filter",
    selectSector: "Select sector",
    allSectors: "All Sectors",
    byTicker: "By Ticker",
    bySector: "By Sector",
    stocksFound: "{count} Stock{count, plural, one {} other {s}} Found",
    noTickersFound: "No tickers found matching your criteria",
    sector: "Sector",
    chart: "Chart",
    loadingTickers: "Loading tickers...",
    searchTickers: "Search tickers...",
    tickerNotFound: "Stock ticker \"{symbol}\" not found",
    tickerData: "Stock Data",
    technicalAnalysis: "Technical Analysis",
    priceChart: "Price Chart",
    candlestickChart: "Candlestick Chart",
  },

  // Time Ranges
  timeRanges: {
    "1M": "1M",
    "3M": "3M", 
    "6M": "6M",
    "1Y": "1Y",
    "2Y": "2Y",
    "YTD": "YTD",
    "CUSTOM": "Custom",
    "1 month": "1 month",
    "3 months": "3 months",
    "6 months": "6 months", 
    "1 year": "1 year",
    "2 years": "2 years",
    "year to date": "year to date",
    "custom range": "custom range",
  },

  // Loading states
  loading: {
    sectorData: "Loading sector data...",
    tickerData: "Loading ticker data...", 
    portfolioData: "Loading portfolio data...",
    comparisonData: "Loading comparison data...",
    chartData: "Loading chart data...",
  },

  // Error states
  errors: {
    failedToLoad: "Failed to load data",
    networkError: "Network error occurred", 
    dataUnavailable: "Data temporarily unavailable",
    tryAgainLater: "Please try again later",
  },

  // Chart controls
  chart: {
    yAxisControls: "Y-Axis Controls",
    adjustVerticalScale: "Adjust the chart's vertical scale",
    minPrice: "Min Price",
    maxPrice: "Max Price", 
    currentRange: "Current: {min} - {max}",
  },

  // Diversification Analysis
  diversification: {
    recommendations: "Diversification Recommendations",
    highCorrelation: "High Correlation Alert",
    highCorrelationMessage: "You have {count} pairs of stocks with correlation > 70%. Consider replacing some highly correlated stocks with assets from different sectors.",
    limitedSector: "Limited Sector Diversification", 
    limitedSectorMessage: "Your portfolio spans only {count} sectors. Consider adding stocks from different industries to reduce sector concentration risk.",
    wellDiversified: "Well Diversified",
    wellDiversifiedMessage: "Your portfolio shows good diversification with low average correlation between stocks. This helps reduce overall portfolio risk.",
    correlationLevels: {
      veryHigh: "Very High",
      high: "High", 
      moderate: "Moderate",
      low: "Low",
      minimal: "Minimal",
      negative: "Negative",
      strongNegative: "Strong Negative"
    },
    other: "Other",
    sectorAllocation: "Sector Allocation",
    sectorDiversificationAnalysis: "Sector Diversification Analysis",
    mostConcentratedSector: "Most Concentrated Sector",
    sectorCount: "Sector Count",
    sectors: "sectors",
    considerMoreDiversification: "Consider more diversification",
    stockCorrelationMatrix: "Stock Correlation Matrix",
    correlationDescription: "Shows how closely stock movements are correlated. Lower correlations indicate better diversification.",
    diversificationScore: "Diversification Score",
    averageCorrelation: "Average Correlation",
    lowerIsBetter: "Lower is better",
    highCorrelations: "High Correlations",
    ofPairs: "of {total} pairs",
    levels: {
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      veryPoor: "Very Poor"
    },
    needTwoStocks: "Need at least 2 stocks for diversification analysis",
    calculatingMetrics: "Calculating diversification metrics..."
  },

  // Date Range Picker
  dateRange: {
    customDateRange: "Custom Date Range",
    dateFormatHint: "Enter dates in yyyy-mm-dd format (e.g., 2024-01-15)",
    availableDataRange: "Available data range:",
    reset: "Reset",
    applyRange: "Apply Range"
  },

  // Performance Attribution
  attribution: {
    performanceAttribution: "Performance Attribution",
    individualStockAttribution: "Individual Stock Attribution",
    performanceBreakdown: "Performance Breakdown",
    bestPerformer: "Best Performer",
    worstPerformer: "Worst Performer",
    positiveContributors: "Positive Contributors",
    negativeContributors: "Negative Contributors",
    portfolioContribution: "Portfolio Contribution",
    vsBenchmark: "vs Benchmark",
    totalPositive: "Total Positive",
    totalNegative: "Total Negative",
    allStocksPositive: "🎉 All stocks contributed positively!",
    keyPerformanceInsights: "Key Performance Insights",
    topContributorImpact: "Top Contributor Impact",
    performanceRange: "Performance Range",
    stockSelectionEffect: "Stock Selection Effect",
    winnersVsLosers: "Winners vs Losers",
    addedToPortfolioReturn: "added to portfolio return",
    spread: "spread",
    outperformed: "outperformed",
    underperformed: "underperformed",
    benchmarkBy: "benchmark by",
    winners: "winners",
    losers: "losers",
    weight: "weight",
    calculatingPerformanceAttribution: "Calculating performance attribution...",
    noPortfolioDataAvailable: "No portfolio data available",
    vsVnIndex: "vs VN-Index"
  },

  // Risk Analysis
  risk: {
    concentrationRisk: "Concentration Risk",
    individualStockRiskProfile: "Individual Stock Risk Profile",
    riskReturnProfile: "Risk-Return Profile",
    riskDistribution: "Risk Distribution",
    riskInsights: "Risk Insights",
    highestRiskStock: "Highest Risk Stock",
    portfolioBeta: "Portfolio Beta",
    potentialDailyLoss: "Potential daily loss",
    moreVolatileThanMarket: "more volatile than market",
    lessVolatileThanMarket: "less volatile than market",
    lowRisk: "Low Risk",
    mediumRisk: "Medium Risk",
    highRisk: "High Risk",
    stocks: "stocks",
    noStocksToAnalyze: "No stocks to analyze",
    annualizedStandardDeviation: "Annualized standard deviation of returns",
    sensitivityToMarketMovements: "Sensitivity to market movements",
    largestPeakToTroughDecline: "Largest peak-to-trough decline",
    portfolioDiversificationLevel: "Portfolio diversification level",
    calculatingRiskMetrics: "Calculating risk metrics...",
    withVolatility: "with {volatility}% volatility"
  },

  // Vietnamese sector translations (keeping English for URL compatibility)
  sectorNames: {
    NGAN_HANG: "Banking",
    BAT_DONG_SAN: "Real Estate", 
    CONG_NGHE: "Technology",
    DICH_VU_TAI_CHINH: "Financial Services",
    THEP: "Steel",
    DIEN: "Electricity",
    DICH_VU: "Services",
    NONG_NGHIEP: "Agriculture",
    KHAI_KHOANG: "Mining",
    HOA_CHAT: "Chemicals",
    XANG_DAU: "Oil & Gas",
    HANG_TIEU_DUNG: "Consumer Goods",
    THUC_PHAM: "Food & Beverage",
    DUOC_PHAM: "Pharmaceuticals",
    VAN_TAI: "Transportation",
    XAY_DUNG: "Construction",
    DETMAY: "Textile",
    GO: "Wood",
    CHUNG_KHOAN: "Securities",
    BAN_LE: "Retail",
    BAO_HIEM: "Insurance",
    BAT_DONG_SAN_KCN: "Industrial Real Estate",
    CAO_SU: "Rubber",
    DAU_KHI: "Oil & Gas",
    DAU_TU_CONG: "Public Investment",
    DET_MAY: "Textile",
    HANG_KHONG: "Aviation",
    NANG_LUONG: "Energy",
    NHUA: "Plastic",
    OTHERS: "Others",
    PENNY: "Penny Stocks",
    SUC_KHOE: "Healthcare",
    THUY_SAN: "Aquaculture",
    VLXD: "Construction Materials",
    XAY_LAP_DIEN: "Electrical Installation",
  },

  // Educational Guide
  educationalGuide: {
    title: "Portfolio Analysis Educational Guide",
    subtitle: "Understanding the key concepts and components used in portfolio analysis",
    
    // Performance Overview
    performanceOverview: {
      title: "Performance Overview",
      description: "Compares your portfolio's performance against the VN-Index benchmark over the selected time period.",
      totalReturn: {
        title: "Total Return",
        description: "The percentage change in portfolio value from the start to the end of the period, including price appreciation.",
      },
      activeReturn: {
        title: "Active Return",
        description: "The difference between your portfolio's return and the benchmark return. Positive values indicate outperformance.",
      },
      sharpeRatio: {
        title: "Sharpe Ratio",
        description: "Measures risk-adjusted returns. Higher values indicate better risk-adjusted performance. Values above 1.0 are considered good.",
      },
    },

    // Risk Analysis
    riskAnalysis: {
      title: "Risk Analysis",
      description: "Evaluates the volatility and risk characteristics of your portfolio compared to the market.",
      volatility: {
        title: "Volatility",
        description: "Measures price fluctuation. Higher volatility means larger price swings and higher risk.",
      },
      beta: {
        title: "Beta",
        description: "Measures sensitivity to market movements. Beta > 1 means more volatile than the market, < 1 means less volatile.",
      },
      maximumDrawdown: {
        title: "Maximum Drawdown",
        description: "The largest peak-to-trough decline during the period. Shows the worst-case scenario for losses.",
      },
      valueAtRisk: {
        title: "Value at Risk (VaR)",
        description: "Estimates the maximum loss you could expect 95% of the time over a given period.",
      },
    },

    // Performance Attribution
    performanceAttribution: {
      title: "Performance Attribution",
      description: "Shows how much each stock contributed to your portfolio's overall performance.",
      contribution: {
        title: "Individual Stock Contributions",
        description: "Each stock's contribution to total portfolio return, assuming equal weighting across all holdings.",
      },
      topContributors: {
        title: "Top Contributors",
        description: "Stocks that added the most value to your portfolio during the period.",
      },
      worstPerformers: {
        title: "Worst Performers",
        description: "Stocks that detracted the most from your portfolio's performance.",
      },
    },

    // Diversification Analysis
    diversificationAnalysis: {
      title: "Diversification Analysis",
      description: "Evaluates how well your portfolio is diversified across different stocks and sectors.",
      correlation: {
        title: "Stock Correlations",
        description: "Shows how similarly your stocks move. Lower correlations (closer to 0) indicate better diversification.",
      },
      recommendations: {
        title: "Diversification Recommendations",
        description: "Suggestions to improve your portfolio's diversification and reduce concentration risk.",
      },
      sectorDistribution: {
        title: "Sector Distribution",
        description: "Shows how your holdings are spread across different market sectors.",
      },
    },

    // Key Metrics
    keyMetrics: {
      title: "Key Portfolio Metrics Explained",
      informationRatio: {
        title: "Information Ratio",
        description: "Measures consistency of outperformance. Higher values indicate more consistent alpha generation.",
      },
      trackingError: {
        title: "Tracking Error",
        description: "Measures how closely your portfolio follows the benchmark. Lower values indicate closer tracking.",
      },
      correlation: {
        title: "Correlation to Benchmark",
        description: "Ranges from -1 to +1. Values closer to +1 mean your portfolio moves similarly to the market.",
      },
    },

    // Tips Section
    tips: {
      title: "Investment Tips",
      diversification: "Maintain diversification across different sectors and avoid overconcentration in similar stocks.",
      riskManagement: "Monitor your portfolio's volatility and drawdowns to ensure they align with your risk tolerance.",
      benchmarking: "Regularly compare your performance against relevant benchmarks like VN-Index.",
      rebalancing: "Consider periodic rebalancing to maintain your desired asset allocation.",
      longTerm: "Focus on long-term performance rather than short-term fluctuations.",
    },
  },
} as const;