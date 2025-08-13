import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Analytics } from "@vercel/analytics/react";

import Header from "../components/Header";
import { FpsMonitor } from "../components/ui/FpsMonitor";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";

import TanStackQueryLayout from "../integrations/tanstack-query/layout.tsx";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

function AppContent() {
	const { isLoading } = useLanguage();
	
	if (isLoading) {
		return <div>Loading...</div>;
	}
	
	return (
		<>
			<Header />
			<Outlet />
			
			{/* Analytics */}
			<Analytics />
			
			{/* Development Tools */}
			<TanStackRouterDevtools />
			<TanStackQueryLayout />
			
			{/* FPS Monitor - positioned in top-right corner */}
			<FpsMonitor position="top-right" showOnlyInDev={true} />
		</>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: () => (
		<LanguageProvider>
			<AppContent />
		</LanguageProvider>
	),
});
