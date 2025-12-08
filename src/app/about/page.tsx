
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import { formatText } from '@/lib/utils/text-formatting';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LogoUSAVerde from '@/assets/logo-sello-blanco2.png';
import ConocenosHero from '@/assets/img-heros/hero-conocenos.png';
import { CheckCircle, Users, Globe, Award, ShieldCheck, GraduationCap, FileCheck, BadgeCheck, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        /* className="relative overflow-hidden mb-16"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <Image
            src={ConocenosHero}
            alt="Medical professionals in training"
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
          <div className="mt-60 flex flex-col text-white gap-3 pb-6 md:pb-12 lg:pb-16 ml-5">
            <div className="flex flex-col gap-3 w-full md:max-w-3xl">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                {t.hero.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 pt-20">

        {/* Who We Are Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
              {t.whoWeAre.title}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {formatText(t.whoWeAre.content)}
            </p>
          </div>
        </section>

        {/* Endorsements Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">
              {t.endorsements.title}
            </h2>

            {/* Primer párrafo descriptivo */}
            <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
              {formatText(t.endorsements.items[0])}
            </p>

            {/* Cards del medio (índices 1, 2, 3) */}
            <div className="grid gap-4 mb-6">
              {t.endorsements.items.slice(1, 4).map((item, index) => {
                const icons = [Award, Award, Award];
                const Icon = icons[index];
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Icon className="h-6 w-6 text-primary flex-shrink-0" />
                        </div>
                        <p className="text-muted-foreground leading-relaxed flex-1">
                          {formatText(item)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Texto de compromiso debajo de las cards */}
            {'commitment' in t.endorsements && t.endorsements.commitment && (
              <p className="text-muted-foreground leading-relaxed text-center">
                {formatText(t.endorsements.commitment)}
              </p>
            )}
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
              {t.missionVision.title}
            </h2>
            <div className="grid md:grid-cols-1 gap-8">
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="font-headline text-2xl font-bold mb-4 text-primary">
                    {t.missionVision.mission.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {formatText(t.missionVision.mission.content)}
                  </p>
                </CardContent>
              </Card>
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="font-headline text-2xl font-bold mb-4 text-primary">
                    {t.missionVision.vision.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {formatText(t.missionVision.vision.content)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Impact in Numbers Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
              {t.impact.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.impact.metrics.map((metric, index) => (
                <Card key={index} className={`text-center ${index === 1 ? 'bg-primary text-primary-foreground' : ''}`}>
                  <CardContent className="p-8">
                    <div className={`text-4xl md:text-5xl font-bold mb-2 ${index === 1 ? 'text-primary-foreground' : 'text-primary'}`}>
                      {metric.number}
                    </div>
                    <p className={`text-lg ${index === 1 ? 'text-primary-foreground/90' : 'text-muted-foreground'}`}>
                      {metric.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">
              {t.team.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t.team.content}
            </p>
            <Button asChild size="lg" className="btn-modern">
              <Link href="/staff">
                {t.team.cta}
              </Link>
            </Button>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-xl md:text-2xl font-semibold mb-6">
              {t.finalCta.title}
            </h2>
            <Button asChild size="lg" variant="outline">
              <Link href="/academic-programs">
                {t.finalCta.button}
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
