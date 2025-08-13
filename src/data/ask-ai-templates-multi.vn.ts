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
	}
];