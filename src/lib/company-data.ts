// Company data types and fetching functions
export interface CompanyInfo {
	symbol: string;
	exchange: string;
	industry: string;
	marketCap: number;
	currentPrice: number;
	outstandingShares: number;
	revenue: number;
	netIncome: number;
	peRatio: number;
	pbRatio: number;
	roe: number;
	roa: number;
	debtToEquity: number;
	currentRatio: number;
	grossMargin: number;
	netMargin: number;
	description?: string;
	founded?: number;
	employees?: number;
	website?: string;
	address?: string;
	phone?: string;
	shareholders?: Array<{
		name: string;
		ownership: number;
	}>;
	officers?: Array<{
		name: string;
		position: string;
	}>;
}

export interface FinancialInfo {
	symbol: string;
	balance_sheet: Array<{
		ticker: string;
		year: number;
		report_length: number;
		[key: string]: any; // Financial line items with coded keys
	}>;
	income_statement: Array<{
		ticker: string;
		year: number;
		report_length: number;
		[key: string]: any; // Financial line items with coded keys
	}>;
}

export interface TickerAIData {
	symbol: string;
	exchange: string;
	industry: string;
	marketCap: number;
	currentPrice: number;
	outstandingShares: number;
	revenue: number;
	netIncome: number;
	peRatio: number;
	pbRatio: number;
	roe: number;
	roa: number;
	debtToEquity: number;
	currentRatio: number;
	grossMargin: number;
	netMargin: number;
	description?: string;
	founded?: number;
	[key: string]: any; // Allow for additional AI-optimized fields
}

const BASE_URL = "https://raw.githubusercontent.com/quanhua92/aipriceaction-data/refs/heads/main/company_data";

// Fetch company information
export async function fetchCompanyInfo(ticker: string): Promise<CompanyInfo> {
	const url = `${BASE_URL}/${ticker}_company_info.json`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch company info for ${ticker}: ${response.status}`);
		}
		
		const data = await response.json();
		
		// Transform the raw data to our interface format
		return {
			symbol: data.symbol || ticker,
			exchange: data.exchange || "",
			industry: data.industry || "",
			marketCap: data.market_cap || data.marketCap || 0,
			currentPrice: data.current_price || data.currentPrice || 0,
			outstandingShares: data.outstanding_shares || data.outstandingShares || 0,
			revenue: data.revenue || 0,
			netIncome: data.net_income || data.netIncome || 0,
			peRatio: data.pe_ratio || data.peRatio || 0,
			pbRatio: data.pb_ratio || data.pbRatio || 0,
			roe: data.roe || 0,
			roa: data.roa || 0,
			debtToEquity: data.debt_to_equity || data.debtToEquity || 0,
			currentRatio: data.current_ratio || data.currentRatio || 0,
			grossMargin: data.gross_margin || data.grossMargin || 0,
			netMargin: data.net_margin || data.netMargin || 0,
			description: data.description || data.company_description,
			founded: data.founded || data.founded_year,
			employees: data.employees || data.employee_count,
			website: data.website,
			address: data.address,
			phone: data.phone,
			shareholders: (data.shareholders || data.major_shareholders || []).map((sh: any) => ({
				name: sh.shareholder_name || sh.name,
				ownership: sh.shareholder_percent || sh.ownership
			})),
			officers: (data.officers || data.key_officers || []).map((off: any) => ({
				name: off.officer_name || off.name,
				position: off.officer_position || off.position
			})),
		};
	} catch (error) {
		console.error(`Error fetching company info for ${ticker}:`, error);
		throw error;
	}
}

// Fetch financial information (balance sheet + income statement)
export async function fetchFinancialInfo(ticker: string): Promise<FinancialInfo> {
	const url = `${BASE_URL}/${ticker}_financial_info.json`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch financial info for ${ticker}: ${response.status}`);
		}
		
		// Get the response text and handle NaN values before parsing
		const responseText = await response.text();
		const sanitizedText = responseText.replace(/:\s*NaN/g, ': null');
		const data = JSON.parse(sanitizedText);
		
		return {
			symbol: ticker,
			balance_sheet: data.balance_sheet || [],
			income_statement: data.income_statement || [],
		};
	} catch (error) {
		console.error(`Error fetching financial info for ${ticker}:`, error);
		throw error;
	}
}

// Fetch AI-optimized ticker data
export async function fetchTickerAIData(ticker: string): Promise<TickerAIData> {
	const url = `${BASE_URL}/${ticker}.json`;
	
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to fetch ticker AI data for ${ticker}: ${response.status}`);
		}
		
		const data = await response.json();
		
		// Transform the raw data to our interface format
		return {
			symbol: data.symbol || ticker,
			exchange: data.exchange || "",
			industry: data.industry || "",
			marketCap: data.market_cap || data.marketCap || 0,
			currentPrice: data.current_price || data.currentPrice || 0,
			outstandingShares: data.outstanding_shares || data.outstandingShares || 0,
			revenue: data.revenue || 0,
			netIncome: data.net_income || data.netIncome || 0,
			peRatio: data.pe_ratio || data.peRatio || 0,
			pbRatio: data.pb_ratio || data.pbRatio || 0,
			roe: data.roe || 0,
			roa: data.roa || 0,
			debtToEquity: data.debt_to_equity || data.debtToEquity || 0,
			currentRatio: data.current_ratio || data.currentRatio || 0,
			grossMargin: data.gross_margin || data.grossMargin || 0,
			netMargin: data.net_margin || data.netMargin || 0,
			description: data.description || data.company_description,
			founded: data.founded || data.founded_year,
			...data, // Include all other fields for AI context
		};
	} catch (error) {
		console.error(`Error fetching ticker AI data for ${ticker}:`, error);
		throw error;
	}
}

// Helper function to check if a financial value should be displayed
export function shouldDisplayFinancialValue(value: number | string): boolean {
	const num = typeof value === 'string' ? parseFloat(value) : value;
	return !isNaN(num) && num !== 0;
}

// Helper function to format financial values
export function formatFinancialValue(value: number | string): string {
	const num = typeof value === 'string' ? parseFloat(value) : value;
	if (isNaN(num) || num === 0) return '';
	
	if (num >= 1000000000) {
		return `${(num / 1000000000).toFixed(2)}B`;
	}
	if (num >= 1000000) {
		return `${(num / 1000000).toFixed(2)}M`;
	}
	if (num >= 1000) {
		return `${(num / 1000).toFixed(2)}K`;
	}
	return num.toLocaleString();
}

// Helper function to format percentage values
export function formatPercentage(value: number | string): string {
	const num = typeof value === 'string' ? parseFloat(value) : value;
	if (isNaN(num) || num === 0) return '';
	
	// Use higher precision for very small values
	const precision = Math.abs(num) < 0.01 ? 6 : 2;
	return `${num.toFixed(precision)}%`;
}

// Helper function to format currency (VND)
export function formatCurrency(value: number | string): string {
	const num = typeof value === 'string' ? parseFloat(value) : value;
	if (isNaN(num)) return 'N/A';
	
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(num);
}