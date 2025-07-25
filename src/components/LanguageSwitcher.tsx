import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="px-3 py-1.5 text-sm font-medium"
      >
        🇬🇧 EN
      </Button>
      <Button
        variant={language === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('ar')}
        className="px-3 py-1.5 text-sm font-medium"
      >
        🇸🇦 AR
      </Button>
    </div>
  );
};