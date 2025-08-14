import type { AskAITemplate } from "@/lib/ask-ai-utils";

export const multipleTickerTemplatesVN: AskAITemplate[] = [
	{
		id: "compare-performance",
		title: "So sánh hiệu suất của các mã này",
		prompt: "Vui lòng so sánh hiệu suất của các mã này dựa trên dữ liệu biểu đồ và phân tích VPA. Những mã nào hoạt động tốt hơn và tại sao?"
	},
	{
		id: "best-investment",
		title: "Mã nào là khoản đầu tư tốt nhất?",
		prompt: "Dựa trên phân tích kỹ thuật và dữ liệu VPA của tất cả các mã này, mã nào sẽ là cơ hội đầu tư tốt nhất hiện tại? Cung cấp lý do chi tiết."
	},
	{
		id: "portfolio-allocation",
		title: "Khuyến nghị phân bổ danh mục",
		prompt: "Nếu tôi tạo danh mục với các mã này, tỷ lệ phân bổ tối ưu cho mỗi mã sẽ là bao nhiêu phần trăm? Xem xét rủi ro, tiềm năng tăng trưởng và tương quan."
	},
	{
		id: "risk-comparison",
		title: "Phân tích so sánh rủi ro",
		prompt: "So sánh mức độ rủi ro của các mã này dựa trên biến động giá, mô hình khối lượng và các chỉ báo kỹ thuật. Xếp hạng từ rủi ro thấp nhất đến cao nhất."
	},
	{
		id: "sector-analysis",
		title: "Phân tích ngành và tương quan",
		prompt: "Phân tích các mã này từ góc độ ngành. Chúng có tương quan như thế nào? Có xu hướng cụ thể nào của ngành ảnh hưởng đến hiệu suất của chúng không?"
	},
	{
		id: "diversification-benefits",
		title: "Lợi ích đa dạng hóa",
		prompt: "Các mã này bổ sung cho nhau tốt đến mức nào cho mục đích đa dạng hóa? Có rủi ro chồng chéo hoặc thừa thãi nào không?"
	},
	{
		id: "momentum-comparison",
		title: "So sánh momentum",
		prompt: "So sánh tín hiệu momentum giữa các mã này. Những mã nào cho thấy momentum tăng giá hoặc giảm giá mạnh nhất dựa trên hành động giá và khối lượng?"
	},
	{
		id: "entry-strategy",
		title: "Chiến lược vào lệnh nhiều mã",
		prompt: "Nếu tôi muốn đầu tư vào nhiều mã từ lựa chọn này, chiến lược vào lệnh tối ưu sẽ là gì? Tôi có nên vào tất cả cùng lúc hay phân tán các lệnh vào?"
	},
	{
		id: "correlation-pairs",
		title: "Tìm các cặp tương quan",
		prompt: "Xác định những mã nào có xu hướng di chuyển cùng nhau (tương quan dương) và những mã nào di chuyển theo hướng ngược lại (tương quan âm). Thông tin này có thể được sử dụng như thế nào để giao dịch?"
	},
	{
		id: "market-conditions",
		title: "Hiệu suất trong các điều kiện thị trường khác nhau",
		prompt: "Dựa trên dữ liệu, các mã này hoạt động như thế nào trong các điều kiện thị trường khác nhau (tăng giá, giảm giá, đi ngang)? Những mã nào mang tính phòng thủ và những mã nào hướng tới tăng trưởng?"
	},
	{
		id: "pairs-trading",
		title: "Cơ hội giao dịch cặp",
		prompt: "Xác định các cơ hội giao dịch cặp tiềm năng trong số các mã này. Những cặp nào có tương quan mạnh cho chiến lược hồi quy trung bình hoặc phân kỳ cho các chiến lược momentum?"
	},
	{
		id: "sector-rotation",
		title: "Phân tích luân chuyển ngành",
		prompt: "Dựa trên mô hình hiệu suất, những ngành nào được đại diện bởi các mã này đang được ưa chuộng và những ngành nào đang bị bỏ qua? Điều này gợi ý gì cho chiến lược luân chuyển ngành?"
	},
	{
		id: "market-cap-analysis",
		title: "Phân tích vốn hóa thị trường",
		prompt: "So sánh các mã này theo vốn hóa thị trường và phân tích cách các cổ phiếu vốn hóa lớn so với vốn hóa nhỏ đang hoạt động. Tôi nên xem xét thiên hướng vốn hóa nào cho danh mục của mình?"
	},
	{
		id: "beta-analysis",
		title: "Phân tích Beta và độ nhạy thị trường",
		prompt: "Phân tích beta (độ nhạy thị trường) của các mã này so với VNINDEX. Những mã nào là cổ phiếu tăng trưởng beta cao và những mã nào là cổ phiếu phòng thủ beta thấp?"
	},
	{
		id: "liquidity-comparison",
		title: "So sánh thanh khoản",
		prompt: "So sánh hồ sơ thanh khoản của các mã này dựa trên mô hình khối lượng. Những cổ phiếu nào cung cấp thanh khoản tốt nhất cho việc vào và ra các vị thế lớn?"
	},
	{
		id: "event-correlation",
		title: "Phân tích tương quan sự kiện",
		prompt: "Các mã này phản ứng như thế nào với các sự kiện thị trường, thông báo kết quả kinh doanh hoặc tin tức kinh tế? Có mô hình phản ứng chung nào hoặc hành vi khác biệt không?"
	},
	{
		id: "hedge-construction",
		title: "Xây dựng danh mục phòng ngừa rủi ro",
		prompt: "Làm thế nào tôi có thể sử dụng các mã này để xây dựng danh mục trung tính thị trường hoặc có bảo hiểm? Những kết hợp nào cung cấp khả năng phòng ngừa rủi ro thị trường tốt nhất?"
	},
	{
		id: "timing-strategy",
		title: "Thời điểm phân bổ vốn",
		prompt: "Dựa trên mô hình kỹ thuật và momentum, thời điểm tối ưu để phân bổ vốn cho từng mã này là gì? Tôi có nên đầu tư đồng thời hay tuần tự?"
	},
	{
		id: "drawdown-analysis",
		title: "So sánh sụt giảm tối đa",
		prompt: "So sánh các giai đoạn sụt giảm tối đa của các mã này. Những cổ phiếu nào cho thấy khả năng bảo vệ downside tốt hơn và phục hồi nhanh hơn từ thua lỗ?"
	},
	{
		id: "trend-strength",
		title: "So sánh sức mạnh xu hướng",
		prompt: "So sánh sức mạnh xu hướng giữa các mã này. Những cổ phiếu nào đang trong xu hướng tăng hoặc giảm mạnh nhất dựa trên hành động giá và các chỉ báo momentum?"
	},
	{
		id: "rebalancing-strategy",
		title: "Chiến lược tái cân bằng danh mục",
		prompt: "Nếu tôi nắm giữ tất cả các mã này trong một danh mục, khi nào và như thế nào tôi nên tái cân bằng dựa trên hiệu suất tương đối và tín hiệu kỹ thuật của chúng?"
	},
	{
		id: "profit-optimization-portfolio",
		title: "Chiến lược danh mục tối đa hóa lợi nhuận",
		prompt: "Thiết kế chiến lược tối đa hóa lợi nhuận tối ưu bằng cách sử dụng các mã này. Phân bổ, thời điểm vào lệnh và cách chốt lời nào sẽ tạo ra lợi nhuận cao nhất trong khi quản lý rủi ro?"
	},
	{
		id: "capital-rotation-strategy",
		title: "Tối ưu hóa luân chuyển vốn",
		prompt: "Tôi nên luân chuyển vốn giữa các mã này như thế nào để tối đa hóa lợi nhuận? Mã nào nên nhận vốn trước, thứ hai, thứ ba? Khi nào tôi nên chuyển tiền từ mã này sang mã khác để có lợi nhuận tối ưu?"
	},
	{
		id: "risk-parity-approach",
		title: "Xây dựng danh mục cân bằng rủi ro",
		prompt: "Xây dựng danh mục cân bằng rủi ro với các mã này trong đó mỗi mã đóng góp rủi ro bằng nhau. Trọng số nào đạt được điều này? So sánh với cách tiếp cận trọng số vốn hóa thị trường hoặc trọng số bằng nhau?"
	},
	{
		id: "momentum-ranking-system",
		title: "Hệ thống xếp hạng và luân chuyển momentum",
		prompt: "Xếp hạng các mã này theo sức mạnh momentum và tạo hệ thống luân chuyển. Mã nào tôi nên tăng trọng số, giảm trọng số hoặc tránh hoàn toàn? Tôi nên đánh giá lại xếp hạng bao lâu một lần?"
	},
	{
		id: "defensive-aggressive-split",
		title: "Phân bổ phòng thủ vs tích cực",
		prompt: "Chia các mã này thành nhóm phòng thủ và tích cực. Tôi nên phân bổ như thế nào giữa phòng thủ và tích cực dựa trên điều kiện thị trường hiện tại? Tỷ lệ nào tối ưu hóa lợi nhuận điều chỉnh rủi ro?"
	},
	{
		id: "earnings-season-strategy",
		title: "Chiến lược danh mục mùa kết quả kinh doanh",
		prompt: "Tôi nên định vị danh mục này như thế nào xung quanh mùa kết quả kinh doanh? Mã nào giữ qua kết quả kinh doanh, mã nào bán trước và mã nào mua sau? Tối ưu hóa cho lợi nhuận liên quan đến kết quả kinh doanh."
	},
	{
		id: "market-crash-protection",
		title: "Chiến lược bảo vệ khỏi sụp đổ thị trường",
		prompt: "Làm thế nào tôi có thể định vị danh mục này để thu lợi hoặc ít nhất bảo vệ khỏi sụp đổ thị trường? Mã nào cung cấp khả năng bảo vệ downside tốt nhất? Tôi có nên hedge hay chuyển sang tiền mặt?"
	},
	{
		id: "sector-momentum-rotation",
		title: "Chiến lược luân chuyển momentum ngành",
		prompt: "Dựa trên đại diện ngành trong các mã này, tạo chiến lược luân chuyển ngành. Ngành nào đang tăng momentum và xứng đáng với phân bổ nhiều hơn? Ngành nào đang mất momentum?"
	},
	{
		id: "volatility-harvesting",
		title: "Cơ hội thu hoạch biến động",
		prompt: "Làm thế nào tôi có thể thu hoạch biến động từ các mã này để có lợi nhuận bổ sung? Những kết hợp nào cung cấp cơ hội chênh lệch biến động hoặc hồi quy trung bình tốt nhất?"
	},
	{
		id: "tax-optimization-strategy",
		title: "Chiến lược giao dịch tối ưu thuế",
		prompt: "Thiết kế cách tiếp cận tối ưu thuế để giao dịch các mã này. Khi nào thực hiện lời so với lỗ? Làm thế nào để tối ưu hóa cho xử lý lợi nhuận vốn dài hạn vs ngắn hạn?"
	},
	{
		id: "liquidity-tiered-approach",
		title: "Định cỡ vị thế theo tầng thanh khoản",
		prompt: "Phân tầng các mã này theo thanh khoản và khuyến nghị cỡ vị thế tương ứng. Vị thế kém thanh khoản nên được định cỡ khác biệt như thế nào? Chiến lược phân bổ dựa trên thanh khoản tối ưu là gì?"
	},
	{
		id: "crisis-opportunity-positioning",
		title: "Định vị cơ hội khủng hoảng",
		prompt: "Nếu xảy ra khủng hoảng thị trường, mã nào trong số này cung cấp cơ hội phục hồi tốt nhất? Tôi nên định vị như thế nào để có lợi nhuận tối đa trong thời kỳ thị trường rối loạn và phục hồi sau đó?"
	},
	{
		id: "income-growth-balance",
		title: "Tối ưu hóa thu nhập vs tăng trưởng",
		prompt: "Cân bằng các mã này để có thu nhập vs tăng trưởng tối ưu. Phân bổ nào tối đa hóa tổng lợi nhuận (cổ tức + lãi vốn)? Điều này nên thay đổi như thế nào dựa trên chu kỳ thị trường?"
	},
	{
		id: "correlation-arbitrage",
		title: "Cơ hội chênh lệch tương quan",
		prompt: "Xác định cơ hội chênh lệch tương quan giữa các mã này. Khi tương quan bị phá vỡ, tôi có thể thu lợi như thế nào? Cặp nào cung cấp tiềm năng chênh lệch thống kê tốt nhất?"
	},
	{
		id: "market-leadership-rotation",
		title: "Chiến lược luân chuyển dẫn đầu thị trường",
		prompt: "Mã nào trong số này là nhà lãnh đạo thị trường vs kẻ theo sau? Tạo chiến lược luân chuyển từ nhà lãnh đạo sang kẻ theo sau và ngược lại. Thay đổi vai trò lãnh đạo thường xảy ra khi nào?"
	},
	{
		id: "options-overlay-strategy",
		title: "Chiến lược overlay quyền chọn để tăng lợi nhuận",
		prompt: "Thiết kế chiến lược overlay quyền chọn cho danh mục cổ phiếu này. Mã nào tốt nhất cho covered call, protective put hoặc chiến lược collar? Có thể tạo ra bao nhiêu thu nhập bổ sung?"
	},
	{
		id: "drawdown-minimization",
		title: "Giảm thiểu sụt giảm tối đa",
		prompt: "Cấu hình danh mục này để giảm thiểu sụt giảm tối đa trong khi duy trì tiềm năng lợi nhuận. Phân bổ và quy tắc giao dịch nào đạt được lợi nhuận điều chỉnh rủi ro tốt nhất?"
	},
	{
		id: "multi-timeframe-strategy",
		title: "Chiến lược phân bổ đa khung thời gian",
		prompt: "Thiết kế các chiến lược phân bổ khác nhau cho các khung thời gian khác nhau: giao dịch trong ngày, swing trading và đầu tư dài hạn. Cỡ vị thế và chiến lược nên thay đổi như thế nào theo khung thời gian?"
	},
	{
		id: "smart-rebalancing-triggers",
		title: "Tín hiệu tái cân bằng thông minh",
		prompt: "Tạo tín hiệu tái cân bằng thông minh ngoài tái cân bằng dựa trên lịch. Tín hiệu kỹ thuật, cơ bản hoặc điều kiện thị trường nào nên kích hoạt tái cân bằng để có hiệu quả tối đa?"
	},
	{
		id: "concentration-vs-diversification",
		title: "Tập trung tối ưu vs đa dạng hóa",
		prompt: "Mức độ tập trung vs đa dạng hóa tối ưu với các mã này là gì? Tôi có nên tập trung vào 2-3 mã hoạt động tốt nhất hay phân bổ đều? Điều này thay đổi như thế nào với điều kiện thị trường?"
	}
];