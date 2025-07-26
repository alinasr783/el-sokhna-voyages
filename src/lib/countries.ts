export interface Program {
  en: string;
  ar: string;
}

export interface University {
  en: string;
  ar: string;
  programs: Program[];
}

export interface Country {
  code: string;
  en: string;
  ar: string;
  description_en: string;
  description_ar: string;
  universities: University[];
}

export const countries: Country[] = [
  {
    code: 'EG',
    en: 'Egypt',
    ar: 'مصر',
    description_en: 'A leading destination for higher education in the Arab world.',
    description_ar: 'وجهة رائدة للتعليم العالي في العالم العربي.',
    universities: [
      {
        en: 'Cairo University',
        ar: 'جامعة القاهرة',
        programs: [
          { en: 'Medicine', ar: 'الطب' },
          { en: 'Engineering', ar: 'الهندسة' },
          { en: 'Pharmacy', ar: 'الصيدلة' },
        ],
      },
      {
        en: 'Ain Shams University',
        ar: 'جامعة عين شمس',
        programs: [
          { en: 'Dentistry', ar: 'طب الأسنان' },
          { en: 'Business', ar: 'إدارة الأعمال' },
        ],
      },
    ],
  },
  {
    code: 'SA',
    en: 'Saudi Arabia',
    ar: 'السعودية',
    description_en: 'Modern universities and top programs in the Gulf region.',
    description_ar: 'جامعات حديثة وبرامج متميزة في الخليج.',
    universities: [
      {
        en: 'King Saud University',
        ar: 'جامعة الملك سعود',
        programs: [
          { en: 'Computer Science', ar: 'علوم الحاسب' },
          { en: 'Law', ar: 'القانون' },
        ],
      },
      {
        en: 'King Abdulaziz University',
        ar: 'جامعة الملك عبدالعزيز',
        programs: [
          { en: 'Medicine', ar: 'الطب' },
          { en: 'Engineering', ar: 'الهندسة' },
        ],
      },
    ],
  },
  {
    code: 'TR',
    en: 'Turkey',
    ar: 'تركيا',
    description_en: 'A bridge between East and West with diverse study options.',
    description_ar: 'جسر بين الشرق والغرب مع خيارات دراسية متنوعة.',
    universities: [
      {
        en: 'Istanbul University',
        ar: 'جامعة اسطنبول',
        programs: [
          { en: 'Architecture', ar: 'الهندسة المعمارية' },
          { en: 'International Relations', ar: 'العلاقات الدولية' },
        ],
      },
      {
        en: 'Middle East Technical University',
        ar: 'جامعة الشرق الأوسط التقنية',
        programs: [
          { en: 'Engineering', ar: 'الهندسة' },
          { en: 'Economics', ar: 'الاقتصاد' },
        ],
      },
    ],
  },
  {
    code: 'DE',
    en: 'Germany',
    ar: 'ألمانيا',
    description_en: 'World-class education and research opportunities.',
    description_ar: 'تعليم وبحث علمي على مستوى عالمي.',
    universities: [
      {
        en: 'Technical University of Munich',
        ar: 'جامعة ميونخ التقنية',
        programs: [
          { en: 'Engineering', ar: 'الهندسة' },
          { en: 'Computer Science', ar: 'علوم الحاسب' },
        ],
      },
      {
        en: 'Heidelberg University',
        ar: 'جامعة هايدلبرغ',
        programs: [
          { en: 'Medicine', ar: 'الطب' },
          { en: 'Biology', ar: 'الأحياء' },
        ],
      },
    ],
  },
  // أضف المزيد من الدول حسب الحاجة
];