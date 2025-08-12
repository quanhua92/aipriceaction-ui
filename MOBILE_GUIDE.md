# Mobile-First UX Guide

*A comprehensive guide to mobile interactions, animations, and user experience patterns implemented in the AI Price Action trading platform.*

## Table of Contents

1. [Core Mobile Principles](#core-mobile-principles)
2. [Mobile Layout Patterns](#mobile-layout-patterns)
3. [Touch Interactions & Gestures](#touch-interactions--gestures)
4. [Smart Input Systems](#smart-input-systems)
5. [Progressive Disclosure](#progressive-disclosure)
6. [Animation & Micro-interactions](#animation--micro-interactions)
7. [Performance Optimizations](#performance-optimizations)
8. [Accessibility & Inclusive Design](#accessibility--inclusive-design)
9. [Implementation Examples](#implementation-examples)
10. [Mobile Testing Checklist](#mobile-testing-checklist)

---

## Core Mobile Principles

### 1. Mobile-First Design Philosophy
- **Always design for mobile first**, then enhance for desktop
- **Thumb-friendly interfaces**: Target areas ≥44px for touch targets
- **Content prioritization**: Show most important content first on small screens
- **Progressive enhancement**: Add complexity as screen size increases

### 2. Touch-First Interactions
- **Immediate visual feedback** for all touch interactions
- **No hover states on mobile** - design for touch, not mouse
- **Gesture support** where it enhances the experience
- **Handle touch delays** and prevent double-tap zoom where appropriate

### 3. Performance First
- **60fps animations** using CSS transforms and GPU acceleration
- **Debounced inputs** to prevent excessive API calls
- **Lazy loading** for non-critical components
- **Low-priority state updates** for smooth interactions

---

## Mobile Layout Patterns

### 1. Hybrid Desktop-Mobile Layouts

**Pattern**: Show mobile cards on small screens, desktop table on larger screens

**Implementation**: [`src/components/portfolio/PortfolioTable.tsx:567-610`](src/components/portfolio/PortfolioTable.tsx#L567-L610)

```tsx
{/* Mobile Layout: Card-based */}
<div className="block md:hidden px-4 space-y-3">
  {sortedItems.map((item) => (
    <PortfolioCard key={item.ticker} item={item} />
  ))}
</div>

{/* Desktop Layout: Table */}
<div className="hidden md:block overflow-x-auto">
  <Table>
    {/* Table content */}
  </Table>
</div>
```

**Benefits**:
- ✅ Native mobile experience (cards instead of cramped tables)
- ✅ Full desktop functionality preserved
- ✅ Single component maintains both layouts

### 2. Enhanced Mobile Cards with Rich Information

**Pattern**: Transform dense table data into scannable mobile cards

**Implementation**: [`src/components/portfolio/PortfolioTable.tsx:284-467`](src/components/portfolio/PortfolioTable.tsx#L284-L467)

**Key Features**:
- **Visual hierarchy**: Color-coded sector indicators
- **Progress bars**: Portfolio percentage visualization
- **Contextual badges**: Sector, watchlist, percentage indicators
- **Inline validation**: Real-time error/warning messages
- **Smart suggestions**: Quick-action buttons for common values

```tsx
const PortfolioCard = ({ item }: { item: PortfolioItem }) => {
  // Portfolio percentage calculation with visual indicator
  const portfolioPercentage = totalPortfolioValue > 0 ? (value / totalPortfolioValue) * 100 : 0;
  
  return (
    <div className="bg-background border rounded-lg p-4 space-y-4 relative overflow-hidden">
      {/* Visual percentage bar at top */}
      {!isWatchList && portfolioPercentage > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 to-blue-400">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${Math.min(portfolioPercentage, 100)}%` }}
          />
        </div>
      )}
      {/* Card content */}
    </div>
  );
};
```

---

## Touch Interactions & Gestures

### 1. Swipe-to-Delete Implementation

**Pattern**: Natural swipe gestures for item removal with undo functionality

**Implementation**: [`src/components/portfolio/PortfolioTable.tsx` - Swipe gesture system (previous iteration)](src/components/portfolio/PortfolioTable.tsx)

**Key Features**:
- **Touch event handling**: `touchstart`, `touchmove`, `touchend`
- **Momentum calculations**: Natural swipe physics
- **Undo mechanism**: Toast notifications with undo action
- **Visual feedback**: Transform translations and color changes

```tsx
// Touch gesture state management
const [swipeStates, setSwipeStates] = useState<{ [ticker: string]: SwipeState }>({});

const handleTouchStart = useCallback((e: TouchEvent, ticker: string) => {
  const touch = e.touches[0];
  setSwipeStates(prev => ({
    ...prev,
    [ticker]: {
      startX: touch.clientX,
      translateX: 0,
      isSwiping: true,
      startTime: Date.now(),
    }
  }));
}, []);

const handleTouchMove = useCallback((e: TouchEvent, ticker: string) => {
  const swipeState = swipeStates[ticker];
  if (!swipeState?.isSwiping) return;
  
  const touch = e.touches[0];
  const deltaX = touch.clientX - swipeState.startX;
  const maxSwipe = 100;
  const translateX = Math.max(-maxSwipe, Math.min(0, deltaX));
  
  setSwipeStates(prev => ({
    ...prev,
    [ticker]: { ...prev[ticker], translateX }
  }));
}, [swipeStates]);
```

### 2. Floating Action Buttons

**Pattern**: Replace traditional save/cancel buttons with floating actions for better mobile UX

**Implementation**: [`src/components/portfolio/PortfolioTable.tsx:617-645`](src/components/portfolio/PortfolioTable.tsx#L617-L645)

```tsx
{hasUnsavedChanges && (
  <div className="px-4 py-3 bg-blue-50/50 border-t border-blue-200/50">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-sm text-blue-700">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="font-medium">{t("portfolio.unsavedChanges")}</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleCancelChanges}>
          <X className="h-4 w-4 mr-1" />
          {t("portfolio.cancel")}
        </Button>
        <Button size="sm" onClick={handleSaveChanges}>
          <Save className="h-4 w-4 mr-1" />
          {t("portfolio.save")}
        </Button>
      </div>
    </div>
  </div>
)}
```

---

## Smart Input Systems

### 1. Real-Time Number Formatting

**Pattern**: Format numbers with thousand separators as users type

**Implementation**: [`src/lib/portfolio-utils.ts:95-101`](src/lib/portfolio-utils.ts#L95-L101)

```tsx
// Format number with Vietnamese thousand separators
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) || 0 : value;
  if (num === 0) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
}

// Parse formatted numbers back to raw values
export function parseFormattedNumber(value: string): number {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned) || 0;
  return Math.max(0, num);
}
```

**Usage in Components**: [`src/components/portfolio/PortfolioTable.tsx:161-201`](src/components/portfolio/PortfolioTable.tsx#L161-L201)

```tsx
const handleInputChange = useCallback((ticker: string, field: 'price' | 'quantity', value: string) => {
  const numValue = parseFormattedNumber(value);
  
  // Format the display value with thousand separators
  const formattedValue = numValue > 0 ? formatNumber(numValue) : value;
  setLocalValues(prev => ({ ...prev, [key]: formattedValue }));
  
  // Real-time validation
  const validation = field === 'price' ? validateStockPrice(numValue) : validateQuantity(numValue);
  // Handle validation feedback...
}, []);
```

### 2. Input Validation & Smart Suggestions

**Pattern**: Provide contextual help and suggestions as users type

**Implementation**: [`src/lib/portfolio-utils.ts:134-169`](src/lib/portfolio-utils.ts#L134-L169)

```tsx
// Vietnamese stock market validation
export function validateStockPrice(price: number): { isValid: boolean; warning?: string } {
  if (price <= 0) return { isValid: false };
  
  if (price < 1000) {
    return { isValid: true, warning: 'Price seems unusually low for Vietnamese stocks' };
  }
  
  if (price > 1_000_000) {
    return { isValid: true, warning: 'Price seems unusually high - did you mean ₫' + formatNumber(price / 1000) + '?' };
  }
  
  return { isValid: true };
}

// Smart rounding suggestions
export function suggestRoundPrice(price: number): number[] {
  if (price <= 0) return [];
  
  const suggestions: number[] = [];
  const magnitude = Math.pow(10, Math.floor(Math.log10(price)));
  const normalized = price / magnitude;
  
  if (normalized < 2) {
    suggestions.push(magnitude * 1, magnitude * 2);
  } else if (normalized < 5) {
    suggestions.push(magnitude * 2, magnitude * 5);
  } else {
    suggestions.push(magnitude * 5, magnitude * 10);
  }
  
  return Array.from(new Set(suggestions)).sort((a, b) => a - b);
}
```

### 3. Input Memory System

**Pattern**: Remember user patterns and provide intelligent suggestions

**Implementation**: [`src/lib/portfolio-utils.ts:437-631`](src/lib/portfolio-utils.ts#L437-L631)

```tsx
// Smart input memory interface
export interface InputMemory {
  recentTickers: string[];
  commonPrices: Record<string, number[]>;
  commonQuantities: number[];
  quickRounds: number[];
  lastUpdated: number;
}

// Remember user inputs for future suggestions
export function rememberTicker(ticker: string): void {
  const memory = loadInputMemory();
  const upperTicker = ticker.toUpperCase();
  
  memory.recentTickers = memory.recentTickers.filter(t => t !== upperTicker);
  memory.recentTickers.unshift(upperTicker);
  memory.recentTickers = memory.recentTickers.slice(0, MAX_RECENT_TICKERS);
  
  saveInputMemory(memory);
}
```

---

## Progressive Disclosure

### 1. Contextual Information Display

**Pattern**: Show relevant information only when needed to reduce cognitive load

**Example**: Portfolio percentage indicators only show when position exists
```tsx
{!isWatchList && portfolioPercentage > 0 && (
  <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800">
    {portfolioPercentage.toFixed(1)}%
  </Badge>
)}
```

### 2. Expandable Input Suggestions

**Pattern**: Show suggestions only when relevant to current input

```tsx
{priceSuggestions.length > 0 && (
  <div className="flex flex-wrap gap-1">
    {priceSuggestions.map((suggestion) => (
      <Button
        key={suggestion}
        size="sm"
        variant="outline"
        className="text-xs h-6 px-2"
        onClick={() => applySuggestion(item.ticker, 'price', suggestion)}
      >
        {formatCompactVND(suggestion)}
      </Button>
    ))}
  </div>
)}
```

---

## Animation & Micro-interactions

### 1. Minimal, Performance-First Animations

**Pattern**: Use minimal, essential animations that don't cause UI instability

```tsx
// ❌ AVOID: Complex staggered animations that cause jiggling
// <div style={{ animationDelay: `${index * 50}ms` }}> // Causes layout jumps

// ✅ PREFERRED: Simple, stable transitions only when necessary
<div className="transition-transform duration-200 ease-out">
  {/* Content */}
</div>
```

### 2. Essential Visual Feedback Only

**Pattern**: Provide feedback without excessive motion that distracts users

```tsx
// ✅ Essential state transitions
<div 
  className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
  style={{ width: `${Math.min(portfolioPercentage, 100)}%` }}
/>

// ✅ Simple input validation states
className={`text-right ${
  priceError ? 'border-red-500 focus:border-red-500' : 
  priceWarning ? 'border-yellow-500 focus:border-yellow-500' : ''
}`}
```

### 3. Stable Touch Feedback

**Pattern**: Clear feedback without excessive scaling or movement

```tsx
// ❌ AVOID: Excessive hover/scale animations
// className="hover:scale-[1.02] active:scale-[0.98]" // Causes instability

// ✅ PREFERRED: Simple color/background changes
className="hover:bg-blue-50 text-red-500 hover:text-red-700"

// ✅ Essential transform for swipe gestures only
style={{ transform: swipeActive ? `translateX(${translateX}px)` : 'translateX(0)' }}
```

### 4. Animation Stability Guidelines

**Key Principles**:
- ❌ **Avoid**: `animate-pulse`, `animate-in`, `slide-in-from-*`, excessive `scale` transforms
- ❌ **Avoid**: Dynamic animation delays that recalculate on re-render
- ❌ **Avoid**: Multiple simultaneous animations on same element
- ✅ **Use**: Simple `transition-transform`, `transition-colors`, `transition-opacity`
- ✅ **Use**: Animations only for essential user feedback
- ✅ **Use**: Stable transforms that don't cause layout recalculation

---

## Error Handling & Reliability

### 1. Graceful Data Loading Failures

**Pattern**: Maintain app functionality even when data fails to load

**Implementation**: [`src/routes/portfolio.tsx:364-446`](src/routes/portfolio.tsx#L364-L446)

```tsx
// Comprehensive error states for data loading
{error ? (
  <Card className="border-red-200 bg-red-50">
    <CardContent className="p-6 text-center">
      <div className="text-red-600">
        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold mb-2">Failed to load stock data</h3>
        <p className="text-sm text-red-600/80 mb-4">
          Unable to fetch stock market data. Your portfolio configuration is saved, 
          but analysis features are temporarily unavailable.
        </p>
      </div>
      <div className="text-sm text-muted-foreground">
        <p>You can still:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Add and remove stocks from your portfolio</li>
          <li>Edit quantities and prices</li>
          <li>Use the portfolio management tools</li>
        </ul>
      </div>
    </CardContent>
  </Card>
) : // ... rest of loading states
```

### 2. Retry Logic with Exponential Backoff

**Pattern**: Automatically retry failed requests with intelligent timing

**Implementation**: [`src/lib/queries.ts:64-66`](src/lib/queries.ts#L64-L66)

```tsx
return useQuery({
  queryKey: ["multiple-ticker-data", tickers, dateRangeConfig, maxPoints],
  queryFn: async () => {
    // Fetch data with error handling per ticker
    const results = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const data = await fetchTickerData(ticker);
          return [ticker, processData(data)] as const;
        } catch (error) {
          console.error(`Failed to load data for ${ticker}:`, error);
          return [ticker, []] as const; // Graceful fallback
        }
      })
    );
    return Object.fromEntries(results);
  },
  enabled: tickers.length > 0,
  retry: 3, // Retry failed requests 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### 3. Functional Degradation Strategy

**Key Principles**:
- ✅ **Portfolio management** always works (add/remove/edit stocks)
- ✅ **URL state persistence** maintains user's configuration  
- ✅ **Input validation** works offline with local rules
- ✅ **Clear messaging** explains what's available vs unavailable
- ❌ **Never block** core functionality due to data issues

### 4. Virtual Keyboard Stability

**Pattern**: Prevent mobile keyboard collapse during typing

**Implementation**: Simplified input handling to minimize re-renders

```tsx
// ❌ AVOID: Excessive state updates that cause keyboard collapse
const handleInputChange = (value) => {
  formatValue(value);        // State update 1
  validateValue(value);      // State update 2  
  updateSuggestions(value);  // State update 3
  setUnsavedChanges(true);   // State update 4
  // ... more updates causing keyboard to collapse
};

// ✅ PREFERRED: Minimal state updates
const handleInputChange = useCallback((ticker: string, field: string, value: string) => {
  const key = `${ticker}-${field}`;
  // Store raw value directly - DO NOT format on every keystroke
  setLocalValues(prev => ({ ...prev, [key]: value }));
  setHasUnsavedChanges(true);
}, []);
```

---

## Performance Optimizations

### 1. Low-Priority State Updates

**Pattern**: Use React's concurrent features for smooth interactions

**Implementation**: [`src/hooks/useLowPriorityState.tsx`](src/hooks/useLowPriorityState.tsx)

```tsx
// Low priority updates for non-critical state changes
const { 
  tickers, 
  removeTicker, 
  clearTickers, 
  setTickers, 
  isPending: tickersUpdating 
} = useTickerState(urlTickers);
```

### 2. Input Debouncing

**Pattern**: Debounce expensive operations like URL updates

**Implementation**: [`src/lib/portfolio-utils.ts:424-434`](src/lib/portfolio-utils.ts#L424-L434)

```tsx
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

### 3. React Suspense Boundaries

**Pattern**: Graceful loading states for heavy components

**Implementation**: [`src/components/ui/ChartSuspense.tsx`](src/components/ui/ChartSuspense.tsx)

```tsx
<ChartSuspense 
  fallbackTitle={`Loading ${item.ticker}`}
  fallbackDescription={`Preparing ${item.ticker} chart data...`}
  height={`${isMobile ? 250 : 300}px`}
  chartType="candlestick"
>
  <CandlestickChart data={item.data} height={isMobile ? 250 : 300} />
</ChartSuspense>
```

---

## Accessibility & Inclusive Design

### 1. Touch Target Guidelines

**Standards**:
- **Minimum 44px** touch targets (Apple HIG)
- **Adequate spacing** between interactive elements
- **Visual focus indicators** for keyboard navigation

### 2. Input Accessibility

```tsx
// Proper input labeling and types
<Input
  type="text"
  inputMode="numeric"  // Mobile keyboard optimization
  value={getCurrentValue(item.ticker, 'price')}
  className="text-right"
  aria-label={`Price for ${item.ticker}`}
/>
```

### 3. Screen Reader Support

```tsx
// Descriptive button labels
<Button
  size="sm"
  variant="ghost"
  onClick={() => onRemoveItem(item.ticker)}
  aria-label={`Remove ${item.ticker} from portfolio`}
>
  <Trash2 className="h-4 w-4" />
</Button>
```

---

## Implementation Examples

### 1. Mobile-First Component Structure

```tsx
function MobileOptimizedComponent() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <>
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <MobileCardLayout />
      </div>
      
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <DesktopTableLayout />
      </div>
    </>
  );
}
```

### 2. Touch-Optimized Input Handling

```tsx
const handleInputChange = useCallback((value: string) => {
  // 1. Format for display
  const formattedValue = formatNumber(parseFormattedNumber(value));
  setLocalValue(formattedValue);
  
  // 2. Validate input
  const validation = validateInput(parseFormattedNumber(value));
  setValidation(validation);
  
  // 3. Provide suggestions
  if (validation.showSuggestions) {
    setSuggestions(getSuggestions(value));
  }
  
  // 4. Debounced save
  debouncedSave(value);
}, []);
```

### 3. Professional Animation Timing

```tsx
// Stagger animations for lists
{items.map((item, index) => (
  <div
    key={item.id}
    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
    style={{ 
      animationDelay: `${index * 50}ms`,
      animationFillMode: 'both' 
    }}
  >
    {/* Content */}
  </div>
))}

// Smooth state transitions
<div className="transition-all duration-300 ease-out">
  {/* Transitioning content */}
</div>
```

---

## Mobile Testing Checklist

### 📱 Device Testing
- [ ] iPhone SE (375px width) - smallest modern viewport
- [ ] iPhone 12/13/14 (390px width) - current standard
- [ ] Android phones (360px+ width) - various aspect ratios
- [ ] Tablets (768px+ width) - landscape and portrait

### 🎯 Touch Interaction Testing
- [ ] All buttons are ≥44px touch targets
- [ ] Swipe gestures work smoothly
- [ ] No accidental touches on adjacent elements
- [ ] Proper touch feedback (visual/haptic)

### ⚡ Performance Testing
- [ ] 60fps animations (use Chrome DevTools)
- [ ] Fast input response (<100ms feedback)
- [ ] Smooth scrolling (no janky scroll)
- [ ] Memory usage stays reasonable

### 📝 Input Testing
- [ ] Virtual keyboard stays open while typing (no collapse)
- [ ] Number inputs show numeric keypad
- [ ] Form validation shows immediately
- [ ] Input state persists during network issues
- [ ] Typing feels responsive (<100ms feedback)

### 🎨 Visual Testing
- [ ] Text is readable at all sizes
- [ ] Colors meet contrast requirements (WCAG AA)
- [ ] No horizontal scrolling on mobile
- [ ] Loading states are clear

### 🔄 State Management Testing
- [ ] Unsaved changes are clearly indicated
- [ ] Data persists across screen rotations
- [ ] Offline states are handled gracefully
- [ ] URL state syncs properly
- [ ] App remains functional when data fails to load
- [ ] Error states provide clear next steps

---

## Key Takeaways

1. **Always start mobile-first** - it forces better prioritization
2. **Touch targets matter** - 44px minimum, adequate spacing
3. **Performance is UX** - 60fps animations, debounced inputs
4. **Context is king** - show relevant information when needed
5. **Feedback is immediate** - users need instant response to touches
6. **Test on real devices** - simulators can't replicate the full experience

## Reference Implementation

The portfolio table component serves as the reference implementation for all these patterns: [`src/components/portfolio/PortfolioTable.tsx`](src/components/portfolio/PortfolioTable.tsx)

This component demonstrates:
- ✅ Hybrid mobile-desktop layouts
- ✅ Touch-optimized interactions
- ✅ Smart input systems with validation
- ✅ Professional animations
- ✅ Performance optimizations
- ✅ Progressive disclosure patterns

---

*This guide should be referenced for every new mobile feature. Update it as new patterns emerge!*