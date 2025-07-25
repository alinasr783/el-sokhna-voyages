import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { YachtCard } from '@/components/YachtCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin } from 'lucide-react';

interface LocationDetail {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
}

interface Yacht {
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
}

export const LocationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  const [location, setLocation] = useState<LocationDetail | null>(null);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch location details
        const { data: locationData } = await supabase
          .from('locations')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        // Fetch yachts in this location
        const { data: yachtsData } = await supabase
          .from('yachts')
          .select(`
            *,
            yacht_images (
              image_url,
              alt_text_en,
              alt_text_ar,
              display_order
            )
          `)
          .eq('location_id', id)
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        setLocation(locationData);
        setYachts(yachtsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading', 'Loading...', 'جاري التحميل...')}</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('location-not-found', 'Location Not Found', 'الموقع غير موجود')}</h1>
          <Link to="/locations">
            <Button>{t('back-to-locations', 'Back to Locations', 'العودة إلى المواقع')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const locationName = language === 'ar' ? location.name_ar : location.name_en;
  const locationDescription = language === 'ar' ? location.description_ar : location.description_en;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        {location.image_url && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${location.image_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 mr-3" />
            <h1 className="text-5xl font-bold">{locationName}</h1>
          </div>
          {locationDescription && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {locationDescription}
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/locations">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back-to-locations', 'Back to Locations', 'العودة إلى المواقع')}
            </Button>
          </Link>
        </div>

        {/* Yachts Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-6">
            {t('yachts-in-location', `Yachts in ${locationName}`, `اليخوت في ${locationName}`)}
          </h2>

          {yachts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {yachts.map((yacht) => (
                <YachtCard key={yacht.id} yacht={yacht} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {t('no-yachts-in-location', 'No yachts available in this location at the moment.', 'لا توجد يخوت متاحة في هذا الموقع في الوقت الحالي.')}
                </p>
                <Link to="/yachts" className="mt-4 inline-block">
                  <Button>
                    {t('browse-all-yachts', 'Browse All Yachts', 'تصفح جميع اليخوت')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};