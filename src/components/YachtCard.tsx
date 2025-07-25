import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Mail } from 'lucide-react';

interface YachtCardProps {
  yacht: {
    id: string;
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    price?: number;
    price_currency?: string;
    is_featured: boolean;
    yacht_images?: Array<{
      image_url: string;
      alt_text_en?: string;
      alt_text_ar?: string;
    }>;
  };
}

export const YachtCard: React.FC<YachtCardProps> = ({ yacht }) => {
  const { t, language } = useLanguage();

  const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
  const yachtDescription = language === 'ar' ? yacht.description_ar : yacht.description_en;
  const primaryImage = yacht.yacht_images?.[0];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Hi! I'm interested in booking the ${yachtName} yacht. Can you provide more details?`);
    window.open(`https://wa.me/201064283248?text=${message}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.open('tel:01064283248', '_self');
  };

  const handleEmailContact = () => {
    const subject = encodeURIComponent(`Yacht Booking Inquiry - ${yachtName}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in booking the ${yachtName} yacht. Please provide more details and availability.\n\nThank you!`);
    window.open(`mailto:elsokhnayatch@gmail.com?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 group bg-gradient-card card-hover">
      <div className="relative overflow-hidden">
        {primaryImage && (
          <img
            src={primaryImage.image_url}
            alt={language === 'ar' ? primaryImage.alt_text_ar : primaryImage.alt_text_en || yachtName}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {yacht.is_featured && (
          <div className="absolute top-4 right-4 bg-gradient-sunset text-white px-3 py-1 rounded-full text-sm font-semibold">
            {t('featured', 'Featured', 'مميز')}
          </div>
        )}
        {yacht.price && (
          <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-bold">
            {yacht.price} {yacht.price_currency || 'USD'}
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-primary">{yachtName}</h3>
        {yachtDescription && (
          <p className="text-muted-foreground mb-4 line-clamp-2">{yachtDescription}</p>
        )}

        <div className="flex flex-col space-y-3">
          <Link to={`/yacht/${yacht.id}`}>
            <Button className="w-full bg-gradient-ocean hover:opacity-90 transition-opacity">
              {t('viewdetails', 'View Details', 'عرض التفاصيل')}
            </Button>
          </Link>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsAppContact}
              className="flex items-center justify-center"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePhoneCall}
              className="flex items-center justify-center"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmailContact}
              className="flex items-center justify-center"
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
