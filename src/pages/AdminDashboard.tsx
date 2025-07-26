import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation, translations } from '../lib/translations'
import { supabase, Yacht, Location, Article } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Anchor, 
  MapPin, 
  FileText,
  Users,
  Settings
} from 'lucide-react'
import { YachtForm } from '../components/admin/YachtForm'
import { LocationForm } from '../components/admin/LocationForm'
import { ArticleForm } from '../components/admin/ArticleForm'

interface AdminDashboardProps {
  onLogout: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [yachts, setYachts] = useState<Yacht[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('yachts')
  const [showYachtForm, setShowYachtForm] = useState(false)
  const [showLocationForm, setShowLocationForm] = useState(false)
  const [showArticleForm, setShowArticleForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [yachtsData, locationsData, articlesData] = await Promise.all([
        supabase.from('yachts').select('*, location:locations(*)').order('created_at', { ascending: false }),
        supabase.from('locations').select('*').order('name_en', { ascending: true }),
        supabase.from('articles').select('*').order('created_at', { ascending: false })
      ])

      setYachts(yachtsData.data || [])
      setLocations(locationsData.data || [])
      setArticles(articlesData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (type: 'yacht' | 'location' | 'article', id: string) => {
    if (!confirm(t('Are you sure you want to delete this item?', 'هل أنت متأكد من حذف هذا العنصر؟'))) {
      return
    }

    try {
      const { error } = await supabase
        .from(type === 'yacht' ? 'yachts' : type === 'location' ? 'locations' : 'articles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting item:', error)
        return
      }

      // Refresh data
      fetchData()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleEdit = (type: 'yacht' | 'location' | 'article', item: any) => {
    setEditingItem(item)
    if (type === 'yacht') setShowYachtForm(true)
    else if (type === 'location') setShowLocationForm(true)
    else setShowArticleForm(true)
  }

  const handleFormClose = () => {
    setShowYachtForm(false)
    setShowLocationForm(false)
    setShowArticleForm(false)
    setEditingItem(null)
    fetchData()
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {t(translations.dashboard.en, translations.dashboard.ar)}
            </h1>
            <p className="text-muted-foreground">
              {t('Manage your yacht booking platform', 'إدارة منصة حجز اليخوت')}
            </p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t(translations.logout.en, translations.logout.ar)}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(translations.yachts.en, translations.yachts.ar)}
              </CardTitle>
              <Anchor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{yachts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(translations.locations.en, translations.locations.ar)}
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{locations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t(translations.articles.en, translations.articles.ar)}
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="yachts">
              <Anchor className="h-4 w-4 mr-2" />
              {t(translations.yachts.en, translations.yachts.ar)}
            </TabsTrigger>
            <TabsTrigger value="locations">
              <MapPin className="h-4 w-4 mr-2" />
              {t(translations.locations.en, translations.locations.ar)}
            </TabsTrigger>
            <TabsTrigger value="articles">
              <FileText className="h-4 w-4 mr-2" />
              {t(translations.articles.en, translations.articles.ar)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yachts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t(translations.yachts.en, translations.yachts.ar)}</h2>
              <Button onClick={() => setShowYachtForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t(translations.add.en, translations.add.ar)}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {yachts.map((yacht) => (
                <Card key={yacht.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ar' ? yacht.name_ar : yacht.name_en}
                    </CardTitle>
                    {yacht.location && (
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? yacht.location.name_ar : yacht.location.name_en}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit('yacht', yacht)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t(translations.edit.en, translations.edit.ar)}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('yacht', yacht.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t(translations.delete.en, translations.delete.ar)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t(translations.locations.en, translations.locations.ar)}</h2>
              <Button onClick={() => setShowLocationForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t(translations.add.en, translations.add.ar)}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location) => (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ar' ? location.name_ar : location.name_en}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar' ? location.description_ar : location.description_en}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit('location', location)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t(translations.edit.en, translations.edit.ar)}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('location', location.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t(translations.delete.en, translations.delete.ar)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t(translations.articles.en, translations.articles.ar)}</h2>
              <Button onClick={() => setShowArticleForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t(translations.add.en, translations.add.ar)}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {language === 'ar' ? article.title_ar : article.title_en}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {language === 'ar' ? article.content_ar : article.content_en}
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEdit('article', article)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t(translations.edit.en, translations.edit.ar)}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete('article', article.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {t(translations.delete.en, translations.delete.ar)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Forms */}
        {showYachtForm && (
          <YachtForm 
            yacht={editingItem} 
            locations={locations}
            onClose={handleFormClose} 
          />
        )}
        {showLocationForm && (
          <LocationForm 
            location={editingItem} 
            onClose={handleFormClose} 
          />
        )}
        {showArticleForm && (
          <ArticleForm 
            article={editingItem} 
            onClose={handleFormClose} 
          />
        )}
      </div>
    </div>
  )
}