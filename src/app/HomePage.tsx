"use client";
import Image from "next/image";
import Link from "next/link";
import PrefetchLink from "@/components/shared/PrefetchLink";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  BookOpen,
  Video,
  Award,
  Star,
  Quote,
  MapPin,
  Facebook,
  Ticket,
} from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import BrandMarquee from "@/components/shared/BrandMarquee";
import { useLanguage } from "@/hooks/use-language";
import { useAutoPauseVideos } from "@/hooks/use-auto-pause-videos";
import { translations } from "@/lib/i18n";
import InicioBanner from "@/assets/img-heros/hero-home.webp";
import LogoUSAVerde from "@/assets/logo-sello-blanco2.png";
import MasterclassUSA from "@/assets/img-heros/masterclass-usa.webp";
import SueroMexico from "@/assets/img-heros/suero-mexico.webp";
import MiniLiftingColombia from "@/assets/img-heros/3-puntos-colombia.webp";

// Dynamic imports for below-the-fold components
const CouponForm = dynamic(() => import("@/components/home/CouponForm"), {
  ssr: false,
  loading: () => <Skeleton className="h-10 w-full" />,
});

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const th = t.home;

  useAutoPauseVideos();

  const features = [
    {
      icon: <GraduationCap className="h-10 w-10 text-primary" />,
      title: t.features.expertInstructors.title,
      description: t.features.expertInstructors.description,
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: t.features.flexibleLearning.title,
      description: t.features.flexibleLearning.description,
    },
    {
      icon: <Video className="h-10 w-10 text-primary" />,
      title: t.features.interactiveContent.title,
      description: t.features.interactiveContent.description,
    },
    {
      icon: <Award className="h-10 w-10 text-primary" />,
      title: t.features.valuableCertificates.title,
      description: t.features.valuableCertificates.description,
    },
  ];

  return (
    <div className="flex flex-col">
      <section
        /* className="relative w-full section-modern"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern min-h-[500px] sm:min-h-[600px] md:h-screen -mt-16"
      >
        {/* Background Image - LCP Critical */}
        <div className="absolute inset-0">
          <Image
            src={InicioBanner}
            alt="Instituto MexCol Banner"
            fill
            className="object-cover"
            priority
            fetchPriority="high"
            quality={75}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 h-full container mx-auto px-4 flex flex-col">
          <div className="flex justify-end pt-4 md:pt-8 lg:pt-6 pr-4 md:pr-4 lg:pr-6">
            <div className="relative w-20 h-20 mt-16 md:w-32 md:h-32 lg:w-36 lg:h-36">
              <Image
                src={LogoUSAVerde}
                alt="Instituto MexCol USA Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          <div className="mt-60 flex flex-col items-center text-center md:items-start md:text-left text-white gap-3 pb-6 md:pb-12 lg:pb-16 md:ml-5">
            <h1 className="text-white text-4xl md:text-5xl font-semibold text-center md:text-left drop-shadow-lg">
              {language === "es"
                ? "Instituto Mex – Col – USA"
                : "Institute Mex – Col – USA"}
            </h1>
            <p className="mt-2 text-white/90 text-lg md:text-xl leading-relaxed drop-shadow-md max-w-xl md:max-w-2xl text-center md:text-left">
              {language === "es"
                ? "Educación continua internacional en medicina estética"
                : "International Continuing Education in Aesthetic Medicine"}
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                asChild
                size="lg"
                className="btn-modern px-8 py-4 text-lg"
              >
                <PrefetchLink href="/academic-programs">
                  {language === "es"
                    ? "Ver Programas Académicos"
                    : "Explore Academic Programs"}
                </PrefetchLink>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg borde-none text-[#1f2937] hover:bg-white"
              >
                <PrefetchLink href="/contact">
                  {language === "es" ? "Contáctanos" : "Contact Us"}
                </PrefetchLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="online-training"
        className="py-20 md:py-28"
        style={{ backgroundColor: "#285F65" }}
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="font-headline text-4xl font-bold tracking-tight sm:text-5xl mb-6"
              style={{ color: "#FFFFFF" }}
            >
              {th.onlineTraining.title}
            </h2>
            <p
              className="mt-6 text-xl leading-relaxed max-w-3xl mx-auto"
              style={{ color: "#FFFFFF" }}
            >
              {th.onlineTraining.intro}
            </p>
            <div className="mt-10">
              <Button
                asChild
                size="lg"
                className="border border-[#ECFDF5] text-[#FFFFFF] bg-transparent hover:text-white px-8 py-4 text-lg"
              >
                <PrefetchLink href="/online-training">
                  {th.onlineTraining.viewRecorded}
                </PrefetchLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/*       <hr className="h-[1px] w-full border-0 bg-gradient-to-r from-transparent via-primary to-transparent" />
       */}
      <section id="featured-programs" className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="font-headline text-4xl font-bold tracking-tight sm:text-5xl mb-4"
              style={{ color: "#285F65" }}
            >
              {th.featuredPrograms.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {th.featuredPrograms.cards.map((c, i) => (
              <Card key={i} className="modern-card overflow-hidden group">
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={
                      c.country === "USA"
                        ? MasterclassUSA
                        : c.country === "México" || c.country === "Mexico"
                        ? SueroMexico
                        : c.country === "Colombia"
                        ? MiniLiftingColombia
                        : c.image
                    }
                    alt={c.country}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className="text-sm font-medium px-3 py-1"
                    >
                      {c.country}
                    </Badge>
                  </div>
                  <CardTitle className="font-headline text-xl leading-tight">
                    {c.course}
                  </CardTitle>
                </CardHeader>
                {/* <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.description}</p>
                </CardContent> */}
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="btn-modern px-8 py-4 text-lg">
              <PrefetchLink href="/academic-programs">
                {th.featuredPrograms.viewMore}
              </PrefetchLink>
            </Button>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="py-20 md:py-28 section-modern section-testimonials"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-white mb-4">
              {th.testimonials.title}
            </h2>
            <p className="text-lg text-white">{th.testimonials.sub}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 md:px-16 shadow-lg">
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[Autoplay({ delay: 4000 })]}
            >
              <CarouselContent className="items-center">
                {Array.from({ length: 11 }, (_, idx) => (
                  <CarouselItem key={idx} className="sm:basis-1/2 lg:basis-1/3">
                    <div className="relative w-full h-full group flex items-center justify-center min-h-[400px] px-2">
                      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white w-full flex items-center justify-center">
                        <Image
                          src={`/testimonios-inicio/testimonio-${idx + 1}.png`}
                          alt={`Testimonio ${idx + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-auto max-h-[500px] object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                          quality={95}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12 bg-white border-2 border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/5" />
              <CarouselNext className="hidden md:flex -right-12 bg-white border-2 border-primary/20 hover:border-primary/40 text-primary hover:bg-primary/5" />
            </Carousel>
            <div className="mt-8 text-center mb-4">
              <p className="text-lg font-medium text-primary">
                {th.testimonials.reviewsText}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-gray-600 hover:bg-blue-50 focus-modern border"
              >
                <a
                  href="https://web.facebook.com/profile.php?id=100064823553168&sk=reviews&_rdc=1&_rdr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4 text-blue-600" />
                  {th.testimonials.facebook}
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-gray-600 hover:bg-red-50 focus-modern border"
              >
                <a
                  href="https://www.google.com/maps/place/Instituto+MexCol/@19.3953309,-99.1871588,16z/data=!4m8!3m7!1s0x85d1ff6a4e5eaaab:0x6d6262102c03bff3!8m2!3d19.3953309!4d-99.1845839!9m1!1b1!16s%2Fg%2F11flrplb83?entry=ttu&g_ep=EgoyMDI1MTAwMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {th.testimonials.googleMx}
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="text-gray-600 hover:bg-red-50 focus-modern border"
              >
                <a
                  href="https://www.google.com/maps/place/Instituto+Mexcol+Medicina+Est%C3%A9tica,+Belleza+y+Hol%C3%ADstica/@28.4500233,-81.3990457,17z/data=!4m17!1m10!3m9!1s0x88e77da778543991:0xbaca64c81f95f8b6!2sInstituto+Mexcol+Medicina+Est%C3%A9tica,+Belleza+y+Hol%C3%ADstica!8m2!3d28.4497642!4d-81.399351!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11rvg6gl56!3m5!1s0x88e77da778543991:0xbaca64c81f95f8b6!8m2!3d28.4497642!4d-81.399351!16s%2Fg%2F11rvg6gl56?entry=ttu&g_ep=EgoyMDI1MTAwNi4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {th.testimonials.googleUsa}
                </a>
              </Button>
            </div>

            {/* Video Section */}
            <div className="mt-10 flex flex-col md:flex-row justify-center gap-8">
              {/* Video 1 - Anuncio institucional */}
              <div className="w-full max-w-sm mx-auto md:max-w-2xl">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="
                    w-full
                    aspect-[9/16]
                    md:aspect-video
                    rounded-3xl
                    shadow-xl
                    bg-[#F5F7F8]
                    object-contain
                  "
                >
                  <source src="/anuncio-mexcol.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>

              {/* Video 2 - Testimonio médicos */}
              <div className="w-full max-w-sm mx-auto md:max-w-2xl">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="
                    w-full
                    aspect-[9/16]
                    md:aspect-video
                    rounded-3xl
                    shadow-xl
                    bg-[#F5F7F8]
                    object-contain
                  "
                >
                  <source src="/Ponentes.mp4" type="video/mp4" />
                  Tu navegador no soporta el elemento de video.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="brands" className="py-20 md:py-28 section-modern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-[#285F65] mb-4">
              {th.brands.title}
            </h2>
          </div>
          <BrandMarquee />
        </div>
      </section>

      <section
        id="contact-home"
        className="py-20 md:py-28 section-modern"
        style={{ backgroundColor: "#285F65" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-[#FFFFFF] mb-4">
              {th.contact.title}
            </h2>
            <p className="text-lg text-[#FFFFFF] mb-8">{th.contact.intro}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <Card
              className="hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <CardHeader>
                <div className="text-center">
                  <MapPin
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: "#285F65" }}
                  />
                  <CardTitle
                    className="font-semibold"
                    style={{ color: "#1F2937" }}
                  >
                    {th.contact.locations.coBogota.title}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card
              className="hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <CardHeader>
                <div className="text-center">
                  <MapPin
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: "#285F65" }}
                  />
                  <CardTitle
                    className="font-semibold mb-2"
                    style={{ color: "#1F2937" }}
                  >
                    {th.contact.locations.mx.title}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
            <Card
              className="hover:shadow-lg transition-all duration-300"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <CardHeader>
                <div className="text-center">
                  <MapPin
                    className="h-8 w-8 mx-auto mb-2"
                    style={{ color: "#285F65" }}
                  />
                  <CardTitle
                    className="font-semibold"
                    style={{ color: "#1F2937" }}
                  >
                    {th.contact.locations.usaOrlando.title}
                  </CardTitle>
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="border border-[#ECFDF5] text-[#FFFFFF] bg-transparent"
            >
              <PrefetchLink href="/contact">
                {th.contact.viewLocations}
              </PrefetchLink>
            </Button>
          </div>
        </div>
      </section>
      {/*<section id="coupon" className="py-20 md:py-28 section-modern relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-white">
       <div className="absolute inset-0 bg-black/20"></div>
       <div className="absolute inset-0 overflow-hidden">
         <div className="organic-shape w-96 h-96 top-10 left-10 opacity-10"></div>
         <div className="organic-shape w-80 h-80 bottom-10 right-10 opacity-5"></div>
       </div>
       
       <div className="container mx-auto px-4 relative z-10">
         <div className="mx-auto max-w-3xl text-center">
           <div className="flex justify-center mb-6">
             <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
               <Ticket className="h-12 w-12 text-white" />
             </div>
           </div>
           <h2 className="font-headline text-4xl text-white font-bold tracking-tight sm:text-5xl mb-6">
             {t.coupon.title}
           </h2>
           <p className="mt-6 text-xl text-white/90 leading-relaxed">
             {t.coupon.subtitle}
           </p>
           <div className="mt-10">
             <CouponForm />
           </div>
         </div>
       </div>
     </section>*/}
    </div>
  );
}
