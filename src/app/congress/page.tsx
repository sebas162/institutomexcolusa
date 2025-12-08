'use client';

import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PrefetchLink from '@/components/shared/PrefetchLink';
import Image from 'next/image';
import LogoUSAVerde from '@/assets/logo-sello-blanco2.png';
import HeroConferencias from '@/assets/img-heros/hero-conferencias.png';
import Turismo1 from '@/assets/img-congreso/turismo-1.jpg';
import Turismo2 from '@/assets/img-congreso/turismo-2.jpg';
import Turismo3 from '@/assets/img-congreso/turismo-3.jpg';
import Salon1 from '@/assets/img-congreso/salon-1.webp';
import Salon2 from '@/assets/img-congreso/salon-2.jpg';
import { 
  MapPin, 
  Award, 
  Gift, 
  BookOpen, 
  Camera,
  CheckCircle,
  Presentation,
  Target,
  Heart,
  Sparkles
} from 'lucide-react';

export default function CongressPage() {
  const { language } = useLanguage();
  
  // Verificar que el contexto esté disponible
  if (!language) {
    return null;
  }
  
  const t = translations[language].congress;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        /*   className="relative w-full overflow-hidden"
          style={{ height: "458.14px" }} */
          className="relative w-full section-modern h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <Image
            src={HeroConferencias}
            alt="Congreso Médico"
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
                {t.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-foreground">
                {t.title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t.description}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t.mission}
              </p>
            </div>
            <div className="space-y-6">
              <Card className="modern-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    {t.targetAudience.split(':')[0]}:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.targetAudience.split(':')[1]}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="modern-card hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    {t.commitment.split(':')[0]}:
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t.commitment.split(':')[1]}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Presentations Section */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t.presentations}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.presentationsList.map((presentation, index) => (
              <Card key={index} className="modern-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 mt-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {presentation}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits and Endorsements */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Benefits */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold text-foreground">
                  {t.benefits}
                </h2>
              </div>
              
              <div className="space-y-4">
                {t.benefitsList.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Endorsements */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h2 className="font-headline text-2xl md:text-3xl font-bold text-foreground">
                  {t.endorsements}
                </h2>
              </div>
              
              <div className="space-y-4">
                {t.endorsementsList.map((endorsement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground leading-relaxed">{endorsement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Raffle Section */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t.raffle}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {t.raffleItems.map((item, index) => (
              <Card key={index} className="modern-card text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground font-medium leading-relaxed">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pre-Congress Workshops */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t.preCongress}
            </h2>
          </div>
          
          <div className="space-y-4">
            {t.preCongressWorkshops.map((workshop, index) => (
              <Card key={index} className="modern-card hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg flex-shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      {workshop}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t.location}
            </h2>
          </div>
          
          <Card className="modern-card overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-headline text-xl font-bold mb-2 text-foreground">
                    {t.hotelName}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {t.hotelAddress}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Ciudad de México, CDMX</span>
                  </div>
                </div>
              </div>
              
              {/* Salon Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={Salon1}
                    alt="Salón 1"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image
                    src={Salon2}
                    alt="Salón 2"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tourism Section */}
      <section className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-foreground">
              {t.tourism}
            </h2>
          </div>
          
          <Card className="modern-card">
            <CardContent className="p-8">
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-lg leading-relaxed text-center">
                    {t.tourismDescription}
                  </p>
                </div>
              </div>
              
              {/* Bento Layout for Images */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                {/* Primera imagen - vertical, ocupa toda la altura */}
                <div className="relative h-[400px] md:h-[600px] rounded-lg overflow-hidden">
                  <Image
                    src={Turismo1}
                    alt="Turismo 1"
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Segunda y tercera imagen - una encima de la otra, dividen equitativamente el espacio */}
                <div className="flex flex-col md:col-span-2 gap-4 h-[400px] md:h-[600px]">
                  <div className="relative flex-1 rounded-lg overflow-hidden">
                    <Image
                      src={Turismo2}
                      alt="Turismo 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative flex-1 rounded-lg overflow-hidden">
                    <Image
                      src={Turismo3}
                      alt="Turismo 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 px-4 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
            {t.subtitle}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {t.description.split('.')[0]}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-modern bg-white text-white hover:bg-white/90 px-8 py-4 text-lg">
              <PrefetchLink href="/contact">{t.registerNow}</PrefetchLink>
            </Button>
            <Button asChild size="lg" variant="outline" className="btn-modern bg-black border-black text-white hover:bg-black/90 px-8 py-4 text-lg">
              <PrefetchLink href="/">{t.backToHome}</PrefetchLink>
            </Button>
          </div>
        </div>
      </section> */}
    </div>
  );
}