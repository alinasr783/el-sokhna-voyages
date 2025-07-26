# ELSOKHNA - Yacht Booking Platform

A modern, luxurious yacht booking platform with full Arabic and English support, built with React, TypeScript, and Supabase.

## 🌟 Features

### Public Website
- **Multilingual Support**: Full Arabic (RTL) and English (LTR) support
- **Home Page**: Showcases available yachts and locations
- **Yacht Listings**: Browse and search yachts with filtering options
- **Yacht Details**: Comprehensive yacht information with image galleries
- **Location Pages**: Explore different yacht locations
- **Articles**: Blog-style articles with search functionality
- **Contact Integration**: Direct WhatsApp, phone, and email contact
- **Google Maps Integration**: Direct links to yacht locations

### Admin Panel
- **Single Admin Access**: Secure admin login system
- **Yacht Management**: Add, edit, delete yachts with multiple images
- **Location Management**: Manage yacht locations
- **Article Management**: Create and manage blog articles
- **Image Upload**: Supabase Storage integration for yacht and article images

### Technical Features
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Built with shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Real-time Data**: Supabase real-time database
- **Image Storage**: Supabase Storage for media files
- **SEO Optimized**: Proper meta tags and structure

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or bun
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd elsokhna-yacht-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migration from `supabase/migrations/001_initial_schema.sql`
   - Create storage buckets:
     - `yacht-images` for yacht photos
     - `article-images` for article images
   - Set storage policies for public read access

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

6. **Access the application**
   - Public site: http://localhost:5173
   - Admin access: Click "Are you the admin?" in the header
   - Admin credentials:
     - Email: alinasreldin783@gmail.com
     - Password: Alinasr89#

## 🗄️ Database Schema

The application uses the following Supabase tables:

### Locations
- `id` (UUID, Primary Key)
- `name_en` (Text)
- `name_ar` (Text)
- `description_en` (Text)
- `description_ar` (Text)
- `coordinates` (Point)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Yachts
- `id` (UUID, Primary Key)
- `name_en` (Text)
- `name_ar` (Text)
- `description_en` (Text)
- `description_ar` (Text)
- `features_en` (Text Array)
- `features_ar` (Text Array)
- `price` (Decimal)
- `location_id` (UUID, Foreign Key)
- `contact_whatsapp` (Text)
- `contact_phone` (Text)
- `contact_email` (Text)
- `google_maps_link` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Yacht Images
- `id` (UUID, Primary Key)
- `yacht_id` (UUID, Foreign Key)
- `image_url` (Text)
- `image_path` (Text)
- `is_primary` (Boolean)
- `order_index` (Integer)
- `created_at` (Timestamp)

### Articles
- `id` (UUID, Primary Key)
- `title_en` (Text)
- `title_ar` (Text)
- `content_en` (Text)
- `content_ar` (Text)
- `image_url` (Text)
- `image_path` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Admin
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `password` (Text)
- `created_at` (Timestamp)

## 🎨 Customization

### Styling
The application uses Tailwind CSS with shadcn/ui components. You can customize:

- Colors: Update `tailwind.config.ts`
- Components: Modify shadcn/ui components in `src/components/ui/`
- Layout: Adjust components in `src/components/`

### Content
- **Translations**: Update `src/lib/translations.ts`
- **Contact Info**: Modify default contact details in forms
- **Branding**: Update logo and brand name in header

### Features
- **Image Upload**: Configure Supabase Storage buckets
- **Email Integration**: Add email service for contact forms
- **Analytics**: Integrate Google Analytics or similar
- **SEO**: Add meta tags and structured data

## 📱 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Other Platforms
The application can be deployed to any static hosting platform that supports:
- Static file hosting
- Environment variables
- Client-side routing

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── admin/          # Admin-specific components
├── contexts/           # React contexts
├── lib/               # Utilities and configurations
├── pages/             # Page components
└── hooks/             # Custom React hooks
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update routing in `src/App.tsx`
4. Add translations in `src/lib/translations.ts`
5. Update database schema if needed

## 🔒 Security

### Admin Access
- Single admin account with email/password
- No user registration system
- Admin credentials stored in database (consider hashing for production)

### Data Protection
- Row Level Security (RLS) enabled on all tables
- Public read access for content
- Admin full access for management
- Supabase Auth integration ready

## 📞 Support

For support and questions:
- **WhatsApp**: 01158954215
- **Phone**: 01158954215
- **Email**: alinasreldin783@gmail.com

## 📄 License

This project is proprietary software. All rights reserved.

---

**ELSOKHNA** - Luxury Yacht Booking Experience
*يخوت العين السخنة - تجربة حجز اليخوت الفاخرة*
