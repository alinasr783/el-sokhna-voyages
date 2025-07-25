import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, enText: string, arText: string) => string;
  dir: string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, enText: string, arText: string) => {
    return language === 'ar' ? arText : enText;
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRTL = language === 'ar';

  const value = {
    language,
    setLanguage,
    t,
    dir,
    isRTL,
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={dir} className={isRTL ? 'font-arabic' : 'font-latin'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};