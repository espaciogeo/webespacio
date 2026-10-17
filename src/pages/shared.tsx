import { Img } from '../lib/Img';

export function MediaImgLocal({ name, alt }: { name: string; alt: string }) {
  return <Img name={name} alt={alt} sizes="34vw" className="absolute inset-0 h-full w-full object-cover" />;
}
