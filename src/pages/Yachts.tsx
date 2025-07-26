import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Yacht, Location } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { MapPin, Search, Phone, Mail, MessageCircle } from 'lucide-react'

export const Yachts: React.FC = () => {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [priceRange, setPriceRange] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch yachts with location and images
        const { data: yachtsData } = await supabase
          .from('yachts')
          .select(`
            *,
            location:locations(*),
            images:yacht_images(*)
          `)
          .order('created_at', { ascending: false })

        // Fetch locations
        const { data: locationsData } = await supabase
          .from('locations')
          .select('*')
          .order('name_en', { ascending: true })

        setYachts(yachtsData || [])
        setLocations(locationsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPrimaryImage = (yacht: Yacht) => {
    if (!yacht.images || yacht.images.length === 0) {
      return '/placeholder-yacht.jpg'
    }
    const primaryImage = yacht.images.find(img => img.is_primary)
    return primaryImage ? primaryImage.image_url : yacht.images[0].image_url
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: 'EGP',
    }).format(price)
  }

  const filteredYachts = yachts.filter(yacht => {
    const matchesSearch = searchTerm === '' || 
      yacht.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yacht.name_ar.includes(searchTerm) ||
      yacht.description_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      yacht.description_ar?.includes(searchTerm)

    const matchesLocation = selectedLocation === '' || yacht.location_id === selectedLocation

    const matchesPrice = priceRange === '' || (() => {
      switch (priceRange) {
        case 'low':
          return yacht.price <= 5000
        case 'medium':
          return yacht.price > 5000 && yacht.price <= 15000
        case 'high':
          return yacht.price > 15000
        default:
          return true
      }
    })()

    return matchesSearch && matchesLocation && matchesPrice
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
            {t(translations.yachts.en, translations.yachts.ar)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Discover our premium collection of luxury yachts available for booking',
              'اكتشف مجموعتنا المميزة من اليخوت الفاخرة المتاحة للحجز'
            )}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('Search yachts...', 'البحث في اليخوت...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder={t('All Locations', 'جميع المواقع')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('All Locations', 'جميع المواقع')}</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {language === 'ar' ? location.name_ar : location.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('All Prices', 'جميع الأسعار')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('All Prices', 'جميع الأسعار')}</SelectItem>
                  <SelectItem value="low">{t('Under 5,000 EGP', 'أقل من 5,000 جنيه')}</SelectItem>
                  <SelectItem value="medium">{t('5,000 - 15,000 EGP', '5,000 - 15,000 جنيه')}</SelectItem>
                  <SelectItem value="high">{t('Over 15,000 EGP', 'أكثر من 15,000 جنيه')}</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedLocation('')
                  setPriceRange('')
                }}
              >
                {t('Clear Filters', 'مسح الفلاتر')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {t('Showing', 'عرض')} {filteredYachts.length} {t('of', 'من')} {yachts.length} {t('yachts', 'يخت')}
          </p>
        </div>

        {/* Yachts Grid */}
        {filteredYachts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg mb-4">
                  {t(translations.noYachtsFound.en, translations.noYachtsFound.ar)}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedLocation('')
                    setPriceRange('')
                  }}
                >
                  {t('Clear Filters', 'مسح الفلاتر')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredYachts.map((yacht) => (
              <Card key={yacht.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={getPrimaryImage(yacht)}
                    alt={language === 'ar' ? yacht.name_ar : yacht.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      {formatPrice(yacht.price)}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === 'ar' ? yacht.name_ar : yacht.name_en}
                  </CardTitle>
                  {yacht.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      {language === 'ar' ? yacht.location.name_ar : yacht.location.name_en}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {language === 'ar' ? yacht.description_ar : yacht.description_en}
                  </p>
                  <div className="flex justify-between items-center">
                    <Button asChild size="sm">
                      <Link to={`/yachts/${yacht.id}`}>
                        {t(translations.view.en, translations.view.ar)}
                      </Link>
                    </Button>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" asChild>
                        <a href={`https://wa.me/${yacht.contact_whatsapp}`} target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <a href={`tel:${yacht.contact_phone}`}>
                          <Phone className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}