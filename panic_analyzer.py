#!/usr/bin/env python3
"""
Vietnamese Market Panic Day Analyzer
Fetches all required ticker data and calculates sector indicators for any given date or date range.
Usage: 
  Single date: python panic_analyzer.py YYYY-MM-DD
  Date range:  python panic_analyzer.py YYYY-MM-DD YYYY-MM-DD
  Cycle analysis: python panic_analyzer.py --cycle YYYY-MM-DD YYYY-MM-DD
"""

import sys
import os
import pandas as pd
from datetime import datetime, timedelta

class VietnamesePanicAnalyzer:
    def __init__(self, data_directory="market_data"):
        self.data_dir = data_directory
        
        # Market cap weighted sector compositions
        self.banking_weights = {
            'VCB': 0.35,  # 325.3T VND
            'BID': 0.25,  # 252.4T VND  
            'TCB': 0.20,  # 243.0T VND
            'CTG': 0.15,  # 225.0T VND
            'VPB': 0.05   # 146.4T VND
        }
        
        self.securities_weights = {
            'SSI': 0.40,  # 48.0T VND (7x larger than #5)
            'VCI': 0.20,  # 25.4T VND
            'HCM': 0.15,  # 15.3T VND
            'MBS': 0.15,  # 15.3T VND
            'SHS': 0.10   # 10.4T VND
        }
        
        self.realestate_weights = {
            'VIC': 0.45,  # 370.8T VND (Largest Vietnamese stock)
            'VHM': 0.35,  # 313.4T VND
            'VRE': 0.10,  # 57.8T VND
            'KDH': 0.05,  # 29.8T VND
            'NVL': 0.05   # 29.5T VND
        }
        
        # All tickers we need
        self.all_tickers = (['VNINDEX'] + 
                           list(self.banking_weights.keys()) + 
                           list(self.securities_weights.keys()) + 
                           list(self.realestate_weights.keys()))
    
    def load_ticker_data(self, ticker):
        """Load CSV data for a ticker"""
        csv_path = os.path.join(self.data_dir, f"{ticker}.csv")
        try:
            df = pd.read_csv(csv_path)
            df.columns = ['ticker', 'date', 'open', 'high', 'low', 'close', 'volume']
            df['date'] = pd.to_datetime(df['date'])
            return df.set_index('date')
        except FileNotFoundError:
            print(f"⚠️  Warning: {ticker}.csv not found")
            return pd.DataFrame()
    
    def get_price_change(self, ticker_data, target_date):
        """Calculate percentage change for target date"""
        target_date = pd.to_datetime(target_date)
        
        if ticker_data.empty:
            return None
            
        # Get target date data
        target_row = ticker_data[ticker_data.index == target_date]
        if target_row.empty:
            return None
            
        # Find previous trading day
        prev_dates = ticker_data[ticker_data.index < target_date].index
        if prev_dates.empty:
            return None
            
        prev_date = prev_dates.max()
        prev_row = ticker_data[ticker_data.index == prev_date]
        
        if prev_row.empty:
            return None
            
        prev_close = prev_row.iloc[0]['close']
        target_close = target_row.iloc[0]['close']
        target_low = target_row.iloc[0]['low']
        target_volume = target_row.iloc[0]['volume']
        
        # Calculate change using close price
        change = ((target_close - prev_close) / prev_close) * 100
        
        # Also calculate worst intraday drop
        intraday_drop = ((target_low - prev_close) / prev_close) * 100
        
        return {
            'prev_close': prev_close,
            'target_close': target_close,
            'target_low': target_low,
            'change': change,
            'intraday_drop': intraday_drop,
            'volume': target_volume
        }
    
    def calculate_sector_indicator(self, sector_changes, weights):
        """Calculate weighted sector indicator"""
        total_weight = 0
        weighted_performance = 0
        valid_tickers = []
        
        for ticker, weight in weights.items():
            if ticker in sector_changes and sector_changes[ticker] is not None:
                change = sector_changes[ticker]['change']
                weighted_performance += change * weight
                total_weight += weight
                valid_tickers.append(ticker)
        
        if total_weight == 0:
            return None, []
            
        return weighted_performance / total_weight, valid_tickers
    
    def classify_panic_type(self, bsi, ssi, rsi, vnindex_drop):
        """Classify panic type based on sector indicators"""
        if abs(vnindex_drop) < 3.0:
            return "NO_PANIC"
        
        # Positive panic: Banking stable, others oversold
        if bsi is not None and ssi is not None and rsi is not None:
            if bsi > -2.0 and ssi < -3.0 and rsi < -4.0:
                return "POSITIVE_PANIC"
            
            # Negative extreme: All indicators deep red
            elif bsi < -5.0 and ssi < -7.0 and rsi < -8.0:
                return "NEGATIVE_EXTREME"
            
            # Negative medium: Significant weakness across board
            elif bsi < -3.0 and ssi < -5.0 and rsi < -6.0:
                return "NEGATIVE_MEDIUM"
        
        return "UNCLEAR_PATTERN"
    
    def analyze_date(self, target_date):
        """Complete analysis for a given date"""
        print(f"🔍 Analyzing Vietnamese Market for {target_date}")
        print("=" * 60)
        
        # Load all ticker data
        all_data = {}
        for ticker in self.all_tickers:
            data = self.load_ticker_data(ticker)
            if not data.empty:
                change = self.get_price_change(data, target_date)
                if change:
                    all_data[ticker] = change
        
        # Check if we have VNINDEX data
        if 'VNINDEX' not in all_data:
            print("❌ ERROR: VNINDEX data not found for this date")
            return
        
        vnindex_data = all_data['VNINDEX']
        vnindex_drop = vnindex_data['change']
        
        print(f"📊 VNINDEX: {vnindex_data['prev_close']:.2f} → {vnindex_data['target_close']:.2f} ({vnindex_drop:+.2f}%)")
        print(f"📉 Intraday Low: {vnindex_data['target_low']:.2f} ({vnindex_data['intraday_drop']:+.2f}%)")
        print(f"📈 Volume: {vnindex_data['volume']:,}")
        
        if abs(vnindex_drop) >= 3.0:
            print(f"🚨 PANIC DAY DETECTED: {vnindex_drop:.2f}% drop!")
        else:
            print(f"✅ Normal trading day: {vnindex_drop:.2f}% change")
        
        print("\n" + "=" * 60)
        print("📈 SECTOR ANALYSIS")
        print("=" * 60)
        
        # Banking Sector Analysis
        print("\n🏦 BANKING SECTOR:")
        banking_changes = {k: all_data.get(k) for k in self.banking_weights.keys()}
        bsi, banking_valid = self.calculate_sector_indicator(banking_changes, self.banking_weights)
        
        for ticker in self.banking_weights.keys():
            weight = self.banking_weights[ticker]
            if ticker in all_data:
                change = all_data[ticker]['change']
                contribution = change * weight
                print(f"  {ticker}: {change:+.2f}% (weight: {weight:.2f}, contrib: {contribution:+.3f}%)")
            else:
                print(f"  {ticker}: NO DATA (weight: {weight:.2f})")
        
        if bsi is not None:
            print(f"  🎯 Banking Indicator: {bsi:+.2f}%")
        else:
            print(f"  ❌ Banking Indicator: Cannot calculate (insufficient data)")
        
        # Securities Sector Analysis
        print("\n📊 SECURITIES SECTOR:")
        securities_changes = {k: all_data.get(k) for k in self.securities_weights.keys()}
        ssi, securities_valid = self.calculate_sector_indicator(securities_changes, self.securities_weights)
        
        for ticker in self.securities_weights.keys():
            weight = self.securities_weights[ticker]
            if ticker in all_data:
                change = all_data[ticker]['change']
                contribution = change * weight
                print(f"  {ticker}: {change:+.2f}% (weight: {weight:.2f}, contrib: {contribution:+.3f}%)")
            else:
                print(f"  {ticker}: NO DATA (weight: {weight:.2f})")
        
        if ssi is not None:
            print(f"  🎯 Securities Indicator: {ssi:+.2f}%")
        else:
            print(f"  ❌ Securities Indicator: Cannot calculate (insufficient data)")
        
        # Real Estate Sector Analysis
        print("\n🏠 REAL ESTATE SECTOR:")
        realestate_changes = {k: all_data.get(k) for k in self.realestate_weights.keys()}
        rsi, realestate_valid = self.calculate_sector_indicator(realestate_changes, self.realestate_weights)
        
        for ticker in self.realestate_weights.keys():
            weight = self.realestate_weights[ticker]
            if ticker in all_data:
                change = all_data[ticker]['change']
                contribution = change * weight
                print(f"  {ticker}: {change:+.2f}% (weight: {weight:.2f}, contrib: {contribution:+.3f}%)")
            else:
                print(f"  {ticker}: NO DATA (weight: {weight:.2f})")
        
        if rsi is not None:
            print(f"  🎯 Real Estate Indicator: {rsi:+.2f}%")
        else:
            print(f"  ❌ Real Estate Indicator: Cannot calculate (insufficient data)")
        
        # Panic Classification
        print("\n" + "=" * 60)
        print("🎯 PANIC CLASSIFICATION")
        print("=" * 60)
        
        panic_type = self.classify_panic_type(bsi, ssi, rsi, vnindex_drop)
        
        print(f"\n📊 SECTOR INDICATORS SUMMARY:")
        if bsi is not None:
            print(f"  Banking Indicator: {bsi:+.2f}% (based on {len(banking_valid)} tickers)")
        if ssi is not None:
            print(f"  Securities Indicator: {ssi:+.2f}% (based on {len(securities_valid)} tickers)")
        if rsi is not None:
            print(f"  Real Estate Indicator: {rsi:+.2f}% (based on {len(realestate_valid)} tickers)")
        
        print(f"\n🎯 PANIC TYPE: {panic_type}")
        
        # Trading Recommendations
        trading_signals = {
            "POSITIVE_PANIC": {
                "signal": "🟢 BUY OPPORTUNITY",
                "action": "Buy quality dips: VIC, SHS, TCB",
                "avoid": "Avoid: NVL, MBS (high volatility)",
                "watch": "Watch: VCB for stability confirmation"
            },
            "NEGATIVE_EXTREME": {
                "signal": "🔴 EXTREME CAUTION", 
                "action": "VCB ONLY + Maximum cash preservation",
                "avoid": "Avoid: All other positions",
                "watch": "Watch: Government intervention signals"
            },
            "NEGATIVE_MEDIUM": {
                "signal": "🟡 DEFENSIVE MODE",
                "action": "Hold cash + VCB defensive positions",
                "avoid": "Avoid: Securities and Real Estate",
                "watch": "Watch: Banking stabilization signals"
            },
            "NO_PANIC": {
                "signal": "✅ NORMAL TRADING",
                "action": "Normal sector rotation strategies",
                "avoid": "No specific avoidance",
                "watch": "Monitor for sector leadership changes"
            }
        }
        
        if panic_type in trading_signals:
            signal_data = trading_signals[panic_type]
            print(f"\n{signal_data['signal']}")
            print(f"  Action: {signal_data['action']}")
            print(f"  Avoid: {signal_data['avoid']}")
            print(f"  Watch: {signal_data['watch']}")
        
        print("\n" + "=" * 60)
        print("📋 WORKBOOK UPDATE DATA")
        print("=" * 60)
        print(f"""
**Sector Performance (VERIFIED DATA):**
- **VNINDEX:** {vnindex_data['prev_close']:.2f} → {vnindex_data['target_close']:.2f} ({vnindex_drop:+.2f}%)
- **Intraday Low:** {vnindex_data['target_low']:.2f} ({vnindex_data['intraday_drop']:+.2f}%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** {bsi:+.2f}% ({len(banking_valid)}/5 tickers)
- **Securities Indicator:** {ssi:+.2f}% ({len(securities_valid)}/5 tickers)  
- **Real Estate Indicator:** {rsi:+.2f}% ({len(realestate_valid)}/5 tickers)

**Panic Classification:** {panic_type}

**Individual Stock Performance:**
Banking: {', '.join([f"{t} {all_data[t]['change']:+.1f}%" for t in banking_valid])}
Securities: {', '.join([f"{t} {all_data[t]['change']:+.1f}%" for t in securities_valid])}
Real Estate: {', '.join([f"{t} {all_data[t]['change']:+.1f}%" for t in realestate_valid])}
""")
    
    def get_date_data(self, target_date):
        """Get market data for a single date without printing"""
        all_data = {}
        for ticker in self.all_tickers:
            data = self.load_ticker_data(ticker)
            if not data.empty:
                change = self.get_price_change(data, target_date)
                if change:
                    all_data[ticker] = change
        
        if 'VNINDEX' not in all_data:
            return None
            
        vnindex_data = all_data['VNINDEX']
        vnindex_drop = vnindex_data['change']
        
        # Calculate sector indicators
        banking_changes = {k: all_data.get(k) for k in self.banking_weights.keys()}
        bsi, banking_valid = self.calculate_sector_indicator(banking_changes, self.banking_weights)
        
        securities_changes = {k: all_data.get(k) for k in self.securities_weights.keys()}
        ssi, securities_valid = self.calculate_sector_indicator(securities_changes, self.securities_weights)
        
        realestate_changes = {k: all_data.get(k) for k in self.realestate_weights.keys()}
        rsi, realestate_valid = self.calculate_sector_indicator(realestate_changes, self.realestate_weights)
        
        panic_type = self.classify_panic_type(bsi, ssi, rsi, vnindex_drop)
        
        return {
            'date': target_date,
            'vnindex_change': vnindex_drop,
            'vnindex_data': vnindex_data,
            'bsi': bsi,
            'ssi': ssi,
            'rsi': rsi,
            'panic_type': panic_type,
            'all_data': all_data,
            'banking_valid': banking_valid,
            'securities_valid': securities_valid,
            'realestate_valid': realestate_valid
        }
    
    def analyze_date_range(self, start_date, end_date):
        """Analyze a range of dates and identify market patterns"""
        print(f"🔍 Analyzing Vietnamese Market from {start_date} to {end_date}")
        print("=" * 80)
        
        current_date = pd.to_datetime(start_date)
        end_date = pd.to_datetime(end_date)
        
        results = []
        panic_days = []
        banking_stabilization_days = []
        securities_recovery_days = []
        
        # Analyze each date
        while current_date <= end_date:
            date_str = current_date.strftime('%Y-%m-%d')
            data = self.get_date_data(date_str)
            
            if data:
                results.append(data)
                
                # Identify panic days
                if abs(data['vnindex_change']) >= 3.0:
                    panic_days.append(data)
                    print(f"🚨 PANIC DAY: {date_str} ({data['vnindex_change']:+.2f}%)")
                
                # Identify banking stabilization (BSI positive after recent panic)
                elif data['bsi'] is not None and data['bsi'] > 1.0:
                    # Check if there was a panic in the last 5 days
                    recent_panic = any(
                        abs(r['vnindex_change']) >= 3.0 
                        for r in results[-5:] 
                        if r['date'] != date_str
                    )
                    if recent_panic:
                        banking_stabilization_days.append(data)
                        print(f"🏦 BANKING STABILIZATION: {date_str} (BSI: {data['bsi']:+.2f}%)")
                
                # Identify securities recovery (SSI outperforming after banking stabilization)
                elif data['ssi'] is not None and data['vnindex_change'] > 0 and data['ssi'] > data['vnindex_change'] + 1.0:
                    # Check if there was banking stabilization in the last 3 days
                    recent_banking_stab = any(
                        r['bsi'] is not None and r['bsi'] > 1.0 
                        for r in results[-3:] 
                        if r['date'] != date_str
                    )
                    if recent_banking_stab:
                        securities_recovery_days.append(data)
                        print(f"📈 SECURITIES RECOVERY: {date_str} (SSI: {data['ssi']:+.2f}% vs VNINDEX: {data['vnindex_change']:+.2f}%)")
            
            current_date += timedelta(days=1)
        
        print("\n" + "=" * 80)
        print("📊 CYCLE ANALYSIS SUMMARY")
        print("=" * 80)
        print(f"📅 Period: {start_date} to {end_date}")
        print(f"🚨 Panic Days Found: {len(panic_days)}")
        print(f"🏦 Banking Stabilization Days: {len(banking_stabilization_days)}")
        print(f"📈 Securities Recovery Days: {len(securities_recovery_days)}")
        
        return {
            'panic_days': panic_days,
            'banking_stabilization': banking_stabilization_days,
            'securities_recovery': securities_recovery_days,
            'all_results': results
        }
    
    def analyze_complete_cycle(self, start_date, end_date):
        """Identify complete panic-to-recovery cycles"""
        print(f"🔄 COMPLETE CYCLE ANALYSIS: {start_date} to {end_date}")
        print("=" * 80)
        
        cycle_data = self.analyze_date_range(start_date, end_date)
        
        # Find complete cycles
        cycles = []
        for panic in cycle_data['panic_days']:
            panic_date = pd.to_datetime(panic['date'])
            
            # Look for banking stabilization within 5 days
            banking_stab = None
            for stab in cycle_data['banking_stabilization']:
                stab_date = pd.to_datetime(stab['date'])
                if panic_date < stab_date <= panic_date + timedelta(days=5):
                    banking_stab = stab
                    break
            
            if banking_stab:
                stab_date = pd.to_datetime(banking_stab['date'])
                
                # Look for securities recovery within 3 days of banking stabilization
                securities_recovery = []
                for recovery in cycle_data['securities_recovery']:
                    recovery_date = pd.to_datetime(recovery['date'])
                    if stab_date < recovery_date <= stab_date + timedelta(days=3):
                        securities_recovery.append(recovery)
                
                if securities_recovery:
                    cycles.append({
                        'panic': panic,
                        'banking_stabilization': banking_stab,
                        'securities_recovery': securities_recovery
                    })
                    
                    print(f"\n🔄 COMPLETE CYCLE FOUND:")
                    print(f"   🚨 Panic: {panic['date']} ({panic['vnindex_change']:+.2f}%)")
                    print(f"   🏦 Banking Stabilization: {banking_stab['date']} (BSI: {banking_stab['bsi']:+.2f}%)")
                    print(f"   📈 Securities Recovery: {len(securities_recovery)} days")
                    for recovery in securities_recovery:
                        print(f"      📈 {recovery['date']} (SSI: {recovery['ssi']:+.2f}%)")
        
        print(f"\n🎯 FOUND {len(cycles)} COMPLETE CYCLES")
        return cycles

def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Single date: python panic_analyzer.py YYYY-MM-DD")
        print("  Date range:  python panic_analyzer.py YYYY-MM-DD YYYY-MM-DD")
        print("  Cycle analysis: python panic_analyzer.py --cycle YYYY-MM-DD YYYY-MM-DD")
        print("")
        print("Examples:")
        print("  python panic_analyzer.py 2018-02-05")
        print("  python panic_analyzer.py 2018-02-01 2018-02-15")
        print("  python panic_analyzer.py --cycle 2022-05-10 2022-05-25")
        sys.exit(1)
    
    analyzer = VietnamesePanicAnalyzer()
    
    # Check for cycle analysis
    if sys.argv[1] == "--cycle":
        if len(sys.argv) != 4:
            print("❌ Error: Cycle analysis requires start and end dates")
            sys.exit(1)
        
        start_date = sys.argv[2]
        end_date = sys.argv[3]
        
        # Validate date formats
        try:
            datetime.strptime(start_date, '%Y-%m-%d')
            datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            print("❌ Error: Dates must be in YYYY-MM-DD format")
            sys.exit(1)
        
        analyzer.analyze_complete_cycle(start_date, end_date)
    
    # Check for date range analysis
    elif len(sys.argv) == 3:
        start_date = sys.argv[1]
        end_date = sys.argv[2]
        
        # Validate date formats
        try:
            datetime.strptime(start_date, '%Y-%m-%d')
            datetime.strptime(end_date, '%Y-%m-%d')
        except ValueError:
            print("❌ Error: Dates must be in YYYY-MM-DD format")
            sys.exit(1)
        
        analyzer.analyze_date_range(start_date, end_date)
    
    # Single date analysis
    elif len(sys.argv) == 2:
        target_date = sys.argv[1]
        
        # Validate date format
        try:
            datetime.strptime(target_date, '%Y-%m-%d')
        except ValueError:
            print("❌ Error: Date must be in YYYY-MM-DD format")
            sys.exit(1)
        
        analyzer.analyze_date(target_date)
    
    else:
        print("❌ Error: Invalid arguments")
        sys.exit(1)

if __name__ == "__main__":
    main()