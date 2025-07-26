import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation, translations } from '../../lib/translations'
import { supabase, Yacht, Location } from '../../lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { X, Upload, Plus, Trash2 } from 'lucide-react'

interface YachtFormProps {
  yacht?: Yacht | null
  locations: Location[]
  onClose: () => void
}

export const YachtForm: React.FC<YachtFormProps> = ({ yacht, locations, onClose }) => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name_en: yacht?.name_en || '',
    name_ar: yacht?.name_ar || '',
    description_en: yacht?.description_en || '',
    description_ar: yacht?.description_ar || '',
    price: yacht?.price || 0,
    location_id: yacht?.location_id || '',
    contact_whatsapp: yacht?.contact_whatsapp || '01158954215',
    contact_phone: yacht?.contact_phone || '01158954215',
    contact_email: yacht?.contact_email || 'alinasreldin783@gmail.com',
    google_maps_link: yacht?.google_maps_link || '',
    features_en: yacht?.features_en || [],
    features_ar: yacht?.features_ar || []
  })
  const [images, setImages] = useState<File[]>([])
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [newFeatureEn, setNewFeatureEn] = useState('')
  const [newFeatureAr, setNewFeatureAr] = useState('')

  useEffect(() => {
    if (yacht?.images) {
      setUploadedImages(yacht.images.map(img => img.image_url))
    }
  }, [yacht])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeatureEn.trim() && newFeatureAr.trim()) {
      setFormData(prev => ({
        ...prev,
        features_en: [...prev.features_en, newFeatureEn.trim()],
        features_ar: [...prev.features_ar, newFeatureAr.trim()]
      }))
      setNewFeatureEn('')
      setNewFeatureAr('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features_en: prev.features_en.filter((_, i) => i !== index),
      features_ar: prev.features_ar.filter((_, i) => i !== index)
    }))
  }

  const uploadImages = async (yachtId: string) => {
    const uploadedUrls: string[] = []
    
    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${yachtId}/${Date.now()}-${i}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('yacht-images')
        .upload(fileName, file)
      
      if (error) {
        console.error('Error uploading image:', error)
        continue
      }
      
      const { data: urlData } = supabase.storage
        .from('yacht-images')
        .getPublicUrl(fileName)
      
      if (urlData?.publicUrl) {
        uploadedUrls.push(urlData.publicUrl)
        
        // Save image record to database
        await supabase.from('yacht_images').insert({
          yacht_id: yachtId,
          image_url: urlData.publicUrl,
          image_path: fileName,
          is_primary: uploadedUrls.length === 1, // First image is primary
          order_index: uploadedUrls.length - 1
        })
      }
    }
    
    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let yachtId = yacht?.id

      if (yachtId) {
        // Update existing yacht
        const { error } = await supabase
          .from('yachts')
          .update(formData)
          .eq('id', yachtId)

        if (error) throw error
      } else {
        // Create new yacht
        const { data, error } = await supabase
          .from('yachts')
          .insert([formData])
          .select()
          .single()

        if (error) throw error
        yachtId = data.id
      }

      // Upload new images
      if (images.length > 0 && yachtId) {
        await uploadImages(yachtId)
      }

      onClose()
    } catch (error) {
      console.error('Error saving yacht:', error)
      alert(t('Error saving yacht', 'خطأ في حفظ اليخت'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {yacht ? t('Edit Yacht', 'تعديل اليخت') : t('Add New Yacht', 'إضافة يخت جديد')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name_en">Name (English)</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => handleInputChange('name_en', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="name_ar">Name (Arabic)</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => handleInputChange('name_ar', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="description_en">Description (English)</Label>
              <Textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => handleInputChange('description_en', e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="description_ar">Description (Arabic)</Label>
              <Textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleInputChange('description_ar', e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (EGP)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                required
              />
            </div>
            <div>
              <Label htmlFor="location_id">Location</Label>
              <Select value={formData.location_id} onValueChange={(value) => handleInputChange('location_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('Select location', 'اختر الموقع')} />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {language === 'ar' ? location.name_ar : location.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contact_whatsapp">WhatsApp</Label>
              <Input
                id="contact_whatsapp"
                value={formData.contact_whatsapp}
                onChange={(e) => handleInputChange('contact_whatsapp', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="google_maps_link">Google Maps Link</Label>
            <Input
              id="google_maps_link"
              value={formData.google_maps_link}
              onChange={(e) => handleInputChange('google_maps_link', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>

          {/* Features */}
          <div>
            <Label>Features</Label>
            <div className="space-y-2">
              {formData.features_en.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm flex-1">
                    {feature} / {formData.features_ar[index]}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  placeholder="Feature (English)"
                  value={newFeatureEn}
                  onChange={(e) => setNewFeatureEn(e.target.value)}
                />
                <Input
                  placeholder="Feature (Arabic)"
                  value={newFeatureAr}
                  onChange={(e) => setNewFeatureAr(e.target.value)}
                />
              </div>
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>Images</Label>
            <div className="space-y-4">
              {/* Existing Images */}
              {uploadedImages.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Existing Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {uploadedImages.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt="" className="w-full h-20 object-cover rounded" />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeUploadedImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              <div>
                <h4 className="text-sm font-medium mb-2">Add New Images</h4>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="" 
                          className="w-full h-20 object-cover rounded" 
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t(translations.cancel.en, translations.cancel.ar)}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t(translations.loading.en, translations.loading.ar) : t(translations.save.en, translations.save.ar)}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}