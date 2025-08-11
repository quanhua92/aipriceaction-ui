export const vn = {
  // Navigation
  nav: {
    dashboard: "Tổng quan",
    sectors: "Ngành", 
    tickers: "Mã chứng khoán",
    compareCharts: "So sánh biểu đồ",
    portfolioAnalysis: "Phân tích danh mục",
  },

  // Common
  common: {
    loading: "Đang tải...",
    noData: "Không có dữ liệu",
    loadingData: "Đang tải dữ liệu...",
    search: "Tìm kiếm",
    back: "Quay lại",
    apply: "Áp dụng",
    reset: "Đặt lại",
    clearAll: "Xóa tất cả",
    more: "thêm",
    daily: "Hàng ngày",
    price: "Giá",
    change: "Thay đổi",
    changePercent: "% Thay đổi",
    volume: "Khối lượng",
    open: "Mở cửa",
    high: "Cao nhất", 
    low: "Thấp nhất",
    close: "Đóng cửa",
    actions: "Hành động",
    view: "Xem",
    ticker: "Mã CK",
    current: "Hiện tại",
    active: "Hoạt động",
    compare: "So sánh",
  },

  // Home/Dashboard
  home: {
    title: "AIPriceAction: Thị trường Chứng khoán Việt Nam",
    subtitle: "Phân tích thời gian thực và thông tin chi tiết về thị trường chứng khoán Việt Nam",
    keySectorPerformance: "Hiệu suất ngành chính",
    topPerformers: "Cổ phiếu tốt nhất",
    topGainers: "Tăng mạnh nhất",
    topLosers: "Giảm mạnh nhất",
    marketOverview: "Tổng quan thị trường",
    vnIndex: "VN-Index",
    sectors: "Các ngành",
    viewAllSectors: "Xem tất cả ngành",
    viewAllTickers: "Xem tất cả mã CK",
    quickActions: "Thao tác nhanh",
    compareStocks: "So sánh cổ phiếu",
    analyzePortfolio: "Phân tích danh mục",
  },

  // Portfolio
  portfolio: {
    title: "Phân tích danh mục", 
    subtitle: "Phân tích toàn diện {count} cổ phiếu so với chỉ số VN-Index",
    buildPortfolio: "Xây dựng danh mục của bạn",
    searchForStocks: "Tìm kiếm cổ phiếu",
    searchPlaceholder: "Nhập mã cổ phiếu (VD: VCB, VHM, HPG)...",
    searchHint: "Bắt đầu gõ để tìm cổ phiếu Việt Nam",
    samplePortfolios: "Hoặc thử các danh mục mẫu:",
    bankingPortfolio: "Danh mục Ngân hàng",
    realEstatePortfolio: "Danh mục Bất động sản", 
    industrialPortfolio: "Danh mục Công nghiệp",
    securitiesPortfolio: "Danh mục Chứng khoán",
    configuration: "Cấu hình danh mục",
    addStock: "Thêm cổ phiếu vào danh mục",
    addStockPlaceholder: "Tìm kiếm và thêm cổ phiếu vào danh mục...",
    currentPortfolio: "Danh mục hiện tại ({count} cổ phiếu)",
    clickToRemove: "Nhấn vào nhãn cổ phiếu để xóa khỏi danh mục",
    clickToRemoveStock: "Nhấn để xóa {ticker}",
    analysisPeriod: "Thời gian phân tích",
    openInCompare: "Mở trong So sánh",
    performanceOverview: "Tổng quan hiệu suất", 
    stocksPerformance: "Hiệu suất cổ phiếu danh mục",
    riskAdjustedPerformance: "Hiệu suất điều chỉnh rủi ro",
    performanceAttribution: "Đóng góp hiệu suất",
    diversificationAnalysis: "Phân tích đa dạng hóa",
    volatilityAnalysis: "Phân tích biến động",
    portfolioVolatility: "Biến động danh mục", 
    benchmarkVolatility: "Biến động chỉ số chuẩn",
    vnindexBenchmark: "VNINDEX (Chỉ số chuẩn)",
    removeVnindex: "Nhấn để xóa chỉ số chuẩn VNINDEX",
  },

  // Portfolio Metrics
  metrics: {
    totalReturn: "Tổng lợi nhuận",
    activeReturn: "Lợi nhuận tích cực", 
    sharpeRatio: "Tỷ số Sharpe",
    informationRatio: "Tỷ số thông tin",
    volatility: "Độ biến động",
    beta: "Hệ số Beta",
    maximumDrawdown: "Mức sụt giảm tối đa",
    valueAtRisk: "Giá trị có rủi ro (95%)",
    correlation: "Tương quan",
    alpha: "Hệ số Alpha",
  },

  // Educational Guide
  guide: {
    title: "Hướng dẫn phân tích danh mục",
    subtitle: "Hiểu các chỉ số và khái niệm chính được sử dụng trong phân tích danh mục:",
    performanceMetrics: "Chỉ số hiệu suất",
    riskMetrics: "Chỉ số rủi ro", 
    diversificationAttribution: "Đa dạng hóa & Đóng góp",
    interpretResults: "Cách diễn giải kết quả",
    goodPerformance: "Hiệu suất tốt: Lợi nhuận tích cực dương, tỷ số Sharpe > 1.0, biến động vừa phải",
    wellDiversified: "Đa dạng hóa tốt: Tương quan thấp giữa các cổ phiếu, phân bổ trên nhiều ngành",
    balancedRisk: "Rủi ro cân bằng: Beta khoảng 1.0, sụt giảm tối đa < 30%, biến động hợp lý với khả năng chấp nhận rủi ro",
    timeHorizon: "Thời gian: Các kỳ dài hơn (6T-2N) cung cấp phân tích có ý nghĩa hơn các kỳ ngắn (1T)",
    disclaimer: "Miễn trừ trách nhiệm: Phân tích này chỉ mang tính chất giáo dục và không nên được coi là lời khuyên đầu tư. Hiệu suất quá khứ không đảm bảo kết quả tương lai. Luôn tham khảo ý kiến cố vấn tài chính trước khi đưa ra quyết định đầu tư.",
    
    // Detailed explanations
    totalReturnExplain: "Tổng lãi hoặc lỗ của danh mục trong khoảng thời gian đã chọn, được biểu thị bằng phần trăm.",
    activeReturnExplain: "Sự khác biệt giữa lợi nhuận danh mục và chỉ số chuẩn VN-Index. Giá trị dương cho thấy hiệu suất vượt trội.",
    sharpeRatioExplain: "Đo lường lợi nhuận điều chỉnh rủi ro. Giá trị cao hơn (>1.0) cho thấy hiệu suất điều chỉnh rủi ro tốt hơn.",
    informationRatioExplain: "Cho thấy mức độ nhất quán vượt trội so với chỉ số chuẩn tương ứng với rủi ro bổ sung.",
    volatilityExplain: "Đo lường mức độ biến động của lợi nhuận danh mục. Biến động thấp hơn cho thấy lợi nhuận ổn định hơn.",
    betaExplain: "Đo độ nhạy cảm với biến động thị trường. Beta > 1 có nghĩa là biến động hơn thị trường, < 1 nghĩa là ít biến động hơn.",
    maximumDrawdownExplain: "Mức giảm lớn nhất từ đỉnh xuống đáy của giá trị danh mục. Cho thấy tình huống thua lỗ tệ nhất.",
    valueAtRiskExplain: "Tổn thất tối đa dự kiến trong 95% các ngày giao dịch. Giúp ước tính tổn thất hàng ngày tiềm năng.",
    correlationExplain: "Đo lường cách các cổ phiếu di chuyển cùng nhau. Giá trị gần 0 cho thấy đa dạng hóa tốt, gần 1 nghĩa là cổ phiếu di chuyển tương tự.",
    performanceAttributionExplain: "Cho thấy cổ phiếu nào đóng góp nhiều nhất vào lãi hoặc lỗ của danh mục.",
    sectorAllocationExplain: "Phân bổ đầu tư trên các ngành công nghiệp khác nhau (Ngân hàng, Bất động sản, v.v.).",
    alphaExplain: "Lợi nhuận vượt trội được tạo ra bởi một cổ phiếu vượt quá mức dự kiến dựa trên beta và hiệu suất thị trường.",
  },

  // Compare
  compare: {
    title: "So sánh biểu đồ",
    subtitle: "So sánh không giới hạn biểu đồ cổ phiếu trong lưới 2 cột linh hoạt (1 cột trên mobile)",
    chartConfiguration: "Cấu hình biểu đồ",
    selectTickers: "Chọn mã cổ phiếu",
    dateRange: "Khoảng thời gian",
    addVnIndex: "Thêm VN-Index",
    bankingStocks: "Cổ phiếu ngân hàng",
    realEstate: "Bất động sản",
    noTickersSelected: "Chưa chọn mã cổ phiếu",
    noTickersMessage: "Tìm kiếm và chọn cổ phiếu để so sánh hiệu suất",
    selectedStocks: "Cổ phiếu đã chọn ({count})",
    removeStock: "Xóa {ticker}",
    searchPlaceholder: "Thêm mã cổ phiếu để so sánh...",
    openInPortfolio: "Mở trong Danh mục",
    selectedStocksPerformance: "Hiệu suất cổ phiếu đã chọn",
    normalizedComparison: "So sánh hiệu suất chuẩn hóa",
    percentageChange: "Phần trăm thay đổi từ ngày bắt đầu",
  },

  // Sectors
  sectors: {
    totalSectors: "Tổng số ngành",
    totalStocks: "Tổng số cổ phiếu",
    avgPerSector: "Trung bình mỗi ngành",
    comparePerformance: "So sánh hiệu suất",
    title: "Các ngành thị trường",
    subtitle: "Phân tích ngành toàn diện và chỉ số hiệu suất",
    loadingSectors: "Đang tải dữ liệu ngành...",
    sectorPerformance: "Hiệu suất cổ phiếu ngành",
    comparing: "Đang so sánh",
    timeRange: "Khoảng thời gian",
    performanceComparison: "So sánh hiệu suất ngành", 
    selected: "đã chọn",
    selectStocksToCompare: "Chọn cổ phiếu để so sánh",
    compareInGrid: "So sánh trong lưới",
    sectorNotFound: "Không tìm thấy ngành \"{sector}\"",
    backToSectors: "Quay lại Ngành",
    compareSectorStocks: "So sánh {count} cổ phiếu trong ngành này",
  },

  // Tickers  
  tickers: {
    title: "Tất cả mã chứng khoán",
    subtitle: "Duyệt và tìm kiếm qua {tickerCount} cổ phiếu Việt Nam trên {sectorCount} ngành",
    searchAndFilter: "Tìm kiếm & Lọc",
    selectSector: "Chọn ngành",
    allSectors: "Tất cả ngành",
    byTicker: "Theo mã CK",
    bySector: "Theo ngành",
    stocksFound: "Tìm thấy {count} cổ phiếu",
    noTickersFound: "Không tìm thấy mã cổ phiếu nào phù hợp",
    sector: "Ngành",
    chart: "Biểu đồ",
    loadingTickers: "Đang tải mã chứng khoán...",
    searchTickers: "Tìm kiếm mã CK...",
    tickerNotFound: "Không tìm thấy mã cổ phiếu \"{symbol}\"",
    tickerData: "Dữ liệu cổ phiếu",
    technicalAnalysis: "Phân tích kỹ thuật",
    priceChart: "Biểu đồ giá",
    candlestickChart: "Biểu đồ nến",
  },

  // Time Ranges
  timeRanges: {
    "1M": "1T",
    "3M": "3T", 
    "6M": "6T",
    "1Y": "1N",
    "2Y": "2N",
    "YTD": "Từ đầu năm",
    "CUSTOM": "Tùy chỉnh",
    "1 month": "1 tháng",
    "3 months": "3 tháng",
    "6 months": "6 tháng", 
    "1 year": "1 năm",
    "2 years": "2 năm",
    "year to date": "từ đầu năm",
    "custom range": "khoảng tùy chỉnh",
  },

  // Loading states
  loading: {
    sectorData: "Đang tải dữ liệu ngành...",
    tickerData: "Đang tải dữ liệu mã CK...", 
    portfolioData: "Đang tải dữ liệu danh mục...",
    comparisonData: "Đang tải dữ liệu so sánh...",
    chartData: "Đang tải dữ liệu biểu đồ...",
  },

  // Error states
  errors: {
    failedToLoad: "Không thể tải dữ liệu",
    networkError: "Lỗi mạng", 
    dataUnavailable: "Dữ liệu tạm thời không khả dụng",
    tryAgainLater: "Vui lòng thử lại sau",
  },

  // Chart controls
  chart: {
    yAxisControls: "Điều khiển trục Y",
    adjustVerticalScale: "Điều chỉnh thang đo dọc của biểu đồ",
    minPrice: "Giá tối thiểu",
    maxPrice: "Giá tối đa", 
    currentRange: "Hiện tại: {min} - {max}",
  },

  // Diversification Analysis
  diversification: {
    recommendations: "Khuyến nghị đa dạng hóa",
    highCorrelation: "Cảnh báo tương quan cao",
    highCorrelationMessage: "Bạn có {count} cặp cổ phiếu với tương quan > 70%. Hãy xem xét thay thế một số cổ phiếu có tương quan cao bằng tài sản từ các ngành khác.",
    limitedSector: "Đa dạng hóa ngành hạn chế", 
    limitedSectorMessage: "Danh mục của bạn chỉ bao gồm {count} ngành. Hãy xem xét thêm cổ phiếu từ các ngành công nghiệp khác nhau để giảm rủi ro tập trung ngành.",
    wellDiversified: "Đa dạng hóa tốt",
    wellDiversifiedMessage: "Danh mục của bạn cho thấy sự đa dạng hóa tốt với tương quan trung bình thấp giữa các cổ phiếu. Điều này giúp giảm rủi ro tổng thể của danh mục.",
    correlationLevels: {
      veryHigh: "Rất cao",
      high: "Cao", 
      moderate: "Trung bình",
      low: "Thấp",
      minimal: "Tối thiểu",
      negative: "Âm",
      strongNegative: "Âm mạnh"
    },
    other: "Khác",
    sectorAllocation: "Phân bổ ngành",
    sectorDiversificationAnalysis: "Phân tích đa dạng hóa ngành",
    mostConcentratedSector: "Ngành tập trung nhất",
    sectorCount: "Số ngành",
    sectors: "ngành",
    considerMoreDiversification: "Nên cân nhắc đa dạng hóa hơn",
    stockCorrelationMatrix: "Ma trận tương quan cổ phiếu",
    correlationDescription: "Hiển thị mức độ tương quan của các biến động cổ phiếu. Tương quan thấp hơn cho thấy đa dạng hóa tốt hơn.",
    diversificationScore: "Điểm đa dạng hóa",
    averageCorrelation: "Tương quan trung bình",
    lowerIsBetter: "Càng thấp càng tốt",
    highCorrelations: "Tương quan cao",
    ofPairs: "của {total} cặp",
    levels: {
      excellent: "Xuất sắc",
      good: "Tốt",
      fair: "Khá",
      poor: "Yếu",
      veryPoor: "Rất yếu"
    },
    needTwoStocks: "Cần ít nhất 2 cổ phiếu để phân tích đa dạng hóa",
    calculatingMetrics: "Đang tính toán chỉ số đa dạng hóa..."
  },

  // Date Range Picker
  dateRange: {
    customDateRange: "Khoảng thời gian tùy chỉnh",
    dateFormatHint: "Nhập ngày theo định dạng yyyy-mm-dd (VD: 2024-01-15)",
    availableDataRange: "Khoảng dữ liệu có sẵn:",
    reset: "Đặt lại",
    applyRange: "Áp dụng khoảng"
  },

  // Performance Attribution
  attribution: {
    performanceAttribution: "Phân bổ hiệu suất",
    individualStockAttribution: "Phân bổ hiệu suất từng cổ phiếu",
    performanceBreakdown: "Phân tích chi tiết hiệu suất",
    bestPerformer: "Tốt nhất",
    worstPerformer: "Tệ nhất",
    positiveContributors: "Đóng góp tích cực",
    negativeContributors: "Đóng góp tiêu cực",
    portfolioContribution: "Đóng góp cho danh mục",
    vsBenchmark: "so với chỉ số chuẩn",
    totalPositive: "Tổng tích cực",
    totalNegative: "Tổng tiêu cực",
    allStocksPositive: "🎉 Tất cả cổ phiếu đóng góp tích cực!",
    keyPerformanceInsights: "Nhận định hiệu suất chính",
    topContributorImpact: "Tác động của người đóng góp hàng đầu",
    performanceRange: "Khoảng hiệu suất",
    stockSelectionEffect: "Hiệu ứng lựa chọn cổ phiếu",
    winnersVsLosers: "Thắng vs Thua",
    addedToPortfolioReturn: "thêm vào lợi nhuận danh mục",
    spread: "khoảng cách",
    outperformed: "vượt trội",
    underperformed: "kém hơn",
    benchmarkBy: "chỉ số chuẩn bởi",
    winners: "thắng",
    losers: "thua",
    weight: "trọng số",
    calculatingPerformanceAttribution: "Đang tính toán phân bổ hiệu suất...",
    noPortfolioDataAvailable: "Không có dữ liệu danh mục",
    vsVnIndex: "so với VN-Index"
  },

  // Risk Analysis
  risk: {
    concentrationRisk: "Rủi ro tập trung",
    individualStockRiskProfile: "Hồ sơ rủi ro từng cổ phiếu",
    riskReturnProfile: "Hồ sơ rủi ro-lợi nhuận",
    riskDistribution: "Phân bố rủi ro",
    riskInsights: "Phân tích rủi ro",
    highestRiskStock: "Cổ phiếu rủi ro cao nhất",
    portfolioBeta: "Beta danh mục",
    potentialDailyLoss: "Tổn thất tiềm năng hàng ngày",
    moreVolatileThanMarket: "biến động hơn thị trường",
    lessVolatileThanMarket: "ít biến động hơn thị trường",
    lowRisk: "Rủi ro thấp",
    mediumRisk: "Rủi ro trung bình",
    highRisk: "Rủi ro cao",
    stocks: "cổ phiếu",
    noStocksToAnalyze: "Không có cổ phiếu để phân tích",
    annualizedStandardDeviation: "Độ lệch chuẩn hàng năm của lợi nhuận",
    sensitivityToMarketMovements: "Độ nhạy cảm với biến động thị trường",
    largestPeakToTroughDecline: "Sụt giảm lớn nhất từ đỉnh xuống đáy",
    portfolioDiversificationLevel: "Mức độ đa dạng hóa danh mục",
    calculatingRiskMetrics: "Đang tính toán chỉ số rủi ro...",
    withVolatility: "với độ biến động {volatility}%"
  },

  // Vietnamese sector translations
  sectorNames: {
    NGAN_HANG: "Ngân hàng",
    BAT_DONG_SAN: "Bất động sản", 
    CONG_NGHE: "Công nghệ",
    DICH_VU_TAI_CHINH: "Dịch vụ tài chính",
    THEP: "Thép",
    DIEN: "Điện",
    DICH_VU: "Dịch vụ",
    NONG_NGHIEP: "Nông nghiệp",
    KHAI_KHOANG: "Khai khoáng",
    HOA_CHAT: "Hóa chất",
    XANG_DAU: "Dầu khí",
    HANG_TIEU_DUNG: "Hàng tiêu dùng",
    THUC_PHAM: "Thực phẩm & Đồ uống",
    DUOC_PHAM: "Dược phẩm",
    VAN_TAI: "Vận tải",
    XAY_DUNG: "Xây dựng",
    DETMAY: "Dệt may",
    GO: "Gỗ",
    CHUNG_KHOAN: "Chứng khoán",
    BAN_LE: "Bán lẻ",
    BAO_HIEM: "Bảo hiểm",
    BAT_DONG_SAN_KCN: "Bất động sản KCN",
    CAO_SU: "Cao su",
    DAU_KHI: "Dầu khí",
    DAU_TU_CONG: "Đầu tư công",
    DET_MAY: "Dệt may",
    HANG_KHONG: "Hàng không",
    NANG_LUONG: "Năng lượng",
    NHUA: "Nhựa",
    OTHERS: "Khác",
    PENNY: "Penny stocks",
    SUC_KHOE: "Sức khỏe",
    THUY_SAN: "Thủy sản",
    VLXD: "Vật liệu xây dựng",
    XAY_LAP_DIEN: "Xây lắp điện",
  },

  // Hướng dẫn giáo dục
  educationalGuide: {
    title: "Hướng dẫn Phân tích Danh mục Đầu tư",
    subtitle: "Hiểu rõ các khái niệm và thành phần chính được sử dụng trong phân tích danh mục",
    
    // Tổng quan hiệu suất
    performanceOverview: {
      title: "Tổng quan Hiệu suất",
      description: "So sánh hiệu suất danh mục của bạn với chỉ số chuẩn VN-Index trong khoảng thời gian đã chọn.",
      totalReturn: {
        title: "Tổng Lợi nhuận",
        description: "Phần trăm thay đổi giá trị danh mục từ đầu đến cuối kỳ, bao gồm tăng giá cổ phiếu.",
      },
      activeReturn: {
        title: "Lợi nhuận Tích cực",
        description: "Sự khác biệt giữa lợi nhuận danh mục và lợi nhuận chỉ số chuẩn. Giá trị dương cho thấy hiệu suất vượt trội.",
      },
      sharpeRatio: {
        title: "Tỷ số Sharpe",
        description: "Đo lường lợi nhuận điều chỉnh rủi ro. Giá trị cao hơn cho thấy hiệu suất điều chỉnh rủi ro tốt hơn. Giá trị trên 1.0 được coi là tốt.",
      },
    },

    // Phân tích rủi ro
    riskAnalysis: {
      title: "Phân tích Rủi ro",
      description: "Đánh giá tính biến động và đặc điểm rủi ro của danh mục so với thị trường.",
      volatility: {
        title: "Độ Biến động",
        description: "Đo lường biến động giá cả. Độ biến động cao có nghĩa là biến động giá lớn hơn và rủi ro cao hơn.",
      },
      beta: {
        title: "Hệ số Beta",
        description: "Đo lường độ nhạy cảm với biến động thị trường. Beta > 1 có nghĩa là biến động nhiều hơn thị trường, < 1 có nghĩa là ít biến động hơn.",
      },
      maximumDrawdown: {
        title: "Mức Sụt giảm Tối đa",
        description: "Mức giảm lớn nhất từ đỉnh xuống đáy trong kỳ. Cho thấy tình huống xấu nhất về mặt tổn thất.",
      },
      valueAtRisk: {
        title: "Giá trị có Rủi ro (VaR)",
        description: "Ước tính tổn thất tối đa bạn có thể mong đợi trong 95% thời gian trong một khoảng thời gian nhất định.",
      },
    },

    // Đóng góp hiệu suất
    performanceAttribution: {
      title: "Đóng góp Hiệu suất",
      description: "Cho thấy mỗi cổ phiếu đóng góp bao nhiều vào hiệu suất tổng thể của danh mục.",
      contribution: {
        title: "Đóng góp từng Cổ phiếu",
        description: "Đóng góp của từng cổ phiếu vào tổng lợi nhuận danh mục, giả định trọng số bằng nhau cho tất cả nắm giữ.",
      },
      topContributors: {
        title: "Đóng góp Hàng đầu",
        description: "Những cổ phiếu tạo ra giá trị nhiều nhất cho danh mục trong kỳ.",
      },
      worstPerformers: {
        title: "Hiệu suất Kém nhất",
        description: "Những cổ phiếu làm giảm hiệu suất danh mục nhiều nhất.",
      },
    },

    // Phân tích đa dạng hóa
    diversificationAnalysis: {
      title: "Phân tích Đa dạng hóa",
      description: "Đánh giá mức độ đa dạng hóa của danh mục qua các cổ phiếu và ngành khác nhau.",
      correlation: {
        title: "Tương quan Cổ phiếu",
        description: "Cho thấy mức độ tương đồng trong biến động của các cổ phiếu. Tương quan thấp hơn (gần 0) cho thấy đa dạng hóa tốt hơn.",
      },
      recommendations: {
        title: "Khuyến nghị Đa dạng hóa",
        description: "Đề xuất cải thiện đa dạng hóa danh mục và giảm rủi ro tập trung.",
      },
      sectorDistribution: {
        title: "Phân bố Ngành",
        description: "Cho thấy cách phân bố nắm giữ qua các ngành thị trường khác nhau.",
      },
    },

    // Chỉ số chính
    keyMetrics: {
      title: "Giải thích Chỉ số Danh mục Chính",
      informationRatio: {
        title: "Tỷ số Thông tin",
        description: "Đo lường tính nhất quán trong hiệu suất vượt trội. Giá trị cao hơn cho thấy tạo alpha nhất quán hơn.",
      },
      trackingError: {
        title: "Sai số Theo dõi",
        description: "Đo lường mức độ sát danh mục theo chỉ số chuẩn. Giá trị thấp hơn cho thấy theo dõi sát hơn.",
      },
      correlation: {
        title: "Tương quan với Chỉ số Chuẩn",
        description: "Dao động từ -1 đến +1. Giá trị gần +1 có nghĩa là danh mục biến động tương tự thị trường.",
      },
    },

    // Phần mẹo
    tips: {
      title: "Mẹo Đầu tư",
      diversification: "Duy trì đa dạng hóa qua các ngành khác nhau và tránh tập trung quá mức vào các cổ phiếu tương tự.",
      riskManagement: "Giám sát độ biến động và mức sụt giảm của danh mục để đảm bảo phù hợp với khả năng chịu rủi ro.",
      benchmarking: "Thường xuyên so sánh hiệu suất với các chỉ số chuẩn phù hợp như VN-Index.",
      rebalancing: "Cân nhắc cân bằng lại định kỳ để duy trì phân bổ tài sản mong muốn.",
      longTerm: "Tập trung vào hiệu suất dài hạn thay vì biến động ngắn hạn.",
    },
  },
} as const;