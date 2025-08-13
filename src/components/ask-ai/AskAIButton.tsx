import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { Brain } from "lucide-react";
import { useState } from "react";
import { AskAIDialog } from "./AskAIDialog";

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
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();

	const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

	return (
		<>
			<Button
				variant={variant}
				size={buttonSize}
				onClick={() => setOpen(true)}
				className={`bg-green-600 hover:bg-green-700 text-white ${className || ""}`}
			>
				<Brain className="h-4 w-4 mr-1" />
				{children || t("askAI.askAI")}
			</Button>

			<AskAIDialog
				open={open}
				onOpenChange={setOpen}
				defaultTicker={ticker}
				defaultTab={defaultTab}
			/>
		</>
	);
}