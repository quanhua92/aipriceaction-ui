/**
 * Comprehensive Panic Analysis Context Database
 * 
 * Raw, detailed analysis for each verified panic day extracted from PANIC_ANALYSIS_WORKBOOK.md
 * Includes PRE-PANIC, PANIC, and POST-PANIC analysis for complete market cycle understanding
 */

export interface PanicContextData {
	date: string;
	prePanicAnalysis: string;
	panicAnalysis: string;
	postPanicAnalysis: string;
}

export const PANIC_CONTEXT_DATABASE: Record<string, PanicContextData> = {
	// 2018 Panic Days
	'2018-02-05': {
		date: '2018-02-05',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (HISTORICAL WEAKNESS DETECTED):**
- **14-Day Scan:** Found **1 significant drop ≥2%** in pre-panic period
  - T-4 (2018-01-17): -2.66% → Banking -4.61%, Securities -3.57%, EARLY_WARNING
- **T-14 (2018-01-12):** VNINDEX +0.19% → Mixed signals → **NO_WARNING**
- **T-7 (2018-01-25):** VNINDEX +1.58% → Strong recovery → **NO_WARNING**  
- **T-1 (2018-02-02):** VNINDEX +0.49% → Positive momentum → **NO_WARNING**

**Pre-Panic Classification:** **HISTORICAL_WEAKNESS_DETECTED** - T-4 drop showed early stress signal
**Trading Implication:** Reduce riskiest positions, raise cash to 30% - One pre-warning signal detected`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Global market correction fears, early year volatility

**Sector Performance (VERIFIED DATA - 15 TICKERS ANALYZED):**
- **VNINDEX:** 1105.04 → 1048.71 (-5.10%)
- **Intraday Low:** 1048.71 (-5.10%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -6.85% (4/5 tickers)
- **Securities Indicator:** -7.22% (5/5 tickers)  
- **Real Estate Indicator:** -6.30% (4/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -7.0%, BID -7.0%, CTG -7.0%, VPB -4.9% → Uniform crash pattern
- **Securities:** SSI -7.0%, VCI -6.0%, HCM -5.9%, MBS -9.7%, SHS -9.0% → Standard crash pattern  
- **Real Estate:** VIC -7.0%, VRE -6.9%, KDH -5.3%, NVL +0.1% → Uniform weakness (NVL anomaly)

**Panic Classification:** NEGATIVE_MEDIUM
- Banking Indicator < -5% (Banking struggling)
- Securities Indicator < -7% (Securities deep crash)  
- Real Estate Indicator < -6% (Real estate widespread selling)

**Stabilization Analysis:**
- **No Banking Leadership:** Banking Indicator -6.85% shows banking crashed with market
- **No Sector Differentiation:** All three indicators negative (uniform selling)
- **Extended Crisis Signal:** Multiple sectors deeply negative = defensive strategy only

**Trading Lesson:**
- Early 2018 confirmed uniform sector crashes across all indicators
- No stabilization leadership yet developed
- All indicators negative = NEGATIVE_MEDIUM panic requiring defensive positioning`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS - EXTENDED CRISIS PATTERN:**

**Day +1 (2018-02-06): CONTINUATION PANIC (-3.54%)**
- **VNINDEX:** 1048.71 → 1011.60 (-3.54%) → **Extended crisis confirmed**
- **Banking Indicator:** -4.12% → Still struggling but VCB showed early defense (-1.12%)
- **Securities Indicator:** -4.77% → Continued weakness across sector  
- **Real Estate Indicator:** -1.39% → **VIC held flat (±0.0%) - First defensive sign!**

**Key Recovery Insights:**
- Banking showed FIRST signs of stabilization with VCB defensive performance
- Securities maintained heavy selling pressure
- Real Estate began defensive positioning with VIC holding
- Classic extended crisis requiring 2+ days for full stabilization
- **Stabilization Pattern:** Banking led recovery as predicted by theory`
	},

	'2018-02-06': {
		date: '2018-02-06',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (PERFECT PREDICTION):**
- **T-14 (2018-01-15):** VNINDEX +1.27% → Banking +2.04%, Securities +2.53%, Real Estate +1.59% → **NO_WARNING**
- **T-7 (2018-01-26):** VNINDEX +1.00% → Banking +3.41%, Securities +1.02%, Real Estate +0.04% → **NO_WARNING**
- **T-1 (2018-02-05):** VNINDEX -5.10% → Banking -6.85%, Securities -7.22%, Real Estate -6.30% → **STRONG_WARNING**

**Pre-Panic Classification:** **ESCALATING_TO_CRISIS** - T-1 panic day triggered follow-through panic
**Trading Implication:** REDUCE positions immediately, increase cash to 70%+ - Perfect follow-through prediction`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Continuation of global correction, margin call cascade

**Sector Performance (VERIFIED DATA - 14 TICKERS ANALYZED):**
- **VNINDEX:** 1048.71 → 1011.60 (-3.54%)
- **Intraday Low:** 983.06 (-6.26%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -4.12% (4/5 tickers)
- **Securities Indicator:** -4.77% (5/5 tickers)  
- **Real Estate Indicator:** -1.39% (4/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -1.1%, BID -6.9%, CTG -6.5%, VPB -4.1% → VCB showing early defensive pattern
- **Securities:** SSI -4.5%, VCI -6.8%, HCM -5.4%, MBS -4.3%, SHS -1.8% → Standard crash pattern  
- **Real Estate:** VIC ±0.0%, VRE -6.9%, KDH -4.6%, NVL +0.3% → VIC incredible stability during panic

**Panic Classification:** UNCLEAR_PATTERN
- Banking Indicator moderate weakness (-4.12%)
- Securities Indicator standard crash (-4.77%)  
- Real Estate Indicator surprisingly resilient (-1.39%)

**Stabilization Analysis:**
- **VCB Defensive Excellence:** -1.1% vs market -3.54% = 71% defensive outperformance
- **VIC Defensive Leadership:** ±0.0% during market panic = ultimate defensive behavior
- **Extended Crisis Signal:** Second consecutive panic day, but defensive leadership emerging

**Trading Lesson:**
- Early 2018 showed emergence of VCB/VIC defensive leadership patterns
- Even in extended crisis, quality Vietnamese stocks showed defensive characteristics
- Real Estate Indicator -1.39% vs Banking Indicator -4.12% shows real estate defensive superiority in early cycles

**Historical Significance:** First clear evidence of VCB-VIC defensive duo that would define Vietnamese market patterns.`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS:**

**Day +1 (2018-02-07): EXPLOSIVE RECOVERY (+2.86%)**  
- **VNINDEX:** 1011.60 → 1040.55 (+2.86%) → **Major recovery bounce**
- **Banking Indicator:** +4.67% → **BANKING STABILIZATION ACHIEVED**
  - BID +6.89% → Banking recovery leader
  - CTG +5.72% → Strong banking follow-through
  - VCB +2.43% → Defensive premium maintained
- **Securities Indicator:** +6.27% → **EXPLOSIVE SECURITIES RECOVERY**
  - MBS +9.64% → **Recovery champion**
  - HCM +7.0% → Securities broad strength
  - SSI +5.79%, SHS +5.49% → Sector-wide participation
- **Real Estate Indicator:** +1.03% → Moderate recovery, VIC still cautious (-0.13%)

**EXTENDED CRISIS RECOVERY PATTERN (2-Day Cycle):**
1. **Day 0:** Crisis continued, VCB/VIC showed early defensive signs
2. **Day +1:** Explosive recovery - Banking +4.67%, Securities +6.27%
3. **Historical Significance:** First recorded Vietnamese explosive recovery sequence

**Pattern Development Insight:** This was the **GENESIS** of Vietnamese recovery patterns - the first time we see the Banking → Securities → Real Estate recovery sequence develop, establishing the foundation for all future panic recovery analysis.`
	},

	'2018-02-09': {
		date: '2018-02-09',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (MULTIPLE WEAKNESS EVENTS):**
- **14-Day Scan:** Found **2 significant drops ≥2%** in pre-panic period
  - T-11 (2018-02-05): -5.10% → Major panic day, STRONG_WARNING
  - T-12 (2018-02-06): -3.54% → Follow-through panic, EARLY_WARNING
- **T-14 (2018-01-18):** VNINDEX +1.50% → All positive → **NO_WARNING**
- **T-7 (2018-01-31):** VNINDEX -0.02% → Securities weakness → **NO_WARNING**
- **T-1 (2018-02-08):** VNINDEX -1.66% → Real Estate -2.38% → **STRONG_WARNING**

**Pre-Panic Classification:** **MULTIPLE_WEAKNESS_EVENTS** - Double panic preceded third panic
**Trading Implication:** REDUCE positions immediately, increase cash to 70%+ - Extended crisis pattern confirmed`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Recovery day after Feb 5-6 double panic - SECURITIES TAKING LEADERSHIP

**Sector Performance (VERIFIED DATA - 13 TICKERS ANALYZED):**
- **VNINDEX:** 1023.25 → 1003.94 (-1.89%)
- **Intraday Low:** 973.78 (-4.83%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -1.24% (4/5 tickers)
- **Securities Indicator:** +1.59% (5/5 tickers)  
- **Real Estate Indicator:** -1.17% (4/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -3.2%, BID +0.3%, CTG ±0.0%, VPB +1.0% → Mixed banking signals
- **Securities:** SSI ±0.0%, VCI ±0.0%, HCM +5.3%, MBS +4.7%, SHS +0.9% → Clear leadership from HCM/MBS  
- **Real Estate:** VIC -1.0%, VRE -2.5%, KDH -1.0%, NVL ±0.0% → Continued weakness

**Panic Classification:** NO_PANIC
- Market closed only -1.89% (normal trading day)
- **SECURITIES LEADERSHIP CONFIRMED:** Securities Indicator +1.59% while VNINDEX dropped -1.89%

**Pattern Recognition - BREAKTHROUGH DISCOVERY:**
- **Feb 7:** Banking stabilization (Banking Indicator +4.67%)
- **Feb 9:** Securities leadership (Securities Indicator +1.59% vs VNINDEX -1.89%)
- **Classic Vietnamese Pattern:** Banking stabilizes → Securities outperform

**Trading Lesson - MAJOR INSIGHT:**
- Early 2018 DID show emerging Vietnamese market patterns
- Securities leadership developed just 4 days after initial panic
- HCM +5.3%, MBS +4.7% show classic securities recovery pattern

**Historical Significance:** First documented Vietnamese market cycle completion in 2018 - Banking stabilization followed by Securities leadership. The patterns were developing earlier than previously recognized.`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS:**

**Pattern Continuation:** This was actually part of the recovery sequence from the Feb 5-6 double panic, demonstrating that Vietnamese market patterns can include multi-day complex recovery sequences where securities leadership emerges during what appears to be continued weakness.

**Key Recovery Pattern Established:**
1. **Day 0-1:** Double panic (Feb 5-6)
2. **Day +1:** Banking stabilization (Feb 7, +4.67%)
3. **Day +3:** Securities leadership emerges (Feb 9, +1.59% while market -1.89%)

**Historical Context:** This sequence proved that Vietnamese recovery patterns could be more complex than simple next-day bounces, with securities leadership developing over multiple days as part of the broader recovery cycle.

**Market Education:** Feb 9 taught that apparent "continued weakness" days could actually be strong positioning days where quality securities outperform significantly, establishing the foundation for recognizing securities leadership during complex recovery sequences.`
	},

	'2018-04-19': {
		date: '2018-04-19',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (EARLY WARNING DETECTED):**
- **T-14 (2018-03-30):** VNINDEX +0.64% → Banking -1.00%, Securities +0.74%, Real Estate +1.71% → **NO_WARNING**
- **T-7 (2018-04-10):** VNINDEX -0.52% → Banking +0.91%, Securities -1.79%, Real Estate -2.17% → **NO_WARNING**
- **T-1 (2018-04-18):** VNINDEX -1.28% → Banking -3.51%, Securities -0.92%, Real Estate -0.86% → **EARLY_WARNING**

**Pre-Panic Classification:** **ISOLATED_SIGNALS** - Banking weakness showed T-1 early warning
**Trading Implication:** Reduce riskiest positions, raise cash to 30% - Banking -3.51% triggered early warning`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Trade war concerns, earnings season disappointments

**Sector Performance (VERIFIED DATA - 13 TICKERS ANALYZED):**
- **VNINDEX:** 1138.53 → 1094.63 (-3.86%)
- **Intraday Low:** 1094.63 (-3.86%)

**Market Cap-Based Sector Indicators:**
- **BSI (Banking):** -5.66% (4/5 tickers)
- **SSI (Securities):** -2.29% (5/5 tickers)  
- **RSI (Real Estate):** -5.23% (4/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -5.9%, BID -5.5%, CTG -5.8%, VPB -4.7% → Uniform banking crash
- **Securities:** SSI -2.1%, VCI -2.1%, HCM -3.4%, MBS -0.5%, SHS -4.6% → Clear defensive pattern
- **Real Estate:** VIC -6.9%, VRE -2.5%, KDH -0.7%, NVL ±0.0% → VIC leading crash

**Panic Classification:** UNCLEAR_PATTERN
- Securities showing defensive characteristics
- Banking and real estate crashing

**Pattern Analysis - MAJOR CONFIRMATION:**
- **Securities Defensive Excellence:** SSI -2.29% vs VNINDEX -3.86% = **+1.57% outperformance**
- **Banking Weakness:** BSI -5.66% (crashed harder than market)
- **F0 Real Estate Crash:** VIC -6.93% leading the crash (F0 emotion pattern)

**Historical Significance:** First clear example of securities defensive leadership during panic - Vietnamese market patterns maturing by April 2018.`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS (2018-04-20, Day +1) - CLASSIC PATTERN:**

**Market Recovery Performance:**
- **VNINDEX:** 1094.63 → 1119.86 (+2.30%) → Strong recovery bounce

**Sector Indicator Recovery (BANKING-LED PATTERN):**
- **Banking Indicator:** +4.51% → **BANKING RECOVERY LEADERSHIP**
  - CTG +5.97% → Banking recovery champion
  - VCB +4.93% → VCB showing recovery strength
  - BID +3.81% → Strong banking participation
  - VPB +0.65% → Moderate banking follow-through
- **Securities Indicator:** +2.20% → **SECURITIES RECOVERY FOLLOW-THROUGH**  
  - SHS +4.80% → **Securities recovery leader emerging**
  - SSI +3.44% → Continuing defensive strength into recovery
  - HCM +2.48% → Solid securities participation
  - VCI -0.83% → Some securities lagging
- **Real Estate Indicator:** +1.52% → **REAL ESTATE MODERATE RECOVERY**
  - VIC +1.73% → Quality real estate recovering
  - VRE +2.56% → F0 cautious re-entry beginning

**CLASSIC 2018 RECOVERY SEQUENCE:**
1. **Banking led recovery** (+4.51% indicator, CTG +5.97%)
2. **Securities followed strongly** (+2.20%, SHS +4.80% emerging)
3. **Real estate participated moderately** (+1.52%, quality-focused)

**Pattern Evolution Insight:**
- **April 2018:** Securities defensive during panic (-2.29%) → Strong recovery (+2.20%)
- **SHS emergence:** +4.80% recovery showing SHS recovery leadership developing
- **VCB strength:** +4.93% confirms VCB defensive patterns in both panic and recovery

**Historical Significance:** This recovery confirmed the maturing Vietnamese pattern where securities defensive strength during panic translates to strong recovery leadership - the foundation of our modern recovery theory.`
	},

	'2018-05-22': {
		date: '2018-05-22',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (PERFECT ESCALATION PATTERN):**
- **T-14 (2018-05-02):** VNINDEX -2.02% → Banking -5.05%, Securities -3.11%, Real Estate -1.38% → **EARLY_WARNING**
- **T-7 (2018-05-11):** VNINDEX +1.55% → Banking +3.48%, Securities +0.74%, Real Estate +2.14% → **NO_WARNING**
- **T-1 (2018-05-21):** VNINDEX -2.46% → Banking -2.34%, Securities -2.03%, Real Estate -3.70% → **STRONG_WARNING**

**Pre-Panic Classification:** **ESCALATING_TO_CRISIS** - T-14 early warning, T-1 Real Estate -3.70% triggered STRONG_WARNING
**Trading Implication:** REDUCE positions immediately, increase cash to 70%+ - Real Estate weakness preceded panic`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** US-China trade tensions escalating, emerging market concerns

**Sector Performance (VERIFIED DATA - 14 TICKERS ANALYZED):**
- **VNINDEX:** 1014.98 → 985.91 (-2.86%)
- **Intraday Low:** 976.73 (-3.77%)

**Market Cap-Based Sector Indicators:**
- **BSI (Banking):** -5.36% (4/5 tickers)
- **SSI (Securities):** -5.77% (5/5 tickers)  
- **RSI (Real Estate):** -1.44% (5/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -4.1%, BID -7.0%, CTG -5.9%, VPB -4.2% → Banking crashed
- **Securities:** SSI -6.1%, VCI -6.7%, HCM -6.0%, MBS -1.8%, SHS -8.1% → Securities crashed hardest
- **Real Estate:** VIC -7.0%, VHM +7.0%, VRE -3.6%, KDH -4.4%, NVL -3.1% → Mixed with VHM anomaly

**Panic Classification:** NO_PANIC (closed -2.86%)
- Intraday panic (-3.77%) but recovered by close

**Pattern Analysis - SURPRISING DISCOVERY:**
- **Real Estate Outperformance:** RSI -1.44% vs VNINDEX -2.86% = **+1.42% outperformance**
- **VHM Anomaly:** +6.98% massive gain (likely company-specific news)
- **Securities Worst:** SSI -5.77% (crashed hardest)

**Key Insight:** NOT uniform sector weakness as claimed. Real estate showed surprising resilience during trade war stress, suggesting domestic vs external shock differentiation.`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS:**

**Intraday Recovery Pattern:** This was a unique case where the market experienced intraday panic (-3.77%) but recovered by close (-2.86%), demonstrating the Vietnamese market's resilience during external trade war shocks.

**Real Estate Leadership Discovery:** First clear evidence that real estate could outperform significantly during external shocks, with the Real Estate Indicator showing +1.42% outperformance relative to the market.

**VHM Anomaly Insight:** The VHM +6.98% gain during a panic day highlighted how individual company fundamentals could override sector panic patterns, teaching the importance of stock-specific analysis even during market-wide stress.

**Pattern Development:** This day established that Vietnamese markets could differentiate between external (trade war) and internal shocks, with domestic real estate showing defensive characteristics against foreign pressure.`
	},

	'2018-05-28': {
		date: '2018-05-28',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (MULTIPLE WEAKNESS EVENTS):**
- **14-Day Scan:** Found **5 significant drops ≥2%** in pre-panic period
  - T-14 (2018-05-25): -2.23% → Banking -5.94%, EARLY_WARNING
  - T-11 (2018-05-22): -2.86% → All sectors weak, EARLY_WARNING  
  - T-10 (2018-05-21): -2.46% → Real Estate -3.70%, STRONG_WARNING
  - T-8 (2018-05-17): -2.27% → DEVELOPING_WEAKNESS
  - T-3 (2018-05-10): -2.66% → Most recent, EARLY_WARNING

**Pre-Panic Classification:** **MULTIPLE_WEAKNESS_EVENTS** - 5 drops showed sustained market stress
**Trading Implication:** REDUCE positions immediately, increase cash to 70%+ - Pattern showed clear escalation`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Foreign capital outflows during trade war - REAL ESTATE SAFE HAVEN EMERGES

**Sector Performance (VERIFIED DATA - 14 TICKERS ANALYZED):**
- **VNINDEX:** 963.90 → 931.75 (-3.34%)
- **Intraday Low:** 927.47 (-3.78%)

**Market Cap-Based Sector Indicators:**
- **BSI (Banking):** -6.64% (4/5 tickers)
- **SSI (Securities):** -7.59% (5/5 tickers)  
- **RSI (Real Estate):** +0.94% (5/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -6.4%, BID -6.8%, CTG -6.9%, VPB -6.9% → Uniform banking crash
- **Securities:** SSI -6.8%, VCI -7.0%, HCM -6.9%, MBS -10.0%, SHS -9.2% → Securities crashed hardest
- **Real Estate:** VIC +3.7%, VHM -0.4%, VRE -1.5%, KDH -7.0%, NVL -1.9% → VIC leading strength

**Panic Classification:** UNCLEAR_PATTERN
- Real estate positive during panic (unusual pattern)

**Pattern Analysis - BREAKTHROUGH DISCOVERY:**
- **VIC Defensive Masterclass:** +3.74% while VNINDEX dropped -3.34% = **+7.08% outperformance!**
- **Real Estate Safe Haven:** RSI +0.94% (only positive sector during panic)
- **Foreign Selling Impact:** Banking/securities crashed, domestic real estate protected

**Historical Significance:** First documented case of VIC as ultimate defensive stock during foreign selling pressure - establishing VIC's role as Vietnamese market safe haven.`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS (2018-05-29, Day +1) - EXPLOSIVE VALIDATION:**

**Market Recovery Performance:**
- **VNINDEX:** 931.75 → 952.18 (+2.19%) → Strong recovery bounce

**Sector Indicator Recovery (VIC DEFENSE CREATES EXPLOSIVE RECOVERY):**
- **Banking Indicator:** +6.89% → **EXPLOSIVE BANKING RECOVERY**
  - **ALL BANKS +6.8% to +7.0%** → Perfect uniform recovery strength
  - VCB +6.83%, BID +6.95%, CTG +6.95%, VPB +6.90% → Complete banking explosion
- **Securities Indicator:** +5.96% → **EXPLOSIVE SECURITIES RECOVERY**
  - **SHS +9.18%** → **Ultimate recovery champion**
  - MBS +8.40% → High-beta explosive bounce
  - SSI +6.89%, HCM +6.86% → Broad securities strength
  - VCI ±0.0% → Some consolidation but overall explosive
- **Real Estate Indicator:** +0.42% → **VIC CONSOLIDATING GAINS**
  - VIC -0.91% → Taking profits after +3.74% defensive masterclass
  - VHM -0.85% → Quality real estate consolidating
  - VRE +6.70%, KDH +4.98% → Other real estate catching up

**LEGENDARY RECOVERY SEQUENCE:**
1. **VIC +3.74% defense** during -3.34% panic created market confidence
2. **Banking exploded +6.89%** (uniform +6.8% to +7.0% gains)
3. **Securities exploded +5.96%** (SHS +9.18% recovery leadership)
4. **VIC consolidated** (-0.91%) while others caught up

**THE VIC EFFECT - BREAKTHROUGH DISCOVERY:**
- **VIC's defensive excellence** (+3.74% during panic) created **market confidence foundation**
- **Next day explosive recovery:** Banking +6.89%, Securities +5.96%
- **SHS +9.18% proves** securities recovery leadership activated by quality defense
- **Pattern Established:** Quality defensive stocks enable explosive sector-wide recovery

**Historical Significance:** This sequence proved that **VIC's defensive excellence creates market confidence** that enables explosive recovery across all sectors - the discovery of defensive leadership enabling recovery leadership, a cornerstone of Vietnamese market theory.`
	},

	'2018-10-11': {
		date: '2018-10-11',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (BLACK SWAN EVENT):**
- **14-Day Scan:** **No significant drops ≥2%** found in pre-panic period
- **T-14 (2018-09-21):** VNINDEX -0.18% → All sectors near flat → **NO_WARNING**
- **T-7 (2018-10-02):** VNINDEX +0.58% → All sectors positive → **NO_WARNING**  
- **T-1 (2018-10-10):** VNINDEX -0.22% → Minor weakness → **NO_WARNING**

**Pre-Panic Classification:** **ISOLATED_SIGNALS** - True external shock, no local warning signals
**Trading Implication:** Normal trading strategies - Global October crash could not be predicted by Vietnamese sector analysis`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Global October crash, systematic selling across all markets

**Sector Performance (VERIFIED DATA - 15 TICKERS ANALYZED):**
- **VNINDEX:** 993.96 → 945.89 (-4.84%)
- **Intraday Low:** 938.83 (-5.55%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -6.67% (5/5 tickers)
- **Securities Indicator:** -7.34% (5/5 tickers)  
- **Real Estate Indicator:** -4.19% (5/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -6.5%, BID -7.0%, TCB -6.3%, CTG -7.0%, VPB -7.0% → VCB showing relative strength
- **Securities:** SSI -6.9%, VCI -6.7%, HCM -6.9%, MBS -8.3%, SHS -9.3% → Standard crash pattern  
- **Real Estate:** VIC -3.7%, VHM -4.5%, VRE -6.5%, KDH -5.4%, NVL -0.3% → VIC defensive excellence

**Panic Classification:** UNCLEAR_PATTERN
- Banking Indicator -6.67% (banking struggling)
- Securities Indicator -7.34% (securities deep crash)  
- Real Estate Indicator -4.19% (moderate weakness)

**Stabilization Analysis:**
- **VIC Defensive Excellence:** -3.7% vs VNINDEX -4.84% = +1.14% outperformance
- **VCB Relative Strength:** -6.5% vs other banks -7.0% = showing leadership within banking
- **Real Estate Defensive:** Real Estate Indicator -4.19% vs Banking -6.67% = +2.48% outperformance

**Trading Lesson:**
- October 2018 confirmed VCB-VIC defensive duo pattern
- Real estate showed defensive characteristics (Real Estate Indicator -4.19%)
- Pattern suggests UNCLEAR_PATTERN requiring selective defensive positioning`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS:**

**Global Context Recovery:** Being part of the global October 2018 crash, the recovery pattern would have been influenced by global market sentiment and international capital flows rather than purely domestic Vietnamese patterns.

**VCB-VIC Pattern Confirmation:** The defensive performance of both VCB (-6.5% vs -7.0% other banks) and VIC (-3.7% vs -4.84% market) during a pure external shock confirmed that these quality names maintained defensive characteristics regardless of shock origin.

**Real Estate Sector Resilience:** The Real Estate Indicator's -4.19% performance vs Banking's -6.67% and Securities' -7.34% established real estate as the most defensive sector during global systematic selling, a pattern that would become crucial for future external shock analysis.

**Pattern Maturation:** October 2018 proved that the Vietnamese defensive patterns discovered earlier in the year (VCB banking strength, VIC real estate leadership) were robust enough to function during pure external shocks, validating the theoretical framework for all market conditions.`
	},

	// 2020 COVID Panic Days
	'2020-03-09': {
		date: '2020-03-09',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (BLACK SWAN EVENT):**
- **COVID-19 Context:** Oil price crash combined with pandemic fears, dual shock scenario
- **External Shock:** No local Vietnamese warning signals for this global systematic event
- **Trading Implication:** External shock events cannot be predicted by domestic sector analysis

**Pre-Panic Classification:** **EXTERNAL_SHOCK** - Dual crisis (oil + COVID) with no local warning patterns`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Oil price crash combined with pandemic fears, dual shock

**Sector Performance (VERIFIED DATA - 15 TICKERS ANALYZED):**
- **VNINDEX:** 891.44 → 835.49 (-6.28%)
- **Intraday Low:** 834.67 (-6.37%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -6.95% (5/5 tickers)
- **Securities Indicator:** -6.89% (5/5 tickers)  
- **Real Estate Indicator:** -6.62% (5/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -7.0%, BID -7.0%, TCB -6.8%, CTG -7.0%, VPB -6.9% → Uniform crash pattern
- **Securities:** SSI -6.8%, VCI -4.2%, HCM -6.8%, MBS -9.2%, SHS -9.3% → Standard crash pattern  
- **Real Estate:** VIC -6.9%, VHM -6.9%, VRE -6.8%, KDH -6.1%, NVL -1.9% → Mostly uniform crash

**Panic Classification:** NEGATIVE_MEDIUM
- Banking Indicator -6.95% (banking struggled)
- Securities Indicator -6.89% (securities deep crash)  
- Real Estate Indicator -6.62% (widespread selling)

**Stabilization Analysis:**
- **Uniform Sector Crash:** All three indicators around -6.8% (no defensive leaders)
- **VCI Relative Strength:** -4.2% vs Securities Indicator -6.89% = showing some resilience
- **NVL Anomaly:** -1.9% vs Real Estate Indicator -6.62% = unusual outperformance

**Trading Lesson:**
- NEGATIVE_MEDIUM panic = defensive positioning only
- Dual shocks (oil + COVID) created uniform selling pressure
- No clear defensive leaders emerged during this phase`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS:**

**COVID Crisis Pattern:** This panic marked the beginning of the COVID crisis period where traditional Vietnamese recovery patterns would be severely disrupted by the systematic nature of the global pandemic.

**Uniform Sector Crash Significance:** The uniform performance across all three sector indicators (-6.95%, -6.89%, -6.62%) demonstrated how external systematic shocks could override the normal Vietnamese defensive patterns discovered in 2018.

**Early COVID Learning:** This event established that during dual systematic shocks (oil + pandemic), even quality Vietnamese defensive stocks would struggle to maintain their normal outperformance patterns, requiring purely defensive cash-heavy strategies.

**Pattern Disruption Warning:** This panic foreshadowed that the COVID crisis would require different analytical approaches, as traditional sector leadership patterns would be less reliable during systematic global health and economic emergencies.`
	},

	'2020-03-12': {
		date: '2020-03-12',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (COVID ESCALATION):**
- **T-3 (2020-03-09):** VNINDEX -6.28% → All sectors crashed uniformly → **STRONG_WARNING**
- **COVID Context:** Global travel restrictions escalating, economic shutdown fears building
- **Crisis Continuation:** Pre-panic warning from recent major drop indicating crisis escalation

**Pre-Panic Classification:** **ESCALATING_CRISIS** - Following major panic just 3 days prior
**Trading Implication:** Maintain defensive positions, crisis continuation pattern active`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Global travel restrictions, economic shutdown fears

**Sector Performance (VERIFIED DATA - 15 TICKERS ANALYZED):**
- **VNINDEX:** 811.35 → 769.25 (-5.19%)
- **Intraday Low:** 762.12 (-6.07%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -6.81% (5/5 tickers)
- **Securities Indicator:** -6.36% (5/5 tickers)  
- **Real Estate Indicator:** -5.48% (5/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -6.9%, BID -7.0%, TCB -7.1%, CTG -6.0%, VPB -6.8% → Uniform crash pattern
- **Securities:** SSI -6.5%, VCI -6.9%, HCM -6.8%, MBS -5.4%, SHS -5.4% → Standard crash pattern  
- **Real Estate:** VIC -5.4%, VHM -5.9%, VRE -6.9%, KDH -5.9%, NVL -0.4% → VIC showing relative strength

**Panic Classification:** UNCLEAR_PATTERN
- Banking Indicator -6.81% (banking struggling)
- Securities Indicator -6.36% (securities struggling)  
- Real Estate Indicator -5.48% (moderate weakness)

**Stabilization Analysis:**
- **Real Estate Best Performance:** Real Estate Indicator -5.48% vs Banking -6.81%
- **VIC Relative Strength:** -5.4% vs VNINDEX -5.19% = slight underperformance but better than sector
- **NVL Anomaly:** -0.4% vs Real Estate Indicator -5.48% = unusual resilience

**Trading Lesson:**
- UNCLEAR_PATTERN suggests mixed defensive signals
- Real estate showing unexpected defensive characteristics during COVID crisis
- VIC maintaining relative strength but not outperforming market`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS (2020-03-13, Day +1) - EXTENDED CRISIS PATTERN:**

**Market Recovery Performance:**  
- **VNINDEX:** 769.25 → 761.78 (-0.97%) → **Continued weakness during COVID crisis**
- **Intraday Low:** 723.42 (-5.96%) → **Severe intraday selling before recovery to close**

**Sector Indicator Recovery (COVID CRISIS DISRUPTION):**
- **Banking Indicator:** -1.06% → **MIXED BANKING SIGNALS**
  - TCB +1.72% → Some banking recovery attempts
  - CTG +0.69% → Moderate banking strength  
  - VCB -0.96% → Quality defensive holding pattern
  - BID -4.63% → Continued banking weakness
- **Securities Indicator:** -1.60% → **SECURITIES STRUGGLING**
  - **MBS +4.46%** → Exceptional high-beta bounce (anomaly)
  - SHS ±0.0% → Recovery leadership absent  
  - SSI -1.80%, HCM -1.02% → Continued securities weakness
  - VCI -7.0% → Severe securities continued selling
- **Real Estate Indicator:** +0.23% → **VIC DEFENSIVE LEADERSHIP**
  - **VIC +0.76%** → Quality defensive behavior during crisis
  - VHM ±0.0%, VRE ±0.0% → F0 real estate holding pattern
  - NVL +0.37% → Some real estate stability

**EXTENDED CRISIS RECOVERY PATTERN:**
1. **No clear sector leadership** - Banking/Securities both weak
2. **VIC quality defense** (+0.76%) during continued market weakness  
3. **Recovery delayed** due to systematic COVID uncertainty
4. **MBS anomaly** (+4.46%) shows high-beta volatility in crisis conditions

**COVID Crisis Insight:**
- **Traditional recovery patterns disrupted** by systematic crisis
- **VIC emerged as quality safe haven** (+0.76% during -0.97% market decline)  
- **Securities recovery leadership absent** - SHS flat, traditional leaders struggling
- **Extended crisis requires different strategy** - quality defense over aggressive recovery plays

**Historical Significance:** This recovery attempt shows how **systematic crises disrupt traditional Vietnamese recovery patterns**, with only quality defensive stocks (VIC) providing stability while normal recovery leadership fails to emerge.`
	},

	'2020-03-23': {
		date: '2020-03-23',
		prePanicAnalysis: `**PRE-PANIC ANALYSIS (PERFECT CRISIS ESCALATION):**
- **14-Day Scan:** Found **5 significant drops ≥2%** in pre-panic period
  - T-14 (2020-03-20): -2.23% → Real Estate -6.48%, STRONG_WARNING
  - T-13 (2020-03-19): -2.91% → Banking -4.07%, EARLY_WARNING
  - T-8 (2020-03-12): -5.19% → All sectors crashed, STRONG_WARNING
  - T-7 (2020-03-11): -3.12% → Banking weakness, EARLY_WARNING
  - T-5 (2020-03-09): -6.28% → Most recent massive drop, STRONG_WARNING

**Pre-Panic Classification:** **MULTIPLE_WEAKNESS_EVENTS** - Perfect escalation to crisis peak
**Trading Implication:** REDUCE positions immediately, increase cash to 70%+ - Crisis peak perfectly predicted`,

		panicAnalysis: `**PANIC DAY ANALYSIS:**
**Context:** Peak pandemic panic, global market capitulation

**Sector Performance (VERIFIED DATA - 15 TICKERS ANALYZED):**
- **VNINDEX:** 709.73 → 666.59 (-6.08%)
- **Intraday Low:** 664.23 (-6.41%)

**Market Cap-Based Sector Indicators:**
- **Banking Indicator:** -6.92% (5/5 tickers)
- **Securities Indicator:** -6.43% (5/5 tickers)  
- **Real Estate Indicator:** -6.36% (5/5 tickers)

**Individual Stock Performance:**
- **Banking:** VCB -7.0%, BID -6.9%, TCB -6.9%, CTG -6.8%, VPB -6.8% → Uniform crash pattern
- **Securities:** SSI -6.8%, VCI -7.0%, HCM -6.8%, MBS -2.4%, SHS -9.2% → Standard crash pattern  
- **Real Estate:** VIC -6.9%, VHM -6.9%, VRE -6.9%, KDH -5.0%, NVL +1.9% → Mostly uniform crash

**Panic Classification:** NEGATIVE_MEDIUM
- Banking Indicator -6.92% (banking collapsed)
- Securities Indicator -6.43% (securities deep crash)  
- Real Estate Indicator -6.36% (widespread selling)

**Stabilization Analysis (Critical Pattern):**
- **Uniform Sector Collapse:** All three indicators around -6.4% to -6.9% (systematic liquidation)
- **MBS Relative Strength:** -2.4% vs Securities Indicator -6.43% = unusual resilience
- **NVL Anomaly:** +1.9% vs Real Estate Indicator -6.36% = extreme outlier performance

**Trading Lesson - BENCHMARK PANIC:**
- NEGATIVE_MEDIUM panic = defensive positioning only (cash + VCB)
- Uniform sector indicators = systematic institutional liquidation
- This became the template for identifying similar future panics

**Historical Significance:** This panic established the systematic sector indicator approach that would define future trading strategies.`,

		postPanicAnalysis: `**POST-PANIC RECOVERY ANALYSIS:**

**Peak COVID Panic Significance:** This represented the peak of COVID panic selling in Vietnamese markets, establishing a critical low point that would define the subsequent recovery patterns throughout the rest of 2020.

**Systematic Liquidation Pattern:** The uniform sector indicators (-6.92%, -6.43%, -6.36%) demonstrated peak institutional liquidation, confirming this as a major capitulation event suitable for eventual re-entry strategies.

**Anomaly Analysis Importance:** The NVL +1.9% performance during peak panic provided crucial evidence that even during systematic liquidation, individual stock fundamentals could create extraordinary outlier performance.

**Recovery Framework Establishment:** This panic became the benchmark for measuring the severity of future panic events, with its uniform sector collapse pattern serving as the template for identifying similarly extreme systematic selling events.

**Strategic Foundation:** The lessons learned from this peak panic - particularly the importance of cash positioning during NEGATIVE_MEDIUM classifications and the identification of systematic liquidation patterns - became fundamental to the crisis trading methodology.`
	},

	// Additional panic days will be added systematically
};