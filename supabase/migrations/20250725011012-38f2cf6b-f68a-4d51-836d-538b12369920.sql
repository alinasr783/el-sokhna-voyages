-- إضافة بيانات تجريبية للمواقع
INSERT INTO public.locations (name_en, name_ar, description_en, description_ar, image_url) VALUES
(
  'El Gouna',
  'الجونة',
  'A stunning Red Sea resort town with pristine beaches and luxury marina facilities. Perfect for yacht adventures with crystal clear waters.',
  'مدينة منتجع رائعة على البحر الأحمر مع شواطئ نظيفة ومرافق مارينا فاخرة. مثالية لمغامرات اليخوت مع المياه الصافية.',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
),
(
  'Ain Sokhna',
  'العين السخنة',
  'The closest beach destination to Cairo, featuring beautiful resorts and excellent yacht facilities along the Red Sea coast.',
  'أقرب وجهة شاطئية إلى القاهرة، تتميز بمنتجعات جميلة ومرافق يخوت ممتازة على ساحل البحر الأحمر.',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
),
(
  'Hurghada',
  'الغردقة',
  'A world-renowned diving destination with vibrant coral reefs and excellent yacht charter services on the Red Sea.',
  'وجهة غوص مشهورة عالمياً مع الشعاب المرجانية النابضة بالحياة وخدمات تأجير اليخوت الممتازة على البحر الأحمر.',
  'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
),
(
  'Marina',
  'المارينا',
  'North Coast luxury marina with pristine Mediterranean beaches and world-class yacht facilities.',
  'مارينا فاخرة في الساحل الشمالي مع شواطئ البحر الأبيض المتوسط النظيفة ومرافق يخوت عالمية المستوى.',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
);

-- الحصول على معرفات المواقع للاستخدام في إدراج اليخوت
-- سنحتاج لاستخدام المعرفات الفعلية بعد الإدراج