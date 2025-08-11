import { useQuery } from "@tanstack/react-query";
import {
	fetchTickerData,
	loadTickerGroups,
	filterDataByTimeRange,
	sampleData,
	type StockDataPoint,
	type TimeRange,
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
	range: TimeRange = "ALL",
	maxPoints: number = 1000,
) {
	return useQuery({
		queryKey: ["ticker-data", ticker, range, maxPoints],
		queryFn: async (): Promise<StockDataPoint[]> => {
			const data = await fetchTickerData(ticker);
			const filteredData = filterDataByTimeRange(data, range);
			return sampleData(filteredData, maxPoints);
		},
		enabled: !!ticker,
		staleTime: 1000 * 60 * 5, // 5 minutes
		gcTime: 1000 * 60 * 30, // 30 minutes
	});
}

export function useMultipleTickerData(
	tickers: string[],
	range: TimeRange = "ALL",
	maxPoints: number = 500,
) {
	return useQuery({
		queryKey: ["multiple-ticker-data", tickers, range, maxPoints],
		queryFn: async (): Promise<Record<string, StockDataPoint[]>> => {
			const promises = tickers.map(async (ticker) => {
				try {
					const data = await fetchTickerData(ticker);
					const filteredData = filterDataByTimeRange(data, range);
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
	});
}

export function useSectorData(sector: string, range: TimeRange = "ALL") {
	const { data: tickerGroups } = useTickerGroups();
	const sectorTickers = tickerGroups?.[sector] || [];

	return useMultipleTickerData(sectorTickers, range);
}
