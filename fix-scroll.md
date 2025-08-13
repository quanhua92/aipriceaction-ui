# TanStack Router Scroll Restoration Fix

This document outlines how to implement scroll restoration in our TanStack Router application to fix the issue where search dialogs lose their state when URL changes cause the page to scroll to the top.

## Current Issue

When users are in the multi-ticker tab of the Ask AI page and add tickers via the search dialog:
1. Adding a ticker updates the URL search params (`tickers` array)
2. TanStack Router navigates to the new URL
3. The page scrolls to the top automatically
4. This disrupts the user's workflow when adding multiple tickers

## TanStack Router Scroll Restoration

TanStack Router provides built-in scroll restoration capabilities that can be configured to handle these scenarios.

### Basic Implementation

Add scroll restoration to the router configuration:

```tsx
// src/main.tsx or router configuration
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  // Enable scroll restoration
  scrollRestoration: true,
  
  // Control scroll behavior
  scrollRestorationBehavior: 'instant', // or 'smooth', 'auto'
})
```

### Advanced Configuration

For more control over when scroll restoration should occur:

```tsx
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  scrollRestoration: true,
  
  // Custom logic for when to preserve scroll position
  getScrollRestorationKey: (location) => {
    // Preserve scroll position for specific routes
    const preserveScrollRoutes = ['/ask', '/compare', '/ticker/$symbol'];
    
    if (preserveScrollRoutes.some(route => location.pathname.startsWith(route))) {
      // Use the pathname as key to preserve scroll per route
      return location.pathname;
    }
    
    // Default behavior for other routes
    return location.state.__TSR_key!;
  },
})
```

### Route-Level Control

For specific routes that need scroll restoration disabled:

```tsx
// In route definition
export const Route = createFileRoute('/ask')({
  component: AskPage,
  // Prevent automatic scroll to top on URL changes
  scrollRestoration: {
    resetScroll: false,
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      ticker: search.ticker as string,
      tickers: Array.isArray(search.tickers) ? (search.tickers as string[]) : [],
      tab: (search.tab as "single" | "multi") || "single"
    };
  }
});
```

### Manual Control with Hooks

For fine-grained control within components:

```tsx
import { useElementScrollRestoration } from '@tanstack/react-router';

function AskPage() {
  // Get reference to scrollable container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Enable scroll restoration for this element
  useElementScrollRestoration({
    id: 'ask-page-container',
    element: containerRef.current,
  });

  return (
    <div ref={containerRef} className="container mx-auto p-4 max-w-7xl">
      {/* Page content */}
    </div>
  );
}
```

## Recommended Solution

### Step 1: Enable Global Scroll Restoration

Update the router configuration to enable scroll restoration:

```tsx
// src/main.tsx
const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  scrollRestorationBehavior: 'instant',
  
  getScrollRestorationKey: (location) => {
    // Preserve scroll for multi-ticker pages
    const multiTickerPages = ['/ask', '/compare', '/ticker/', '/panic/analyze'];
    
    if (multiTickerPages.some(page => location.pathname.startsWith(page))) {
      return location.pathname;
    }
    
    return location.state.__TSR_key!;
  },
});
```

### Step 2: Route-Specific Configuration

For routes with multi-ticker functionality, disable automatic scroll reset:

```tsx
// src/routes/ask.tsx
export const Route = createFileRoute("/ask")({
  component: AskPage,
  scrollRestoration: {
    resetScroll: false, // Don't scroll to top on search param changes
  },
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    // ... existing validation
  }
});
```

Apply the same to other multi-ticker routes:
- `/compare`
- `/ticker/$symbol` 
- `/panic/analyze`

### Step 3: Test and Verify

After implementation:
1. Navigate to `/ask` and switch to multi-ticker tab
2. Scroll to a specific position on the page
3. Add multiple tickers via the search dialog
4. Verify the page maintains scroll position during URL updates
5. Verify the search dialog persistence still works correctly

## Alternative Solutions

### Option 1: Prevent URL Updates During Dialog Interaction

Instead of updating URL immediately when tickers are added, batch the updates:

```tsx
// Only update URL when dialog is closed or after a delay
const debouncedUpdateUrl = useMemo(
  () => debounce((tickers: string[]) => {
    updateSearchParams({ tickers, tab: "multi" });
  }, 500),
  [updateSearchParams]
);
```

### Option 2: Use Hash-Based Navigation

For dialog states, use hash fragments that don't trigger full navigation:

```tsx
// Use hash for dialog state, search params for data
const handleTickersChange = (newTickers: string[]) => {
  setSelectedTickers(newTickers);
  // Update hash instead of search params during dialog interaction
  window.location.hash = 'adding-tickers';
  
  // Update search params only when dialog closes
};
```

## Implementation Priority

1. **High Priority**: Implement Step 1 (Global Scroll Restoration)
2. **Medium Priority**: Implement Step 2 (Route-Specific Configuration) 
3. **Low Priority**: Consider alternative solutions if needed

## Testing Checklist

- [ ] Multi-ticker search in `/ask` preserves scroll position
- [ ] Multi-ticker search in `/compare` preserves scroll position  
- [ ] Multi-ticker search in `/ticker/$symbol` preserves scroll position
- [ ] Multi-ticker search in `/panic/analyze` preserves scroll position
- [ ] Single-ticker searches still work normally
- [ ] Navigation to different routes works normally
- [ ] Browser back/forward buttons work correctly
- [ ] Mobile navigation is not affected

## Notes

- This fix addresses the UX issue where users lose their place when adding multiple tickers
- The `persistOpenState` localStorage feature we implemented works in conjunction with scroll restoration
- Both features together provide a smooth multi-ticker selection experience