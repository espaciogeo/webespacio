// Decodifica el payload __NUXT_DATA__ (formato devalue) de una página de GoHighLevel.
export function nuxtData(html: string): any {
  const m = html.match(/<script[^>]*id="__NUXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  const arr = JSON.parse(m[1]);
  const memo = new Map<number, any>();
  const hyd = (i: number): any => {
    if (typeof i !== 'number') return i;
    if (i === -1) return undefined;
    if (memo.has(i)) return memo.get(i);
    const v = arr[i];
    if (v === null || typeof v !== 'object') { memo.set(i, v); return v; }
    if (Array.isArray(v)) {
      if (typeof v[0] === 'string' && ['ShallowReactive', 'Reactive', 'Ref', 'ShallowRef', 'EmptyRef', 'EmptyShallowRef', 'NuxtError'].includes(v[0])) { const r = hyd(v[1]); memo.set(i, r); return r; }
      if (v[0] === 'Set' || v[0] === 'Map' || v[0] === 'Date') { memo.set(i, v); return v; }
      const out: any[] = []; memo.set(i, out); for (const x of v) out.push(hyd(x)); return out;
    }
    const o: any = {}; memo.set(i, o); for (const k of Object.keys(v)) o[k] = hyd(v[k]); return o;
  };
  return hyd(0);
}
// Todos los elementos de la página (y popups) indexados por id.
export function ghlElements(html: string): Record<string, any> {
  const d = nuxtData(html);
  const pd = d?.data?.pageData;
  const out: Record<string, any> = {};
  const add = (els: any[]) => { for (const e of els || []) if (e && e.id) out[e.id] = e; };
  add(pd?.elements);
  for (const p of pd?.popupsList || []) add(p?.elements || p?.popup?.elements || []);
  if (pd?.popup?.elements) add(pd.popup.elements);
  return out;
}
