import type { AskAITemplate } from "@/lib/ask-ai-utils";

export const singleTickerTemplatesVN: AskAITemplate[] = [
	{
		id: "should-buy",
		title: "Tôi có nên mua mã này không?",
		prompt: "Dựa trên dữ liệu biểu đồ và phân tích volume price action ở trên, tôi có nên mua mã này không? Vui lòng phân tích các chuyển động giá gần đây, mô hình volume và đưa ra khuyến nghị có lý do."
	},
	{
		id: "explain-movement",
		title: "Giải thích biến động của mã này",
		prompt: "Vui lòng giải thích biến động giá gần đây của mã này dựa trên dữ liệu biểu đồ và phân tích VPA. Những yếu tố chính nào đang thúc đẩy hành động giá?"
	},
	{
		id: "technical-analysis",
		title: "Tóm tắt phân tích kỹ thuật",
		prompt: "Cung cấp phân tích kỹ thuật toàn diện về mã này dựa trên dữ liệu biểu đồ và mô hình volume. Bao gồm các mức hỗ trợ/kháng cự, phân tích xu hướng và các chỉ báo momentum."
	},
	{
		id: "risk-assessment",
		title: "Đánh giá rủi ro",
		prompt: "Những rủi ro và cơ hội tiềm năng nào cho mã này dựa trên dữ liệu biểu đồ hiện tại và phân tích VPA? Cung cấp đánh giá rủi ro-lợi nhuận."
	},
	{
		id: "entry-exit-points",
		title: "Điểm vào và ra",
		prompt: "Dựa trên phân tích kỹ thuật và dữ liệu VPA, những điểm vào và ra tốt cho mã này là gì? Vui lòng cung cấp mức giá cụ thể và lý do."
	},
	{
		id: "volume-analysis",
		title: "Phân tích khối lượng",
		prompt: "Phân tích các mô hình khối lượng được hiển thị trong dữ liệu. Khối lượng liên quan đến chuyển động giá như thế nào? Có những đột biến khối lượng đáng kể hoặc bất thường nào không?"
	},
	{
		id: "trend-direction",
		title: "Hướng xu hướng",
		prompt: "Hướng xu hướng hiện tại của mã này là gì? Nó tăng giá, giảm giá hay đi ngang? Cung cấp bằng chứng từ dữ liệu biểu đồ và phân tích VPA."
	},
	{
		id: "short-term-outlook",
		title: "Triển vọng ngắn hạn",
		prompt: "Triển vọng ngắn hạn (1-2 tuần) của bạn cho mã này dựa trên dữ liệu gần đây là gì? Tôi nên theo dõi điều gì trong những ngày tới?"
	},
	{
		id: "long-term-potential",
		title: "Tiềm năng đầu tư dài hạn",
		prompt: "Đánh giá tiềm năng đầu tư dài hạn của mã này. Dựa trên dữ liệu lịch sử và các mô hình hiện tại, mã này có phù hợp để nắm giữ dài hạn không?"
	},
	{
		id: "price-targets",
		title: "Mục tiêu giá",
		prompt: "Dựa trên phân tích kỹ thuật và các mức hỗ trợ/kháng cự, mục tiêu giá thực tế cho mã này trong 1-3 tháng tới là gì?"
	},
	{
		id: "support-resistance",
		title: "Các mức hỗ trợ và kháng cự",
		prompt: "Xác định các mức hỗ trợ và kháng cự quan trọng cho mã này dựa trên dữ liệu giá lịch sử. Những mức giá quan trọng nhất cần theo dõi là gì?"
	},
	{
		id: "chart-patterns",
		title: "Nhận dạng mô hình biểu đồ",
		prompt: "Có mô hình biểu đồ nào có thể nhận dạng được (đầu vai, tam giác, cờ, nêm, đỉnh/đáy kép) đang hình thành ở mã này không? Những mô hình này gợi ý điều gì?"
	},
	{
		id: "breakout-potential",
		title: "Phân tích đột phá",
		prompt: "Mã này có đang chuẩn bị cho một đột phá tiềm năng không? Phân tích các mô hình củng cố, khối lượng và hành động giá để đánh giá khả năng và hướng đột phá."
	},
	{
		id: "stop-loss-strategy",
		title: "Khuyến nghị cắt lỗ",
		prompt: "Dựa trên phân tích kỹ thuật và mô hình biến động, các mức cắt lỗ phù hợp cho cả vị thế mua và bán mã này ở đâu?"
	},
	{
		id: "sector-comparison",
		title: "So sánh hiệu suất ngành",
		prompt: "Mã này đang hoạt động như thế nào so với ngành của nó và thị trường chung (VNINDEX)? Nó có vượt trội hay kém hơn so với các cổ phiếu cùng ngành?"
	},
	{
		id: "liquidity-analysis",
		title: "Phân tích thanh khoản và giao dịch",
		prompt: "Phân tích thanh khoản của mã này dựa trên mô hình khối lượng và biên độ giá. Có đủ thanh khoản để vào và ra lệnh một cách suôn sẻ không?"
	},
	{
		id: "institutional-activity",
		title: "Phân tích hoạt động tổ chức",
		prompt: "Dựa trên mô hình khối lượng và chuyển động giá, có thể suy luận gì về hoạt động của các tổ chức hoặc nhà đầu tư thông minh trong mã này? Họ có đang tích lũy hay phân phối?"
	},
	{
		id: "fibonacci-analysis",
		title: "Phân tích Fibonacci retracement",
		prompt: "Áp dụng các mức Fibonacci retracement cho các chuyển động giá gần đây. Những mức Fibonacci quan trọng nào có thể hoạt động như hỗ trợ hoặc kháng cự?"
	},
	{
		id: "volatility-assessment",
		title: "Đánh giá biến động và rủi ro",
		prompt: "Phân tích mô hình biến động của mã này. Nó biến động như thế nào so với mức bình thường lịch sử? Điều này có nghĩa gì cho việc định cỡ vị thế?"
	},
	{
		id: "market-context",
		title: "Phân tích bối cảnh thị trường",
		prompt: "Bối cảnh thị trường rộng hơn (xu hướng VNINDEX, tâm lý thị trường, yếu tố kinh tế) đang ảnh hưởng đến hành động giá của mã này như thế nào? Tôi có nên xem xét các yếu tố vĩ mô?"
	}
];