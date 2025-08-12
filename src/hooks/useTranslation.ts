import { useLanguage } from '@/contexts/LanguageContext';
import { translations, type TranslationData } from '@/translations';

// Helper type for nested object access
type DeepValue<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer K1}.${infer K2}`
  ? K1 extends keyof T
    ? T[K1] extends object
      ? DeepValue<T[K1], K2>
      : never
    : never
  : never;

// Helper function to get nested value from object using dot notation
function getNestedValue<T extends Record<string, any>>(
  obj: T,
  path: string
): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Template string interpolation
function interpolate(template: string, params: Record<string, any> = {}): string {
  return template.replace(/\{([^}]+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
}

export function useTranslation() {
  const { language } = useLanguage();

  const t = <TKey extends string>(
    key: TKey,
    params?: Record<string, any>
  ): DeepValue<TranslationData, TKey> => {
    const currentTranslations = translations[language];
    const fallbackTranslations = translations.en; // Always fallback to English
    
    // Try to get value from current language
    let value = getNestedValue(currentTranslations, key);
    
    // Fallback to English if not found
    if (value === undefined) {
      value = getNestedValue(fallbackTranslations, key);
      
      // If still not found, return the key itself
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key as DeepValue<TranslationData, TKey>;
      }
    }
    
    // Handle string interpolation if params provided
    if (typeof value === 'string' && params) {
      value = interpolate(value, params);
    }
    
    return value as DeepValue<TranslationData, TKey>;
  };

  // Helper for getting translations with fallback
  const tWithFallback = (key: string, fallback?: string, params?: Record<string, any>): string => {
    try {
      const result = t(key, params);
      return typeof result === 'string' ? result : fallback || key;
    } catch {
      return fallback || key;
    }
  };

  // Helper to translate hardcoded trading advice from panic analyzer
  const translateTradingAdvice = (englishText: string): string => {
    // Map hardcoded English strings to translation keys
    const tradingAdviceMap: Record<string, string> = {
      'REDUCE positions immediately, increase cash to 70%+': 'panic.reducePositionsImmediately',
      'Reduce portfolio by 40%, prepare defensive positions': 'panic.reducePortfolioBy40',
      'Reduce riskiest positions, raise cash to 30%': 'panic.reduceRiskiestPositions',
      'Monitor closely, prepare for defensive rotation': 'panic.monitorCloselyPrepareDefensive',
      'Normal trading strategies': 'panic.normalTradingStrategies',
      
      // Risk levels
      'EXTREME': 'panic.riskLevelExtreme',
      'HIGH - Monitor daily for escalation': 'panic.riskLevelHigh',
      'MEDIUM - Watch for pattern development': 'panic.riskLevelMedium',
      'LOW-MEDIUM - Early stage warning': 'panic.riskLevelLowMedium',
      'LOW - No immediate panic signals': 'panic.riskLevelLow',
      'UNKNOWN - Insufficient data for analysis': 'panic.riskLevelUnknown',
      
      // Position sizes
      'Maximum 30% equity exposure': 'panic.maximumEquityExposure',
      'Maximum 60% equity exposure': 'panic.maximum60EquityExposure',
      'Maximum 70% equity exposure': 'panic.maximum70EquityExposure',
      'Normal allocation with caution': 'panic.normalAllocationWithCaution',
      'Normal allocation': 'panic.normalAllocation',
      'Conservative allocation recommended': 'panic.conservativeAllocation',
      
      // Defensive stocks
      'VCB only, exit all others': 'panic.vcbOnlyExitOthers',
      'VCB, VIC core holdings only': 'panic.vcbVicCoreHoldings',
      'Emphasize VCB, VIC, TCB quality': 'panic.emphasizeVcbVicTcb',
      'Quality focus: Banking/VIC blend': 'panic.qualityFocusBankingVic',
      'Standard diversification': 'panic.standardDiversification',
      'Maintain defensive baseline': 'panic.maintainDefensiveBaseline',
    };

    const translationKey = tradingAdviceMap[englishText];
    if (translationKey) {
      return t(translationKey);
    }
    
    // If no translation found, return the original text
    return englishText;
  };

  return {
    t,
    tWithFallback,
    translateTradingAdvice,
    language,
  };
}