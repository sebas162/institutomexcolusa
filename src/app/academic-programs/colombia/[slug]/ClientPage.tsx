"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OptimizedImage } from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  GraduationCap,
  ArrowLeft,
  Award,
  BookOpen,
  Target,
  ShieldCheck,
  Play,
  MessageCircle,
  Package,
  ClipboardList,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useLanguage } from "@/hooks/use-language";
import { translations } from "@/lib/i18n";
import { formatText } from "@/lib/utils/text-formatting";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import LogoUSAVerde from "@/assets/logo-sello-blanco2.png";
import { resolveHeroImage } from "@/lib/utils/hero-image-resolver";
import comentario1 from "@/assets/img-comentarios/comentario-1.jpeg";
import comentario2 from "@/assets/img-comentarios/comentario-2.jpeg";
import comentario3 from "@/assets/img-comentarios/comentario-3.jpeg";
import { useAutoPauseVideos } from "@/hooks/use-auto-pause-videos";
import { useIsMobile } from "@/hooks/use-mobile";

// Dynamic imports for below-the-fold components
const ProductsMarquee = dynamic(
  () => import("@/components/shared/ProductsMarquee"),
  {
    loading: () => (
      <div className="min-h-[150px] animate-pulse bg-muted rounded-lg" />
    ),
    ssr: false,
  }
);

const VideoCard = dynamic(
  () =>
    import("@/components/VideoCard").then((mod) => ({
      default: mod.VideoCard,
    })),
  {
    loading: () => (
      <div className="min-h-[300px] animate-pulse bg-muted rounded-lg aspect-video" />
    ),
    ssr: false,
  }
);

export default function ClientPage({ slug }: { slug: string }) {
  const { language } = useLanguage();
  const t = translations[language].academicPrograms;
  const courseDetails = (t.countries.colombia.courseDetails as any)?.[slug];
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useAutoPauseVideos();
  const isMobile = useIsMobile();

  // Course Schema + Breadcrumb Schema para Colombia (JSON-LD invisible)
  useEffect(() => {
    if (!courseDetails) return;

    // Course Schema
    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: courseDetails.title || "Curso Especializado",
      description:
        courseDetails.description ||
        "Programa de formación en estética avanzada",
      provider: {
        "@type": "Organization",
        name: "Instituto Mex-Col-USA",
        sameAs: "https://www.institutomexcolusa.com",
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "onsite",
        location: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "CO",
          },
        },
      },
    };

    // Breadcrumb Schema
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: language === "es" ? "Inicio" : "Home",
          item: "https://www.institutomexcolusa.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name:
            language === "es" ? "Programas Académicos" : "Academic Programs",
          item: "https://www.institutomexcolusa.com/academic-programs/",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Colombia",
          item: "https://www.institutomexcolusa.com/academic-programs/colombia/",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: courseDetails.title || "Curso",
          item: `https://www.institutomexcolusa.com/academic-programs/colombia/${slug}/`,
        },
      ],
    };

    // Inyectar Course Schema
    const courseScriptId = "course-schema-co";
    let courseScript = document.getElementById(
      courseScriptId
    ) as HTMLScriptElement | null;
    if (!courseScript) {
      courseScript = document.createElement("script");
      courseScript.id = courseScriptId;
      courseScript.type = "application/ld+json";
      document.head.appendChild(courseScript);
    }
    courseScript.textContent = JSON.stringify(courseSchema);

    // Inyectar Breadcrumb Schema
    const breadcrumbScriptId = "breadcrumb-schema-co";
    let breadcrumbScript = document.getElementById(
      breadcrumbScriptId
    ) as HTMLScriptElement | null;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.id = breadcrumbScriptId;
      breadcrumbScript.type = "application/ld+json";
      document.head.appendChild(breadcrumbScript);
    }
    breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);

    // Cleanup
    return () => {
      const courseEl = document.getElementById(courseScriptId);
      const breadcrumbEl = document.getElementById(breadcrumbScriptId);
      if (courseEl) courseEl.remove();
      if (breadcrumbEl) breadcrumbEl.remove();
    };
  }, [language, slug, courseDetails]);

  // Carrusel automático para móvil
  useEffect(() => {
    if (slug !== "intravenous-therapy-online") return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, [slug]);

  if (!courseDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {language === "es" ? "Curso no encontrado" : "Course not found"}
        </h1>
        <Button asChild>
          <Link href="/academic-programs?country=colombia">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "es" ? "Volver a Programas" : "Back to Programs"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        /* className="relative overflow-hidden"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern min-h-[500px] sm:min-h-[600px] md:h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <OptimizedImage
            src={resolveHeroImage(slug)}
            alt={courseDetails.title}
            className="absolute inset-0 w-full h-full object-cover"
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col">
          <div className="flex items-start justify-between pt-20 md:pt-24 lg:pt-28">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <Link href="/academic-programs?country=colombia">
                <ArrowLeft className="h-4 w-4" />
                {language === "es" ? "Volver a Programas" : "Back to Programs"}
              </Link>
            </Button>
            <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32">
              <Image
                src={LogoUSAVerde}
                alt="Instituto MexCol USA Logo"
                fill
                className="object-contain drop-shadow-2xl"
                loading="lazy"
                sizes="(max-width: 768px) 80px, 128px"
              />
            </div>
          </div>
          <div className="mt-60 md:mt-auto flex flex-col text-white gap-3 pb-6 md:pb-12 lg:pb-16 ml-5">
            <Badge className="w-fit bg-primary text-primary-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              Colombia
            </Badge>
            <div className="flex flex-col gap-3 w-full px-4 sm:px-6 md:px-0 md:max-w-3xl">
              <h1 className="font-headline text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-tight text-balance">
                {courseDetails.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - First on mobile, second on desktop */}
          <div className="lg:col-span-1 order-1 lg:order-2 space-y-8">
            {slug === "intravenous-therapy-online" && (
              <div className="video-wrapper">
                <video
                  key={slug}
                  autoPlay={!isMobile}
                  preload="metadata"
                  playsInline
                  controls
                  className="video-sidebar"
                  data-autopause-video
                >
                  <source
                    src="/video-cursos/mex-col-suero.mp4"
                    type="video/mp4"
                  />
                  {language === "es"
                    ? "Tu navegador no soporta la reproducción de video."
                    : "Your browser does not support video playback."}
                </video>
              </div>
            )}
            {slug === "master-class-facial-modeling" && (
              <div className="video-wrapper">
                <video
                  key={slug}
                  autoPlay={!isMobile}
                  preload="metadata"
                  playsInline
                  controls
                  className="video-sidebar"
                  data-autopause-video
                >
                  <source
                    src="/video-cursos/mex-col-master.mp4"
                    type="video/mp4"
                  />
                  {language === "es"
                    ? "Tu navegador no soporta la reproducción de video."
                    : "Your browser does not support video playback."}
                </video>
              </div>
            )}
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle>
                  {language === "es"
                    ? "Información del Curso"
                    : "Course Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(courseDetails as any).format && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {language === "es" ? "Formato" : "Format"}
                      </p>
                      <p className="text-sm text-[#475569]">
                        {(courseDetails as any).format}
                      </p>
                    </div>
                  </div>
                )}

                {courseDetails.duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {language === "es" ? "Duración" : "Duration"}
                      </p>
                      <p className="text-sm text-[#475569]">
                        {courseDetails.duration}
                      </p>
                    </div>
                  </div>
                )}

                {courseDetails.schedule && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {language === "es" ? "Horario" : "Schedule"}
                      </p>
                      <p className="text-sm text-[#475569]">
                        {courseDetails.schedule}
                      </p>
                    </div>
                  </div>
                )}

                {courseDetails.location && slug === "mini-lifting-colombia" && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {language === "es" ? "Ubicación" : "Location"}
                      </p>
                      <p className="text-sm text-[#475569]">
                        {courseDetails.location}
                      </p>
                    </div>
                  </div>
                )}

                {(courseDetails as any).certification && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">
                        {language === "es" ? "Certificación" : "Certification"}
                      </p>
                      <p className="text-sm text-[#475569]">
                        {(courseDetails as any).certification}
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Inverted buttons: WhatsApp first, Enroll second */}
                <Button className="w-full btn-modern" size="lg" asChild>
                  <a
                    href={`https://wa.me/${
                      language === "es" ? "5215566308602" : "14074540524"
                    }?text=${encodeURIComponent(
                      language === "es"
                        ? `¡Hola! estoy interesado en el ${courseDetails.title} de Colombia`
                        : `Hello! I would love to receive more information about the ${courseDetails.title} from Colombia`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="w-7 h-7 mr-2" />
                    {language === "es"
                      ? "Solicitar Información"
                      : "Request Information"}
                  </a>
                </Button>

                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href="/contact">
                    {language === "es" ? "Inscribirse Ahora" : "Enroll Now"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            {/* Target Audience */}
            {(courseDetails as any).targetAudience && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    {(courseDetails as any).targetAudience.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-2xl font-bold text-[#1F2937] text-center">
                      {(courseDetails as any).targetAudience.highlighted}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(
                      (courseDetails as any).targetAudience.description
                    ) ? (
                      (courseDetails as any).targetAudience.description.map(
                        (paragraph: string, idx: number) => (
                          <p
                            key={idx}
                            className="text-sm text-[#475569] leading-relaxed"
                          >
                            {formatText(paragraph)}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-sm text-[#475569] leading-relaxed">
                        {formatText(
                          (courseDetails as any).targetAudience.description
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Objectives */}
            {courseDetails.objectives && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    {language === "es"
                      ? "Objetivos de Aprendizaje"
                      : "Learning Objectives"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {courseDetails.objectives.map(
                      (objective: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-sm text-[#475569] pt-0.5">
                            {objective}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Curriculum */}
            {courseDetails.curriculum && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    {language === "es"
                      ? "Estructura del curso"
                      : "Course structure"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseDetails.curriculum.map((module: any, idx: number) => (
                    <div
                      key={idx}
                      className="border-l-2 border-primary/30 pl-4"
                    >
                      <h4 className="font-semibold text-[#475569] mb-2">
                        {module.title.startsWith("**")
                          ? formatText(module.title)
                          : module.title}
                      </h4>
                      <ul className="space-y-1">
                        {module.topics.map(
                          (topic: string, topicIdx: number) => {
                            const previousTopic =
                              topicIdx > 0 ? module.topics[topicIdx - 1] : "";
                            const hasNewLines =
                              previousTopic &&
                              (previousTopic.includes("\\n\\n") ||
                                previousTopic.includes("\n\n") ||
                                previousTopic.endsWith("\\n\\n") ||
                                previousTopic.endsWith("\n\n"));
                            const isNewSection =
                              topic.startsWith("**") && topicIdx > 0;
                            const hasSpacing = hasNewLines || isNewSection;
                            const isLongText =
                              topic.includes("\n") && topic.length > 200;
                            const isLongParagraph =
                              topic.length > 200 && !topic.includes("\n");
                            const startsWithNewline = topic.startsWith("\n");
                            const startsWithNumber = /^\d+\./.test(
                              topic.trim()
                            );
                            const showBullet =
                              topicIdx !== 0 &&
                              !topic.startsWith("**") &&
                              !topic.includes(
                                "Master modeling techniques in:"
                              ) &&
                              !topic.includes(
                                "Master modeling techniques for:"
                              ) &&
                              !topic.includes(
                                "Domina técnicas de modelado en:"
                              ) &&
                              !topic.includes(
                                "Learn to relax facial muscles to prevent and treat expression lines in:"
                              ) &&
                              !topic.includes(
                                "Aprende a relajar los músculos faciales para prevenir y tratar líneas de expresión en:"
                              ) &&
                              !topic.includes(
                                "Apply rejuvenation protocols with immediate lifting effect in:"
                              ) &&
                              !topic.includes(
                                "Apply rejuvenation protocols with immediate lifting effect for:"
                              ) &&
                              !topic.includes(
                                "Apply rejuvenation protocols with **immediate lifting effect** for:"
                              ) &&
                              !topic.includes(
                                "Apply rejuvenation protocols with immediate lifting effects in:"
                              ) &&
                              !topic.includes(
                                "Aplica protocolos de rejuvenecimiento con efecto lifting inmediato en:"
                              ) &&
                              !topic.includes(
                                "Know the main biostimulators available in the market and their application in:"
                              ) &&
                              !topic.includes(
                                "Conoce los principales bioestimuladores disponibles en el mercado y su aplicación en:"
                              ) &&
                              !topic.includes(
                                "Learn about the main bio-stimulators available in the market and their application in:"
                              ) &&
                              !topic.includes(
                                "Learn about leading biostimulators available in the market and their applications in:"
                              ) &&
                              !topic.includes(
                                "Discover the main biostimulators available on the market and their application for:"
                              ) &&
                              !topic.includes("Demonstrative Practice") &&
                              !topic.includes("Práctica Demostrativa") &&
                              !topic.includes("Delivery of Certificates") &&
                              !topic.includes("Entrega de Certificados") &&
                              !topic.includes("Photographic record") &&
                              !topic.includes("Registro fotográfico") &&
                              !topic.includes("Final Exam") &&
                              !topic.includes("Examen Final") &&
                              !topic.includes("Upon passing") &&
                              !topic.includes("Al aprobar") &&
                              !isLongText &&
                              !isLongParagraph &&
                              !startsWithNewline &&
                              !startsWithNumber;
                            return (
                              <li
                                key={topicIdx}
                                className={`text-sm ${
                                  isLongText || isLongParagraph
                                    ? "block"
                                    : "flex items-start gap-2"
                                } ${
                                  topicIdx === 0 &&
                                  !isLongText &&
                                  !isLongParagraph
                                    ? "text-[#475569] font-semibold"
                                    : "text-[#475569]"
                                } ${hasSpacing ? "!mt-8" : ""} ${
                                  startsWithNumber || isLongParagraph
                                    ? "list-none"
                                    : ""
                                }`}
                              >
                                {showBullet && (
                                  <span className="text-[#475569]">•</span>
                                )}
                                <span
                                  className={`${
                                    topicIdx === 0 && !isLongText ? "" : ""
                                  } whitespace-pre-line`}
                                >
                                  {formatText(topic)}
                                </span>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Includes */}
            {(courseDetails as any).includes && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-6 w-6 text-primary" />
                    {language === "es" ? "El Curso Incluye" : "Course Includes"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(courseDetails as any).includes.map(
                      (item: string, idx: number) => {
                        const isBulletItem = item.startsWith("•");
                        const displayText = isBulletItem
                          ? item.substring(2)
                          : item;
                        const isTitle =
                          !isBulletItem &&
                          (displayText.startsWith("**") ||
                            displayText.includes(
                              "**Digital Support Material**"
                            ) ||
                            displayText.includes(
                              "**Material de Apoyo Digital**"
                            ) ||
                            displayText.includes(
                              "**Exclusive Audiovisual Content:**"
                            ) ||
                            displayText.includes(
                              "**Contenido Audiovisual Exclusivo:**"
                            ));
                        const isIntroText =
                          !isBulletItem &&
                          !isTitle &&
                          (displayText.includes("At the end of the course") ||
                            displayText.includes("Al finalizar el curso"));
                        const isFinalText =
                          !isBulletItem && displayText.startsWith("✨");
                        const showIcon =
                          !isTitle &&
                          !isIntroText &&
                          !isFinalText &&
                          !isBulletItem;

                        return (
                          <li
                            key={idx}
                            className={
                              isBulletItem
                                ? "flex items-start gap-2 text-sm ml-6"
                                : isTitle
                                ? "flex items-start gap-2 text-sm font-semibold"
                                : "flex items-start gap-2 text-sm"
                            }
                          >
                            {isBulletItem && (
                              <span className="text-[#475569] mt-0.5 flex-shrink-0 font-bold">
                                •
                              </span>
                            )}
                            {showIcon && (
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            )}
                            <span
                              className={`text-[#475569] ${
                                isTitle || isIntroText || isFinalText
                                  ? "whitespace-pre-line"
                                  : ""
                              }`}
                            >
                              {formatText(displayText)}
                            </span>
                          </li>
                        );
                      }
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Accreditations */}
            {(courseDetails as any).accreditations && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    {language === "es"
                      ? "Avales y Respaldos"
                      : "Accreditations"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(courseDetails as any).accreditations.map(
                      (accr: string, idx: number) => {
                        const isBulletItem = accr.startsWith("•");
                        const displayText = isBulletItem
                          ? accr.substring(1).trim()
                          : accr;
                        return (
                          <div
                            key={idx}
                            className={`text-sm text-[#475569] whitespace-pre-line ${
                              isBulletItem ? "flex items-start gap-2" : ""
                            }`}
                          >
                            {isBulletItem && (
                              <span className="text-[#475569] mt-0.5 flex-shrink-0 font-bold">
                                •
                              </span>
                            )}
                            <span>{formatText(displayText)}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product Quality */}
            {(courseDetails as any).productQuality && (
              <Card className="border-primary/20 overflow-hidden">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    {(courseDetails as any).productQuality.title ||
                      (language === "es"
                        ? "Productos de Calidad y Seguridad Garantizada"
                        : "Quality Products and Guaranteed Safety")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {(courseDetails as any).productQuality.description && (
                    <div className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                      {formatText(
                        (courseDetails as any).productQuality.description
                      )}
                    </div>
                  )}

                  {/* Products Carousel - Only show if there are certifications */}
                  {(courseDetails as any).productQuality.certifications &&
                    (courseDetails as any).productQuality.certifications
                      .length > 0 && (
                      <div className="mt-8 -mx-6">
                        <ProductsMarquee />
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Comentarios - Solo para curso de sueroterapia de Colombia */}
            {slug === "intravenous-therapy-online" && (
              <Card className="border-primary/20 overflow-hidden">
                <CardContent className="pt-6">
                  {/* Desktop: Grid con 3 imágenes lado a lado */}
                  <div className="hidden md:grid md:grid-cols-3 gap-6">
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-primary/10 shadow-sm bg-muted/50">
                      <Image
                        src={comentario1}
                        alt="Comentario 1"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-primary/10 shadow-sm bg-muted/50 p-4">
                      <Image
                        src={comentario2}
                        alt="Comentario 2"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-primary/10 shadow-sm bg-muted/50 p-4">
                      <Image
                        src={comentario3}
                        alt="Comentario 3"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>

                  {/* Mobile: Carrusel con transición automática */}
                  <div className="md:hidden relative w-full overflow-hidden rounded-lg pb-12">
                    <div
                      ref={carouselRef}
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                      }}
                    >
                      <div className="min-w-full relative aspect-[4/3] bg-muted/50 p-2">
                        <Image
                          src={comentario1}
                          alt="Comentario 1"
                          fill
                          className="object-contain"
                          sizes="100vw"
                        />
                      </div>
                      <div className="min-w-full relative aspect-[4/3] bg-muted/50 p-2">
                        <Image
                          src={comentario2}
                          alt="Comentario 2"
                          fill
                          className="object-contain"
                          sizes="100vw"
                        />
                      </div>
                      <div className="min-w-full relative aspect-[4/3] bg-muted/50 p-2">
                        <Image
                          src={comentario3}
                          alt="Comentario 3"
                          fill
                          className="object-contain"
                          sizes="100vw"
                        />
                      </div>
                    </div>
                    {/* Indicadores de slide */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3 items-center">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          className={`rounded-full transition-all ${
                            currentSlide === index
                              ? "w-6 h-2 bg-primary"
                              : "w-2 h-2 bg-primary/40 hover:bg-primary/60"
                          }`}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Ir a comentario ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Testimonial Video */}
            {(courseDetails as any).testimonial && (
              <Card className="border-primary/20 overflow-hidden bg-background">
                <CardHeader className="text-center border-b bg-primary/10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Play className="h-6 w-6 text-primary animate-pulse" />
                    <CardTitle className="text-2xl">
                      {(courseDetails as any).testimonial.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm font-semibold text-[#475569]">
                    {(courseDetails as any).testimonial.subtitle}
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {slug === "master-class-facial-modeling" && (
                    <div className="mt-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          "/video-testimonios/testimonios-armonizacion-col/armonizacion-colombia-1.mp4",
                          "/video-testimonios/testimonios-armonizacion-col/armonizacion-colombia-2.mp4",
                          "/video-testimonios/testimonios-armonizacion-col/armonizacion-colombia-3.mp4",
                          "/video-testimonios/testimonios-armonizacion-col/armonizacion-colombia-4.mp4",
                        ].map((videoSrc, idx) => (
                          <div key={idx} className="flex justify-center">
                            <VideoCard type="local" src={videoSrc} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#475569]">
                      {language === "es"
                        ? "Testimonio Verificado"
                        : "Verified Testimonial"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Duplicated Quick Info Buttons at the end - Mobile UX improvement */}
        <div className="mt-12 lg:hidden">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Button className="w-full btn-modern" size="lg" asChild>
                <a
                  href={`https://wa.me/${
                    language === "es" ? "5215566308602" : "14074540524"
                  }?text=${encodeURIComponent(
                    language === "es"
                      ? `¡Hola! estoy interesado en el ${courseDetails.title} de Colombia`
                      : `Hello! I would love to receive more information about the course: ${courseDetails.title} from Colombia`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="w-7 h-7 mr-2" />
                  {language === "es"
                    ? "Solicitar Información"
                    : "Request Information"}
                </a>
              </Button>

              <Button variant="outline" className="w-full" size="lg" asChild>
                <Link href="/contact">
                  {language === "es" ? "Inscribirse Ahora" : "Enroll Now"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back to Programs Button at the end */}
        <div className="mt-12 text-center">
          <Link
            href="/academic-programs?country=colombia"
            className="inline-flex items-center gap-2 text-foreground hover:text-[#10b981] transition-colors duration-200 underline-offset-4 hover:underline decoration-[#10b981]"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === "es" ? "Volver a Programas" : "Back to Programs"}
          </Link>
        </div>
      </div>
    </div>
  );
}
