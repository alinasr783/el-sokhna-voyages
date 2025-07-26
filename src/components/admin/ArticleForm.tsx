import React, { useState } from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useTranslation, translations } from '../../lib/translations'
import { supabase, Article } from '../../lib/supabase'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { X } from 'lucide-react'

interface ArticleFormProps {
  article?: Article | null
  onClose: () => void
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ article, onClose }) => {
  const { language } = useLanguage()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title_en: article?.title_en || '',
    title_ar: article?.title_ar || '',
    content_en: article?.content_en || '',
    content_ar: article?.content_ar || '',
    image_url: article?.image_url || '',
    image_path: article?.image_path || ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setFormData(prev => ({ ...prev, image_url: '', image_path: '' }))
  }

  const uploadImage = async (articleId: string) => {
    if (!imageFile) return null

    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${articleId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('article-images')
      .upload(fileName, imageFile)
    
    if (error) {
      console.error('Error uploading image:', error)
      return null
    }
    
    const { data: urlData } = supabase.storage
      .from('article-images')
      .getPublicUrl(fileName)
    
    return urlData?.publicUrl || null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let articleId = article?.id

      if (articleId) {
        // Update existing article
        const { error } = await supabase
          .from('articles')
          .update(formData)
          .eq('id', articleId)

        if (error) throw error
      } else {
        // Create new article
        const { data, error } = await supabase
          .from('articles')
          .insert([formData])
          .select()
          .single()

        if (error) throw error
        articleId = data.id
      }

      // Upload new image
      if (imageFile && articleId) {
        const imageUrl = await uploadImage(articleId)
        if (imageUrl) {
          await supabase
            .from('articles')
            .update({ image_url: imageUrl })
            .eq('id', articleId)
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving article:', error)
      alert(t('Error saving article', 'خطأ في حفظ المقال'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? t('Edit Article', 'تعديل المقال') : t('Add New Article', 'إضافة مقال جديد')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title_en">Title (English)</Label>
              <Input
                id="title_en"
                value={formData.title_en}
                onChange={(e) => handleInputChange('title_en', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="title_ar">Title (Arabic)</Label>
              <Input
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="content_en">Content (English)</Label>
              <Textarea
                id="content_en"
                value={formData.content_en}
                onChange={(e) => handleInputChange('content_en', e.target.value)}
                rows={12}
                required
                placeholder="Write your article content in English..."
              />
            </div>
            <div>
              <Label htmlFor="content_ar">Content (Arabic)</Label>
              <Textarea
                id="content_ar"
                value={formData.content_ar}
                onChange={(e) => handleInputChange('content_ar', e.target.value)}
                rows={12}
                required
                placeholder="اكتب محتوى المقال بالعربية..."
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <Label>Article Image</Label>
            <div className="space-y-4">
              {/* Existing Image */}
              {formData.image_url && !imageFile && (
                <div className="relative">
                  <img 
                    src={formData.image_url} 
                    alt="" 
                    className="w-full max-w-md h-48 object-cover rounded" 
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              {/* New Image */}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-2"
                />
                {imageFile && (
                  <div className="relative">
                    <img 
                      src={URL.createObjectURL(imageFile)} 
                      alt="" 
                      className="w-full max-w-md h-48 object-cover rounded" 
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => setImageFile(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
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