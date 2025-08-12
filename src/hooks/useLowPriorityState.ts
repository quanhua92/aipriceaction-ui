/**
 * Low Priority State Hook
 * 
 * Uses React's concurrent features to update state with lower priority,
 * allowing urgent updates (like user interactions) to take precedence.
 * Particularly useful for ticker additions that trigger expensive chart re-renders.
 */

import { useState, useTransition, useCallback } from 'react';

/**
 * Hook for managing state updates with different priorities
 * @param initialValue - Initial state value
 * @returns [state, urgentUpdate, lowPriorityUpdate, isPending]
 */
export function useLowPriorityState<T>(initialValue: T) {
	const [state, setState] = useState<T>(initialValue);
	const [isPending, startTransition] = useTransition();

	// Urgent update - runs immediately with high priority
	const urgentUpdate = useCallback((value: T | ((prev: T) => T)) => {
		setState(value);
	}, []);

	// Low priority update - runs during idle time
	const lowPriorityUpdate = useCallback((value: T | ((prev: T) => T)) => {
		startTransition(() => {
			setState(value);
		});
	}, []);

	return [state, urgentUpdate, lowPriorityUpdate, isPending] as const;
}

/**
 * Hook specifically for managing ticker collections with performance optimization
 */
export function useTickerState(initialTickers: string[] = []) {
	const [tickers, urgentUpdateTickers, lowPriorityUpdateTickers, isPending] = useLowPriorityState<string[]>(initialTickers);

	// Add ticker with low priority (for bulk operations)
	const addTicker = useCallback((ticker: string) => {
		lowPriorityUpdateTickers(prev => 
			prev.includes(ticker) ? prev : [...prev, ticker]
		);
	}, [lowPriorityUpdateTickers]);

	// Add multiple tickers with low priority
	const addTickers = useCallback((newTickers: string[]) => {
		lowPriorityUpdateTickers(prev => {
			const uniqueNewTickers = newTickers.filter(ticker => !prev.includes(ticker));
			return uniqueNewTickers.length > 0 ? [...prev, ...uniqueNewTickers] : prev;
		});
	}, [lowPriorityUpdateTickers]);

	// Remove ticker with urgent priority (immediate user action)
	const removeTicker = useCallback((ticker: string) => {
		urgentUpdateTickers(prev => prev.filter(t => t !== ticker));
	}, [urgentUpdateTickers]);

	// Clear all tickers with urgent priority
	const clearTickers = useCallback(() => {
		urgentUpdateTickers([]);
	}, [urgentUpdateTickers]);

	// Replace all tickers with low priority (for bulk updates)
	const setTickers = useCallback((newTickers: string[]) => {
		lowPriorityUpdateTickers(newTickers);
	}, [lowPriorityUpdateTickers]);

	return {
		tickers,
		addTicker,
		addTickers,
		removeTicker,
		clearTickers,
		setTickers,
		isPending,
	};
}