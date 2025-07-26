import React, { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation, translations } from '../../lib/translations'
import { supabase, Location } from '../../lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

interface LocationFormProps {
  location?: Location | null
  onClose: () => void
}

export const LocationForm: React.FC<LocationFormProps> = ({ location, onClose }) => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name_en: location?.name_en || '',
    name_ar: location?.name_ar || '',
    description_en: location?.description_en || '',
    description_ar: location?.description_ar || '',
    coordinates: location?.coordinates || null
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (location?.id) {
        // Update existing location
        const { error } = await supabase
          .from('locations')
          .update(formData)
          .eq('id', location.id)

        if (error) throw error
      } else {
        // Create new location
        const { error } = await supabase
          .from('locations')
          .insert([formData])

        if (error) throw error
      }

      onClose()
    } catch (error) {
      console.error('Error saving location:', error)
      alert(t('Error saving location', 'خطأ في حفظ الموقع'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {location ? t('Edit Location', 'تعديل الموقع') : t('Add New Location', 'إضافة موقع جديد')}
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

          {/* Coordinates (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                placeholder="e.g., 29.9792"
                value={formData.coordinates?.x || ''}
                onChange={(e) => handleInputChange('coordinates', {
                  x: parseFloat(e.target.value) || null,
                  y: formData.coordinates?.y || null
                })}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                placeholder="e.g., 31.1342"
                value={formData.coordinates?.y || ''}
                onChange={(e) => handleInputChange('coordinates', {
                  x: formData.coordinates?.x || null,
                  y: parseFloat(e.target.value) || null
                })}
              />
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