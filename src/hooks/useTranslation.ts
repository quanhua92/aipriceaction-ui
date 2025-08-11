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

  return {
    t,
    tWithFallback,
    language,
  };
}