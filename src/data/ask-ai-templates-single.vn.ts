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
	}
];