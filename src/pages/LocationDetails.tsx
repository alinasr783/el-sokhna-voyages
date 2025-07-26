import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Location, Yacht } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { MapPin, ArrowLeft, Phone, Mail, MessageCircle } from 'lucide-react'

export const LocationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [location, setLocation] = useState<Location | null>(null)
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!id) return

      try {
        // Fetch location
        const { data: locationData, error: locationError } = await supabase
          .from('locations')
          .select('*')
          .eq('id', id)
          .single()

        if (locationError) {
          console.error('Error fetching location:', locationError)
          return
        }

        // Fetch yachts in this location
        const { data: yachtsData, error: yachtsError } = await supabase
          .from('yachts')
          .select(`
            *,
            images:yacht_images(*)
          `)
          .eq('location_id', id)
          .order('created_at', { ascending: false })

        if (yachtsError) {
          console.error('Error fetching yachts:', yachtsError)
        }

        setLocation(locationData)
        setYachts(yachtsData || [])
      } catch (error) {
        console.error('Error fetching location data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocationData()
  }, [id])

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

  if (!location) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('Location not found', 'الموقع غير موجود')}
          </h1>
          <Button asChild>
            <Link to="/locations">
              {t('Back to Locations', 'العودة إلى المواقع')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/locations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Locations', 'العودة إلى المواقع')}
            </Link>
          </Button>
        </nav>

        {/* Location Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">
                  {language === 'ar' ? location.name_ar : location.name_en}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {yachts.length} {t('yachts available', 'يخت متاح')}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed">
              {language === 'ar' ? location.description_ar : location.description_en}
            </p>
          </CardContent>
        </Card>

        {/* Yachts in this Location */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {t('Yachts in this Location', 'اليخوت في هذا الموقع')}
          </h2>

          {yachts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-4">
                    {t('No yachts available in this location yet', 'لا توجد يخوت متاحة في هذا الموقع بعد')}
                  </p>
                  <Button asChild>
                    <Link to="/yachts">
                      {t('View All Yachts', 'عرض جميع اليخوت')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yachts.map((yacht) => (
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

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t(translations.contact.en, translations.contact.ar)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{t(translations.whatsapp.en, translations.whatsapp.ar)}</h3>
                <a href="https://wa.me/01158954215" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  01158954215
                </a>
              </div>
              <div className="text-center">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{t(translations.phone.en, translations.phone.ar)}</h3>
                <a href="tel:01158954215" className="text-primary hover:underline">
                  01158954215
                </a>
              </div>
              <div className="text-center">
                <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{t(translations.email.en, translations.email.ar)}</h3>
                <a href="mailto:alinasreldin783@gmail.com" className="text-primary hover:underline">
                  alinasreldin783@gmail.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}