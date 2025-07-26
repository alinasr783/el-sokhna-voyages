import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Article } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Search, FileText, Calendar } from 'lucide-react'

export const Articles: React.FC = () => {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching articles:', error)
          return
        }

        setArticles(data || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const filteredArticles = articles.filter(article => {
    return searchTerm === '' || 
      article.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.title_ar.includes(searchTerm) ||
      article.content_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content_ar.includes(searchTerm)
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

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
            {t(translations.articles.en, translations.articles.ar)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'Discover insights, tips, and stories about luxury yacht experiences',
              'اكتشف رؤى ونصائح وقصص حول تجارب اليخوت الفاخرة'
            )}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('Search articles...', 'البحث في المقالات...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            {t('Showing', 'عرض')} {filteredArticles.length} {t('of', 'من')} {articles.length} {t('articles', 'مقال')}
          </p>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-4">
                  {t(translations.noArticlesFound.en, translations.noArticlesFound.ar)}
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
            {filteredArticles.map((article, index) => (
              <Card 
                key={article.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                {article.image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={language === 'ar' ? article.title_ar : article.title_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.created_at)}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    {language === 'ar' ? article.title_ar : article.title_en}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {truncateContent(language === 'ar' ? article.content_ar : article.content_en)}
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/articles/${article.id}`}>
                      {t('Read More', 'اقرأ المزيد')}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}