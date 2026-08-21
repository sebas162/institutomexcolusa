
'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import logo from '@/assets/Logo-USA-Blanco.png';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;

  return (
    <footer className="border-t bg-[#0A1416] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image className='h-12 w-12' src={logo} alt="Instituto MEXCOL"/>
              <span className="text-xl font-bold">Instituto Mex - Col - Usa</span>
            </Link>
            <p className="mt-4 text-white/70 max-w-sm">
              {t.description}
            </p>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider">
              {t.quickLinks.title}
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-white/70 hover:text-primary">
                  {t.quickLinks.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-primary">
                  {t.quickLinks.contact}
                </Link>
              </li>
              <li>
                <Link href="/academic-programs" className="text-white/70 hover:text-primary">
                  {t.quickLinks.programs}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold tracking-wider">
              {t.followUs}
            </h3>
            <div className="mt-4 flex space-x-4">
              <Link href="https://web.facebook.com/profile.php?id=100064823553168&_rdc=1&_rdr#" target="_blank" className="text-white/70 hover:text-primary transition-colors">
                <FaFacebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://www.instagram.com/institutomexcolusa/?fbclid=IwY2xjawM32tFleHRuA2FlbQIxMABicmlkETFDRHc2QlJ4c3ptQkJhZk95AR5puV-240pMhD4PNqhO7EDPZiERJ12obf7HJKjV4bpYE4zyVPenQ2AOgKdlLg_aem_HG-fv_s3k4lfx73ByZ8H1Q#" target="_blank" className="text-white/70 hover:text-primary transition-colors">
                <FaInstagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.youtube.com/@institutomexcolusa" target="_blank" className="text-white/70 hover:text-primary transition-colors">
                <FaYoutube className="h-6 w-6" />
                <span className="sr-only">Youtube</span>
              </Link>
              <Link href="https://www.tiktok.com/@instituto.mex_col_usa" target="_blank" className="text-white/70 hover:text-primary transition-colors">
                <FaTiktok className="h-6 w-6" />
                <span className="sr-only">Tiktok</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-white/70">
          <p className="mb-4">{t.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/terms" className="text-white/70 hover:text-primary hover:underline">
              {t.quickLinks.terms}
            </Link>
            <span className="text-white/50 hidden sm:inline">|</span>
            <Link href="/privacy" className="text-white/70 hover:text-primary hover:underline">
              {t.quickLinks.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
