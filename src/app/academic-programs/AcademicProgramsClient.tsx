"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LogoUSAVerde from "@/assets/logo-sello-blanco2.png";
import heroimg from "@/assets/img-heros/hero-programas-academico.webp";
import MasterClassUSA from "@/assets/img-heros/img-hero-cursos/master-class-usa.webp";
import MasterClassMX from "@/assets/img-heros/img-hero-cursos/master-class-mx.webp";
import MasterClassCol from "@/assets/img-heros/img-hero-cursos/master-class-col.webp";
import SueroUSA from "@/assets/img-heros/img-hero-cursos/suero-usa.webp";
import SueroMX from "@/assets/img-heros/img-hero-cursos/suero-mx.webp";
import SueroCol from "@/assets/img-heros/img-hero-cursos/suero-col.webp";
import MiniLiftingUSA from "@/assets/img-heros/img-hero-cursos/mini-lifting-usa.webp";
import MiniLiftingMX from "@/assets/img-heros/img-hero-cursos/mini-lifting-mx.webp";
import MiniLiftingCol from "@/assets/img-heros/img-hero-cursos/mini-lifting-col.webp";
import FlebotomiaUSA from "@/assets/img-heros/img-hero-cursos/flebotomia-usa.webp";

// Mapeo de rutas de imágenes a imports
const imageMap: Record<string, any> = {
  "@/assets/img-heros/img-hero-cursos/master-class-usa.webp": MasterClassUSA,
  "@/assets/img-heros/img-hero-cursos/master-class-mx.webp": MasterClassMX,
  "@/assets/img-heros/img-hero-cursos/master-class-col.webp": MasterClassCol,
  "@/assets/img-heros/img-hero-cursos/suero-usa.webp": SueroUSA,
  "@/assets/img-heros/img-hero-cursos/suero-mx.webp": SueroMX,
  "@/assets/img-heros/img-hero-cursos/suero-col.webp": SueroCol,
  "@/assets/img-heros/img-hero-cursos/mini-lifting-usa.webp": MiniLiftingUSA,
  "@/assets/img-heros/img-hero-cursos/mini-lifting-mx.webp": MiniLiftingMX,
  "@/assets/img-heros/img-hero-cursos/mini-lifting-col.webp": MiniLiftingCol,
  "@/assets/img-heros/img-hero-cursos/flebotomia-usa.webp": FlebotomiaUSA,
};

export default function AcademicProgramsClient() {
  const { language } = useLanguage();
  const t = translations[language].academicPrograms;
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");

  const [selectedTab, setSelectedTab] = useState<"usa" | "mexico" | "colombia">(
    countryParam === "colombia" ||
      countryParam === "mexico" ||
      countryParam === "usa"
      ? countryParam
      : "usa"
  );

  useEffect(() => {
    if (
      countryParam === "colombia" ||
      countryParam === "mexico" ||
      countryParam === "usa"
    ) {
      setSelectedTab(countryParam);
    }
  }, [countryParam]);

  const countries = [
    {
      key: "usa" as const,
      label: t.tabs.usa,
      image: "https://picsum.photos/1200/400?random=21",
      ai: "USA flag",
    },
    {
      key: "mexico" as const,
      label: t.tabs.mexico,
      image: "https://picsum.photos/1200/400?random=22",
      ai: "Mexico landmark",
    },
    {
      key: "colombia" as const,
      label: t.tabs.colombia,
      image: "https://picsum.photos/1200/400?random=23",
      ai: "Colombia landscape",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        /* className="relative overflow-hidden mb-10"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern min-h-[500px] sm:min-h-[600px] md:h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <Image
            src={heroimg}
            alt="Academic Programs hero"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            quality={80}
            sizes="100vw"
            style={{ objectPosition: "center 15%" }}
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
                loading="lazy"
                sizes="(max-width: 768px) 80px, 144px"
              />
            </div>
          </div>
          <div className="mt-60 flex flex-col items-center text-center md:items-start md:text-left text-white gap-3 pb-6 md:pb-12 lg:pb-16 md:ml-5">
            <div className="flex flex-col gap-3 w-full md:max-w-3xl">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                <br className="hidden md:block" />
                <span className="block md:inline">{t.heroHeadlineBottom}</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-10 pt-20">
        <Tabs
          value={selectedTab}
          onValueChange={(value) =>
            setSelectedTab(value as "usa" | "mexico" | "colombia")
          }
          className="w-full"
        >
          <div className="flex justify-center">
            <TabsList>
              {countries.map((c) => (
                <TabsTrigger key={c.key} value={c.key}>
                  {c.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {countries.map((c) => {
            const list = (t.countries as any)[c.key].courses as Array<{
              title: string;
              description?: string;
              image?: string;
              slug?: string;
            }>;
            return (
              <TabsContent key={c.key} value={c.key} className="mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list.map((course) => (
                    <Card
                      key={course.title}
                      className="h-full flex flex-col overflow-hidden group"
                    >
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={
                            imageMap[course.image || ""] ||
                            course.image ||
                            "https://picsum.photos/400/300"
                          }
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader>
                        <CardTitle className="font-headline">
                          {course.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        {course.description && (
                          <p className="text-muted-foreground mb-4">
                            {course.description}
                          </p>
                        )}
                        <div className="mt-auto">
                          <Button className="w-full btn-modern" asChild>
                            <a
                              href={`/academic-programs/${c.key}/${
                                course.slug || ""
                              }`}
                            >
                              {t.cta}
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* SEO Content - Hidden from UI but indexed by search engines */}
      <section
        className="sr-only"
        aria-label="SEO content for academic programs"
      >
        <h2>Formación Profesional en Medicina Estética</h2>
        <p>
          Instituto Mex-Col-USA ofrece programas académicos de medicina estética
          con certificación internacional. Nuestros cursos especializados
          incluyen lifting sin cirugía, suero terapia, armonización facial y
          flebotomía. Con sedes en USA, México y Colombia, proporcionamos
          formación práctica y teórica de alta calidad.
        </p>
        <p>
          Cada programa está diseñado para profesionales médicos y esteticistas
          que desean mejorar sus habilidades en tratamientos no invasivos,
          técnicas avanzadas y procedimientos seguros con estándares
          internacionales.
        </p>
        <ul>
          <li>Cursos de Medicina Estética en USA</li>
          <li>Formación de Lifting Facial en México</li>
          <li>Programas de Armonización en Colombia</li>
          <li>Certificación Profesional Internacional</li>
        </ul>
      </section>
    </div>
  );
}
