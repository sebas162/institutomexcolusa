
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import LogoUSAVerde from '@/assets/logo-sello-blanco2.png';
import { FaWhatsapp } from 'react-icons/fa';
import { formatText } from '@/lib/utils/text-formatting';
import Curso1Image from '@/assets/logos-cursos/formacion en linea curso 1.png';
import Curso2Image from '@/assets/logos-cursos/formacion en linea curso 2.png';
import HeroFormacionEnLinea from '@/assets/img-heros/hero-formacion-en-linea.png';

export default function OnlineTrainingPage() {
  const { language } = useLanguage();
  const t = translations[language].onlineTraining;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        /* className="relative overflow-hidden mb-10"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <Image
            src={HeroFormacionEnLinea}
            alt="Capacitación en línea"
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
              <p className="text-base md:text-2xl text-white/90 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 pb-10">

      {/* Descripción de la sección */}
      <section className="my-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            {t.description}
          </p>
        </div>
      </section>

      {/* Explicación de funcionamiento */}
      <section className="my-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6 text-center">
            {t.howToAccess.title}
          </h2>
          <div className="bg-primary/5 p-6 md:p-8 rounded-lg">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {formatText(t.howToAccess.text)}
            </p>
          </div>
        </div>
      </section>

      {/* Listado de Cursos */}
      <section className="my-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.courses.map((course, index) => {
              const courseImages = [Curso1Image, Curso2Image];
              return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={courseImages[index]}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-xl mb-2">{course.name}</CardTitle>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>{t.labels.speaker}</strong> {course.speaker}</p>
                    <p><strong>{t.labels.duration}</strong> {course.duration}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full btn-modern" 
                    size="lg"
                    asChild
                  >
                    <a 
                      href={`https://wa.me/${language === 'es' ? '5215566308602' : '14074540524'}?text=${encodeURIComponent(
                        language === 'es' 
                          ? `Hola, estoy interesado en el curso: ${course.name}`
                          : `Hello, I'm interested in the course: ${course.name}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaWhatsapp className="w-5 h-5 mr-1" />
                      {t.ctaButton}
                    </a>
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
