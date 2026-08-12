import services from '../data/services.json';
import doctors from '../data/doctors.json';
import education from '../data/education.json';
import educationCategories from '../data/education-categories.json';

export type SearchItem = {
  type: 'service' | 'service-item' | 'doctor' | 'education' | 'education-topic' | 'page';
  typeLabel: string;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
};

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  items.push(
    { type: 'page', typeLabel: '頁面', title: '首頁', href: '/zh/', keywords: '首頁 榛怡' },
    { type: 'page', typeLabel: '頁面', title: '兒科服務', href: '/zh/services/', keywords: '兒科服務 專科' },
    { type: 'page', typeLabel: '頁面', title: '醫生團隊', href: '/zh/doctors/', keywords: '醫生團隊 科室' },
    { type: 'page', typeLabel: '頁面', title: '兒科教育', href: '/zh/education/', keywords: '兒科教育 文章' },
    { type: 'page', typeLabel: '頁面', title: '關於我們', href: '/zh/contact/', keywords: '關於我們 聯絡 地址 電話 營業' },
  );

  for (const s of services) {
    items.push({
      type: 'service',
      typeLabel: '專科服務',
      title: s.title,
      subtitle: s.desc,
      href: `/zh/services/${s.id}/`,
      keywords: `${s.title} ${s.desc} ${s.id}`,
    });
    for (const item of s.items) {
      items.push({
        type: 'service-item',
        typeLabel: '服務細項',
        title: item.text,
        subtitle: s.title,
        href: `/zh/services/${s.id}/${item.slug}/`,
        keywords: `${item.text} ${s.title}`,
      });
    }
  }

  for (const d of doctors) {
    items.push({
      type: 'doctor',
      typeLabel: '醫生 / 團隊',
      title: d.name,
      subtitle: `${d.title}${d.departmentTitle ? ` · ${d.departmentTitle}` : ''}`,
      href: `/zh/doctors/${d.department}/#${d.id}`,
      keywords: `${d.name} ${d.english} ${d.title} ${d.role || ''} ${d.departmentTitle} ${(d.creds || []).join(' ')}`,
    });
  }

  for (const c of educationCategories) {
    const count = education.filter((a) => a.category === c.id).length;
    if (!count) continue;
    items.push({
      type: 'education-topic',
      typeLabel: '教育主題',
      title: c.title,
      subtitle: c.desc,
      href: `/zh/education/${c.id}/`,
      keywords: `${c.title} ${c.desc}`,
    });
  }

  for (const a of education) {
    items.push({
      type: 'education',
      typeLabel: '教育文章',
      title: a.title,
      subtitle: [a.categoryTitle || a.tag, a.doctorName].filter(Boolean).join(' · '),
      href: `/zh/education/${a.category}/${a.slug}/`,
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
