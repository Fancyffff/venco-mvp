export type Locale = 'zh' | 'en';

export function getLocale(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

/** Swap the unprefixed Traditional Chinese route ↔ /en/... */
export function switchLocalePath(pathname: string, to: Locale): string {
  const path = pathname.split('?')[0].split('#')[0];
  let rest = path === '/en' || path.startsWith('/en/')
    ? path.replace(/^\/en\/?/, '')
    : path;
  rest = rest.replace(/^\/+|\/+$/g, '');
  if (to === 'en') return rest ? `/en/${rest}/` : '/en/';
  return rest ? `/${rest}/` : '/';
}

export function localePath(locale: Locale, path = ''): string {
  const rest = path.replace(/^\/+/, '').replace(/\/+$/, '');
  if (locale === 'en') return rest ? `/en/${rest}/` : '/en/';
  return rest ? `/${rest}/` : '/';
}

const uiZh = {
  home: '首頁',
  services: '兒科服務',
  doctors: '醫生團隊',
  education: '兒科教育',
  about: '關於榛怡',
  contactNav: '聯絡我們',
  clinicEnv: '診所環境',
  documents: '文件專區',
  browseFiles: '瀏覽文件',
  downloadFile: '下載',
  noFilesYet: '文件即將上載，請稍後再查看。',
  search: '搜尋',
  bookWhatsapp: 'WhatsApp 預約',
  langLabel: '繁體中文',
  langOther: 'English',
  langSwitch: '語言切換',
  openMenu: '打開選單',
  closeMenu: '關閉',
  serviceCategories: '服務分類',
  serviceItems: '服務細項 / 相關醫生',
  viewSpecialty: '查看專科',
  relatedDoctors: '相關醫生',
  noItemsWithDoctors: '此專科暫無細項列表，可直接預約相關醫生。',
  deptCategories: '科室分類',
  deptMembers: '科室成員',
  viewDept: '查看科室',
  eduTopics: '主題分類',
  eduArticles: '分類文章',
  viewAll: '查看全部',
  quickLinks: '快速鏈接',
  contactUs: '聯絡我們',
  hours: '營業時間',
  address: '診所地址',
  contactCta: '馬上聯絡我們',
  contactCtaLead: '我們的團隊隨時準備為您提供幫助',
  wechatQr: '請用微信掃碼關注',
  terms: '服務條款',
  privacy: '用戶隱私',
  learnMore: '了解更多',
  viewAllServices: '查看全部兒科服務 →',
  viewAllDoctors: '查看全部科室 →',
  viewAllEducation: '查看全部兒科教育 →',
  homeHeadline: '全面守護兒童成長',
  servicesHeadline: '全面的兒科服務',
  servicesLead: '專業兒科服務，守護孩子健康成長',
  doctorsHeadline: '專業的醫生團隊',
  doctorsLead: '由經驗豐富的兒科醫生及專科團隊悉心照顧',
  educationHeadline: '豐富的兒科教育',
  educationLead: '分享實用兒童健康知識，陪伴家長安心育兒',
  bookThisService: 'WhatsApp 預約此服務',
  backToSpecialty: '返回專科',
  howToBook: '如何預約',
  belonging: '所屬專科',
  otherItems: '同專科其他細項',
  relatedEducation: '相關兒科教育',
  specialtyIntro: '專科介紹',
  itemsCount: (n: number) => `${n} 個服務細項`,
  doctorsCount: (n: number) => `${n} 位相關醫生`,
  siteDesc: '榛怡醫務中心兒科專科，專注兒童健康診療。',
};

const uiEn = {
  home: 'Home',
  services: 'Pediatric Services',
  doctors: 'Doctors',
  education: 'Pediatric Education',
  about: 'About Venco',
  contactNav: 'Contact Us',
  clinicEnv: 'Clinic environment',
  documents: 'Documents',
  browseFiles: 'Browse files',
  downloadFile: 'Download',
  noFilesYet: 'Documents will be uploaded soon.',
  search: 'Search',
  bookWhatsapp: 'Book via WhatsApp',
  langLabel: 'English',
  langOther: '繁體中文',
  langSwitch: 'Language',
  openMenu: 'Open menu',
  closeMenu: 'Close',
  serviceCategories: 'Service categories',
  serviceItems: 'Service items / doctors',
  viewSpecialty: 'View specialty',
  relatedDoctors: 'Related doctors',
  noItemsWithDoctors: 'No item list yet — you can book a related doctor directly.',
  deptCategories: 'Departments',
  deptMembers: 'Team members',
  viewDept: 'View department',
  eduTopics: 'Topics',
  eduArticles: 'Articles',
  viewAll: 'View all',
  quickLinks: 'Quick links',
  contactUs: 'Contact',
  hours: 'Opening hours',
  address: 'Clinic address',
  contactCta: 'Contact us now',
  contactCtaLead: 'Our team is ready to help',
  wechatQr: 'Scan with WeChat to follow',
  terms: 'Terms of service',
  privacy: 'Privacy',
  learnMore: 'Learn more',
  viewAllServices: 'View all pediatric services →',
  viewAllDoctors: 'View all departments →',
  viewAllEducation: 'View all education →',
  homeHeadline: 'Comprehensive care for growing children',
  servicesHeadline: 'Comprehensive Pediatric Services',
  servicesLead: 'Specialist pediatric care for children’s healthy growth',
  doctorsHeadline: 'Our medical team',
  doctorsLead: 'Experienced paediatricians and specialist clinicians',
  educationHeadline: 'Pediatric Education',
  educationLead: 'Practical health knowledge for parents',
  bookThisService: 'Book this service on WhatsApp',
  backToSpecialty: 'Back to specialty',
  howToBook: 'How to book',
  belonging: 'Specialty',
  otherItems: 'Other items in this specialty',
  relatedEducation: 'Related education',
  specialtyIntro: 'Specialty overview',
  itemsCount: (n: number) => `${n} service items`,
  doctorsCount: (n: number) => `${n} related doctors`,
  siteDesc: 'Venco Medical Centre — specialist paediatric care for children.',
};

export type UiStrings = typeof uiZh;

export function t(locale: Locale): UiStrings {
  return locale === 'en' ? uiEn : uiZh;
}

/** English labels aligned with the live venco.com.hk/en site. */
export const serviceCopyEn: Record<string, { title: string; desc: string }> = {
  general: { title: 'General Paediatrics', desc: 'Care for common childhood illnesses.' },
  vaccine: { title: 'Vaccinations', desc: 'Vaccination planning and follow-up.' },
  respiratory: { title: 'Respiratory Care', desc: 'Care for cough, asthma, and breathing issues.' },
  endocrine: { title: 'Endocrinology', desc: 'Growth, puberty, and hormone assessment.' },
  allergy: { title: 'Allergy Care', desc: 'Allergy testing, treatment, and follow-up.' },
  surgery: { title: 'Surgery', desc: 'Pediatric surgical consultation.' },
  genetics: { title: 'Clinical Genetics', desc: 'Genetic assessment and family counselling.' },
  telemedicine: { title: 'Telemedicine', desc: 'Remote consultation and follow-up.' },
  neuro: { title: 'Neurology', desc: 'Care for children’s neurological concerns.' },
  psychology: { title: 'Child Psychology', desc: 'Child emotional and developmental support.' },
  nephrology: { title: 'Paediatric Nephrology', desc: 'Assessment and follow-up for children’s kidney and urinary concerns.' },
};

export const categoryCopyEn: Record<string, { title: string; desc: string }> = {
  'clinical-genetics': { title: 'Clinical Genetics', desc: 'Genetic assessment and related paediatric topics.' },
  paediatrics: { title: 'Paediatrics', desc: 'Common childhood health topics.' },
  'child-growth': { title: 'Child Growth', desc: 'Growth, development, and metabolic health.' },
  'paediatric-surgery': { title: 'Paediatric Surgery', desc: 'Surgical care topics for children.' },
  psychology: { title: 'Psychology', desc: 'Emotional and behavioural support.' },
  'covid-19': { title: 'COVID-19', desc: 'COVID-related paediatric guidance.' },
  flu: { title: 'Influenza', desc: 'Flu prevention and care for children.' },
  shingles: { title: 'Shingles', desc: 'Shingles awareness and care.' },
  'sleep-apnea': { title: 'Sleep Apnea', desc: 'Sleep and breathing concerns.' },
  gastroenteritis: { title: 'Gastroenteritis', desc: 'Stomach and digestive health.' },
  'allergic-rhinitis': { title: 'Allergic Rhinitis', desc: 'Nasal allergy care for children.' },
};

export const deptTitleEn: Record<string, string> = {
  general: 'General Paediatrics',
  respiratory: 'Respiratory',
  endocrine: 'Endocrinology',
  genetics: 'Clinical Genetics',
  surgery: 'Paediatric Surgery',
  neuro: 'Neurology',
  obstetrics: 'Obstetrics & Gynaecology',
  psychology: 'Child Psychology',
};

export function serviceTitle(locale: Locale, id: string, fallback: string) {
  if (locale === 'en') return serviceCopyEn[id]?.title || fallback;
  return fallback;
}

export function serviceDesc(locale: Locale, id: string, fallback: string) {
  if (locale === 'en') return serviceCopyEn[id]?.desc || fallback;
  return fallback;
}
