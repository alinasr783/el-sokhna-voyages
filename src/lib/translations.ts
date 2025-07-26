import { useLanguage } from '../contexts/LanguageContext'

export const useTranslation = () => {
  const { language } = useLanguage()
  
  const t = (enText: string, arText: string) => {
    return language === 'ar' ? arText : enText
  }
  
  return { t, language }
}

// Common translations
export const translations = {
  // Navigation
  home: { en: 'Home', ar: 'الرئيسية' },
  yachts: { en: 'Yachts', ar: 'اليخوت' },
  locations: { en: 'Locations', ar: 'المواقع' },
  articles: { en: 'Articles', ar: 'المقالات' },
  admin: { en: 'Admin', ar: 'الإدارة' },
  
  // Common actions
  view: { en: 'View', ar: 'عرض' },
  edit: { en: 'Edit', ar: 'تعديل' },
  delete: { en: 'Delete', ar: 'حذف' },
  add: { en: 'Add', ar: 'إضافة' },
  save: { en: 'Save', ar: 'حفظ' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  search: { en: 'Search', ar: 'بحث' },
  
  // Contact
  contact: { en: 'Contact', ar: 'اتصل بنا' },
  whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
  phone: { en: 'Phone', ar: 'الهاتف' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  
  // Yacht details
  price: { en: 'Price', ar: 'السعر' },
  features: { en: 'Features', ar: 'المميزات' },
  location: { en: 'Location', ar: 'الموقع' },
  viewOnMap: { en: 'View on Map', ar: 'عرض على الخريطة' },
  
  // Admin
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  areYouAdmin: { en: 'Are you the admin?', ar: 'هل أنت المدير؟' },
  
  // Messages
  noYachtsFound: { en: 'No yachts found', ar: 'لم يتم العثور على يخوت' },
  noLocationsFound: { en: 'No locations found', ar: 'لم يتم العثور على مواقع' },
  noArticlesFound: { en: 'No articles found', ar: 'لم يتم العثور على مقالات' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  
  // Brand
  brandName: { en: 'ELSOKHNA', ar: 'يخوت العين السخنة' },
  tagline: { en: 'Luxury Yacht Booking', ar: 'حجز اليخوت الفاخرة' }
}