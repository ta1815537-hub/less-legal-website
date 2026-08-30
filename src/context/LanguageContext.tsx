import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationSchema, translations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app_language';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return 'hi';
  });

  const triggerGoogleTranslate = (lang: Language) => {
    try {
      const langCode = lang === 'hi' ? '/en/hi' : '/en/en';
      const hostname = window.location.hostname;
      
      // Set googtrans cookie for domain and path
      document.cookie = `googtrans=${langCode}; path=/;`;
      if (hostname) {
        document.cookie = `googtrans=${langCode}; path=/; domain=${hostname};`;
      }
      
      // Try to trigger select element directly if present
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.value = lang === 'hi' ? 'hi' : 'en';
        selectEl.dispatchEvent(new Event('change'));
      }
    } catch (e) {
      console.warn('Google Translate sync issue:', e);
    }
  };

  const setLanguage = (lang: Language) => {
    if (lang !== language) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        document.documentElement.lang = lang;
        triggerGoogleTranslate(lang);
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  useEffect(() => {
    document.documentElement.lang = language;
    
    // Set initial cookie based on language state so Google Translate initializes correctly
    if (typeof window !== 'undefined') {
      const langCode = language === 'hi' ? '/en/hi' : '/en/en';
      document.cookie = `googtrans=${langCode}; path=/;`;
      if (window.location.hostname) {
        document.cookie = `googtrans=${langCode}; path=/; domain=${window.location.hostname};`;
      }
    }
    
    // Inject Google Translate script if not present
    if (typeof window !== 'undefined') {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate && window.google.translate.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: true
            },
            'google_translate_element'
          );
          if (language === 'hi') {
            setTimeout(() => triggerGoogleTranslate('hi'), 300);
          }
        }
      };

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      triggerGoogleTranslate(language);
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <div id="google_translate_element" className="hidden opacity-0 pointer-events-none fixed bottom-0 right-0 w-0 h-0 overflow-hidden" />
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
