"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";

export default function ColombiaClient() {
  const { language } = useLanguage();
  const t = translations[language].programColombia;
  const { courses } = t;

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          {t.subtitle}
        </p>
      </section>

      <section className="my-16">
        <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://picsum.photos/1200/400?random=10"
            alt="Paisaje de Colombia"
            data-ai-hint="Colombia landscape"
            width={1200}
            height={400}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/30" />
        </div>
      </section>

      <section className="my-16">
        <h2 className="font-headline text-3xl font-bold text-center mb-12">
          {t.featuredTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.title}>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{course.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                  <span>
                    {language === "es" ? "Duración" : "Duration"}:{" "}
                    {course.duration}
                  </span>
                </div>
                <Button className="w-full btn-modern">{t.moreInfo}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-16">
        <Button asChild size="lg">
          <Link href="/academic-programs">{t.backToPrograms}</Link>
        </Button>
      </div>

      {/* SEO Content - Hidden from UI */}
      <section
        className="sr-only"
        aria-label="Colombia aesthetic medicine programs"
      >
        <h2>Cursos de Medicina Estética en Colombia</h2>
        <p>
          Instituto Mex-Col-USA ofrece programas de formación en medicina
          estética en Bogotá, Colombia. Nuestros cursos especializados incluyen
          lifting sin cirugía, armonización facial, suero terapia e
          inyectología. Formación práctica y teórica con certificación
          internacional reconocida.
        </p>
        <p>
          Profesionales médicos y esteticistas en Colombia pueden acceder a
          capacitación avanzada en técnicas no invasivas, procedimientos seguros
          y tratamientos estéticos de alta calidad.
        </p>
        <ul>
          <li>Lifting Facial sin Cirugía en Colombia</li>
          <li>Armonización Facial Avanzada</li>
          <li>Suero Terapia y Inyectología</li>
          <li>Certificación Profesional Colombiana e Internacional</li>
        </ul>
      </section>
    </div>
  );
}
