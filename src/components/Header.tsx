import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
	BarChart3,
	TrendingUp,
	Grid3X3,
	Users,
	Building2,
	Target,
	Menu,
	X,
	Languages,
	AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { language, setLanguage } = useLanguage();
	const { t } = useTranslation();

	const navigationLinks = [
		{
			to: "/",
			icon: BarChart3,
			label: t("nav.dashboard"),
		},
		{
			to: "/panic",
			icon: AlertTriangle,
			label: "Panic Analysis",
		},
		{
			to: "/sectors",
			icon: Building2,
			label: t("nav.sectors"),
		},
		{
			to: "/tickers",
			icon: Users,
			label: t("nav.tickers"),
		},
		{
			to: "/compare",
			icon: Grid3X3,
			label: t("nav.compareCharts"),
		},
		{
			to: "/portfolio",
			icon: Target,
			label: t("nav.portfolioAnalysis"),
		},
	];

	const toggleLanguage = () => {
		const newLanguage = language === 'en' ? 'vn' : 'en';
		setLanguage(newLanguage);
	};

	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4">
				{/* Logo - always visible */}
				<Link
					to="/"
					className="flex items-center space-x-2"
					onClick={closeMobileMenu}
				>
					<TrendingUp className="h-6 w-6" />
					<span className="font-bold text-lg">AIPriceAction</span>
				</Link>

				{/* Desktop Navigation - hidden on mobile */}
				<nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
					{navigationLinks.map((link) => {
						const Icon = link.icon;
						return (
							<Link
								key={link.to}
								to={link.to}
								className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
							>
								<div className="flex items-center space-x-2">
									<Icon className="h-4 w-4" />
									<span>{link.label}</span>
								</div>
							</Link>
						);
					})}
					
					{/* Language Toggle - Desktop */}
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleLanguage}
						className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
						title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
					>
						<Languages className="h-4 w-4" />
						<span className="font-semibold">{language.toUpperCase()}</span>
					</Button>
				</nav>

				{/* Mobile Controls - only visible on mobile */}
				<div className="md:hidden flex items-center space-x-2">
					{/* Language Toggle - Mobile */}
					<Button
						variant="ghost"
						size="sm"
						onClick={toggleLanguage}
						className="flex items-center space-x-1 text-xs"
						title={language === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
					>
						<Languages className="h-4 w-4" />
						<span className="font-semibold">{language.toUpperCase()}</span>
					</Button>
					
					{/* Mobile Hamburger Button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle mobile menu"
					>
						{mobileMenuOpen ? (
							<X className="h-6 w-6" />
						) : (
							<Menu className="h-6 w-6" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Navigation Menu - slides down when open */}
			{mobileMenuOpen && (
				<div className="md:hidden border-t bg-background/95 backdrop-blur">
					<nav className="container px-4 py-4 space-y-2">
						{navigationLinks.map((link) => {
							const Icon = link.icon;
							return (
								<Link
									key={link.to}
									to={link.to}
									className="flex items-center space-x-3 p-3 rounded-lg transition-colors hover:bg-muted text-foreground/80 [&.active]:text-foreground [&.active]:bg-muted"
									onClick={closeMobileMenu}
								>
									<Icon className="h-5 w-5" />
									<span className="font-medium">{link.label}</span>
								</Link>
							);
						})}
					</nav>
				</div>
			)}
		</header>
	);
}
