import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Location } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { MapPin, Search, Anchor } from 'lucide-react'

export const Locations: React.FC = () => {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .order('name_en', { ascending: true })

        if (error) {
          console.error('Error fetching locations:', error)
          return
        }

        setLocations(data || [])
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  const filteredLocations = locations.filter(location => {
    return searchTerm === '' || 
      location.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.name_ar.includes(searchTerm) ||
      location.description_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description_ar?.includes(searchTerm)
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t(translations.loading.en, translations.loading.ar)}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t(translations.locations.en, translations.locations.ar)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Explore our beautiful destinations where you can enjoy luxury yacht experiences',
              'استكشف وجهاتنا الجميلة حيث يمكنك الاستمتاع بتجارب اليخوت الفاخرة'
            )}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('Search locations...', 'البحث في المواقع...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            {t('Showing', 'عرض')} {filteredLocations.length} {t('of', 'من')} {locations.length} {t('locations', 'موقع')}
          </p>
        </div>

        {/* Locations Grid */}
        {filteredLocations.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <Anchor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-4">
                  {t(translations.noLocationsFound.en, translations.noLocationsFound.ar)}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                >
                  {t('Clear Search', 'مسح البحث')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle className="text-xl">
                      {language === 'ar' ? location.name_ar : location.name_en}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    {language === 'ar' ? location.description_ar : location.description_en}
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/locations/${location.id}`}>
                      {t('Explore Location', 'استكشف الموقع')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}