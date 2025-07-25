import React from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-gradient-ocean text-primary-foreground shadow-luxury sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="text-2xl font-bold">
            ⛵ {t('brand', 'ELSOKHNA', 'السخنة')}
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-white/90 hover:text-white transition-colors font-medium"
          >
            {t('home', 'Home', 'الرئيسية')}
          </Link>
          <Link 
            to="/yachts" 
            className="text-white/90 hover:text-white transition-colors font-medium"
          >
            {t('yachts', 'Yachts', 'اليخوت')}
          </Link>
          <Link 
            to="/locations" 
            className="text-white/90 hover:text-white transition-colors font-medium"
          >
            {t('locations', 'Locations', 'المواقع')}
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};