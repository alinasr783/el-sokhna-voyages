import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { YachtCard } from '@/components/YachtCard';
import { LocationCard } from '@/components/LocationCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Anchor, MapPin } from 'lucide-react';
import heroImage from '@/assets/hero-yacht-marina.jpg';

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

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
}

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [yachtCounts, setYachtCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          .eq('is_active', true)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(6);

        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6);

        const { data: yachtCountsData } = await supabase
          .from('yachts')
          .select('location_id')
          .eq('is_active', true);

        const counts: { [key: string]: number } = {};
        yachtCountsData?.forEach(yacht => {
          counts[yacht.location_id] = (counts[yacht.location_id] || 0) + 1;
        });

        setYachts(yachtsData || []);
        setLocations(locationsData || []);
        setYachtCounts(counts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {t('hero-title', 'Luxury Yacht Experiences', 'تجارب يخوت فاخرة')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {t('hero-subtitle', 
              'Discover the most beautiful yachts in the most exclusive locations',
              'اكتشف أجمل اليخوت في أكثر الأماكن حصرية'
            )}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/yachts">
              <Button size="lg" className="bg-gradient-sunset hover:opacity-90 text-lg px-8 py-3">
                {t('explore-yachts', 'Explore Yachts', 'استكشف اليخوت')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/locations">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-primary hover:bg-white hover:text-primary"
              >
                {t('browse-locations', 'Browse Locations', 'تصفح المواقع')}
                <MapPin className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Yachts Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Anchor className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-4xl font-bold text-primary">
                {t('featured-yachts', 'Featured Yachts', 'اليخوت المميزة')}
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('featured-yachts-desc', 
                'Our handpicked selection of the finest luxury yachts',
                'مجموعتنا المختارة بعناية من أفخر اليخوت الفاخرة'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {yachts.map((yacht) => (
              <YachtCard key={yacht.id} yacht={yacht} />
            ))}
          </div>

          {yachts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('no-featured-yachts', 'No featured yachts available at the moment.', 'لا توجد يخوت مميزة متاحة في الوقت الحالي.')}
              </p>
            </div>
          )}

          <div className="text-center">
            <Link to="/yachts">
              <Button size="lg" className="bg-gradient-ocean hover:opacity-90">
                {t('view-all-yachts', 'View All Yachts', 'عرض جميع اليخوت')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-4xl font-bold text-primary">
                {t('prime-locations', 'Prime Locations', 'مواقع متميزة')}
              </h2>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('prime-locations-desc', 
                'Explore breathtaking destinations where luxury meets adventure',
                'استكشف وجهات خلابة حيث تلتقي الفخامة بالمغامرة'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {locations.map((location) => (
              <LocationCard 
                key={location.id} 
                location={location} 
                yachtCount={yachtCounts[location.id] || 0}
              />
            ))}
          </div>

          {locations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t('no-locations', 'No locations available at the moment.', 'لا توجد مواقع متاحة في الوقت الحالي.')}
              </p>
            </div>
          )}

          <div className="text-center">
            <Link to="/locations">
              <Button size="lg" className="bg-gradient-ocean hover:opacity-90">
                {t('view-all-locations', 'View All Locations', 'عرض جميع المواقع')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
