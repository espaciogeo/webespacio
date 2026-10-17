import manifest from '../img-manifest.json';

type Name = keyof typeof manifest;

// <picture> con AVIF + WebP en 800/1600 px. Las imágenes ya vienen con el tratamiento unificado.
export function Img({ name, alt, sizes = '(min-width: 1024px) 50vw, 100vw', className, eager = false, style }: {
  name: string; alt: string; sizes?: string; className?: string; eager?: boolean; style?: React.CSSProperties;
}) {
  const m = manifest[name as Name];
  const set = (ext: string) => `/img/${name}-800.${ext} 800w, /img/${name}-1600.${ext} ${m?.w ?? 1600}w`;
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={`/img/${name}-800.webp`}
        alt={alt}
        width={m?.w}
        height={m?.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
        style={style}
      />
    </picture>
  );
}
