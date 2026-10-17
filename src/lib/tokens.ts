// Lee un token de color (canales "r g b" de tokens.css) para usarlo donde CSS no llega: canvas 2D y Three.js.
const FALLBACK: Record<string, string> = { '--c-paper': '255 255 255', '--c-ink': '9 67 114', '--c-accent': '102 204 153' };
export function tokenRgb(name: string): string {
  const raw = typeof document !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue(name).trim() : '';
  return (raw || FALLBACK[name] || '0 0 0').split(/\s+/).join(',');
}
export const rgba = (name: string, a: number) => `rgba(${tokenRgb(name)},${a})`;
