# TODO - AIPriceAction Development

## 🚨 Critical Issues

### Duplicate Tickers Across Sectors
The following 3 tickers appear in multiple sectors, causing React key conflicts:

- **ACG**: `OTHERS`, `THEP`
- **MSR**: `KHAI_KHOANG`, `THEP`  
- **PTB**: `THEP`, `VLXD`

**Impact:**
- ✅ **Fixed**: React duplicate key warnings resolved with unique keys
- These tickers legitimately belong to multiple sectors (e.g., steel companies in both mining and steel sectors)

### Missing Market Data Files
**Summary:** 171 out of 288 tickers are missing CSV data files (59.4% missing)

**Major Sectors with Missing Data:**
- **PENNY**: 16 missing files - Low-cap/penny stocks  
- **BAT_DONG_SAN**: 16 missing files - Real estate sector
- **CHUNG_KHOAN**: 13 missing files - Securities/brokerage sector
- **VAN_TAI**: 13 missing files - Transportation sector
- **XAY_DUNG**: 15 missing files - Construction sector
- **OTHERS**: 10 missing files - Miscellaneous companies
- **THEP**: 8 missing files - Steel sector

**Complete Missing Files List:**
<details>
<summary>Click to expand full list (171 files)</summary>

**BAN_LE** (2 missing): HAX, PET  
**BAO_HIEM** (2 missing): BMI, MIG  
**BAT_DONG_SAN** (16 missing): AGG, CEO, DIG, DXG, HLD, HQC, HTN, ITC, KHG, LDG, NDN, NHA, NTL, SCR, SGR, TDC  
**BAT_DONG_SAN_KCN** (7 missing): D2D, DTD, IDV, LHG, NTC, SZC, TIP  
**CAO_SU** (3 missing): DRG, DRI, VRG  
**CHUNG_KHOAN** (13 missing): AGR, APG, APS, BMS, BVS, DSC, EVS, ORS, SBS, TCI, TVB, TVS, VDS  
**CONG_NGHE** (4 missing): ELC, MFS, TTN, VTK  
**DAU_KHI** (4 missing): CNG, OIL, PVC, PVD  
**DAU_TU_CONG** (5 missing): FCN, G36, KSB, LCG, PLC  
**DET_MAY** (6 missing): ADS, EVE, GIL, PPH, STK, TCM  
**HANG_KHONG** (3 missing): NCT, SAS, SGN  
**HOA_CHAT** (4 missing): BFC, CSV, DDV, LAS  
**KHAI_KHOANG** (4 missing): BMC, NBC, NNC, TNT  
**NANG_LUONG** (3 missing): GEG, PPC, QTP  
**NGAN_HANG** (4 missing): EIB, EVF, MSB, OCB  
**NHUA** (3 missing): APH, HCD, NHH  
**NONG_NGHIEP** (5 missing): BAF, LTG, NAF, TSC, VLC  
**OTHERS** (10 missing): ACG, BWE, DHC, DSN, GDT, HHS, TDM, TIG, TTF, YEG  
**PENNY** (16 missing): CIG, DAG, DAH, DL1, DST, EVG, HAP, HID, LIG, MST, NRC, PXI, RDP, VC7, VIG, VPH  
**SUC_KHOE** (4 missing): DCL, DHT, JVC, TNH  
**THEP** (8 missing): ACG, GDA, KSV, SMC, TLH, TVN, VGS, VIF  
**THUC_PHAM** (5 missing): CLX, LSS, MCM, SBT, SLS  
**THUY_SAN** (5 missing): ACL, ASM, CMX, FMC, IDI  
**VAN_TAI** (13 missing): DVP, DXP, MHC, PHP, PVP, SKG, TCD, TCL, VIP, VNA, VOS, VSC, VTO  
**VLXD** (6 missing): BCC, BTN, BTS, CTI, DHA, HOM  
**XAY_DUNG** (15 missing): BCE, BCG, C47, C69, CKG, DPG, FID, HBC, IDJ, IJC, L18, PHC, S99, TLD, VC2  
**XAY_LAP_DIEN** (2 missing): SCI, VNE

</details>

**Impact:**
- Causes 404 errors when loading data for missing tickers
- Results in console errors but does not break functionality  
- Some sector comparisons show incomplete data
- 40.6% of tickers have working data (117/288)

**Solutions:**
1. **Preferred**: Add missing CSV files to `/market_data/` directory
2. **Alternative**: Remove missing tickers from `ticker_group.json` 
3. **Current**: Graceful error handling prevents app crashes

## 🔧 Technical Improvements

### Page Title Update
- ✅ **Fixed**: Updated from "Create TanStack App - aipriceaction-ui" 
- ✅ **New**: "AI Price Action - Vietnamese Stock Market Analysis"
- ✅ **Files updated**: `index.html` and `public/manifest.json`

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
- ✅ Removed backward compatibility functions to prevent confusion

---

## 📝 Development Notes

- Use `timeout 30s pnpm test:e2e:headed` to run Playwright tests
- Missing CSV files cause 404s but don't break core functionality
- Enhanced date range system successfully integrated
- Navigation and chart display issues resolved