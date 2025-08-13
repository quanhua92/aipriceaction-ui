import { useQuery } from "@tanstack/react-query";
import {
	fetchTickerData,
	loadTickerGroups,
	filterDataByDateRange,
	sampleData,
	type StockDataPoint,
	type DateRangeConfig,
} from "./stock-data";

export function useTickerGroups() {
	return useQuery({
		queryKey: ["ticker-groups"],
		queryFn: loadTickerGroups,
		staleTime: 1000 * 60 * 60, // 1 hour
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
	});
}

export function useTickerData(
	ticker: string,
	dateRangeConfig: DateRangeConfig = { range: "ALL" },
	maxPoints = 1000,
) {
	return useQuery({
		queryKey: ["ticker-data", ticker, dateRangeConfig, maxPoints],
		queryFn: async (): Promise<StockDataPoint[]> => {
			const data = await fetchTickerData(ticker);
			const filteredData = filterDataByDateRange(data, dateRangeConfig);
			return sampleData(filteredData, maxPoints);
		},
		enabled: !!ticker,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes
		retry: 3, // Retry failed requests 3 times
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
	});
}


export function useMultipleTickerData(
	tickers: string[],
	dateRangeConfig: DateRangeConfig = { range: "ALL" },
	maxPoints = 500,
) {
	return useQuery({
		queryKey: ["multiple-ticker-data", tickers, dateRangeConfig, maxPoints],
		queryFn: async (): Promise<Record<string, StockDataPoint[]>> => {
			const promises = tickers.map(async (ticker) => {
				try {
					const data = await fetchTickerData(ticker);
					const filteredData = filterDataByDateRange(data, dateRangeConfig);
					return [ticker, sampleData(filteredData, maxPoints)] as const;
				} catch (error) {
					console.error(`Failed to load data for ${ticker}:`, error);
					return [ticker, []] as const;
				}
			});

			const results = await Promise.all(promises);
			return Object.fromEntries(results);
		},
		enabled: tickers.length > 0,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes
		retry: 3, // Retry failed requests 3 times
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
	});
}


export function useSectorData(
	sector: string,
	dateRangeConfig: DateRangeConfig = { range: "ALL" },
) {
	const { data: tickerGroups } = useTickerGroups();
	const sectorTickers = tickerGroups?.[sector] || [];

	return useMultipleTickerData(sectorTickers, dateRangeConfig);
}

