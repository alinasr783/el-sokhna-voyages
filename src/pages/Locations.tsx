import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../lib/translations'
import { countries } from '../lib/countries'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Search, GraduationCap, School, BookOpen } from 'lucide-react'

export const Locations: React.FC = () => {
  const { language, isRTL } = useLanguage()
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCountries = countries.filter(country => {
    return (
      country.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.ar.includes(searchTerm) ||
      country.description_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.description_ar.includes(searchTerm) ||
      country.universities.some(u =>
        u.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ar.includes(searchTerm) ||
        u.programs.some(p =>
          p.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.ar.includes(searchTerm)
        )
      )
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {language === 'ar' ? 'أفضل الوجهات الدراسية' : 'Top Study Destinations'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar'
              ? 'استكشف أفضل الدول للدراسة وأشهر الجامعات والبرامج لكل وجهة.'
              : 'Explore the best countries for study, top universities, and programs in each destination.'}
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={language === 'ar' ? 'ابحث عن دولة أو جامعة أو برنامج...' : 'Search for a country, university, or program...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-muted-foreground">
            {language === 'ar'
              ? `عرض ${filteredCountries.length} من ${countries.length} وجهة`
              : `Showing ${filteredCountries.length} of ${countries.length} destinations`}
          </p>
        </div>

        {/* Countries Grid */}
        {filteredCountries.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg mb-4 text-muted-foreground">
              {language === 'ar' ? 'لا توجد وجهات مطابقة للبحث.' : 'No destinations found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCountries.map((country) => (
              <Card key={country.code} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">
                      {language === 'ar' ? country.ar : country.en}
                    </CardTitle>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {language === 'ar' ? country.description_ar : country.description_en}
                  </p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-base mb-2 flex items-center gap-1">
                      <School className="h-4 w-4 text-primary" />
                      {language === 'ar' ? 'أشهر الجامعات' : 'Top Universities'}
                    </h3>
                    <ul className="space-y-2">
                      {country.universities.map((uni, idx) => (
                        <li key={idx} className="bg-gray-100 rounded p-2">
                          <div className="font-medium">
                            {language === 'ar' ? uni.ar : uni.en}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            <BookOpen className="inline h-3 w-3 mr-1 text-primary align-text-bottom" />
                            {language === 'ar' ? 'أفضل البرامج:' : 'Top Programs:'}
                            <span className="ml-1">
                              {uni.programs.map(p => language === 'ar' ? p.ar : p.en).join('، ')}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}