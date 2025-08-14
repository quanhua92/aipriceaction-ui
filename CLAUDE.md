# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` or `pnpm start` - Start development server on port 5173
- `pnpm build` - Build for production (runs vite build && tsc)
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm test:e2e` - Run Playwright E2E tests
- `pnpm test:e2e:headed` - Run E2E tests with browser UI
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome  
- `pnpm check` - Run Biome linting and formatting checks

Always run tests with timeout like `timeout 30s` or `timeout 60s` to avoid blocking bash.

## Architecture Overview

This is a React TypeScript application for Vietnamese stock market analysis with AI-powered insights, built with:

- **TanStack Router**: File-based routing with routes in `src/routes/`
- **TanStack Query**: Data fetching and state management (integrated via `src/integrations/tanstack-query/`)
- **Shadcn/ui**: UI component library with components in `src/components/ui/`
- **Tailwind CSS v4**: Styling with Vite plugin
- **Biome**: Code formatting and linting (replaces ESLint/Prettier)
- **Recharts**: Charting library for financial data visualization

### Key Architecture Components

**Data Layer (`src/lib/`)**:
- `queries.ts` - TanStack Query hooks for data fetching with caching strategies
- `stock-data.ts` - Core stock data processing, filtering, and calculations
- `company-data.ts` - Company information and financial data fetching
- `ask-ai-utils.ts` - AI context building and prompt generation utilities
- `portfolio-utils.ts` - Portfolio analysis and URL encoding/decoding
- `panic-analyzer.ts` - Market panic detection algorithms

**Translation System (`src/translations/`)**:
- Bilingual support (English/Vietnamese) with type-safe translation keys
- `useTranslation` hook provides current language and translation functions
- Translation keys support nested object access (e.g., `t("home.title")`)

**AI-Powered Features**:
- Ask AI system with context-aware prompts (`src/data/ask-ai-templates-*.ts`)
- Single and multi-ticker analysis templates
- VPA (Volume Price Analysis) integration
- Company data enrichment for AI context

**Chart System (`src/components/charts/`)**:
- `CandlestickChart.tsx` - Main financial chart component
- `ComparisonChart.tsx` - Multi-ticker comparison visualization
- Chart data is sampled and filtered based on date ranges and performance requirements

**Portfolio Management**:
- URL-based state persistence for portfolio configurations
- Performance analysis with risk metrics and diversification analysis
- Share functionality with privacy controls

### Key Architecture Points

- Router context includes QueryClient for TanStack Query integration
- Root layout in `src/routes/__root.tsx` includes Header, devtools, and query layout
- Path alias `@` maps to `src/` directory
- Auto code splitting enabled in TanStack Router
- Biome uses tab indentation and double quotes
- Data fetching includes retry logic with exponential backoff
- Chart performance optimized with data sampling (configurable max points)

### Domain-Specific Features

**Vietnamese Stock Market Support**:
- Ticker groups by sector (Banking, Securities, Real Estate, etc.)
- VN-Index benchmark integration
- Vietnamese currency formatting (VND)
- Sector-specific performance analysis

**Panic Analysis System**:
- Historical panic day detection and analysis
- Pre-panic warning indicators
- Trading signal generation based on market conditions

**AI Context Building**:
- Chart data context (configurable days)
- VPA analysis integration
- Company fundamental data enrichment
- Multi-ticker correlation analysis

### Adding Components

Use Shadcn CLI to add new UI components:
```bash
pnpx shadcn@latest add button
```

### Adding Routes

Create new `.tsx` files in `src/routes/` - TanStack Router will auto-generate route tree.

### Data Fetching Patterns

Use TanStack Query hooks from `src/lib/queries.ts`:
- `useTickerData(ticker, dateRangeConfig, maxPoints)` - Single ticker data
- `useMultipleTickerData(tickers, dateRangeConfig, maxPoints)` - Multiple tickers
- `useTickerGroups()` - Sector groupings
- `useSectorData(sector, dateRangeConfig)` - Sector-specific data

### Integration Structure

TanStack Query integration is centralized in `src/integrations/tanstack-query/` with:
- `root-provider.tsx` - Query client setup with default configurations
- `layout.tsx` - Query devtools integration

### Translation Usage

```tsx
const { t, language } = useTranslation();
// Use: t("home.title") or t("portfolio.askAI.description")
```

### Chart Performance

Charts are optimized with configurable data sampling:
- Default 1000 points for single ticker, 500 for multiple tickers
- Use `maxPoints` parameter in data fetching hooks
- Data filtering by date ranges before sampling

Demo files (prefixed with `demo`) can be safely deleted.

## important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
- ALWAYS BUILD BEFORE COMMIT