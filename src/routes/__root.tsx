import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import Header from "../components/Header";
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
			<TanStackRouterDevtools />
			<TanStackQueryLayout />
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
