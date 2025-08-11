import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { 
	TrendingUp, 
	FileText, 
	ExternalLink,
	Loader2,
	AlertCircle,
	Eye
} from "lucide-react";
import { useVPAData } from "@/hooks/useVPAData";

interface VPAButtonProps {
	ticker: string;
	variant?: "button" | "badge" | "icon";
	size?: "sm" | "lg";
	mode?: "dialog" | "popover";
	className?: string;
}

// Parse markdown content to extract recent entries (simplified for popup)
const parseVPAContentSimple = (content: string, limit = 10) => {
	const lines = content.split('\n');
	const entries: Array<{
		date: string;
		content: string;
		analysis: string;
	}> = [];
	
	let currentEntry: { date: string; content: string; analysis: string } | null = null;
	let isAnalysisSection = false;
	
	for (const line of lines) {
		// Match date patterns
		const dateMatch = line.match(/\*\*(?:Ngày\s+)?(\d{4}-\d{2}-\d{2})[:：]\*\*/);
		
		if (dateMatch) {
			if (currentEntry) {
				entries.push(currentEntry);
				if (entries.length >= limit) break;
			}
			
			currentEntry = {
				date: dateMatch[1],
				content: line.replace(/\*\*/g, '').trim(),
				analysis: ''
			};
			isAnalysisSection = false;
		} else if (currentEntry) {
			if (line.includes('**Phân tích VPA/Wyckoff:**') || line.includes('**VPA Analysis:**')) {
				isAnalysisSection = true;
				currentEntry.analysis += line.replace(/\*\*/g, '').trim() + '\n';
			} else if (line.trim().startsWith('-') && line.includes('**')) {
				isAnalysisSection = true;
				currentEntry.analysis += line.replace(/\*\*/g, '').trim() + '\n';
			} else if (isAnalysisSection && line.trim() && line.trim().length > 5) {
				currentEntry.analysis += line.trim() + '\n';
			} else if (!isAnalysisSection && line.trim() && !line.startsWith('#')) {
				currentEntry.content += ' ' + line.trim();
			}
		}
	}
	
	if (currentEntry) {
		entries.push(currentEntry);
	}
	
	return entries.slice(0, limit);
};

function VPAContent({ ticker }: { ticker: string }) {
	const { data: vpaData, isLoading, error } = useVPAData(ticker);
	const entries = vpaData ? parseVPAContentSimple(vpaData.content, 10) : [];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-5 w-5 animate-spin" />
				<span className="ml-2 text-sm text-muted-foreground">Loading VPA data...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
				<AlertCircle className="h-4 w-4" />
				<span>
					{error.message.includes('not available') 
						? `VPA data not available for ${ticker}`
						: 'Failed to load VPA data'
					}
				</span>
			</div>
		);
	}

	if (entries.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground text-sm">
				No VPA data available for {ticker}
			</div>
		);
	}

	return (
		<div className="space-y-4 max-h-96 overflow-y-auto">
			<div className="flex items-center justify-between sticky top-0 bg-background pb-2 border-b">
				<h4 className="font-semibold text-sm flex items-center gap-2">
					<TrendingUp className="h-4 w-4 text-blue-600" />
					Latest VPA Analysis - {ticker}
				</h4>
				{vpaData?.lastModified && (
					<Badge variant="outline" className="text-xs">
						{new Date(vpaData.lastModified).toLocaleDateString()}
					</Badge>
				)}
			</div>
			
			<div className="space-y-3">
				{entries.map((entry, index) => (
					<div 
						key={entry.date} 
						className={`border-l-2 border-blue-200 pl-3 ${index === 0 ? 'border-l-blue-500' : ''}`}
					>
						<div className="flex items-center gap-2 mb-1">
							<Badge 
								variant={index === 0 ? 'default' : 'secondary'} 
								className="text-xs"
							>
								{entry.date}
							</Badge>
							{index === 0 && (
								<Badge variant="outline" className="text-xs text-green-600">
									Latest
								</Badge>
							)}
						</div>
						
						<p className="text-xs text-muted-foreground mb-2 leading-relaxed">
							{entry.content}
						</p>
						
						{entry.analysis && (
							<div className="bg-muted/30 rounded-md p-2 text-xs">
								<div className="font-medium text-muted-foreground mb-1">
									VPA Analysis:
								</div>
								<div className="text-muted-foreground whitespace-pre-line">
									{entry.analysis.length > 300 
										? entry.analysis.substring(0, 300) + '...'
										: entry.analysis
									}
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			<div className="pt-2 border-t">
				<Button
					variant="outline"
					size="sm"
					className="w-full text-xs"
					onClick={() => window.open(`https://github.com/quanhua92/aipriceaction/blob/main/vpa_data/${ticker}.md`, '_blank')}
				>
					<ExternalLink className="h-3 w-3 mr-1" />
					View Full Analysis on GitHub
				</Button>
			</div>
		</div>
	);
}

export function VPAButton({ 
	ticker, 
	variant = "button", 
	size = "sm",
	mode = "popover",
	className = ""
}: VPAButtonProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Render different button variants
	const renderTrigger = () => {
		switch (variant) {
			case "badge":
				return (
					<Badge 
						variant="outline" 
						className={`cursor-pointer hover:bg-muted transition-colors ${className}`}
					>
						<FileText className="h-3 w-3 mr-1" />
						VPA
					</Badge>
				);
			case "icon":
				return (
					<Button 
						variant="ghost" 
						size="sm"
						className={`h-6 w-6 p-0 hover:bg-muted ${className}`}
					>
						<Eye className="h-3 w-3" />
					</Button>
				);
			default:
				return (
					<Button 
						variant="outline" 
						size={size}
						className={`gap-1 ${className}`}
					>
						<TrendingUp className="h-3 w-3" />
						VPA
					</Button>
				);
		}
	};

	if (mode === "dialog") {
		return (
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					{renderTrigger()}
				</DialogTrigger>
				<DialogContent className="max-w-2xl max-h-[80vh]">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-blue-600" />
							Volume Price Analysis - {ticker}
						</DialogTitle>
					</DialogHeader>
					<VPAContent ticker={ticker} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				{renderTrigger()}
			</PopoverTrigger>
			<PopoverContent 
				className="w-96 max-h-[500px] overflow-hidden" 
				align="start"
				side="bottom"
			>
				<VPAContent ticker={ticker} />
			</PopoverContent>
		</Popover>
	);
}