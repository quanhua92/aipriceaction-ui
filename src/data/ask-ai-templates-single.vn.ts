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
	},
	{
		id: "profit-maximization",
		title: "Chiến lược tối đa hóa lợi nhuận",
		prompt: "Dựa trên tất cả dữ liệu có sẵn (biểu đồ, VPA, cơ bản công ty), chiến lược có xác suất cao nhất để tối đa hóa lợi nhuận từ mã này là gì? Bao gồm định cỡ vị thế tối ưu, thời điểm vào lệnh và mức chốt lời."
	},
	{
		id: "risk-reward-ratio",
		title: "Phân tích tỷ lệ rủi ro-lợi nhuận",
		prompt: "Tính toán tỷ lệ rủi ro-lợi nhuận cho các giao dịch tiềm năng trong mã này. Setup rủi ro-lợi nhuận tốt nhất hiện tại là gì? Tôi nên đặt stop và target ở đâu để có lợi nhuận tối đa?"
	},
	{
		id: "failure-prevention",
		title: "Tránh các lỗi giao dịch thường gặp",
		prompt: "Dựa trên hành động giá và mô hình VPA của mã này, những lỗi giao dịch phổ biến nào dẫn đến thua lỗ? Làm thế nào để tránh những điểm thất bại này và bảo vệ vốn?"
	},
	{
		id: "market-timing",
		title: "Thời điểm thị trường tối ưu",
		prompt: "Khi nào là thời điểm tuyệt đối tốt nhất để vào và ra mã này? Phân tích mô hình trong ngày, chu kỳ hàng tuần và xu hướng theo mùa để xác định cửa sổ thời gian có xác suất cao nhất."
	},
	{
		id: "position-sizing",
		title: "Định cỡ vị thế để an toàn tối đa",
		prompt: "Với biến động của mã này và khả năng chấp nhận rủi ro của tôi, cỡ vị thế nào sẽ tối đa hóa lợi nhuận trong khi bảo vệ khỏi thua lỗ thảm khốc? Bao gồm phân tích Kelly criterion nếu có thể."
	},
	{
		id: "catalyst-analysis",
		title: "Phân tích chất xúc tác và sự kiện sắp tới",
		prompt: "Những sự kiện, kết quả kinh doanh hoặc chất xúc tác thị trường sắp tới nào có thể tác động đáng kể đến giá của mã này? Tôi nên định vị như thế nào để thu lợi từ những biến động tiềm năng này?"
	},
	{
		id: "insider-smart-money",
		title: "Hoạt động của smart money và insider",
		prompt: "Khối lượng và hành động giá gợi ý gì về hoạt động của smart money, tổ chức hoặc insider? Họ có đang tích lũy hay phân phối? Làm thế nào để tôi thống nhất với dòng tiền thông minh?"
	},
	{
		id: "profit-protection",
		title: "Chiến lược bảo vệ lợi nhuận",
		prompt: "Nếu tôi đã có lời trong vị thế này, chiến lược tốt nhất để bảo vệ và tối đa hóa những khoản lời này là gì? Tôi có nên sử dụng trailing stop, chốt lời từng phần hay kỹ thuật khác?"
	},
	{
		id: "contrarian-opportunities",
		title: "Phân tích cơ hội nghịch chiều",
		prompt: "Có cơ hội chơi nghịch chiều trong mã này không? Khi mọi người đều bearish, có phải là lúc để bullish (hoặc ngược lại)? Phân tích tâm lý vs. dữ liệu kỹ thuật để có lợi nhuận nghịch chiều."
	},
	{
		id: "dividend-income-analysis",
		title: "Phân tích cổ tức và tiềm năng thu nhập",
		prompt: "Phân tích lịch sử cổ tức và tiềm năng thu nhập của mã này. Mã này có phù hợp cho chiến lược tập trung thu nhập không? An toàn cổ tức và triển vọng tăng trưởng như thế nào?"
	},
	{
		id: "options-strategies",
		title: "Cơ hội giao dịch quyền chọn",
		prompt: "Những chiến lược quyền chọn nào sẽ có lợi nhuận nhất cho setup hiện tại của mã này? Phân tích covered call, cash-secured put hoặc chiến lược phức tạp hơn dựa trên biến động và hướng."
	},
	{
		id: "earnings-strategy",
		title: "Chiến lược chơi kết quả kinh doanh",
		prompt: "Tôi nên giao dịch mã này như thế nào xung quanh thông báo kết quả kinh doanh? Mô hình phản ứng kết quả kinh doanh lịch sử là gì? Tôi có nên giữ qua kết quả kinh doanh hay đóng trước đó?"
	},
	{
		id: "capital-preservation",
		title: "Ưu tiên bảo toàn vốn",
		prompt: "Nếu bảo toàn vốn là ưu tiên hàng đầu của tôi, tôi nên tiếp cận mã này như thế nào? Cách an toàn nhất để tham gia vào upside tiềm năng trong khi giảm thiểu rủi ro downside là gì?"
	},
	{
		id: "momentum-scalping",
		title: "Cơ hội momentum và scalping",
		prompt: "Những cơ hội momentum ngắn hạn và scalping nào tồn tại trong mã này? Xác định những mô hình trong ngày tốt nhất và cơ hội lợi nhuận nhanh dựa trên phân tích VPA."
	},
	{
		id: "swing-trading-setup",
		title: "Tối ưu hóa swing trading",
		prompt: "Setup swing trading tối ưu cho mã này là gì? Phân tích thời gian nắm giữ tốt nhất, mô hình vào/ra và mục tiêu lời cho swing trade dựa trên mô hình lịch sử."
	},
	{
		id: "value-trap-analysis",
		title: "Phát hiện bẫy giá trị",
		prompt: "Mã này có phải là bẫy giá trị hay cơ hội thực sự? Phân tích xem sự rẻ rõ ràng có được biện minh bởi cơ bản hay có rủi ro ẩn có thể dẫn đến underperformance tiếp tục."
	},
	{
		id: "recovery-potential",
		title: "Tiềm năng phục hồi và xoay chuyển",
		prompt: "Nếu mã này đã giảm, tiềm năng phục hồi là gì? Phân tích xem đây là sự thụt lùi tạm thời hay suy giảm cấu trúc. Những tín hiệu nào sẽ chỉ ra sự xoay chuyển thành công?"
	}
];