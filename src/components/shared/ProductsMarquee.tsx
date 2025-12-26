'use client';

import * as React from 'react';
import Image, { type StaticImageData } from 'next/image';

import product1 from '@/assets/logos-cursos/curso-colombia-1.1.webp';
import product2 from '@/assets/logos-cursos/curso-colombia-1.2.webp';
import product3 from '@/assets/logos-cursos/curso-colombia-1.3.webp';
import product4 from '@/assets/logos-cursos/curso-colombia-1.4.png';
import product5 from '@/assets/logos-cursos/curso-colombia-1.5.png';
import product6 from '@/assets/logos-cursos/curso-colombia-1.6.png';

const products: StaticImageData[] = [
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
];

export default function ProductsMarquee() {
  // Duplicado de contenido para animación suave
  const items = React.useMemo(() => [...products, ...products], []);
  const firstRowProducts = React.useMemo(() => products.slice(0, 3), []);
  const secondRowProducts = React.useMemo(() => products.slice(3), []);
  const firstRowItems = React.useMemo(() => [...firstRowProducts, ...firstRowProducts], []);
  const secondRowItems = React.useMemo(() => [...secondRowProducts, ...secondRowProducts], []);

  return (
    <div>
      {/* Desktop: Single marquee row */}
      <div className="hidden md:block relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="marquee-track animate-scroll gap-10 will-change-transform" aria-hidden="true">
          {items.map((img, idx) => (
            <div
              key={idx}
              className="flex h-32 min-w-[240px] items-center justify-center rounded-lg bg-white px-6 py-4 border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={img}
                alt="Product"
                width={240}
                height={128}
                sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 240px"
                style={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                }}
                className="drop-shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile rows */}
      <div className="md:hidden space-y-4">
        {/* Row 1: reverse */}
        <div className="relative w-full overflow-hidden">
          <div className="marquee-track animate-scroll-reverse gap-10 will-change-transform" aria-hidden="true">
            {firstRowItems.map((img, idx) => (
              <div
                key={idx}
                className="flex h-32 min-w-[240px] items-center justify-center rounded-lg bg-white px-6 py-4 border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={img}
                  alt="Product"
                  width={240}
                  height={128}
                  sizes="180px"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                  className="drop-shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: normal */}
        <div className="relative w-full overflow-hidden">
          <div className="marquee-track animate-scroll gap-10 will-change-transform" aria-hidden="true">
            {secondRowItems.map((img, idx) => (
              <div
                key={idx}
                className="flex h-32 min-w-[240px] items-center justify-center rounded-lg bg-white px-6 py-4 border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={img}
                  alt="Product"
                  width={240}
                  height={128}
                  sizes="180px"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                  className="drop-shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-track {
          display: flex;
          width: fit-content; /* IMPORTANT: evita salto */
          white-space: nowrap;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll {
          animation: scroll 6s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 6s linear infinite;
        }
      `}</style>
    </div>
  );
}

