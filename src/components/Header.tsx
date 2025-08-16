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
	Brain,
	Search,
	ChevronDown,
	LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { language, setLanguage } = useLanguage();
	const { t } = useTranslation();

	const navigationMenu = [
		{
			label: t("nav.dashboard"),
			to: "/",
			icon: BarChart3,
		},
		{
			label: t("askAI.askAI"),
			to: "/ask",
			icon: Brain,
		},
		{
			label: t("nav.analysis"),
			icon: TrendingUp,
			children: [
				{
					to: "/scan",
					icon: Search,
					label: t("nav.scan"),
				},
				{
					to: "/panic",
					icon: AlertTriangle,
					label: t("nav.panicAnalysis"),
				},
				{
					to: "/portfolio",
					icon: Target,
					label: t("nav.portfolioAnalysis"),
				},
			],
		},
		{
			label: t("nav.tools"),
			icon: Grid3X3,
			children: [
				{
					to: "/chart",
					icon: LineChart,
					label: "Chart Debug",
				},
				{
					to: "/compare",
					icon: Grid3X3,
					label: t("nav.compareCharts"),
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
			],
		},
	];

	const allNavigationLinks = [
		{
			to: "/",
			icon: BarChart3,
			label: t("nav.dashboard"),
		},
		{
			to: "/ask",
			icon: Brain,
			label: t("askAI.askAI"),
		},
		{
			to: "/scan",
			icon: Search,
			label: t("nav.scan"),
		},
		{
			to: "/panic",
			icon: AlertTriangle,
			label: t("nav.panicAnalysis"),
		},
		{
			to: "/portfolio",
			icon: Target,
			label: t("nav.portfolioAnalysis"),
		},
		{
			to: "/chart",
			icon: LineChart,
			label: "Chart Debug",
		},
		{
			to: "/compare",
			icon: Grid3X3,
			label: t("nav.compareCharts"),
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
	];

	const toggleLanguage = () => {
		const newLanguage = language === 'en' ? 'vn' : 'en';
		setLanguage(newLanguage);
	};

	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
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
				<nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
					{navigationMenu.map((item) => {
						const Icon = item.icon;
						
						if (item.children) {
							// Dropdown menu item
							return (
								<div key={item.label} className="relative group">
									<button className="flex items-center space-x-2 transition-colors hover:text-foreground/80 text-foreground/60 px-3 py-2 rounded-md">
										<Icon className="h-4 w-4" />
										<span>{item.label}</span>
										<ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
									</button>
									
									{/* Dropdown Menu */}
									<div className="absolute top-full left-0 mt-1 w-48 bg-background border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
										<div className="py-2">
											{item.children.map((child) => {
												const ChildIcon = child.icon;
												return (
													<Link
														key={child.to}
														to={child.to}
														className="flex items-center space-x-3 px-4 py-2 text-sm transition-colors hover:bg-muted text-foreground/80 hover:text-foreground [&.active]:text-foreground [&.active]:bg-muted"
													>
														<ChildIcon className="h-4 w-4" />
														<span>{child.label}</span>
													</Link>
												);
											})}
										</div>
									</div>
								</div>
							);
						} else {
							// Regular menu item
							return (
								<Link
									key={item.to}
									to={item.to}
									className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground px-3 py-2 rounded-md"
								>
									<div className="flex items-center space-x-2">
										<Icon className="h-4 w-4" />
										<span>{item.label}</span>
									</div>
								</Link>
							);
						}
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
					<nav className="container mx-auto px-4 py-4 space-y-2">
						{allNavigationLinks.map((link) => {
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
