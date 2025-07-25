import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { LocationCard } from '@/components/LocationCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
}

export const LocationsList: React.FC = () => {
  const { t, language } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [yachtCounts, setYachtCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        // Fetch yacht counts per location
        const { data: yachtCountsData } = await supabase
          .from('yachts')
          .select('location_id')
          .eq('is_active', true);

        const counts: { [key: string]: number } = {};
        yachtCountsData?.forEach(yacht => {
          counts[yacht.location_id] = (counts[yacht.location_id] || 0) + 1;
        });

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

  const filteredLocations = locations.filter(location => {
    const locationName = language === 'ar' ? location.name_ar : location.name_en;
    const locationDescription = language === 'ar' ? location.description_ar : location.description_en;
    
    return searchTerm === '' || 
      locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (locationDescription && locationDescription.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {t('all-locations', 'All Locations', 'جميع المواقع')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('explore-locations', 'Explore our beautiful destinations', 'استكشف وجهاتنا الجميلة')}
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search-locations', 'Search locations...', 'البحث في المواقع...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground text-center">
            {t('showing-results', `Showing ${filteredLocations.length} location(s)`, `عرض ${filteredLocations.length} موقع`)}
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLocations.map((location) => (
            <LocationCard 
              key={location.id} 
              location={location} 
              yachtCount={yachtCounts[location.id] || 0}
            />
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('no-locations-found', 'No locations found matching your search.', 'لم يتم العثور على مواقع تطابق بحثك.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};