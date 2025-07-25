import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              ⛵ {t('brand', 'ELSOKHNA', 'السخنة')}
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              {t('description', 
                'Premium yacht rental experiences in the most beautiful locations.',
                'تجارب فاخرة لاستئجار اليخوت في أجمل المواقع.'
              )}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('contact', 'Contact Us', 'اتصل بنا')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span>01064283248</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-secondary" />
                <span>01064283248</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span>elsokhnayatch@gmail.com </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">
              {t('quicklinks', 'Quick Links', 'روابط سريعة')}
            </h4>
            <div className="space-y-2">
              <Link to="/" className="block hover:text-secondary transition-colors">
                {t('home', 'Home', 'الرئيسية')}
              </Link>
              <Link to="/yachts" className="block hover:text-secondary transition-colors">
                {t('yachts', 'Yachts', 'اليخوت')}
              </Link>
              <Link to="/locations" className="block hover:text-secondary transition-colors">
                {t('locations', 'Locations', 'المواقع')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/60 text-sm">
            © 2025 ELSOKHNA. {t('rights', 'All rights reserved.', 'جميع الحقوق محفوظة.')}
          </p>
          
          <Link 
            to="/admin-login" 
            className="text-xs text-primary-foreground/40 hover:text-secondary transition-colors mt-4 md:mt-0"
          >
            {t('adminlink', 'Are you the admin?', 'هل أنت المدير؟')}
          </Link>
        </div>
      </div>
    </footer>
  );
};
