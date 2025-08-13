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
	}
];