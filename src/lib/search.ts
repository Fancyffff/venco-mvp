import services from '../data/services.json';
import doctors from '../data/doctors.json';
import education from '../data/education.json';
import educationCategories from '../data/education-categories.json';
import type { Locale } from './i18n';
import { serviceCopyEn, categoryCopyEn, deptTitleEn, localePath } from './i18n';

export type SearchItem = {
  type: 'service' | 'service-item' | 'doctor' | 'education' | 'education-topic' | 'page';
  typeLabel: string;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
};

export function buildSearchIndex(locale: Locale = 'zh'): SearchItem[] {
  const items: SearchItem[] = [];
  const lp = (p = '') => localePath(locale, p);
  const pageLabel = locale === 'en' ? 'Page' : '頁面';

  if (locale === 'en') {
    items.push(
      { type: 'page', typeLabel: pageLabel, title: 'Home', href: lp(), keywords: 'home venco' },
      { type: 'page', typeLabel: pageLabel, title: 'Pediatric Services', href: lp('services'), keywords: 'services specialties' },
      { type: 'page', typeLabel: pageLabel, title: 'Doctors', href: lp('doctors'), keywords: 'doctors team' },
      { type: 'page', typeLabel: pageLabel, title: 'Pediatric Education', href: lp('education'), keywords: 'education articles' },
      { type: 'page', typeLabel: pageLabel, title: 'About Venco', href: lp('about'), keywords: 'about venco clinic' },
      { type: 'page', typeLabel: pageLabel, title: 'Contact Us', href: lp('contact'), keywords: 'contact address phone hours' },
      { type: 'page', typeLabel: pageLabel, title: 'Documents', href: `${lp('services')}#documents`, keywords: 'documents files download' },
    );
  } else {
    items.push(
      { type: 'page', typeLabel: pageLabel, title: '首頁', href: lp(), keywords: '首頁 榛怡' },
      { type: 'page', typeLabel: pageLabel, title: '兒科服務', href: lp('services'), keywords: '兒科服務 專科' },
      { type: 'page', typeLabel: pageLabel, title: '醫生團隊', href: lp('doctors'), keywords: '醫生團隊 科室' },
      { type: 'page', typeLabel: pageLabel, title: '兒科教育', href: lp('education'), keywords: '兒科教育 文章' },
      { type: 'page', typeLabel: pageLabel, title: '關於榛怡', href: lp('about'), keywords: '關於榛怡 診所環境' },
      { type: 'page', typeLabel: pageLabel, title: '聯絡我們', href: lp('contact'), keywords: '聯絡 地址 電話 預約 工作時間' },
      { type: 'page', typeLabel: pageLabel, title: '文件專區', href: `${lp('services')}#documents`, keywords: '文件 下載 表格' },
    );
  }

  for (const s of services) {
    const title = locale === 'en' ? (serviceCopyEn[s.id]?.title || s.title) : s.title;
    const desc = locale === 'en' ? (serviceCopyEn[s.id]?.desc || s.desc) : s.desc;
    items.push({
      type: 'service',
      typeLabel: locale === 'en' ? 'Specialty' : '專科服務',
      title,
      subtitle: desc,
      href: lp(`services/${s.id}`),
      keywords: `${title} ${desc} ${s.title} ${s.desc} ${s.id}`,
    });
    for (const item of s.items) {
      items.push({
        type: 'service-item',
        typeLabel: locale === 'en' ? 'Service item' : '服務細項',
        title: item.text,
        subtitle: title,
        href: lp(`services/${s.id}/${item.slug}`),
        keywords: `${item.text} ${title} ${s.title}`,
      });
    }
  }

  for (const d of doctors) {
    const dept = locale === 'en' ? (deptTitleEn[d.department] || d.departmentTitle) : d.departmentTitle;
    const title = locale === 'en' ? (d.english || d.name) : d.name;
    items.push({
      type: 'doctor',
      typeLabel: locale === 'en' ? 'Doctor / team' : '醫生 / 團隊',
      title,
      subtitle: `${d.title}${dept ? ` · ${dept}` : ''}`,
      href: `${lp(`doctors/${d.department}`)}#${d.id}`,
      keywords: `${d.name} ${d.english} ${d.title} ${d.role || ''} ${d.departmentTitle} ${(d.creds || []).join(' ')}`,
    });
  }

  for (const c of educationCategories) {
    const count = education.filter((a) => a.category === c.id).length;
    if (!count) continue;
    const title = locale === 'en' ? (categoryCopyEn[c.id]?.title || c.title) : c.title;
    const desc = locale === 'en' ? (categoryCopyEn[c.id]?.desc || c.desc) : c.desc;
    items.push({
      type: 'education-topic',
      typeLabel: locale === 'en' ? 'Education topic' : '教育主題',
      title,
      subtitle: desc,
      href: lp(`education/${c.id}`),
      keywords: `${title} ${desc} ${c.title} ${c.desc}`,
    });
  }

  for (const a of education) {
    items.push({
      type: 'education',
      typeLabel: locale === 'en' ? 'Article' : '教育文章',
      title: a.title,
      subtitle: [a.categoryTitle || a.tag, a.doctorName].filter(Boolean).join(' · '),
      href: lp(`education/${a.category}/${a.slug}`),
      keywords: `${a.title} ${a.lead || ''} ${a.categoryTitle || ''} ${a.tag || ''} ${a.doctorName || ''} ${(a.body || []).slice(0, 8).join(' ')}`,
    });
  }

  return items;
}

export function searchIndex(index: SearchItem[], query: string, limit = 40): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const tokens = q.split(/\s+/).filter(Boolean);
  const scored = index
    .map((item) => {
      const hay = `${item.title} ${item.subtitle || ''} ${item.keywords}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (item.title.toLowerCase().includes(t)) score += 8;
        else if ((item.subtitle || '').toLowerCase().includes(t)) score += 4;
        else if (hay.includes(t)) score += 2;
        else return null;
      }
      if (item.title.toLowerCase().startsWith(tokens[0])) score += 3;
      return { item, score };
    })
    .filter(Boolean) as { item: SearchItem; score: number }[];

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'zh-Hant'));
  return scored.slice(0, limit).map((s) => s.item);
}
