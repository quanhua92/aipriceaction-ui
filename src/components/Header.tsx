import { Link } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Grid3X3, Users, Building2 } from "lucide-react";

export default function Header() {
	return (
		<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4">
				<div className="flex items-center space-x-6">
					<Link to="/" className="flex items-center space-x-2">
						<TrendingUp className="h-6 w-6" />
						<span className="font-bold text-lg">AIPriceAction</span>
					</Link>
					
					<nav className="flex items-center space-x-4 text-sm font-medium">
						<Link 
							to="/" 
							className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
						>
							<div className="flex items-center space-x-2">
								<BarChart3 className="h-4 w-4" />
								<span>Dashboard</span>
							</div>
						</Link>
						
						<Link 
							to="/tickers" 
							className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
						>
							<div className="flex items-center space-x-2">
								<Users className="h-4 w-4" />
								<span>Browse Tickers</span>
							</div>
						</Link>
						
						<Link 
							to="/sectors"
							className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
						>
							<div className="flex items-center space-x-2">
								<Building2 className="h-4 w-4" />
								<span>Sectors</span>
							</div>
						</Link>
						
						<Link 
							to="/compare" 
							className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground"
						>
							<div className="flex items-center space-x-2">
								<Grid3X3 className="h-4 w-4" />
								<span>Compare Charts</span>
							</div>
						</Link>
					</nav>
				</div>
			</div>
		</header>
	);
}
