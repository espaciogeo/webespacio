export type MediaRef = { name: string; w: number; h: number; dir?: string };

export type Block =
  | { t: 'heading'; level: number; text: string }
  | { t: 'text'; html: string }
  | { t: 'button'; text: string; href: string }
  | { t: 'image'; src: MediaRef; alt?: string; href?: string }
  | { t: 'video'; provider: 'youtube' | 'vimeo' | 'file'; id: string }
  | { t: 'form'; name: string; fields: { label: string; type: string; required: boolean; id: string; options: string[] }[]; submit: string; actions: string[]; formId: string; postId: string; redirect: string }
  | { t: 'testimonial'; text: string; name: string; role?: string; img?: MediaRef | null }
  | { t: 'accordion'; items: { title: string; html: string }[] }
  | { t: 'list'; items: { text: string; href?: string }[] }
  | { t: 'card'; title: string; html: string; img?: MediaRef | null; href?: string }
  | { t: 'counter'; value: string; label: string }
  | { t: 'price'; items: { title: string; price: string; text: string }[] }
  | { t: 'gallery'; images: MediaRef[] }
  | { t: 'map'; src: string }
  // bloques de las páginas traídas de GoHighLevel / PDF
  | { t: 'embed'; src: string; title: string; height: number; id?: string; options?: { id: string; label: string; src: string; note?: string }[] }
  | { t: 'calculator' }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'stats'; items: { value: string; label: string }[] }
  | { t: 'steps'; items: { title: string; text: string; tag?: string }[] }
  | { t: 'compare'; cols: { id: string; name: string; highlight?: boolean }[]; groups: { title: string; rows: { label: string; cells: (string | boolean | string[])[] }[] }[]; ctas: { text: string; href: string }[][]; note?: string; currency?: string }
  | { t: 'plans'; regions: { id: string; name: string; plans: { id: string; name: string; price: string; per?: string; badge?: string; lead?: string; includes: string[]; note?: string; cta: { text: string; href: string } }[] }[] }
  | { t: 'tickets'; items: { img?: MediaRef | null; kicker: string; title: string; text: string; before?: string; price: string; items: string[]; cta: { text: string; href: string }; note?: string }[] }
  | { t: 'bookbuy'; ar: { title: string; pack: string; price: string; href: string; note: string; disclaimer: string }; stores: { intro: string; items: { name: string; text: string; href: string; cta: string }[]; notes: string[] }; world: { intro: string; countries: { name: string; region: string; href: string }[]; note: string } };

export type PageKind = 'institucional' | 'legal' | 'producto' | 'confirmacion';
export type Fact = { label: string; value: string };
export type PageData = {
  id: string; slug: string; path: string; kind: PageKind; title: string; date: string; modified: string;
  seo: { title: string; description: string }; noindex: boolean; sections: { blocks: Block[]; title?: string; kicker?: string; id?: string; tone?: 'dark' | 'soft' }[];
  // opcionales de las páginas de formaciones/eBooks
  hero?: { kicker?: string; lede?: string; image?: MediaRef | null; facts?: Fact[]; trazo?: string };
  cta?: { text: string; href: string };
  faq?: { title: string; html: string }[];
  faqNote?: string;
  breadcrumb?: { label: string; href: string }[];
  source?: string;
};

// Índices editoriales (/formaciones/, /ebooks/)
export type CollectionItem = {
  path: string; title: string; kicker: string; text?: string; facts: Fact[]; cta: string; image?: MediaRef | null; size?: 'xl' | 'l' | 'm' | 's'; status?: string;
};
export type CollectionData = { kicker: string; title: string; lede: string; trazo: string; groups: { title: string; text?: string; items: CollectionItem[] }[]; band?: { title: string; text: string; links: { text: string; href: string }[] } };

export type Author = { slug: string; name: string };
export type PostCard = {
  kind: 'wp' | 'news'; number?: number;
  slug: string; path: string; title: string; date: string; excerpt: string;
  authors: Author[]; categories: { slug: string; name: string }[]; image: MediaRef | null; readingMinutes: number;
};
export type TocItem = { id: string; text: string; level: number };

export type Head = { title: string; description: string; canonical: string; image: string; noindex: boolean; type: string; jsonld?: Record<string, unknown> };

export type RouteData = { head: Head } & (
  | { type: 'home' }
  | { type: 'clase' }
  | { type: '404' }
  | { type: 'page'; page: PageData }
  | { type: 'collection'; collection: CollectionData }
  | { type: 'archive'; kicker: string; title: string; description: string; page: number; pages: number; basePath: string; posts: PostCard[]; categories: { slug: string; name: string; count: number }[]; active?: string; author?: string }
  | { type: 'post'; post: PostCard & { html: string; toc: TocItem[]; modified: string; subtitle?: string; aboutBook?: boolean; substackUrl?: string }; related: PostCard[]; prev?: PostCard | null; next?: PostCard | null }
);
