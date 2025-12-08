
'use client';

import * as React from 'react';
import Link from 'next/link';
import PrefetchLink from '@/components/shared/PrefetchLink';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Menu,
  Globe,
  UserCog,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  navigationMenuLinkStyle,
  navigationMenuContainerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import logo from '@/assets/Logo-USA-Verde.png';
import Image from 'next/image';

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href || ''}
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

// Componente para el underline deslizante
function SlidingUnderline({
  activeIndex,
  hoverIndex,
  containerRef,
  language
}: {
  activeIndex: number;
  hoverIndex: number | null;
  containerRef: React.RefObject<HTMLDivElement>;
  language: 'en' | 'es';
}) {
  const [activeUnderlineStyle, setActiveUnderlineStyle] = React.useState<React.CSSProperties>({});
  const [hoverUnderlineStyle, setHoverUnderlineStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    // Pequeño delay para asegurar que el DOM se ha actualizado después del cambio de idioma
    const timer = setTimeout(() => {
      if (containerRef.current && activeIndex >= 0) {
        const container = containerRef.current;
        const items = container.querySelectorAll('[data-nav-item]');
        const activeItem = items[activeIndex] as HTMLElement;

        if (activeItem) {
          const containerRect = container.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();

          setActiveUnderlineStyle({
            left: itemRect.left - containerRect.left,
            width: itemRect.width,
            transition: 'all 0.3s ease-out'
          });
        }
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [activeIndex, containerRef, language]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && hoverIndex !== null && hoverIndex >= 0) {
        const container = containerRef.current;
        const items = container.querySelectorAll('[data-nav-item]');
        const hoverItem = items[hoverIndex] as HTMLElement;

        if (hoverItem) {
          const containerRect = container.getBoundingClientRect();
          const itemRect = hoverItem.getBoundingClientRect();

          setHoverUnderlineStyle({
            left: itemRect.left - containerRect.left,
            width: itemRect.width,
            transition: 'all 0.2s ease-out'
          });
        }
      } else {
        setHoverUnderlineStyle({ opacity: 0 });
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [hoverIndex, containerRef, language]);

  return (
    <>
      {/* Underline activo */}
      {activeIndex >= 0 && (
        <div
          className="absolute -bottom-5 h-1 bg-primary rounded-full pointer-events-none"
          style={activeUnderlineStyle}
        />
      )}
      {/* Underline hover */}
      <div
        className="absolute -bottom-5 h-1 bg-primary/40 rounded-full pointer-events-none"
        style={hoverUnderlineStyle}
      />
    </>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const t = translations[language].navbar;
  const navContainerRef = React.useRef<HTMLDivElement>(null);

  const navLinks = t.navLinks;
  const academicPrograms = t.academicPrograms;
  const firstTwoLinks = navLinks.slice(0, 2);
  const remainingLinks = navLinks.slice(2);

  // Crear array de todos los enlaces para el underline (sin staff)
  const allNavLinks = [
    ...firstTwoLinks,
    { href: '/academic-programs', label: t.academicProgramsTitle },
    ...remainingLinks
  ];

  // Encontrar el índice del enlace activo
  const activeIndex = allNavLinks.findIndex(link => pathname === link.href);

  const handleLanguageChange = (lang: 'en' | 'es') => {
    setLanguage(lang);
  };

  const isAdminPage = pathname.startsWith('/admin');

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center"></div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center">
        {/* Logo - izquierda */}
        <div className="hidden md:flex">
          <PrefetchLink href="/" className="flex items-center space-x-2">
            <Image className='h-16 w-16' src={logo} alt="Instituto MEXCOL" />
            {/*             <span className="font-bold">Instituto MEXCOL</span>
 */}          </PrefetchLink>
        </div>

        {/* Navegación - centro */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <div ref={navContainerRef} className={cn(navigationMenuContainerStyle(), "relative")}>
              <NavigationMenuList>
                {allNavLinks.map((link, index) => (
                  <NavigationMenuItem key={link.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={link.href}
                        className={navigationMenuLinkStyle()}
                        data-active={pathname === link.href}
                        data-nav-item
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
              <SlidingUnderline
                activeIndex={activeIndex}
                hoverIndex={hoverIndex}
                containerRef={navContainerRef}
                language={language}
              />
            </div>
          </NavigationMenu>
        </div>

        {/* Layout móvil con justify-between */}
        <div className="flex flex-1 items-center justify-between md:hidden">
          {/* Logo a la izquierda */}
          <PrefetchLink href="/" className="flex items-center">
            <Image className='h-14 w-14' src={logo} alt="Instituto MEXCOL" />
          </PrefetchLink>

          {/* Controles a la derecha */}
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                  <span className="text-lg">{language === 'es' ? '🇲🇽' : '🇺🇸'}</span>
                  <span className="sr-only">Change language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-border/50 shadow-lg">
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('es')}
                  className="cursor-pointer hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700"
                >
                  <span className="mr-2">🇲🇽</span>
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('en')}
                  className="cursor-pointer hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700"
                >
                  <span className="mr-2">🇺🇸</span>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-white flex flex-col">
                <PrefetchLink
                  href="/"
                  className="flex items-center"
                  onClick={() => setOpen(false)}
                >
                  <Image className='h-8 w-8 mr-2' src={logo} alt="Instituto MEXCOL" />
                  <span className="font-bold text-foreground">Instituto Mex - Col - Usa</span>
                </PrefetchLink>
                <div className="mt-6 flex flex-col space-y-2 flex-1">
                  {firstTwoLinks.map((item) => (
                    <PrefetchLink
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'rounded-lg p-3 text-sm font-medium transition-colors duration-200',
                        'hover:bg-primary/10 hover:text-primary',
                        pathname === item.href ? 'bg-primary/15 text-primary font-semibold' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </PrefetchLink>
                  ))}
                  <PrefetchLink
                    href="/academic-programs"
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-lg p-3 text-sm font-medium transition-colors duration-200',
                      'hover:bg-primary/10 hover:text-primary',
                      pathname === '/academic-programs' ? 'bg-primary/15 text-primary font-semibold' : 'text-foreground'
                    )}
                  >
                    {t.academicProgramsTitle}
                  </PrefetchLink>
                  {remainingLinks.map((item) => (
                    <PrefetchLink
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'rounded-lg p-3 text-sm font-medium transition-colors duration-200',
                        'hover:bg-primary/10 hover:text-primary',
                        pathname === item.href ? 'bg-primary/15 text-primary font-semibold' : 'text-foreground'
                      )}
                    >
                      {item.label}
                    </PrefetchLink>
                  ))}
                </div>
                <div className="mt-auto pt-2 border-t border-border/50 space-y-1">
                  <p className="text-sm text-muted-foreground font-medium text-center pb-2">
                    © 2025 Instituto Mex - Col - Usa. Todos los derechos reservados.
                  </p>
                  <div className='block justify-center items-center space-x-3'>
                    <PrefetchLink
                      href="/terms"
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block text-center text-xs transition-colors duration-200',
                        'hover:text-primary',
                        pathname === '/terms' ? 'text-primary font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      Términos y Condiciones
                    </PrefetchLink>
                    <PrefetchLink
                      href="/privacy"
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block text-center text-xs transition-colors duration-200',
                        'hover:text-primary',
                        pathname === '/privacy' ? 'text-primary font-semibold' : 'text-muted-foreground'
                      )}
                    >
                      Aviso de Privacidad
                    </PrefetchLink>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Idioma - derecha */}
        <div className="hidden md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <span className="text-lg">{language === 'es' ? '🇲🇽' : '🇺🇸'}</span>
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-border/50 shadow-lg">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('es')}
                className="cursor-pointer hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700"
              >
                <span className="mr-2">🇲🇽</span>
                Español
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className="cursor-pointer hover:bg-teal-50 hover:text-teal-700 focus:bg-teal-50 focus:text-teal-700"
              >
                <span className="mr-2">🇺🇸</span>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
