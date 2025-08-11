import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'vn';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('vn');
  const [isLoading, setIsLoading] = useState(true);

  // Detect language from multiple sources with priority
  const detectLanguage = (): Language => {
    // 1. Check URL searchParams first (highest priority - for tests)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang');
      if (urlLang === 'en' || urlLang === 'vn') {
        return urlLang as Language;
      }
    }

    // 2. Check localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('aipriceaction-language');
        if (stored === 'en' || stored === 'vn') {
          return stored as Language;
        }
      } catch (error) {
        // localStorage not available
        console.warn('localStorage not available:', error);
      }
    }

    // 3. Default to Vietnamese
    return 'vn';
  };

  // Initialize language on mount
  useEffect(() => {
    const initialLanguage = detectLanguage();
    setLanguageState(initialLanguage);
    setIsLoading(false);
  }, []);

  // Listen for URL changes to support test parameter changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      const newLanguage = detectLanguage();
      if (newLanguage !== language) {
        setLanguageState(newLanguage);
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    // Don't override if URL parameter is present (tests)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('lang')) {
        console.warn('Language change blocked: URL parameter override active');
        return;
      }
    }

    setLanguageState(newLanguage);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aipriceaction-language', newLanguage);
      } catch (error) {
        console.warn('Failed to save language preference:', error);
      }
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}