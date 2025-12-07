'use client';

import * as React from 'react';
import Image, { type StaticImageData } from 'next/image';

import img1 from '@/assets/logos-marcas/image-20250917-224335.png';
import img2 from '@/assets/logos-marcas/image-20250917-225606.png';
import img3 from '@/assets/logos-marcas/image-20250917-225655.png';
import img4 from '@/assets/logos-marcas/image-20250917-225738.png';
import img5 from '@/assets/logos-marcas/image-20250917-225836.png';
import img6 from '@/assets/logos-marcas/image-20250917-225915.png';
import img7 from '@/assets/logos-marcas/image-20250917-235949.png';
import img8 from '@/assets/logos-marcas/image-20250918-000534.png';
import img9 from '@/assets/logos-marcas/logos 2.png';
import logoMarca1 from '@/assets/logos-marcas/logo-marca-1.png';
import logoMarca2 from '@/assets/logos-marcas/logo-marca-2.png';

const logos: StaticImageData[] = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  logoMarca1,
  logoMarca2,
];

export default function BrandMarquee() {
  const items = React.useMemo(() => [...logos, ...logos], []);
  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-background" />
      <div className="flex animate-marquee gap-10 will-change-transform items-center" aria-hidden>
        {items.map((img, idx) => (
          <div key={idx} className="flex h-24 min-w-[220px] items-center justify-center rounded-md bg-muted px-6 py-3 border">
            <Image
              src={img}
              alt="Brand logo"
              width={220}
              height={96}
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 220px"
              style={{ objectFit: 'contain', width: '100%', height: '100%', filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.25))' }}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          width: max(220%, 1400px);
          animation: marquee 15s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
}


