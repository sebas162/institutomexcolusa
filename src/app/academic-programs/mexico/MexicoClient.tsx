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

export default function MexicoClient() {
  const { language } = useLanguage();
  const t = translations[language].programMexico;
  const { courses } = t;
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-bold md:text-5xl">{t.title}</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          {t.subtitle}
        </p>
      </section>

      <section className="my-16">
        <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-xl">
          <Image
            src="https://picsum.photos/1200/400?random=11"
            alt="México"
            width={1200}
            height={400}
            className="object-cover"
          />
        </div>
      </section>

      <section className="my-16">
        <h2 className="text-3xl font-bold text-center mb-12">
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
                  <p>{course.description}</p>

                  <div className="flex items-center text-sm">
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
                        if (
                          typeof window !== "undefined" &&
                          (window as any).fbq
                        ) {
                          (window as any).fbq("track", "ViewContent", {
                            content_name: course.title,
                            content_category: "Curso México",
                          });

                          console.log("✅ ViewContent enviado");

                          setTimeout(() => {
                            router.push(
                              `/academic-programs/mexico/${course.slug}`,
                            );
                          }, 500);
                        } else {
                          console.log("⏳ fbq no listo...");
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
        <Button asChild>
          <Link href="/academic-programs">{t.backToPrograms}</Link>
        </Button>
      </div>
    </div>
  );
}
