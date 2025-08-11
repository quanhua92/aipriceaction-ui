import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	TrendingUp, 
	ChevronDown, 
	ChevronUp, 
	FileText, 
	ExternalLink,
	Loader2,
	AlertCircle
} from "lucide-react";
import { useVPAData } from "@/hooks/useVPAData";

interface VPACardProps {
	ticker: string;
	title?: string;
	compact?: boolean;
	defaultExpanded?: boolean;
	showViewButton?: boolean;
}

// Simple parsing: split content into chunks and take from bottom
const parseVPAContent = (content: string, limit = 5) => {
	const lines = content.split('\n').filter(line => line.trim());
	
	// Split content into chunks based on patterns that look like dates or entries
	const chunks: Array<{
		date: string;
		content: string;
		analysis: string;
	}> = [];
	
	let currentChunk = '';
	let chunkIndex = 0;
	
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		
		// Look for any date pattern (flexible matching)
		const dateMatch = line.match(/(\d{4}[-/]\d{2}[-/]\d{2})|(?:Ngày.*?(\d{4}[-/]\d{2}[-/]\d{2}))/);
		
		// If we find a date or we've accumulated enough content, start a new chunk
		if (dateMatch || currentChunk.length > 300) {
			if (currentChunk.trim()) {
				// Extract date if possible, otherwise use index
				const extractedDate = currentChunk.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
				const date = extractedDate ? extractedDate[1] : `Entry ${chunkIndex + 1}`;
				
				chunks.push({
					date: date,
					content: currentChunk.replace(/\*\*/g, '').trim(),
					analysis: ''
				});
				chunkIndex++;
			}
			currentChunk = line;
		} else {
			currentChunk += '\n' + line;
		}
	}
	
	// Don't forget the last chunk
	if (currentChunk.trim()) {
		const extractedDate = currentChunk.match(/(\d{4}[-/]\d{2}[-/]\d{2})/);
		const date = extractedDate ? extractedDate[1] : `Entry ${chunkIndex + 1}`;
		
		chunks.push({
			date: date,
			content: currentChunk.replace(/\*\*/g, '').trim(),
			analysis: ''
		});
	}
	
	// Take latest entries from the bottom (reverse order)
	return chunks.slice(-limit).reverse();
};

export function VPACard({ 
	ticker, 
	title, 
	compact = false, 
	defaultExpanded = false,
	showViewButton = true 
}: VPACardProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const { data: vpaData, isLoading, error } = useVPAData(ticker);

	const entries = vpaData ? parseVPAContent(vpaData.content, compact ? 3 : 10) : [];
	
	if (error && error.message.includes('not available')) {
		return (
			<Card className="opacity-60">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base">
						<FileText className="h-4 w-4 text-muted-foreground" />
						{title || `VPA Analysis - ${ticker}`}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<AlertCircle className="h-4 w-4" />
						<span>VPA data not available for {ticker}</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<TrendingUp className="h-4 w-4 text-blue-600" />
						{title || `Volume Price Analysis - ${ticker}`}
					</CardTitle>
					<div className="flex items-center gap-2">
						{vpaData?.lastModified && (
							<Badge variant="outline" className="text-xs">
								Updated: {new Date(vpaData.lastModified).toLocaleDateString()}
							</Badge>
						)}
						{!compact && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(!isExpanded)}
							>
								{isExpanded ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-8">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span className="ml-2 text-sm text-muted-foreground">Loading VPA data...</span>
					</div>
				) : error ? (
					<div className="flex items-center gap-2 text-sm text-red-600 py-4">
						<AlertCircle className="h-4 w-4" />
						<span>Failed to load VPA data</span>
					</div>
				) : entries.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground text-sm">
						No VPA data available
					</div>
				) : (
					<div className="space-y-4">
						{/* Show latest entry always, or first few if compact */}
						<div className="space-y-3">
							{entries.slice(0, compact ? 2 : isExpanded ? entries.length : 3).map((entry, index) => (
								<div 
									key={entry.date} 
									className={`border-l-2 border-blue-200 pl-4 ${index === 0 ? 'border-l-blue-500' : ''}`}
								>
									<div className="flex items-center gap-2 mb-1">
										<Badge variant={index === 0 ? 'default' : 'secondary'} className="text-xs">
											{entry.date}
										</Badge>
										{index === 0 && (
											<Badge variant="outline" className="text-xs text-green-600">
												Latest
											</Badge>
										)}
									</div>
									<p className="text-sm text-muted-foreground mb-2 leading-relaxed">
										{entry.content}
									</p>
									{entry.analysis && (
										<div className="bg-muted/50 rounded-md p-2 text-xs">
											<div className="font-medium text-muted-foreground mb-1">
												VPA Analysis:
											</div>
											<div className="text-muted-foreground whitespace-pre-line">
												{entry.analysis.substring(0, compact ? 200 : 400)}
												{entry.analysis.length > (compact ? 200 : 400) && '...'}
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						{/* Show more/less button */}
						{!compact && entries.length > 3 && (
							<div className="text-center pt-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsExpanded(!isExpanded)}
									className="text-xs"
								>
									{isExpanded ? (
										<>
											<ChevronUp className="h-3 w-3 mr-1" />
											Show Less
										</>
									) : (
										<>
											<ChevronDown className="h-3 w-3 mr-1" />
											Show More ({entries.length - 3} more entries)
										</>
									)}
								</Button>
							</div>
						)}

						{/* External link button */}
						{showViewButton && vpaData && (
							<div className="pt-3 border-t">
								<Button
									variant="outline"
									size="sm"
									className="w-full text-xs"
									onClick={() => window.open(`https://github.com/quanhua92/aipriceaction/blob/main/vpa_data/${ticker}.md`, '_blank')}
								>
									<ExternalLink className="h-3 w-3 mr-1" />
									View Full VPA Analysis on GitHub
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}