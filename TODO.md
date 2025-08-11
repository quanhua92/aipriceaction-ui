# TODO - AIPriceAction Development

## 🚨 Critical Issues

### Missing Market Data Files
The following ticker symbols are defined in `ticker_group.json` but their corresponding CSV files are missing from GitHub:

**Banking Sector (NGAN_HANG):**
- `OCB.csv` - 404 Not Found
- `MSB.csv` - 404 Not Found  
- `EVF.csv` - 404 Not Found
- `EIB.csv` - 404 Not Found

**Impact:**
- Causes 404 errors when loading banking sector data
- Results in console errors but does not break functionality
- Some sector comparisons may show incomplete data

**Solutions:**
1. **Preferred**: Add missing CSV files to `/market_data/` directory
2. **Alternative**: Remove missing tickers from `ticker_group.json` 
3. **Temp Fix**: Update error handling to gracefully handle missing files

## 🔧 Technical Improvements

### Page Title Update Needed
- Current: "Create TanStack App - aipriceaction-ui"
- Should be: "AIPriceAction" or "AIPriceAction - Vietnamese Stock Data"
- File to update: `index.html` or `vite.config.js`

### Date Range Selector
- ✅ Successfully implemented enhanced date range system
- ✅ Fixed chart loading issues in home page
- ✅ Added support for custom date ranges across all routes

## 🧪 Testing Status

### Playwright Tests
- ✅ **Chart functionality**: Working correctly
- ✅ **Sector navigation**: Working correctly  
- ✅ **Individual ticker pages**: Working correctly
- ⚠️ **Console errors**: Due to missing CSV files (non-breaking)

### Test Coverage
- ✅ Home page debugging
- ✅ Chart component testing
- ✅ Navigation testing
- 📝 **TODO**: Add comprehensive E2E tests for all routes

## 📊 Performance Notes

### Current Status
- VN-Index loads successfully from GitHub
- Date parsing fixed (no more July 2001 issue)
- Enhanced date range selection working
- All major functionality operational despite missing files

### Optimizations Done
- ✅ Fixed CSV date parsing for correct timezone handling
- ✅ Updated chart tooltips to use actual data dates
- ✅ Implemented proper error handling for failed requests
- ✅ Added backward compatibility for TimeRange system

---

## 📝 Development Notes

- Use `timeout 30s pnpm test:e2e:headed` to run Playwright tests
- Missing CSV files cause 404s but don't break core functionality
- Enhanced date range system successfully integrated
- Navigation and chart display issues resolved