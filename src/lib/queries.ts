import { useQuery } from "@tanstack/react-query";
import {
	fetchTickerData,
	loadTickerGroups,
	filterDataByDateRange,
	sampleData,
	type StockDataPoint,
	type DateRangeConfig,
} from "./stock-data";
import {
	fetchCompanyInfo,
	fetchFinancialInfo,
	fetchTickerAIData,
} from "./company-data";

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

// Company info query hook
export function useCompanyInfo(ticker: string) {
	return useQuery({
		queryKey: ["company-info", ticker],
		queryFn: () => fetchCompanyInfo(ticker),
		enabled: !!ticker,
		staleTime: 1000 * 60 * 60, // 1 hour (company info doesn't change often)
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
	});
}

// Financial info query hook
export function useFinancialInfo(ticker: string) {
	return useQuery({
		queryKey: ["financial-info", ticker],
		queryFn: () => fetchFinancialInfo(ticker),
		enabled: !!ticker,
		staleTime: 1000 * 60 * 60, // 1 hour (financial data doesn't change often)
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
	});
}

// Ticker AI data query hook
export function useTickerAIData(ticker: string) {
	return useQuery({
		queryKey: ["ticker-ai-data", ticker],
		queryFn: () => fetchTickerAIData(ticker),
		enabled: !!ticker,
		staleTime: 1000 * 60 * 30, // 30 minutes
		gcTime: 1000 * 60 * 60, // 1 hour
		retry: 2,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
	});
}

