import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Yacht } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  ArrowLeft,
  Star,
  Users,
  Anchor
} from 'lucide-react'

export const YachtDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [yacht, setYacht] = useState<Yacht | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchYacht = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('yachts')
          .select(`
            *,
            location:locations(*),
            images:yacht_images(*)
          `)
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching yacht:', error)
          return
        }

        setYacht(data)
      } catch (error) {
        console.error('Error fetching yacht:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchYacht()
  }, [id])

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

  if (!yacht) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('Yacht not found', 'اليخت غير موجود')}
          </h1>
          <Button asChild>
            <Link to="/yachts">
              {t('Back to Yachts', 'العودة إلى اليخوت')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const images = yacht.images || []
  const primaryImage = images.find(img => img.is_primary) || images[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/yachts">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Yachts', 'العودة إلى اليخوت')}
            </Link>
          </Button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <Card>
              <CardContent className="p-0">
                {images.length > 0 ? (
                  <div className="space-y-4">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={images[selectedImage]?.image_url || primaryImage?.image_url}
                        alt={language === 'ar' ? yacht.name_ar : yacht.name_en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {images.length > 1 && (
                      <div className="p-4">
                        <div className="flex space-x-2 overflow-x-auto">
                          {images.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setSelectedImage(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                selectedImage === index ? 'border-primary' : 'border-gray-200'
                              }`}
                            >
                              <img
                                src={image.image_url}
                                alt={`${language === 'ar' ? yacht.name_ar : yacht.name_en} - ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-t-lg">
                    <Anchor className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Yacht Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {language === 'ar' ? yacht.name_ar : yacht.name_en}
                    </CardTitle>
                    {yacht.location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {language === 'ar' ? yacht.location.name_ar : yacht.location.name_en}
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {formatPrice(yacht.price)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('Description', 'الوصف')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar' ? yacht.description_ar : yacht.description_en}
                  </p>
                </div>

                {yacht.features_en && yacht.features_en.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {t(translations.features.en, translations.features.ar)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(language === 'ar' ? yacht.features_ar : yacht.features_en)?.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {yacht.google_maps_link && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {t(translations.location.en, translations.location.ar)}
                    </h3>
                    <Button asChild variant="outline">
                      <a 
                        href={yacht.google_maps_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>{t(translations.viewOnMap.en, translations.viewOnMap.ar)}</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t(translations.contact.en, translations.contact.ar)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <a href={`https://wa.me/${yacht.contact_whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {t(translations.whatsapp.en, translations.whatsapp.ar)}
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <a href={`tel:${yacht.contact_phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      {t(translations.phone.en, translations.phone.ar)}
                    </a>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full" size="lg">
                    <a href={`mailto:${yacht.contact_email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      {t(translations.email.en, translations.email.ar)}
                    </a>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t(translations.whatsapp.en, translations.whatsapp.ar)}:</span>
                    <span className="font-medium">{yacht.contact_whatsapp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t(translations.phone.en, translations.phone.ar)}:</span>
                    <span className="font-medium">{yacht.contact_phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t(translations.email.en, translations.email.ar)}:</span>
                    <span className="font-medium">{yacht.contact_email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t(translations.price.en, translations.price.ar)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(yacht.price)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('per booking', 'للحجز الواحد')}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            {yacht.location && (
              <Card>
                <CardHeader>
                  <CardTitle>{t(translations.location.en, translations.location.ar)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">
                        {language === 'ar' ? yacht.location.name_ar : yacht.location.name_en}
                      </h4>
                      {yacht.location.description_en && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {language === 'ar' ? yacht.location.description_ar : yacht.location.description_en}
                        </p>
                      )}
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/locations/${yacht.location.id}`}>
                        {t('View Location Details', 'عرض تفاصيل الموقع')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}