import { useQuery, useQueryClient } from "@tanstack/react-query";

interface VPAData {
	content: string;
	lastModified?: string;
	ticker: string;
}

const fetchVPAData = async (ticker: string): Promise<VPAData> => {
	const url = `https://raw.githubusercontent.com/quanhua92/aipriceaction/main/vpa_data/${ticker}.md`;
	
	try {
		const response = await fetch(url);
		
		if (!response.ok) {
			if (response.status === 404) {
				throw new Error(`VPA data not available for ${ticker}`);
			}
			throw new Error(`Failed to fetch VPA data: ${response.status}`);
		}
		
		const content = await response.text();
		const lastModified = response.headers.get('last-modified');
		
		return {
			content,
			lastModified: lastModified || undefined,
			ticker,
		};
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('Unknown error occurred while fetching VPA data');
	}
};

export function useVPAData(ticker: string, enabled = true) {
	return useQuery({
		queryKey: ['vpa-data', ticker],
		queryFn: () => fetchVPAData(ticker),
		enabled: enabled && Boolean(ticker),
		staleTime: 1000 * 60 * 30, // 30 minutes
		gcTime: 1000 * 60 * 60 * 2, // 2 hours
		retry: (failureCount, error) => {
			// Don't retry for 404 errors (data doesn't exist)
			if (error instanceof Error && error.message.includes('not available')) {
				return false;
			}
			// Retry up to 2 times for other errors
			return failureCount < 2;
		},
	});
}

// Hook to prefetch VPA data (useful for hover states, etc.)
export function usePrefetchVPAData() {
	const queryClient = useQueryClient();
	
	return (ticker: string) => {
		queryClient.prefetchQuery({
			queryKey: ['vpa-data', ticker],
			queryFn: () => fetchVPAData(ticker),
			staleTime: 1000 * 60 * 30,
		});
	};
}