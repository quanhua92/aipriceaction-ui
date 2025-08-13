/**
 * Panic Analysis Translation Support
 * 
 * Vietnamese/English translations for all panic analysis content
 * including UI labels, classifications, warnings, and trading advice.
 */

export const panicTranslations = {
	en: {
		// Page titles and headers
		panicAnalysis: 'Vietnamese Panic Analysis',
		panicOverview: 'Panic Analysis Overview',
		detailedAnalysis: 'Detailed Analysis',
		historicalEvents: 'Historical Events',
		prePanicWarning: 'Pre-Panic Warning System',
		
		// Navigation
		backToOverview: 'Back to Panic Overview',
		viewDetails: 'View Details',
		analyzeCurrentMarket: 'Analyze Current Market',
		nextPanicEvent: 'Next Panic Event',
		
		// Panic classifications
		panicTypes: {
			POSITIVE_PANIC: 'Positive Panic',
			NEGATIVE_EXTREME: 'Negative Extreme',
			NEGATIVE_MEDIUM: 'Negative Medium', 
			UNCLEAR_PATTERN: 'Unclear Pattern',
			RECOVERY_SIGNAL: 'Recovery Signal',
			NO_PANIC: 'No Panic'
		},
		
		// Warning levels
		warningLevels: {
			STRONG_WARNING: 'Strong Warning',
			MODERATE_WARNING: 'Moderate Warning',
			EARLY_WARNING: 'Early Warning',
			DEVELOPING_WEAKNESS: 'Developing Weakness',
			NO_WARNING: 'No Warning',
			INSUFFICIENT_DATA: 'Insufficient Data'
		},
		
		// Pattern types
		patternTypes: {
			ESCALATING_TO_CRISIS: 'Escalating to Crisis',
			MULTIPLE_WEAKNESS_EVENTS: 'Multiple Weakness Events',
			SUSTAINED_DETERIORATION: 'Sustained Deterioration',
			ISOLATED_SIGNALS: 'Black Swan Events',
			PERSISTENT_WEAKNESS: 'Persistent Weakness',
			NO_SIGNALS_DETECTED: 'No Signals Detected'
		},
		
		// Sector indicators
		sectorIndicators: {
			bsi: 'Banking Sector Indicator',
			ssi: 'Securities Sector Indicator',
			rsi: 'Real Estate Sector Indicator',
			bankingDescription: 'VCB, BID, TCB, CTG, VPB - Market cap weighted',
			securitiesDescription: 'SSI, VCI, HCM, MBS, SHS - Market cap weighted',
			realEstateDescription: 'VIC, VHM, VRE, KDH, NVL - Market cap weighted'
		},
		
		// Trading advice
		tradingAdvice: {
			action: 'Trading Action',
			riskLevel: 'Risk Level',
			positionSize: 'Position Size',
			defensiveStocks: 'Defensive Stocks',
			
			// Risk levels
			riskLevels: {
				EXTREME: 'EXTREME - Panic likely within 1-3 days',
				HIGH: 'HIGH - Monitor daily for escalation',
				MEDIUM: 'MEDIUM - Watch for pattern development',
				LOW_MEDIUM: 'LOW-MEDIUM - Early stage warning',
				LOW: 'LOW - No immediate panic signals',
				UNKNOWN: 'UNKNOWN - Insufficient data for analysis'
			},
			
			// Actions
			strongWarningAction: 'REDUCE positions immediately, increase cash to 70%+',
			moderateWarningAction: 'Reduce portfolio by 40%, prepare defensive positions',
			earlyWarningAction: 'Reduce riskiest positions, raise cash to 30%',
			developingWeaknessAction: 'Monitor closely, prepare for defensive rotation',
			noWarningAction: 'Normal trading strategies'
		},
		
		// Classification descriptions
		classificationDescriptions: {
			POSITIVE_PANIC: 'Banking stable, Securities/Real Estate oversold - Buy opportunity',
			NEGATIVE_EXTREME: 'All sectors deep red - Defensive positioning only',
			NEGATIVE_MEDIUM: 'Significant cross-sector weakness - Reduce exposure',
			UNCLEAR_PATTERN: 'Mixed sector signals - Selective positioning',
			RECOVERY_SIGNAL: 'Recovery patterns emerging - Monitor for entry',
			NO_PANIC: 'Normal market conditions - Standard strategies'
		},
		
		// Warning descriptions
		warningDescriptions: {
			STRONG_WARNING: 'EXTREME - Panic likely within 1-3 days',
			MODERATE_WARNING: 'HIGH - Monitor daily for escalation',
			EARLY_WARNING: 'MEDIUM - Watch for pattern development',
			DEVELOPING_WEAKNESS: 'LOW-MEDIUM - Early stage warning',
			NO_WARNING: 'LOW - No immediate panic signals',
			INSUFFICIENT_DATA: 'UNKNOWN - Insufficient data for analysis'
		},
		
		// Analysis sections
		analysis: {
			sectorBreakdown: 'Sector Performance Breakdown',
			sectorBreakdownDesc: 'Individual sector indicator analysis',
			patternAnalysis: 'Pattern Analysis', 
			patternAnalysisDesc: 'Vietnamese market pattern classification',
			classificationLogic: 'Classification Logic',
			historicalContext: 'Historical Context',
			marketConditions: 'Market conditions and external factors',
			tradingLesson: 'Trading Lesson',
			recoveryAnalysis: 'Recovery Analysis',
			recoveryAnalysisDesc: 'Post-panic stabilization and recovery patterns',
			prePanicSignals: 'Pre-Panic Signal Timeline',
			prePanicSignalsDesc: 'T-1, T-7, T-14 analysis showing pattern development',
			comprehensiveScan: '14-Day Comprehensive Scan',
			comprehensiveScanDesc: 'Significant drops (≥2%) detected in 14-day pre-panic period',
			prePanicTradingAdvice: 'Pre-Panic Trading Advice',
			prePanicTradingAdviceDesc: 'Risk management recommendations based on pre-panic signals',
			marketChartAnalysis: 'Market Chart Analysis',
			marketChartAnalysisDesc: '6-month view: 3 months before and after panic day',
			selectedTickersPerformance: 'Selected Tickers Performance',
			selectedTickersPerformanceDesc: 'Performance comparison of manually selected tickers from Compare Charts'
		},
		
		// Recovery metrics
		recovery: {
			stabilization: 'Stabilization',
			recoveryLeader: 'Recovery Leader',
			nextDay: 'Next Day',
			daysToStabilize: 'Days to Stabilize',
			nextDayPerformance: 'Next Day Performance',
			securitiesRecovery: 'Securities Recovery Performance',
			averageSecuritiesRecovery: 'Average securities sector recovery'
		},
		
		// Statistics
		statistics: {
			totalPanicDays: 'Total Panic Days',
			predictionAccuracy: 'Prediction Accuracy',
			systemPerformance: 'System Performance',
			updated: 'Updated',
			eventsAnalyzed: 'events analyzed',
			eventsWithWarning: 'events with warning signals',
			blackSwanEvents: 'Black Swan events (unpredictable)',
			yearlyDistribution: 'Yearly Distribution',
			patternDistribution: 'Pattern Distribution',
			recoveryPatterns: 'Recovery Patterns',
			fastStabilization: 'Fast Stabilization (1-2 days)',
			slowStabilization: 'Slow Stabilization (3+ days)',
			extendedCrisis: 'Extended Crisis'
		},
		
		// Common UI elements
		ui: {
			loading: 'Loading analysis...',
			error: 'Unable to load analysis',
			noDataAvailable: 'No data available for this date',
			historicalEvent: 'Historical Event',
			currentAnalysis: 'Current Analysis',
			takeAction: 'Take Action',
			quickActions: 'Quick Actions',
			filters: 'Filters',
			allYears: 'All Years',
			allPatterns: 'All Patterns',
			classification: 'Classification',
			panicType: 'Panic Type',
			warningLevel: 'Warning Level',
			patternType: 'Pattern Type',
			marketContext: 'Market Context'
		}
	},
	
	vi: {
		// Tiêu đề trang và header
		panicAnalysis: 'Phân Tích Panic Thị Trường Việt Nam',
		panicOverview: 'Tổng Quan Phân Tích Panic',
		detailedAnalysis: 'Phân Tích Chi Tiết', 
		historicalEvents: 'Các Sự Kiện Lịch Sử',
		prePanicWarning: 'Hệ Thống Cảnh Báo Trước Panic',
		
		// Điều hướng
		backToOverview: 'Quay Lại Tổng Quan Panic',
		viewDetails: 'Xem Chi Tiết',
		analyzeCurrentMarket: 'Phân Tích Thị Trường Hiện Tại',
		nextPanicEvent: 'Sự Kiện Panic Tiếp Theo',
		
		// Phân loại panic
		panicTypes: {
			POSITIVE_PANIC: 'Panic Tích Cực',
			NEGATIVE_EXTREME: 'Panic Cực Kỳ Tiêu Cực',
			NEGATIVE_MEDIUM: 'Panic Tiêu Cực Trung Bình',
			UNCLEAR_PATTERN: 'Mô Hình Không Rõ Ràng',
			RECOVERY_SIGNAL: 'Tín Hiệu Phục Hồi',
			NO_PANIC: 'Không Panic'
		},
		
		// Mức độ cảnh báo
		warningLevels: {
			STRONG_WARNING: 'Cảnh Báo Mạnh',
			MODERATE_WARNING: 'Cảnh Báo Vừa Phải',
			EARLY_WARNING: 'Cảnh Báo Sớm',
			DEVELOPING_WEAKNESS: 'Yếu Kém Đang Phát Triển',
			NO_WARNING: 'Không Cảnh Báo',
			INSUFFICIENT_DATA: 'Dữ Liệu Không Đủ'
		},
		
		// Loại mô hình
		patternTypes: {
			ESCALATING_TO_CRISIS: 'Leo Thang Thành Khủng Hoảng',
			MULTIPLE_WEAKNESS_EVENTS: 'Nhiều Sự Kiện Yếu Kém',
			SUSTAINED_DETERIORATION: 'Suy Thoái Kéo Dài',
			ISOLATED_SIGNALS: 'Sự Kiện Thiên Nga Đen',
			PERSISTENT_WEAKNESS: 'Yếu Kém Dai Dẳng',
			NO_SIGNALS_DETECTED: 'Không Phát Hiện Tín Hiệu'
		},
		
		// Chỉ số ngành
		sectorIndicators: {
			bsi: 'Chỉ Số Ngành Ngân Hàng',
			ssi: 'Chỉ Số Ngành Chứng Khoán',
			rsi: 'Chỉ Số Ngành Bất Động Sản',
			bankingDescription: 'VCB, BID, TCB, CTG, VPB - Trọng số theo vốn hóa',
			securitiesDescription: 'SSI, VCI, HCM, MBS, SHS - Trọng số theo vốn hóa',
			realEstateDescription: 'VIC, VHM, VRE, KDH, NVL - Trọng số theo vốn hóa'
		},
		
		// Lời khuyên giao dịch
		tradingAdvice: {
			action: 'Hành Động Giao Dịch',
			riskLevel: 'Mức Độ Rủi Ro',
			positionSize: 'Quy Mô Vị Thế',
			defensiveStocks: 'Cổ Phiếu Phòng Thủ',
			
			// Mức độ rủi ro
			riskLevels: {
				EXTREME: 'CỰC KỲ CAO - Panic có thể xảy ra trong 1-3 ngày',
				HIGH: 'CAO - Theo dõi hàng ngày để phát hiện leo thang',
				MEDIUM: 'TRUNG BÌNH - Quan sát sự phát triển mô hình',
				LOW_MEDIUM: 'THẤP-TRUNG BÌNH - Cảnh báo giai đoạn đầu',
				LOW: 'THẤP - Không có tín hiệu panic ngay lập tức',
				UNKNOWN: 'KHÔNG RÕ - Dữ liệu không đủ để phân tích'
			},
			
			// Hành động
			strongWarningAction: 'GIẢM vị thế ngay lập tức, tăng tiền mặt lên 70%+',
			moderateWarningAction: 'Giảm danh mục 40%, chuẩn bị vị thế phòng thủ',
			earlyWarningAction: 'Giảm các vị thế rủi ro nhất, tăng tiền mặt lên 30%',
			developingWeaknessAction: 'Theo dõi chặt chẽ, chuẩn bị xoay sang phòng thủ',
			noWarningAction: 'Chiến lược giao dịch bình thường'
		},
		
		// Mô tả phân loại
		classificationDescriptions: {
			POSITIVE_PANIC: 'Ngân hàng ổn định, Chứng khoán/BĐS bán quá mức - Cơ hội mua',
			NEGATIVE_EXTREME: 'Tất cả ngành đều đỏ sâu - Chỉ định vị phòng thủ',
			NEGATIVE_MEDIUM: 'Yếu kém đáng kể trên nhiều ngành - Giảm tiếp xúc',
			UNCLEAR_PATTERN: 'Tín hiệu ngành hỗn hợp - Định vị chọn lọc',
			RECOVERY_SIGNAL: 'Mô hình phục hồi đang xuất hiện - Theo dõi để vào',
			NO_PANIC: 'Điều kiện thị trường bình thường - Chiến lược tiêu chuẩn'
		},
		
		// Mô tả cảnh báo
		warningDescriptions: {
			STRONG_WARNING: 'CỰC KỲ CAO - Panic có thể xảy ra trong 1-3 ngày',
			MODERATE_WARNING: 'CAO - Theo dõi hàng ngày để phát hiện leo thang',
			EARLY_WARNING: 'TRUNG BÌNH - Quan sát sự phát triển mô hình',
			DEVELOPING_WEAKNESS: 'THẤP-TRUNG BÌNH - Cảnh báo giai đoạn đầu',
			NO_WARNING: 'THẤP - Không có tín hiệu panic ngay lập tức',
			INSUFFICIENT_DATA: 'KHÔNG RÕ - Dữ liệu không đủ để phân tích'
		},
		
		// Các phần phân tích
		analysis: {
			sectorBreakdown: 'Phân Tích Hiệu Suất Theo Ngành',
			sectorBreakdownDesc: 'Phân tích chỉ số ngành riêng lẻ',
			patternAnalysis: 'Phân Tích Mô Hình',
			patternAnalysisDesc: 'Phân loại mô hình thị trường Việt Nam',
			classificationLogic: 'Logic Phân Loại',
			historicalContext: 'Bối Cảnh Lịch Sử',
			marketConditions: 'Điều kiện thị trường và yếu tố bên ngoài',
			tradingLesson: 'Bài Học Giao Dịch',
			recoveryAnalysis: 'Phân Tích Phục Hồi',
			recoveryAnalysisDesc: 'Mô hình ổn định và phục hồi sau panic',
			prePanicSignals: 'Dòng Thời Gian Tín Hiệu Trước Panic',
			prePanicSignalsDesc: 'Phân tích T-1, T-7, T-14 cho thấy sự phát triển mô hình',
			comprehensiveScan: 'Quét Toàn Diện 14 Ngày',
			comprehensiveScanDesc: 'Phát hiện các đợt giảm đáng kể (≥2%) trong giai đoạn 14 ngày trước panic',
			prePanicTradingAdvice: 'Lời Khuyên Giao Dịch Trước Panic',
			prePanicTradingAdviceDesc: 'Khuyến nghị quản lý rủi ro dựa trên tín hiệu trước panic',
			marketChartAnalysis: 'Phân Tích Biểu Đồ Thị Trường',
			marketChartAnalysisDesc: 'Góc nhìn 6 tháng: 3 tháng trước và sau ngày panic',
			selectedTickersPerformance: 'Hiệu Suất Mã Cổ Phiếu Đã Chọn',
			selectedTickersPerformanceDesc: 'So sánh hiệu suất của các mã cổ phiếu được chọn thủ công từ So Sánh Biểu Đồ'
		},
		
		// Các chỉ số phục hồi
		recovery: {
			stabilization: 'Ổn Định',
			recoveryLeader: 'Người Dẫn Đầu Phục Hồi',
			nextDay: 'Ngày Tiếp Theo',
			daysToStabilize: 'Số Ngày Để Ổn Định',
			nextDayPerformance: 'Hiệu Suất Ngày Tiếp Theo',
			securitiesRecovery: 'Hiệu Suất Phục Hồi Chứng Khoán',
			averageSecuritiesRecovery: 'Phục hồi trung bình ngành chứng khoán'
		},
		
		// Thống kê
		statistics: {
			totalPanicDays: 'Tổng Số Ngày Panic',
			predictionAccuracy: 'Độ Chính Xác Dự Đoán',
			systemPerformance: 'Hiệu Suất Hệ Thống',
			updated: 'Cập Nhật',
			eventsAnalyzed: 'sự kiện được phân tích',
			eventsWithWarning: 'sự kiện có tín hiệu cảnh báo',
			blackSwanEvents: 'Sự kiện Thiên Nga Đen (không thể dự đoán)',
			yearlyDistribution: 'Phân Bố Theo Năm',
			patternDistribution: 'Phân Bố Mô Hình',
			recoveryPatterns: 'Mô Hình Phục Hồi',
			fastStabilization: 'Ổn Định Nhanh (1-2 ngày)',
			slowStabilization: 'Ổn Định Chậm (3+ ngày)',
			extendedCrisis: 'Khủng Hoảng Kéo Dài'
		},
		
		// Các yếu tố UI chung
		ui: {
			loading: 'Đang tải phân tích...',
			error: 'Không thể tải phân tích',
			noDataAvailable: 'Không có dữ liệu cho ngày này',
			historicalEvent: 'Sự Kiện Lịch Sử',
			currentAnalysis: 'Phân Tích Hiện Tại',
			takeAction: 'Hành Động',
			quickActions: 'Hành Động Nhanh',
			filters: 'Bộ Lọc',
			allYears: 'Tất Cả Năm',
			allPatterns: 'Tất Cả Mô Hình',
			classification: 'Phân Loại',
			panicType: 'Loại Panic',
			warningLevel: 'Mức Cảnh Báo',
			patternType: 'Loại Mô Hình',
			marketContext: 'Bối Cảnh Thị Trường'
		}
	}
};

export type Language = 'en' | 'vi';

/**
 * Get translated text for panic analysis
 */
export function getPanicTranslation(language: Language, key: string): string {
	const keys = key.split('.');
	let value: any = panicTranslations[language];
	
	for (const k of keys) {
		if (value && typeof value === 'object' && k in value) {
			value = value[k];
		} else {
			// Fallback to English if translation not found
			value = panicTranslations.en;
			for (const fallbackKey of keys) {
				if (value && typeof value === 'object' && fallbackKey in value) {
					value = value[fallbackKey];
				} else {
					return key; // Return key if no translation found
				}
			}
			break;
		}
	}
	
	return typeof value === 'string' ? value : key;
}

/**
 * Hook for panic analysis translations
 */
export function usePanicTranslations(language: Language = 'en') {
	return {
		t: (key: string) => getPanicTranslation(language, key),
		translations: panicTranslations[language]
	};
}