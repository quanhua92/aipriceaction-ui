import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Brain } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AskAIButtonProps {
	ticker?: string;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "sm" | "md" | "lg";
	className?: string;
	defaultTab?: "single" | "multi";
	children?: React.ReactNode;
}

export function AskAIButton({
	ticker,
	variant = "default",
	size = "sm",
	className,
	defaultTab = "single",
	children,
}: AskAIButtonProps) {
	const { t } = useTranslation();

	const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

	// Build search params
	const searchParams: Record<string, string> = {};
	if (ticker) searchParams.ticker = ticker;
	if (defaultTab !== "single") searchParams.tab = defaultTab;

	return (
		<Link to="/ask" search={searchParams}>
			<Button
				variant={variant}
				size={buttonSize}
				className={`bg-green-600 hover:bg-green-700 text-white ${className || ""}`}
			>
				<Brain className="h-4 w-4 mr-1" />
				{children || t("askAI.askAI")}
			</Button>
		</Link>
	);
}