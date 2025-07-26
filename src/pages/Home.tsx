import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Yacht, Location } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { MapPin, Star, Phone, Mail, MessageCircle } from 'lucide-react'

export const Home: React.FC = () => {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t(translations.loading.en, translations.loading.ar)}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">
              {t('ELSOKHNA', 'يخوت العين السخنة')}
            </h1>
            <p className="text-xl mb-6 opacity-90">
              {t('Luxury Yacht Booking Experience', 'تجربة حجز اليخوت الفاخرة')}
            </p>
            <Button size="lg" asChild>
              <Link to="/yachts">
                {t('Explore Yachts', 'استكشف اليخوت')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Available Yachts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('Available Yachts', 'اليخوت المتاحة')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Discover our premium collection of luxury yachts available for booking',
                'اكتشف مجموعتنا المميزة من اليخوت الفاخرة المتاحة للحجز'
              )}
            </p>
          </div>

          {yachts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t(translations.noYachtsFound.en, translations.noYachtsFound.ar)}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yachts.slice(0, 6).map((yacht) => (
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

          {yachts.length > 6 && (
            <div className="text-center mt-8">
              <Button asChild>
                <Link to="/yachts">
                  {t('View All Yachts', 'عرض جميع اليخوت')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Available Locations Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('Available Locations', 'المواقع المتاحة')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t(
                'Explore our beautiful destinations where you can enjoy luxury yacht experiences',
                'استكشف وجهاتنا الجميلة حيث يمكنك الاستمتاع بتجارب اليخوت الفاخرة'
              )}
            </p>
          </div>

          {locations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {t(translations.noLocationsFound.en, translations.noLocationsFound.ar)}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location) => (
                <Card key={location.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {language === 'ar' ? location.name_ar : location.name_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
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
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            {t(translations.contact.en, translations.contact.ar)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-4">
              <MessageCircle className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{t(translations.whatsapp.en, translations.whatsapp.ar)}</h3>
              <a href="https://wa.me/01158954215" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                01158954215
              </a>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Phone className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{t(translations.phone.en, translations.phone.ar)}</h3>
              <a href="tel:01158954215" className="text-primary hover:underline">
                01158954215
              </a>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <Mail className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">{t(translations.email.en, translations.email.ar)}</h3>
              <a href="mailto:alinasreldin783@gmail.com" className="text-primary hover:underline">
                alinasreldin783@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
