import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Upload, Star, MapPin, Anchor, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Location {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  image_url?: string;
  is_active: boolean;
}

interface Yacht {
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
  is_active: boolean;
  locations?: {
    name_en: string;
    name_ar: string;
  };
  yacht_images?: Array<{
    id: string;
    image_url: string;
    alt_text_en?: string;
    alt_text_ar?: string;
    display_order: number;
  }>;
}

interface Article {
  id: string;
  title_en: string;
  title_ar: string;
  content_en?: string;
  content_ar?: string;
  main_image_url?: string;
  is_active: boolean;
}

export const AdminPanel: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const { t } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [yachts, setYachts] = useState<Yacht[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Location form states
  const [locationForm, setLocationForm] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    image_url: ''
  });
  const [editingLocation, setEditingLocation] = useState<string | null>(null);

  // Yacht form states
  const [yachtForm, setYachtForm] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    features_en: '',
    features_ar: '',
    price: '',
    price_currency: 'USD',
    location_id: '',
    is_featured: false
  });
  const [editingYacht, setEditingYacht] = useState<string | null>(null);

  // Article form states
  const [articleForm, setArticleForm] = useState({
    title_en: '',
    title_ar: '',
    content_en: '',
    content_ar: '',
    main_image_url: ''
  });
  const [editingArticle, setEditingArticle] = useState<string | null>(null);
  const [articleImageFile, setArticleImageFile] = useState<File | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  type FetchDataType = () => Promise<void>;
  const fetchData: FetchDataType = async () => {
    try {
      const [locationsResult, yachtsResult, articlesResult] = await Promise.all([
        supabase.from('locations').select('*').order('created_at', { ascending: false }),
        supabase.from('yachts').select(`
          *,
          locations (name_en, name_ar),
          yacht_images (id, image_url, alt_text_en, alt_text_ar, display_order)
        `).order('created_at', { ascending: false }),
        supabase.from('articles').select('*').order('created_at', { ascending: false })
      ]);

      setLocations(locationsResult.data || []);
      setYachts(yachtsResult.data || []);
      setArticles(articlesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Location functions
  const handleLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLocation) {
        const { error } = await supabase
          .from('locations')
          .update(locationForm)
          .eq('id', editingLocation);
        
        if (error) throw error;
        showMessage('success', t('location-updated', 'Location updated successfully', 'تم تحديث الموقع بنجاح'));
      } else {
        const { error } = await supabase
          .from('locations')
          .insert([locationForm]);
        
        if (error) throw error;
        showMessage('success', t('location-created', 'Location created successfully', 'تم إنشاء الموقع بنجاح'));
      }
      
      resetLocationForm();
      fetchData();
    } catch (error) {
      console.error('Error saving location:', error);
      showMessage('error', t('error-saving', 'Error saving location', 'خطأ في حفظ الموقع'));
    }
  };

  const resetLocationForm = () => {
    setLocationForm({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      image_url: ''
    });
    setEditingLocation(null);
  };

  const editLocation = (location: Location) => {
    setLocationForm({
      name_en: location.name_en,
      name_ar: location.name_ar,
      description_en: location.description_en || '',
      description_ar: location.description_ar || '',
      image_url: location.image_url || ''
    });
    setEditingLocation(location.id);
  };

  const deleteLocation = async (id: string) => {
    if (!confirm(t('confirm-delete-location', 'Are you sure you want to delete this location?', 'هل أنت متأكد من حذف هذا الموقع؟'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('locations')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      showMessage('success', t('location-deleted', 'Location deleted successfully', 'تم حذف الموقع بنجاح'));
      fetchData();
    } catch (error) {
      console.error('Error deleting location:', error);
      showMessage('error', t('error-deleting', 'Error deleting location', 'خطأ في حذف الموقع'));
    }
  };

  // Yacht functions
  const handleYachtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const yachtData = {
        ...yachtForm,
        features_en: yachtForm.features_en ? yachtForm.features_en.split(',').map(f => f.trim()) : [],
        features_ar: yachtForm.features_ar ? yachtForm.features_ar.split(',').map(f => f.trim()) : [],
        price: yachtForm.price ? parseFloat(yachtForm.price) : null
      };

      let yachtId;

      if (editingYacht) {
        const { error } = await supabase
          .from('yachts')
          .update(yachtData)
          .eq('id', editingYacht);
        
        if (error) throw error;
        yachtId = editingYacht;
        showMessage('success', t('yacht-updated', 'Yacht updated successfully', 'تم تحديث اليخت بنجاح'));
      } else {
        const { data, error } = await supabase
          .from('yachts')
          .insert([yachtData])
          .select()
          .single();
        
        if (error) throw error;
        yachtId = data.id;
        showMessage('success', t('yacht-created', 'Yacht created successfully', 'تم إنشاء اليخت بنجاح'));
      }

      // Handle image uploads
      if (selectedFiles && selectedFiles.length > 0) {
        await uploadYachtImages(yachtId);
      }
      
      resetYachtForm();
      fetchData();
    } catch (error) {
      console.error('Error saving yacht:', error);
      showMessage('error', t('error-saving', 'Error saving yacht', 'خطأ في حفظ اليخت'));
    }
  };

  const uploadYachtImages = async (yachtId: string) => {
    if (!selectedFiles) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${yachtId}_${Date.now()}_${i}.${fileExt}`;
      const filePath = `yacht-images/${fileName}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from('yacht-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('yacht-images')
          .getPublicUrl(filePath);

        await supabase
          .from('yacht_images')
          .insert([{
            yacht_id: yachtId,
            image_url: urlData.publicUrl,
            display_order: i,
            alt_text_en: `${yachtForm.name_en} - Image ${i + 1}`,
            alt_text_ar: `${yachtForm.name_ar} - صورة ${i + 1}`
          }]);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setSelectedFiles(null);
  };

  const resetYachtForm = () => {
    setYachtForm({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      features_en: '',
      features_ar: '',
      price: '',
      price_currency: 'USD',
      location_id: '',
      is_featured: false
    });
    setEditingYacht(null);
  };

  const editYacht = (yacht: Yacht) => {
    setYachtForm({
      name_en: yacht.name_en,
      name_ar: yacht.name_ar,
      description_en: yacht.description_en || '',
      description_ar: yacht.description_ar || '',
      features_en: yacht.features_en?.join(', ') || '',
      features_ar: yacht.features_ar?.join(', ') || '',
      price: yacht.price?.toString() || '',
      price_currency: yacht.price_currency || 'USD',
      location_id: yacht.location_id,
      is_featured: yacht.is_featured
    });
    setEditingYacht(yacht.id);
  };

  const deleteYacht = async (id: string) => {
    if (!confirm(t('confirm-delete-yacht', 'Are you sure you want to delete this yacht?', 'هل أنت متأكد من حذف هذا اليخت؟'))) {
      return;
    }

    try {
      const { error } = await supabase
        .from('yachts')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
      showMessage('success', t('yacht-deleted', 'Yacht deleted successfully', 'تم حذف اليخت بنجاح'));
      fetchData();
    } catch (error) {
      console.error('Error deleting yacht:', error);
      showMessage('error', t('error-deleting', 'Error deleting yacht', 'خطأ في حذف اليخت'));
    }
  };

  // Article CRUD handlers
  const resetArticleForm = () => {
    setArticleForm({
      title_en: '',
      title_ar: '',
      content_en: '',
      content_ar: '',
      main_image_url: ''
    });
    setEditingArticle(null);
    setArticleImageFile(null);
  };

  const editArticle = (article: Article) => {
    setArticleForm({
      title_en: article.title_en,
      title_ar: article.title_ar,
      content_en: article.content_en || '',
      content_ar: article.content_ar || '',
      main_image_url: article.main_image_url || ''
    });
    setEditingArticle(article.id);
    setArticleImageFile(null);
  };

  const deleteArticle = async (id: string) => {
    if (!confirm(t('confirm-delete-article', 'Are you sure you want to delete this article?', 'هل أنت متأكد من حذف هذا المقال؟'))) return;
    try {
      const { error } = await supabase.from('articles').update({ is_active: false }).eq('id', id);
      if (error) throw error;
      showMessage('success', t('article-deleted', 'Article deleted successfully', 'تم حذف المقال بنجاح'));
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      showMessage('error', t('error-deleting', 'Error deleting article', 'خطأ في حذف المقال'));
    }
  };

  const handleArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let main_image_url = articleForm.main_image_url;
      // Upload image if selected
      if (articleImageFile) {
        const fileExt = articleImageFile.name.split('.').pop();
        const fileName = `article_${Date.now()}.${fileExt}`;
        const filePath = `articles/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('articles').upload(filePath, articleImageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('articles').getPublicUrl(filePath);
        main_image_url = urlData.publicUrl;
      }
      if (editingArticle) {
        const { error } = await supabase.from('articles').update({ ...articleForm, main_image_url }).eq('id', editingArticle);
        if (error) throw error;
        showMessage('success', t('article-updated', 'Article updated successfully', 'تم تحديث المقال بنجاح'));
      } else {
        const { error } = await supabase.from('articles').insert([{ ...articleForm, main_image_url }]);
        if (error) throw error;
        showMessage('success', t('article-created', 'Article created successfully', 'تم إنشاء المقال بنجاح'));
      }
      resetArticleForm();
      fetchData();
    } catch (error) {
      console.error('Error saving article:', error);
      showMessage('error', t('error-saving', 'Error saving article', 'خطأ في حفظ المقال'));
    }
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

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('loading-data', 'Loading data...', 'جاري تحميل البيانات...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            {t('admin-panel', 'Admin Panel', 'لوحة الإدارة')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('manage-content', 'Manage your yacht and location content', 'إدارة محتوى اليخوت والمواقع')}
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === 'error' ? 'border-destructive' : 'border-green-500'}`}>
            <AlertDescription className={message.type === 'error' ? 'text-destructive' : 'text-green-700'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="locations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3"> {/* changed from 2 to 3 */}
            <TabsTrigger value="locations" className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{t('locations', 'Locations', 'المواقع')}</span>
            </TabsTrigger>
            <TabsTrigger value="yachts" className="flex items-center space-x-2">
              <Anchor className="w-4 h-4" />
              <span>{t('yachts', 'Yachts', 'اليخوت')}</span>
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>{t('articles', 'Articles', 'المقالات')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            {/* Add/Edit Location Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>
                    {editingLocation 
                      ? t('edit-location', 'Edit Location', 'تعديل الموقع')
                      : t('add-location', 'Add New Location', 'إضافة موقع جديد')
                    }
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLocationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name_en">{t('name-english', 'Name (English)', 'الاسم (إنجليزي)')}</Label>
                      <Input
                        id="name_en"
                        value={locationForm.name_en}
                        onChange={(e) => setLocationForm({...locationForm, name_en: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name_ar">{t('name-arabic', 'Name (Arabic)', 'الاسم (عربي)')}</Label>
                      <Input
                        id="name_ar"
                        value={locationForm.name_ar}
                        onChange={(e) => setLocationForm({...locationForm, name_ar: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description_en">{t('description-english', 'Description (English)', 'الوصف (إنجليزي)')}</Label>
                      <Textarea
                        id="description_en"
                        value={locationForm.description_en}
                        onChange={(e) => setLocationForm({...locationForm, description_en: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_ar">{t('description-arabic', 'Description (Arabic)', 'الوصف (عربي)')}</Label>
                      <Textarea
                        id="description_ar"
                        value={locationForm.description_ar}
                        onChange={(e) => setLocationForm({...locationForm, description_ar: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="image_url">{t('image-url', 'Image URL', 'رابط الصورة')}</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={locationForm.image_url}
                      onChange={(e) => setLocationForm({...locationForm, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-ocean">
                      {editingLocation ? t('update', 'Update', 'تحديث') : t('create', 'Create', 'إنشاء')}
                    </Button>
                    {editingLocation && (
                      <Button type="button" variant="outline" onClick={resetLocationForm}>
                        {t('cancel', 'Cancel', 'إلغاء')}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Locations List */}
            <Card>
              <CardHeader>
                <CardTitle>{t('existing-locations', 'Existing Locations', 'المواقع الموجودة')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locations.filter(l => l.is_active).map((location) => (
                    <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{location.name_en} / {location.name_ar}</h3>
                        {location.description_en && (
                          <p className="text-sm text-muted-foreground mt-1">{location.description_en}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editLocation(location)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteLocation(location.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Yachts Tab */}
          <TabsContent value="yachts" className="space-y-6">
            {/* Add/Edit Yacht Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>
                    {editingYacht 
                      ? t('edit-yacht', 'Edit Yacht', 'تعديل اليخت')
                      : t('add-yacht', 'Add New Yacht', 'إضافة يخت جديد')
                    }
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleYachtSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yacht_name_en">{t('name-english', 'Name (English)', 'الاسم (إنجليزي)')}</Label>
                      <Input
                        id="yacht_name_en"
                        value={yachtForm.name_en}
                        onChange={(e) => setYachtForm({...yachtForm, name_en: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="yacht_name_ar">{t('name-arabic', 'Name (Arabic)', 'الاسم (عربي)')}</Label>
                      <Input
                        id="yacht_name_ar"
                        value={yachtForm.name_ar}
                        onChange={(e) => setYachtForm({...yachtForm, name_ar: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="yacht_description_en">{t('description-english', 'Description (English)', 'الوصف (إنجليزي)')}</Label>
                      <Textarea
                        id="yacht_description_en"
                        value={yachtForm.description_en}
                        onChange={(e) => setYachtForm({...yachtForm, description_en: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="yacht_description_ar">{t('description-arabic', 'Description (Arabic)', 'الوصف (عربي)')}</Label>
                      <Textarea
                        id="yacht_description_ar"
                        value={yachtForm.description_ar}
                        onChange={(e) => setYachtForm({...yachtForm, description_ar: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="features_en">{t('features-english', 'Features (English)', 'المميزات (إنجليزي)')}</Label>
                      <Input
                        id="features_en"
                        value={yachtForm.features_en}
                        onChange={(e) => setYachtForm({...yachtForm, features_en: e.target.value})}
                        placeholder={t('features-placeholder', 'Comma separated: WiFi, Pool, Jacuzzi', 'مفصولة بفواصل: واي فاي، مسبح، جاكوزي')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="features_ar">{t('features-arabic', 'Features (Arabic)', 'المميزات (عربي)')}</Label>
                      <Input
                        id="features_ar"
                        value={yachtForm.features_ar}
                        onChange={(e) => setYachtForm({...yachtForm, features_ar: e.target.value})}
                        placeholder={t('features-placeholder-ar', 'مفصولة بفواصل: واي فاي، مسبح، جاكوزي', 'مفصولة بفواصل: واي فاي، مسبح، جاكوزي')}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">{t('price', 'Price', 'السعر')}</Label>
                      <Input
                        id="price"
                        type="number"
                        value={yachtForm.price}
                        onChange={(e) => setYachtForm({...yachtForm, price: e.target.value})}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">{t('currency', 'Currency', 'العملة')}</Label>
                      <Select value={yachtForm.price_currency} onValueChange={(value) => setYachtForm({...yachtForm, price_currency: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="EGP">EGP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">{t('location', 'Location', 'الموقع')}</Label>
                      <Select value={yachtForm.location_id} onValueChange={(value) => setYachtForm({...yachtForm, location_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select-location', 'Select location', 'اختر الموقع')} />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.filter(l => l.is_active).map((location) => (
                            <SelectItem key={location.id} value={location.id}>
                              {location.name_en} / {location.name_ar}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={yachtForm.is_featured}
                      onChange={(e) => setYachtForm({...yachtForm, is_featured: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="is_featured">{t('featured-yacht', 'Featured Yacht', 'يخت مميز')}</Label>
                  </div>

                  <div>
                    <Label htmlFor="yacht_images">{t('yacht-images', 'Yacht Images', 'صور اليخت')}</Label>
                    <Input
                      id="yacht_images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setSelectedFiles(e.target.files)}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('images-note', 'You can select multiple images. Images will be uploaded after saving the yacht.', 'يمكنك اختيار عدة صور. سيتم رفع الصور بعد حفظ اليخت.')}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-ocean">
                      {editingYacht ? t('update', 'Update', 'تحديث') : t('create', 'Create', 'إنشاء')}
                    </Button>
                    {editingYacht && (
                      <Button type="button" variant="outline" onClick={resetYachtForm}>
                        {t('cancel', 'Cancel', 'إلغاء')}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Yachts List */}
            <Card>
              <CardHeader>
                <CardTitle>{t('existing-yachts', 'Existing Yachts', 'اليخوت الموجودة')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {yachts.filter(y => y.is_active).map((yacht) => (
                    <div key={yacht.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{yacht.name_en} / {yacht.name_ar}</h3>
                          {yacht.is_featured && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{t('featured', 'Featured', 'مميز')}</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {yacht.locations?.name_en} / {yacht.locations?.name_ar}
                        </p>
                        {yacht.price && (
                          <p className="text-sm font-medium text-secondary">
                            {yacht.price} {yacht.price_currency}
                          </p>
                        )}
                        {yacht.yacht_images && yacht.yacht_images.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            <Image className="w-4 h-4" />
                            <span className="text-xs text-muted-foreground">
                              {yacht.yacht_images.length} {t('images', 'images', 'صور')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editYacht(yacht)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteYacht(yacht.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            {/* Add/Edit Article Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>
                    {editingArticle
                      ? t('edit-article', 'Edit Article', 'تعديل المقال')
                      : t('add-article', 'Add New Article', 'إضافة مقال جديد')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleArticleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title_en">{t('title-english', 'Title (English)', 'العنوان (إنجليزي)')}</Label>
                      <Input
                        id="title_en"
                        value={articleForm.title_en}
                        onChange={e => setArticleForm({ ...articleForm, title_en: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="title_ar">{t('title-arabic', 'Title (Arabic)', 'العنوان (عربي)')}</Label>
                      <Input
                        id="title_ar"
                        value={articleForm.title_ar}
                        onChange={e => setArticleForm({ ...articleForm, title_ar: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="content_en">{t('content-english', 'Content (English)', 'المحتوى (إنجليزي)')}</Label>
                      <Textarea
                        id="content_en"
                        value={articleForm.content_en}
                        onChange={e => setArticleForm({ ...articleForm, content_en: e.target.value })}
                        rows={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="content_ar">{t('content-arabic', 'Content (Arabic)', 'المحتوى (عربي)')}</Label>
                      <Textarea
                        id="content_ar"
                        value={articleForm.content_ar}
                        onChange={e => setArticleForm({ ...articleForm, content_ar: e.target.value })}
                        rows={5}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="main_image_url">{t('main-image', 'Main Image', 'الصورة الرئيسية')}</Label>
                    <Input
                      id="main_image_url"
                      type="file"
                      accept="image/*"
                      onChange={e => setArticleImageFile(e.target.files?.[0] || null)}
                    />
                    {articleForm.main_image_url && !articleImageFile && (
                      <img src={articleForm.main_image_url} alt="Current" className="mt-2 rounded w-32 h-20 object-cover" />
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="bg-gradient-ocean">
                      {editingArticle ? t('update', 'Update', 'تحديث') : t('create', 'Create', 'إنشاء')}
                    </Button>
                    {editingArticle && (
                      <Button type="button" variant="outline" onClick={resetArticleForm}>
                        {t('cancel', 'Cancel', 'إلغاء')}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
            {/* Articles List */}
            <Card>
              <CardHeader>
                <CardTitle>{t('existing-articles', 'Existing Articles', 'المقالات الموجودة')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.filter(a => a.is_active !== false).map(article => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{article.title_en} / {article.title_ar}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.content_en}</p>
                        {article.main_image_url && (
                          <img src={article.main_image_url} alt="" className="mt-2 rounded w-24 h-16 object-cover" />
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => editArticle(article)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deleteArticle(article.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};