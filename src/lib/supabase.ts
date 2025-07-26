import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Location {
  id: string
  name_en: string
  name_ar: string
  description_en?: string
  description_ar?: string
  coordinates?: { x: number; y: number }
  created_at: string
  updated_at: string
}

export interface Yacht {
  id: string
  name_en: string
  name_ar: string
  description_en?: string
  description_ar?: string
  features_en?: string[]
  features_ar?: string[]
  price: number
  location_id?: string
  contact_whatsapp: string
  contact_phone: string
  contact_email: string
  google_maps_link?: string
  created_at: string
  updated_at: string
  location?: Location
  images?: YachtImage[]
}

export interface YachtImage {
  id: string
  yacht_id: string
  image_url: string
  image_path: string
  is_primary: boolean
  order_index: number
  created_at: string
}

export interface Article {
  id: string
  title_en: string
  title_ar: string
  content_en: string
  content_ar: string
  image_url?: string
  image_path?: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  password: string
  created_at: string
}