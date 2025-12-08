
"use client";
import Image from 'next/image';
import { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { ContactForm } from '@/components/contact/ContactForm';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LogoUSAVerde from '@/assets/logo-sello-blanco2.png';
import ContactanosHero from '@/assets/img-heros/contactanos.png';

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const [selectedCountry, setSelectedCountry] = useState<'colombia' | 'mexico' | 'usa'>('usa');

  interface Office {
    city: string;
    address: string;
    phone?: string;
    phones?: { number: string; type: 'phone' | 'whatsapp' }[];
    email: string;
  }

  const offices: Record<'colombia' | 'mexico' | 'usa', Office[]> = {
    colombia: [
      {
        city: language === 'es' ? 'Bogotá - oficinas administrativas' : 'Bogotá - Administrative Offices',
        address: 'Carrera 16A # 80-16. Consultorio 206 Barrio el lago Contry',
        phone: '+57 322 432 4933',
        email: 'gerencia@institutomexcolusa.com'
      },
    ],
    mexico: [
      {
        city: language === 'es' ? 'Ciudad de México' : 'Mexico City',
        address: 'Av. Insurgentes Sur 546-piso 7, Roma Sur, Cuauhtémoc, 06760, CDMX',
        phones: [
          { number: '+52 55 6630 8602', type: 'whatsapp' },
          { number: '55 2593 6885', type: 'phone' }
        ],
        email: 'gerencia@institutomexcolusa.com'
      },
    ],
    usa: [
      {
        city: language === 'es' ? 'Eventos Presenciales' : 'In-person events',
        address: language === 'es' ? 'Los Angeles California - Miami Florida - Nueva York Nueva York' : 'Los Angeles California - Miami Florida - Nueva York Nueva York',
        phone: '+1 (407) 454-0524',
        email: 'gerencia@institutomexcolusa.com'
      },
      {
        city: language === 'es' ? 'Orlando Florida - Oficinas Administrativas' : 'Orlando Florida - Administrative Offices',
        address: '2180 Central Florida Parkway. Suite A2. Orlando FL 32837',
        phone: '+1 (407) 454-0524',
        email: 'gerencia@institutomexcolusa.com'
      },
      {
        city: language === 'es' ? 'Houston Texas - Sede' : 'Houston Texas - Headquarters',
        address: '2307 S Texas 6, Houston, TX 77077',
        phone: '+1 (407) 454-0524',
        email: 'gerencia@institutomexcolusa.com'
      },
    ],
  };

  const social = t.followUs.links;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        /* className="relative overflow-hidden mb-10"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern h-screen -mt-20"
      >
        <div className="absolute inset-0">
          <Image
            src={ContactanosHero}
            alt="Contact hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col">
          <div className="flex justify-end pt-4 md:pt-8 lg:pt-6 pr-4 md:pr-4 lg:pr-6">
            <div className="relative w-20 h-20 mt-12 md:w-32 md:h-32 lg:w-36 lg:h-36">
              <Image
                src={LogoUSAVerde}
                alt="Instituto MexCol USA Logo"
                fill
                className="object-contain drop-shadow-2xl mt-6"
                priority
              />
            </div>
          </div>
          <div className="mt-60 flex flex-col items-center text-center md:items-start md:text-left text-white gap-3 pb-6 md:pb-12 lg:pb-16 md:ml-5">
            <div className="flex flex-col gap-3 w-full md:max-w-3xl">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base md:text-2xl text-white/90 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-10 pt-20">

        <section>
          <Tabs
            value={selectedCountry}
            onValueChange={(v) => setSelectedCountry(v as 'colombia' | 'mexico' | 'usa')}
            className="w-full"
          >
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="usa">{t.countries.usa}</TabsTrigger>
                <TabsTrigger value="mexico">{t.countries.mexico}</TabsTrigger>
                <TabsTrigger value="colombia">{t.countries.colombia}</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </section>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="order-last md:order-none">
            <ContactForm />
          </div>
          <div className="w-full space-y-6">
            <div className="flex flex-col gap-4">
              {offices[selectedCountry].map((o) => (
                <Card key={`${selectedCountry}-${o.city}`} className="w-full">
                  <CardHeader>
                    <CardTitle className="font-headline text-foreground font-semibold">{o.city}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary mt-1" /><span>{o.address}</span></div>
                    <div className="flex flex-col gap-1">
                      {o.phones ? (
                        o.phones.map((phone, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {phone.type === 'whatsapp' ? (
                              <FaWhatsapp className="h-4 w-4 text-primary" />
                            ) : (
                              <Phone className="h-4 w-4 text-primary" />
                            )}
                            <span>{phone.number}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><span>{o.phone}</span></div>
                      )}
                    </div>
                    <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><span>{o.email}</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* <div>
            <h3 className="font-headline text-xl font-semibold">{t.followUs.title}</h3>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <a href="https://www.facebook.com/profile.php?id=100064823553168#" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline"><Facebook className="h-4 w-4" />{t.followUs.facebook}</a>
              <a href="https://www.instagram.com/institutomexcolusa/?fbclid=IwY2xjawM32tFleHRuA2FlbQIxMABicmlkETFDRHc2QlJ4c3ptQkJhZk95AR5puV-240pMhD4PNqhO7EDPZiERJ12obf7HJKjV4bpYE4zyVPenQ2AOgKdlLg_aem_HG-fv_s3k4lfx73ByZ8H1Q#"	 target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline"><Instagram className="h-4 w-4" />{t.followUs.instagram}</a>
              <a href="https://www.tiktok.com/@instituto.mex_col_usa" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline"><Music2 className="h-4 w-4" />{t.followUs.tiktok}</a>
              <a href="https://www.youtube.com/@institutomexcol9788/featured" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:underline"><Youtube className="h-4 w-4" />{t.followUs.youtube}</a>
            </div>
          </div> */}
          </div>
        </section>
      </div>
    </div>
  );
}
