-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for languages
CREATE TYPE language_enum AS ENUM ('en', 'ar');

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    coordinates POINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yachts table
CREATE TABLE yachts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    features_en TEXT[],
    features_ar TEXT[],
    price DECIMAL(10,2) NOT NULL,
    location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
    contact_whatsapp TEXT DEFAULT '01158954215',
    contact_phone TEXT DEFAULT '01158954215',
    contact_email TEXT DEFAULT 'alinasreldin783@gmail.com',
    google_maps_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yacht_images table
CREATE TABLE yacht_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    yacht_id UUID REFERENCES yachts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_path TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    image_url TEXT,
    image_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin table (single admin only)
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the single admin user
INSERT INTO admin (email, password) VALUES ('alinasreldin783@gmail.com', 'Alinasr89#');

-- Create indexes for better performance
CREATE INDEX idx_yachts_location_id ON yachts(location_id);
CREATE INDEX idx_yacht_images_yacht_id ON yacht_images(yacht_id);
CREATE INDEX idx_yacht_images_order ON yacht_images(yacht_id, order_index);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_yachts_updated_at BEFORE UPDATE ON yachts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE yachts ENABLE ROW LEVEL SECURITY;
ALTER TABLE yacht_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for locations" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read access for yachts" ON yachts FOR SELECT USING (true);
CREATE POLICY "Public read access for yacht_images" ON yacht_images FOR SELECT USING (true);
CREATE POLICY "Public read access for articles" ON articles FOR SELECT USING (true);

-- Create policies for admin full access
CREATE POLICY "Admin full access for locations" ON locations FOR ALL USING (true);
CREATE POLICY "Admin full access for yachts" ON yachts FOR ALL USING (true);
CREATE POLICY "Admin full access for yacht_images" ON yacht_images FOR ALL USING (true);
CREATE POLICY "Admin full access for articles" ON articles FOR ALL USING (true);
CREATE POLICY "Admin full access for admin" ON admin FOR ALL USING (true);