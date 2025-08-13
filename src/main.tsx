import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

// Handle GitHub Pages SPA routing
if (window.location.search.includes('redirect=')) {
	const redirectPath = new URLSearchParams(window.location.search).get('redirect');
	if (redirectPath) {
		window.history.replaceState({}, '', redirectPath);
	}
}

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	scrollRestorationBehavior: 'instant',
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
	
	// Custom logic for when to preserve scroll position
	getScrollRestorationKey: (location) => {
		// Preserve scroll position for multi-ticker pages
		const multiTickerPages = ['/ask', '/compare', '/ticker/', '/panic/analyze'];
		
		if (multiTickerPages.some(page => location.pathname.startsWith(page))) {
			return location.pathname;
		}
		
		return location.state.__TSR_key!;
	},
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
				<RouterProvider router={router} />
			</TanStackQueryProvider.Provider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
