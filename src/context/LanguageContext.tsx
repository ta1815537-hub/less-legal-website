import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: {
    common: {
      home: string;
      articles: string;
      tools: string;
      founder: string;
      about: string;
      contact: string;
      backToHome: string;
      loading: string;
    };
  };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language');
    return saved === 'en' ? 'en' : 'hi';
  });

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'hi' ? 'en' : 'hi'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = {
    common: {
      home: language === 'hi' ? 'होम' : 'Home',
      articles: language === 'hi' ? 'लेख' : 'Articles',
      tools: language === 'hi' ? 'टूल्स' : 'Tools',
      founder: language === 'hi' ? 'संस्थापक' : 'Founder',
      about: language === 'hi' ? 'परिचय' : 'About',
      contact: language === 'hi' ? 'संपर्क' : 'Contact',
      backToHome: language === 'hi' ? 'होम पर वापस जाएं' : 'Back to Home',
      loading: language === 'hi' ? 'लोड हो रहा है...' : 'Loading...',
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
