"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    fbq: any;
  }
}

      <section className="my-16">
        <h2 className="font-headline text-3xl font-bold text-center mb-12">
          {t.featuredTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const isTargetCourse =
              course.slug === "facial-harmonization-course";
            return (
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
                  <Button
                    onClick={() => {
                      console.log("CLICK VIEW CONTENT");

                      const fireEvent = () => {
                        if (typeof window !== "undefined" && (window as any).fbq) {
                          (window as any).fbq("track", "ViewContent", {
                            content_name: course.title,
                            content_category: "Curso México",
                          });
                          console.log("✅ ViewContent enviado");
                          setTimeout(() => {
                            router.push(`/academic-programs/mexico/${course.slug}`);
                          }, 500);
                        } else {
                          console.log("⏳ fbq no listo, reintentando...");
                          setTimeout(fireEvent, 200);
                        }
                      };

                      if (isTargetCourse) {
                        fireEvent();
                      } else {
                        router.push(`/academic-programs/mexico/${course.slug}`);
                      }
                    }}
                  >
                    Más información
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
        aria-label="Mexico aesthetic medicine programs"
      >
        <h2>Cursos de Medicina Estética en México</h2>
        <p>
          Instituto Mex-Col-USA ofrece programas de formación en medicina
          estética en México. Nuestros cursos especializados incluyen mini
          lifting, suero terapia, armonización facial e inyectología. Formación
          profesional con certificación internacional reconocida en todo el
          continente.
        </p>
        <p>
          Profesionales médicos y esteticistas en México pueden acceder a
          capacitación avanzada en técnicas no invasivas, procedimientos seguros
          y tratamientos estéticos de más alta calidad.
        </p>
        <ul>
          <li>Mini Lifting Facial en México</li>
          <li>Suero Terapia Avanzada</li>
          <li>Armonización Facial Profesional</li>
          <li>Certificación Profesional Mexicana e Internacional</li>
        </ul>
      </section>
    </div>
  );
}
