-- إضافة بيانات تجريبية لليخوت
INSERT INTO public.yachts (name_en, name_ar, description_en, description_ar, features_en, features_ar, price, price_currency, location_id, is_featured) VALUES

-- يخوت في الجونة
(
  'Luxury Princess',
  'الأميرة الفاخرة',
  'A magnificent 85-foot luxury yacht featuring spacious decks, premium amenities, and elegant interior design. Perfect for sunset cruises and special occasions.',
  'يخت فاخر رائع بطول 85 قدماً يتميز بطوابق واسعة ووسائل راحة متميزة وتصميم داخلي أنيق. مثالي لرحلات غروب الشمس والمناسبات الخاصة.',
  ARRAY['Air Conditioning', 'WiFi', 'Sound System', 'Full Kitchen', 'Master Bedroom', 'Jacuzzi', 'Diving Equipment', 'Water Sports'],
  ARRAY['تكييف هواء', 'واي فاي', 'نظام صوتي', 'مطبخ كامل', 'غرفة نوم رئيسية', 'جاكوزي', 'معدات غوص', 'رياضات مائية'],
  2500,
  'USD',
  '55108324-be61-4a35-9394-f342971ad5cd',
  true
),

(
  'Ocean Explorer',
  'مكتشف المحيط',
  'Modern 65-foot yacht perfect for family adventures and diving excursions. Equipped with the latest navigation technology and safety equipment.',
  'يخت حديث بطول 65 قدماً مثالي لمغامرات العائلة ورحلات الغوص. مجهز بأحدث تقنيات الملاحة ومعدات السلامة.',
  ARRAY['Navigation System', 'Safety Equipment', 'Snorkeling Gear', 'BBQ Grill', 'Sun Deck', 'Cabin', 'Mini Bar'],
  ARRAY['نظام ملاحة', 'معدات سلامة', 'معدات غطس', 'شواية باربكيو', 'سطح شمسي', 'كابينة', 'بار صغير'],
  1800,
  'USD',
  '55108324-be61-4a35-9394-f342971ad5cd',
  false
),

-- يخوت في العين السخنة
(
  'Red Sea Dream',
  'حلم البحر الأحمر',
  'Elegant 75-foot yacht offering comfort and style for Red Sea adventures. Features panoramic windows and spacious entertainment areas.',
  'يخت أنيق بطول 75 قدماً يوفر الراحة والأناقة لمغامرات البحر الأحمر. يتميز بنوافذ بانورامية ومناطق ترفيه واسعة.',
  ARRAY['Panoramic Windows', 'Entertainment System', 'Full Bar', 'Dining Area', 'Sun Loungers', 'Water Slide', 'Fishing Equipment'],
  ARRAY['نوافذ بانورامية', 'نظام ترفيه', 'بار كامل', 'منطقة طعام', 'كراسي استلقاء', 'زحليقة مائية', 'معدات صيد'],
  2200,
  'USD',
  '31dc2074-3d7b-44a6-9bc8-775f274adda6',
  true
),

(
  'Sunset Paradise',
  'جنة غروب الشمس',
  'Beautiful 55-foot yacht ideal for romantic getaways and small group celebrations. Features cozy interiors and stunning sunset views.',
  'يخت جميل بطول 55 قدماً مثالي للهروب الرومانسي واحتفالات المجموعات الصغيرة. يتميز بديكورات داخلية مريحة ومناظر غروب شمس خلابة.',
  ARRAY['Romantic Lighting', 'Cozy Seating', 'Wine Storage', 'Sunset Deck', 'Music System', 'Kitchen'],
  ARRAY['إضاءة رومانسية', 'مقاعد مريحة', 'تخزين نبيذ', 'سطح غروب الشمس', 'نظام موسيقي', 'مطبخ'],
  1500,
  'USD',
  '31dc2074-3d7b-44a6-9bc8-775f274adda6',
  false
),

-- يخوت في الغردقة
(
  'Coral Reef Explorer',
  'مكتشف الشعاب المرجانية',
  'Specialized 70-foot diving yacht with professional equipment and experienced crew. Perfect for exploring Hurghada stunning coral reefs.',
  'يخت غوص متخصص بطول 70 قدماً مع معدات مهنية وطاقم ذو خبرة. مثالي لاستكشاف الشعاب المرجانية الخلابة في الغردقة.',
  ARRAY['Professional Diving Equipment', 'Dive Platform', 'Underwater Camera', 'Oxygen Tank Storage', 'First Aid', 'Expert Guide'],
  ARRAY['معدات غوص مهنية', 'منصة غوص', 'كاميرا تحت الماء', 'تخزين خزانات أكسجين', 'إسعافات أولية', 'مرشد خبير'],
  2800,
  'USD',
  '1b21762b-2090-4143-9c59-4f3373ac3653',
  true
),

(
  'Desert Wind',
  'رياح الصحراء',
  'Traditional 60-foot yacht with modern amenities, perfect for experiencing authentic Red Sea sailing with contemporary comfort.',
  'يخت تقليدي بطول 60 قدماً مع وسائل راحة حديثة، مثالي لتجربة الإبحار الأصيل في البحر الأحمر مع الراحة المعاصرة.',
  ARRAY['Traditional Design', 'Modern Comfort', 'Sailing Equipment', 'Deck Lounge', 'Refreshment Area'],
  ARRAY['تصميم تقليدي', 'راحة حديثة', 'معدات إبحار', 'صالة السطح', 'منطقة مرطبات'],
  1600,
  'USD',
  '1b21762b-2090-4143-9c59-4f3373ac3653',
  false
),

-- يخوت في المارينا
(
  'Mediterranean Jewel',
  'جوهرة البحر المتوسط',
  'Stunning 90-foot luxury yacht featuring world-class amenities and Mediterranean elegance. Perfect for North Coast luxury experiences.',
  'يخت فاخر مذهل بطول 90 قدماً يتميز بوسائل راحة عالمية المستوى وأناقة البحر المتوسط. مثالي لتجارب الساحل الشمالي الفاخرة.',
  ARRAY['Luxury Suites', 'Gourmet Kitchen', 'Wine Cellar', 'Spa Area', 'Pool', 'Helicopter Pad', 'Professional Crew'],
  ARRAY['أجنحة فاخرة', 'مطبخ للذواقة', 'قبو نبيذ', 'منطقة سبا', 'مسبح', 'مهبط هليكوبتر', 'طاقم مهني'],
  3500,
  'USD',
  '30c2ac26-30ab-4eaf-9790-1d46cb88390a',
  true
),

(
  'Coastal Breeze',
  'نسيم الساحل',
  'Elegant 68-foot yacht perfect for North Coast adventures with family and friends. Features comfortable accommodations and recreation areas.',
  'يخت أنيق بطول 68 قدماً مثالي لمغامرات الساحل الشمالي مع العائلة والأصدقاء. يتميز بأماكن إقامة مريحة ومناطق ترفيه.',
  ARRAY['Family Friendly', 'Recreation Areas', 'Comfortable Cabins', 'Outdoor Dining', 'Water Sports Equipment'],
  ARRAY['مناسب للعائلة', 'مناطق ترفيه', 'كابائن مريحة', 'طعام خارجي', 'معدات رياضات مائية'],
  2000,
  'USD',
  '30c2ac26-30ab-4eaf-9790-1d46cb88390a',
  false
);