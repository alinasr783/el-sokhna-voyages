import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { YachtCard } from '@/components/YachtCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface Yacht {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  price?: number;
  price_currency?: string;
  is_featured: boolean;
  location_id: string;
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
}

export const YachtsList: React.FC = () => {
  const { t, language } = useLanguage();
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch yachts with images
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
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        // Fetch locations
        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .eq('is_active', true)
          .order('name_en');

        setYachts(yachtsData || []);
        setLocations(locationsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredYachts = yachts.filter(yacht => {
    const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
    const yachtDescription = language === 'ar' ? yacht.description_ar : yacht.description_en;
    
    const matchesSearch = searchTerm === '' || 
      yachtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (yachtDescription && yachtDescription.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = selectedLocation === 'all' || yacht.location_id === selectedLocation;
    
    return matchesSearch && matchesLocation;
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
            {t('all-yachts', 'All Yachts', 'جميع اليخوت')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('browse-yachts', 'Browse our complete collection of luxury yachts', 'تصفح مجموعتنا الكاملة من اليخوت الفاخرة')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('search-yachts', 'Search yachts...', 'البحث في اليخوت...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('filter-location', 'Filter by location', 'تصفية حسب الموقع')} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {t('all-locations', 'All Locations', 'جميع المواقع')}
              </SelectItem>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {language === 'ar' ? location.name_ar : location.name_en}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {t('showing-results', `Showing ${filteredYachts.length} yacht(s)`, `عرض ${filteredYachts.length} يخت`)}
          </p>
        </div>

        {/* Yachts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredYachts.map((yacht) => (
            <YachtCard key={yacht.id} yacht={yacht} />
          ))}
        </div>

        {filteredYachts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {t('no-yachts-found', 'No yachts found matching your criteria.', 'لم يتم العثور على يخوت تطابق معاييرك.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};