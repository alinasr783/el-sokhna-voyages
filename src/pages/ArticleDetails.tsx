import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Article } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'

export const ArticleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching article:', error)
          return
        }

        setArticle(data)
      } catch (error) {
        console.error('Error fetching article:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t(translations.loading.en, translations.loading.ar)}</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            {t('Article not found', 'المقال غير موجود')}
          </h1>
          <Button asChild>
            <Link to="/articles">
              {t('Back to Articles', 'العودة إلى المقالات')}
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
            <Link to="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('Back to Articles', 'العودة إلى المقالات')}
            </Link>
          </Button>
        </nav>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(article.created_at)}
              </div>
              <CardTitle className="text-3xl md:text-4xl leading-tight">
                {language === 'ar' ? article.title_ar : article.title_en}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Article Image */}
          {article.image_url && (
            <Card className="mb-8">
              <CardContent className="p-0">
                <div className="aspect-video relative overflow-hidden rounded-lg">
                  <img
                    src={article.image_url}
                    alt={language === 'ar' ? article.title_ar : article.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Content */}
          <Card>
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                style={{ direction: isRTL ? 'rtl' : 'ltr' }}
              >
                <div 
                  className="whitespace-pre-wrap leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: (language === 'ar' ? article.content_ar : article.content_en)
                      .replace(/\n/g, '<br>')
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Article Footer */}
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('Published on', 'نشر في')} {formatDate(article.created_at)}
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link to="/articles">
                    {t('Back to Articles', 'العودة إلى المقالات')}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}