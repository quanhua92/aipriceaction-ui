# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` or `pnpm start` - Start development server on port 5173
- `pnpm build` - Build for production (runs vite build && tsc)
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests with Vitest
- `pnpm lint` - Lint code with Biome
- `pnpm format` - Format code with Biome  
- `pnpm check` - Run Biome linting and formatting checks

## Architecture Overview

This is a React TypeScript application built with:

- **TanStack Router**: File-based routing with routes in `src/routes/`
- **TanStack Query**: Data fetching and state management (integrated via `src/integrations/tanstack-query/`)
- **Shadcn/ui**: UI component library with components in `src/components/ui/`
- **Tailwind CSS v4**: Styling with Vite plugin
- **Biome**: Code formatting and linting (replaces ESLint/Prettier)

### Key Architecture Points

- Router context includes QueryClient for TanStack Query integration
- Root layout in `src/routes/__root.tsx` includes Header, devtools, and query layout
- Path alias `@` maps to `src/` directory
- Auto code splitting enabled in TanStack Router
- Biome uses tab indentation and double quotes

### Adding Components

Use Shadcn CLI to add new UI components:
```bash
pnpx shadcn@latest add button
```

### Adding Routes

Create new `.tsx` files in `src/routes/` - TanStack Router will auto-generate route tree.

### Integration Structure

TanStack Query integration is centralized in `src/integrations/tanstack-query/` with:
- `root-provider.tsx` - Query client setup
- `layout.tsx` - Query devtools integration

Demo files (prefixed with `demo`) can be safely deleted.