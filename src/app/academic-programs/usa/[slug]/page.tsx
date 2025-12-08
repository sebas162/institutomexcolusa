'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  CreditCard
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '@/hooks/use-language';
import { translations } from '@/lib/i18n';
import { formatText } from '@/lib/utils/text-formatting';
import ProductsMarquee from '@/components/shared/ProductsMarquee';
import LogoUSAVerde from '@/assets/logo-sello-blanco2.png';
import MasterClassUSA from '@/assets/img-heros/img-hero-cursos/master-class-USA.png';
import SueroUSA from '@/assets/img-heros/img-hero-cursos/suero-USA.png';
import MiniLiftingUSA from '@/assets/img-heros/img-hero-cursos/mini-lifting-USA.png';
import FlebotomiaUSA from '@/assets/img-heros/img-hero-cursos/flebotomia-USA.png';
import { useAutoPauseVideos } from '@/hooks/use-auto-pause-videos';

// Mapeo de rutas de imágenes a imports
const imageMap: Record<string, any> = {
  '@/assets/img-heros/img-hero-cursos/master-class-USA.png': MasterClassUSA,
  '@/assets/img-heros/img-hero-cursos/suero-USA.png': SueroUSA,
  '@/assets/img-heros/img-hero-cursos/mini-lifting-USA.png': MiniLiftingUSA,
  '@/assets/img-heros/img-hero-cursos/flebotomia-USA.png': FlebotomiaUSA,
};

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { language } = useLanguage();
  const t = translations[language].academicPrograms;
  const courseDetails = (t.countries.usa.courseDetails as any)?.[slug];

  useAutoPauseVideos();

  if (!courseDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Course not found</h1>
        <Button asChild>
          <Link href="/academic-programs?country=usa">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Programs
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
        className="relative w-full section-modern h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <Image
            src={imageMap[courseDetails.heroImage] || courseDetails.heroImage || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1600&auto=format&fit=crop'}
            alt={courseDetails.title}
            fill
            className="object-cover"
            priority
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
              <Link href="/academic-programs?country=usa">
                <ArrowLeft className="h-4 w-4" />
                {language === 'es' ? 'Volver a Programas' : 'Back to Programs'}
              </Link>
            </Button>
            <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32">
              <Image
                src={LogoUSAVerde}
                alt="Instituto MexCol USA Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
          <div className="mt-60 md:mt-auto flex flex-col text-white gap-3 pb-6 md:pb-12 lg:pb-16 ml-5">
            <Badge className="w-fit bg-primary text-primary-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              USA
            </Badge>
            <div className="flex flex-col gap-3 w-full md:max-w-3xl">
              <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
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
            {slug === 'intravenous-therapy-chelation' && (
              <div className="overflow-hidden rounded-2xl border border-primary/20 shadow-lg">
                <video
                  key={slug}
                  autoPlay
                  playsInline
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover bg-black"
                  data-autopause-video
                >
                  <source src="/video-cursos/mex-col-suero.mp4" type="video/mp4" />
                  {language === 'es'
                    ? 'Tu navegador no soporta la reproducción de video.'
                    : 'Your browser does not support video playback.'}
                </video>
              </div>
            )}
            {slug === 'master-class-4-techniques' && (
              <div className="overflow-hidden rounded-2xl border border-primary/20 shadow-lg">
                <video
                  key={slug}
                  autoPlay
                  playsInline
                  controls
                  preload="metadata"
                  className="w-full h-full object-cover bg-black"
                  data-autopause-video
                >
                  <source src="/video-cursos/mex-col-master.mp4" type="video/mp4" />
                  {language === 'es'
                    ? 'Tu navegador no soporta la reproducción de video.'
                    : 'Your browser does not support video playback.'}
                </video>
              </div>
            )}
            <Card className="lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle>{language === 'es' ? 'Información del Curso' : 'Course Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(courseDetails as any).format && (
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{language === 'es' ? 'Formato' : 'Format'}</p>
                      <p className="text-sm text-[#475569]">{(courseDetails as any).format}</p>
                    </div>
                  </div>
                )}

                {courseDetails.duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{language === 'es' ? 'Duración' : 'Duration'}</p>
                      <p className="text-sm text-[#475569]">{courseDetails.duration}</p>
                    </div>
                  </div>
                )}

                {courseDetails.schedule && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{language === 'es' ? 'Horario' : 'Schedule'}</p>
                      <p className="text-sm text-[#475569]">{courseDetails.schedule}</p>
                    </div>
                  </div>
                )}

                {courseDetails.location && slug === 'phlebotomy-technician' && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{language === 'es' ? 'Ubicación' : 'Location'}</p>
                      <p className="text-sm text-[#475569]">{courseDetails.location}</p>
                    </div>
                  </div>
                )}

                {(courseDetails as any).certification && (
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{language === 'es' ? 'Certificación' : 'Certification'}</p>
                      <p className="text-sm text-[#475569]">{(courseDetails as any).certification}</p>
                    </div>
                  </div>
                )}

                {(courseDetails as any).idCard && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{language === 'es' ? 'ID Card' : 'ID Card'}</p>
                      <p className="text-sm text-[#475569]">{(courseDetails as any).idCard}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Inverted buttons: WhatsApp first, Enroll second */}
                <Button
                  className="w-full btn-modern"
                  size="lg"
                  asChild
                >
                  <a
                    href={`https://wa.me/${language === 'es' ? '5215566308602' : '14074540524'}?text=${encodeURIComponent(
                      language === 'es'
                        ? `Hola, estoy interesado en el ${courseDetails.title} de Estados Unidos`
                        : `Hello! I would love to receive more information about the ${courseDetails.title} from USA`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="w-7 h-7 mr-2" />
                    {language === 'es' ? 'Solicitar Información' : 'Request Information'}
                  </a>
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                  asChild
                >
                  <Link href="/contact">
                    {language === 'es' ? 'Inscribirse Ahora' : 'Enroll Now'}
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
                    {(courseDetails as any).targetAudience.description.split('\n\n').map((paragraph: string, idx: number) => (
                      <p key={idx} className="text-sm text-[#475569] leading-relaxed">
                        {formatText(paragraph)}
                      </p>
                    ))}
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
                    {language === 'es' ? 'Objetivos de Aprendizaje' : 'Learning Objectives'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {courseDetails.objectives.map((objective: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-sm text-[#475569] pt-0.5">{objective}</span>
                      </li>
                    ))}
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
                    {language === 'es' ? 'Estructura del curso' : 'Course structure'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseDetails.curriculum.map((module: any, idx: number) => (
                    <div key={idx} className="border-l-2 border-primary/30 pl-4">
                      <h4 className="font-semibold text-[#475569] mb-2">{module.title.startsWith('**') ? formatText(module.title) : module.title}</h4>
                      <ul className="space-y-1">
                        {module.topics.map((topic: string, topicIdx: number) => {
                          const previousTopic = topicIdx > 0 ? module.topics[topicIdx - 1] : '';
                          const hasNewLines = previousTopic && (previousTopic.includes('\\n\\n') || previousTopic.includes('\n\n') || previousTopic.endsWith('\\n\\n') || previousTopic.endsWith('\n\n'));
                          const isNewSection = topic.startsWith('**') && topicIdx > 0;
                          const hasSpacing = hasNewLines || isNewSection;
                          const isLongText = topic.includes('\n') && topic.length > 200;
                          const isLongParagraph = topic.length > 200 && !topic.includes('\n');
                          const startsWithNewline = topic.startsWith('\n');
                          const startsWithNumber = /^\d+\./.test(topic.trim());
                          const showBullet = topicIdx !== 0 && !topic.startsWith('**') && !topic.includes('Master modeling techniques in:') && !topic.includes('Domina técnicas de modelado en:') && !topic.includes('Learn to relax facial muscles to prevent and treat expression lines in:') && !topic.includes('Aprende a relajar los músculos faciales para prevenir y tratar líneas de expresión en:') && !topic.includes('Apply rejuvenation protocols with immediate lifting effect in:') && !topic.includes('Aplica protocolos de rejuvenecimiento con efecto lifting inmediato en:') && !topic.includes('Know the main biostimulators available in the market and their application in:') && !topic.includes('Conoce los principales bioestimuladores disponibles en el mercado y su aplicación en:') && !topic.includes('Learn about the main bio-stimulators available in the market and their application in:') && !topic.includes('Demonstrative Practice') && !topic.includes('Práctica Demostrativa') && !topic.includes('Delivery of Certificates') && !topic.includes('Entrega de Certificados') && !topic.includes('Photographic record') && !topic.includes('Registro fotográfico') && !topic.includes('Final Exam') && !topic.includes('Examen Final') && !topic.includes('Upon passing') && !topic.includes('Al aprobar') && !isLongText && !isLongParagraph && !startsWithNewline && !startsWithNumber;
                          return (
                            <li key={topicIdx} className={`text-sm ${isLongText || isLongParagraph ? 'block' : 'flex items-start gap-2'} ${topicIdx === 0 && !isLongText && !isLongParagraph ? 'text-[#475569] font-semibold' : 'text-[#475569]'} ${hasSpacing ? '!mt-8' : ''} ${startsWithNumber || isLongParagraph ? 'list-none' : ''}`}>
                              {showBullet && <span className="text-[#475569]">•</span>}
                              <span className={`${topicIdx === 0 && !isLongText ? '' : ''} whitespace-pre-line`}>{formatText(topic)}</span>
                            </li>
                          );
                        })}
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
                    {language === 'es' ? 'El Curso Incluye' : 'Course Includes'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(courseDetails as any).includes.map((item: string, idx: number) => {
                      const isBulletItem = item.startsWith('•');
                      const displayText = isBulletItem ? item.substring(2) : item;
                      const isTitle = !isBulletItem && (displayText.startsWith('**') || displayText.includes('**Digital Support Material**') || displayText.includes('**Material de Apoyo Digital**') || displayText.includes('**Exclusive Audiovisual Content:**') || displayText.includes('**Contenido Audiovisual Exclusivo:**'));
                      const isIntroText = !isBulletItem && !isTitle && (displayText.includes('At the end of the course') || displayText.includes('Al finalizar el curso'));
                      const isFinalText = !isBulletItem && displayText.startsWith('✨');
                      const showIcon = !isTitle && !isIntroText && !isFinalText && !isBulletItem;

                      return (
                        <li key={idx} className={isBulletItem ? "flex items-start gap-2 text-sm ml-6" : isTitle ? "flex items-start gap-2 text-sm font-semibold" : "flex items-start gap-2 text-sm"}>
                          {isBulletItem && (
                            <span className="text-[#475569] mt-0.5 flex-shrink-0 font-bold">•</span>
                          )}
                          {showIcon && (
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`text-[#475569] ${isTitle || isIntroText || isFinalText ? "whitespace-pre-line" : ""}`}>{formatText(displayText)}</span>
                        </li>
                      );
                    })}
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
                    {language === 'es' ? 'Avales y Respaldos' : 'Accreditations'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(courseDetails as any).accreditations.map((accr: string, idx: number) => (
                      <div key={idx} className="text-sm text-[#475569] whitespace-pre-line">
                        {formatText(accr)}
                      </div>
                    ))}
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
                    {(courseDetails as any).productQuality.title || (language === 'es' ? 'Productos de Calidad y Seguridad Garantizada' : 'Quality Products and Guaranteed Safety')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {(courseDetails as any).productQuality.description && (
                    <div className="text-sm text-[#475569] leading-relaxed whitespace-pre-line">
                      {formatText((courseDetails as any).productQuality.description)}
                    </div>
                  )}

                  {/* Products Carousel - Only show if there are certifications */}
                  {(courseDetails as any).productQuality.certifications && (courseDetails as any).productQuality.certifications.length > 0 && (
                    <div className="mt-8 -mx-6">
                      <ProductsMarquee />
                    </div>
                  )}
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
                <CardContent className="p-6 space-y-4">
                  <div className="relative w-full overflow-hidden rounded-lg shadow-xl" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${(courseDetails as any).testimonial.videoId}`}
                      title="Course testimonial"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#475569]">
                      {language === 'es' ? 'Testimonio Verificado' : 'Verified Testimonial'}
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
              <Button
                className="w-full btn-modern"
                size="lg"
                asChild
              >
                <a
                  href={`https://wa.me/${language === 'es' ? '5215566308602' : '14074540524'}?text=${encodeURIComponent(
                    language === 'es'
                      ? `Hola, estoy interesado en el ${courseDetails.title} de Estados Unidos`
                      : `Hello! I would love to receive more information about the course: ${courseDetails.title} from USA`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="w-7 h-7 mr-2" />
                  {language === 'es' ? 'Solicitar Información' : 'Request Information'}
                </a>
              </Button>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                asChild
              >
                <Link href="/contact">
                  {language === 'es' ? 'Inscribirse Ahora' : 'Enroll Now'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Back to Programs Button at the end */}
        <div className="mt-12 text-center">
          <Link
            href="/academic-programs?country=usa"
            className="inline-flex items-center gap-2 text-foreground hover:text-[#10b981] transition-colors duration-200 underline-offset-4 hover:underline decoration-[#10b981]"
          >
            <ArrowLeft className="h-4 w-4" />
            {language === 'es' ? 'Volver a Programas' : 'Back to Programs'}
          </Link>
        </div>
      </div>
    </div>
  );
}

