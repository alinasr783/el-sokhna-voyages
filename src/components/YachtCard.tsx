import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Phone, Mail, MapPin, Star } from 'lucide-react';

interface YachtDetail {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  features_en?: string[];
  features_ar?: string[];
  price?: number;
  price_currency?: string;
  is_featured: boolean;
  location_id: string;
  locations?: {
    name_en: string;
    name_ar: string;
  };
  yacht_images?: Array<{
    image_url: string;
    alt_text_en?: string;
    alt_text_ar?: string;
    display_order: number;
  }>;
}

export const YachtDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { t, language } = useLanguage();
  const [yacht, setYacht] = useState<YachtDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchYacht = async () => {
      if (!id) return;

      try {
        const { data } = await supabase
          .from('yachts')
          .select(`
            *,
            locations (
              name_en,
              name_ar
            ),
            yacht_images (
              image_url,
              alt_text_en,
              alt_text_ar,
              display_order
            )
          `)
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (data) {
          if (data.yacht_images) {
            data.yacht_images.sort((a, b) => a.display_order - b.display_order);
          }
          setYacht(data);
        }
      } catch (error) {
        console.error('Error fetching yacht:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchYacht();
  }, [id, location.pathname]);

  const handleWhatsAppContact = () => {
    if (!yacht) return;
    const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
    const message = encodeURIComponent(`Hi! I'm interested in booking the ${yachtName} yacht. Can you provide more details?`);
    window.open(`https://wa.me/201064283248?text=${message}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.open('tel:01064283248', '_self');
  };

  const handleEmailContact = () => {
    if (!yacht) return;
    const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
    const subject = encodeURIComponent(`Yacht Booking Inquiry - ${yachtName}`);
    const body = encodeURIComponent(`Hi,\n\nI'm interested in booking the ${yachtName} yacht. Please provide more details and availability.\n\nThank you!`);
    window.open(`mailto:elsokhnayatch@gmail.com?subject=${subject}&body=${body}`, '_self');
  };

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

  if (!yacht) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('yacht-not-found', 'Yacht Not Found', 'اليخت غير موجود')}</h1>
          <Link to="/yachts">
            <Button>{t('back-to-yachts', 'Back to Yachts', 'العودة إلى اليخوت')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const yachtName = language === 'ar' ? yacht.name_ar : yacht.name_en;
  const yachtDescription = language === 'ar' ? yacht.description_ar : yacht.description_en;
  const yachtFeatures = language === 'ar' ? yacht.features_ar : yacht.features_en;
  const locationName = yacht.locations ? (language === 'ar' ? yacht.locations.name_ar : yacht.locations.name_en) : '';

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/yachts">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('back-to-yachts', 'Back to Yachts', 'العودة إلى اليخوت')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {yacht.yacht_images && yacht.yacht_images.length > 0 && (
              <>
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={yacht.yacht_images[selectedImageIndex].image_url}
                    alt={language === 'ar' 
                      ? yacht.yacht_images[selectedImageIndex].alt_text_ar 
                      : yacht.yacht_images[selectedImageIndex].alt_text_en || yachtName
                    }
                    className="w-full h-96 object-cover"
                  />
                  {yacht.is_featured && (
                    <div className="absolute top-4 right-4 bg-gradient-sunset text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {t('featured', 'Featured', 'مميز')}
                    </div>
                  )}
                </div>

                {yacht.yacht_images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {yacht.yacht_images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative overflow-hidden rounded border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-primary ring-2 ring-primary/20' 
                            : 'border-transparent hover:border-primary/50'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={`${yachtName} ${index + 1}`}
                          className="w-full h-20 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-2">{yachtName}</h1>
              {locationName && (
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-lg">{locationName}</span>
                </div>
              )}
              {yacht.price && (
                <div className="text-3xl font-bold text-secondary mb-4">
                  {yacht.price} {yacht.price_currency || 'USD'}
                </div>
              )}
            </div>

            {yachtDescription && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    {t('description', 'Description', 'الوصف')}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{yachtDescription}</p>
                </CardContent>
              </Card>
            )}

            {yachtFeatures && yachtFeatures.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">
                    {t('features', 'Features', 'المميزات')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {yachtFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {t('book-now', 'Book This Yacht', 'احجز هذا اليخت')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('contact-booking', 
                    'Contact us to book this yacht and create unforgettable memories.',
                    'تواصل معنا لحجز هذا اليخت وخلق ذكريات لا تُنسى.'
                  )}
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('whatsapp', 'WhatsApp: 01064283248', 'واتساب: 01064283248')}
                  </Button>

                  <Button
                    onClick={handlePhoneCall}
                    variant="outline"
                    className="w-full"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    {t('phone', 'Phone: 01064283248', 'هاتف: 01064283248')}
                  </Button>

                  <Button
                    onClick={handleEmailContact}
                    variant="outline"
                    className="w-full"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {t('email', 'Email Us', 'راسلنا')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
