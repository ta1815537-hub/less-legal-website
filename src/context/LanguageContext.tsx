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
      if (saved === 'hi' || saved === 'en') {
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

      // Guard body styles against Google Translate unwanted top offset/height inflation
      const cleanGoogleTranslateArtifacts = () => {
        if (document.body.style.top && document.body.style.top !== '0px') {
          document.body.style.top = '0px';
        }
        if (document.body.style.position && document.body.style.position !== 'static') {
          document.body.style.position = 'static';
        }
        const skipElements = document.querySelectorAll('.skiptranslate, iframe[name="google_translate_element"], .VIpgJd-ZVi9od-ORHb-OEVmcd');
        skipElements.forEach((el) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl && htmlEl.style.display !== 'none') {
            htmlEl.style.display = 'none';
            htmlEl.style.visibility = 'hidden';
            htmlEl.style.height = '0px';
            htmlEl.style.width = '0px';
            htmlEl.style.position = 'absolute';
            htmlEl.style.top = '-99999px';
          }
        });
      };

      const observer = new MutationObserver(cleanGoogleTranslateArtifacts);
      observer.observe(document.body, { attributes: true, childList: true, subtree: false });

      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script');
        script.id = 'google-translate-script';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }

      return () => {
        observer.disconnect();
      };
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
      <div 
        id="google_translate_element" 
        style={{ display: 'none', position: 'absolute', top: '-99999px', left: '-99999px', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }} 
      />
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
