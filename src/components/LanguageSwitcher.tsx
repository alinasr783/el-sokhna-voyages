import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-medium ${
          language === 'en' 
            ? 'bg-white/20 text-white hover:bg-white/30' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        🇬🇧 EN
      </Button>
      <Button
        variant={language === 'ar' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1.5 text-sm font-medium ${
          language === 'ar' 
            ? 'bg-white/20 text-white hover:bg-white/30' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
        }`}
      >
        🇸🇦 AR
      </Button>
    </div>
  );
};