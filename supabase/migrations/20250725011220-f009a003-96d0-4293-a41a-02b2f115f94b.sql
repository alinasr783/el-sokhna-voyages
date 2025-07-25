-- إضافة صور تجريبية لليخوت
-- سنحتاج لمعرفات اليخوت أولاً، لذا سنحصل عليها من الاستعلام السابق

-- صور Luxury Princess
INSERT INTO public.yacht_images (yacht_id, image_url, alt_text_en, alt_text_ar, display_order) VALUES
((SELECT id FROM yachts WHERE name_en = 'Luxury Princess' LIMIT 1), 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Luxury Princess Yacht - Main View', 'الأميرة الفاخرة - المنظر الرئيسي', 0),
((SELECT id FROM yachts WHERE name_en = 'Luxury Princess' LIMIT 1), 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Luxury Princess Yacht - Interior', 'الأميرة الفاخرة - الداخل', 1),

-- صور Ocean Explorer
((SELECT id FROM yachts WHERE name_en = 'Ocean Explorer' LIMIT 1), 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Ocean Explorer Yacht - Sailing', 'مكتشف المحيط - الإبحار', 0),
((SELECT id FROM yachts WHERE name_en = 'Ocean Explorer' LIMIT 1), 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Ocean Explorer Yacht - Deck', 'مكتشف المحيط - السطح', 1),

-- صور Red Sea Dream
((SELECT id FROM yachts WHERE name_en = 'Red Sea Dream' LIMIT 1), 'https://images.unsplash.com/photo-1593643123811-b0ceebf1df7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Red Sea Dream Yacht - Sunset', 'حلم البحر الأحمر - غروب الشمس', 0),
((SELECT id FROM yachts WHERE name_en = 'Red Sea Dream' LIMIT 1), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Red Sea Dream Yacht - Marina', 'حلم البحر الأحمر - المارينا', 1),

-- صور Sunset Paradise
((SELECT id FROM yachts WHERE name_en = 'Sunset Paradise' LIMIT 1), 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Sunset Paradise Yacht', 'جنة غروب الشمس', 0),

-- صور Coral Reef Explorer
((SELECT id FROM yachts WHERE name_en = 'Coral Reef Explorer' LIMIT 1), 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Coral Reef Explorer - Diving Ready', 'مكتشف الشعاب المرجانية - جاهز للغوص', 0),
((SELECT id FROM yachts WHERE name_en = 'Coral Reef Explorer' LIMIT 1), 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Coral Reef Explorer - Equipment', 'مكتشف الشعاب المرجانية - المعدات', 1),

-- صور Desert Wind
((SELECT id FROM yachts WHERE name_en = 'Desert Wind' LIMIT 1), 'https://images.unsplash.com/photo-1539650116574-75c0c6d73a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Desert Wind Yacht - Traditional Style', 'رياح الصحراء - الطراز التقليدي', 0),

-- صور Mediterranean Jewel
((SELECT id FROM yachts WHERE name_en = 'Mediterranean Jewel' LIMIT 1), 'https://images.unsplash.com/photo-1564053489984-317bbd824340?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Mediterranean Jewel - Luxury', 'جوهرة البحر المتوسط - الفخامة', 0),
((SELECT id FROM yachts WHERE name_en = 'Mediterranean Jewel' LIMIT 1), 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Mediterranean Jewel - Pool Area', 'جوهرة البحر المتوسط - منطقة المسبح', 1),

-- صور Coastal Breeze
((SELECT id FROM yachts WHERE name_en = 'Coastal Breeze' LIMIT 1), 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Coastal Breeze - Family Friendly', 'نسيم الساحل - مناسب للعائلة', 0);