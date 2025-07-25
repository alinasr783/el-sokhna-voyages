import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

interface LocationCardProps {
  location: {
    id: string;
    name_en: string;
    name_ar: string;
    description_en?: string;
    description_ar?: string;
    image_url?: string;
  };
  yachtCount?: number;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, yachtCount = 0 }) => {
  const { t, language } = useLanguage();

  const locationName = language === 'ar' ? location.name_ar : location.name_en;
  const locationDescription = language === 'ar' ? location.description_ar : location.description_en;

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500 group bg-gradient-card card-hover">
      <div className="relative overflow-hidden">
        {location.image_url && (
          <img
            src={location.image_url}
            alt={locationName}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-lg">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span className="font-semibold">
              {yachtCount} {t('yachts', 'Yachts', 'يخت')}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2 text-primary">{locationName}</h3>
        {locationDescription && (
          <p className="text-muted-foreground mb-4 line-clamp-3">{locationDescription}</p>
        )}

        <Link to={`/location/${location.id}`}>
          <Button className="w-full bg-gradient-ocean hover:opacity-90 transition-opacity">
            {t('explorelocation', 'Explore Location', 'استكشاف الموقع')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};