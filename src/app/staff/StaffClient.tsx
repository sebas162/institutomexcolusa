"use client";

import Image, { type StaticImageData } from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import hero from "@/assets/img-heros/hero-directores.webp";
import DirectoraImage from "@/assets/img-ponentes/Directora.png";
import DirectoraMovil from "@/assets/img-ponentes/Directora-movil.png";
import RamosImage from "@/assets/img-ponentes/DR ramos.png";
import RamosMovil from "@/assets/img-ponentes/DR ramos-movil.png";
import AldoImage from "@/assets/img-ponentes/DR aldo.png";
import AldoMovil from "@/assets/img-ponentes/DR aldo-movil.png";
import BravoImage from "@/assets/img-ponentes/DR bravo.png";
import BravoMovil from "@/assets/img-ponentes/DR bravo-movil.png";
import HerreraImage from "@/assets/img-ponentes/DR juan herrera.png";
import HerreraMovil from "@/assets/img-ponentes/DR juan herrera-movil.png";
import GenerImage from "@/assets/img-ponentes/Dr gener.png";
import GenerMovil from "@/assets/img-ponentes/Dr gener-movil.png";
import AlejandroBravoImage from "@/assets/img-ponentes/Dr Alejandro Bravo.png";
import AlejandroBravoMovil from "@/assets/img-ponentes/Dr Alejandro Bravo-movil.png";
import CarolinaImage from "@/assets/img-ponentes/DR carolina.png";
import CarolinaMovil from "@/assets/img-ponentes/DR carolina-movil.png";
import LogoUSAVerde from "@/assets/logo-sello-blanco2.png";

type Lang = "es" | "en";

type Person = {
  name: string;
  role: string;
  photo: string | StaticImageData;
  bio: string;
};

export default function StaffClient() {
  const { language } = useLanguage();
  const lang: Lang = language === "es" ? "es" : "en";

  const heroTitle: Record<Lang, string> = {
    es: "Directores y Staff Médico",
    en: "Directors and Medical Staff",
  };

  const heroSubtitle: Record<Lang, string> = {
    es: "Conoce a nuestros líderes",
    en: "Meet our leaders",
  };

  const teamIntro: Record<Lang, string> = {
    es: "Nuestro equipo de directores y especialistas médicos es el pilar de nuestra institución. Contamos con médicos estéticos, cirujanos plásticos, ingenieros biomédicos, todos líderes en investigación y práctica estética. Su experiencia garantiza la calidad de cada programa y permite transmitir las últimas actualizaciones en técnicas médicas y de belleza.",
    en: "Our team of directors and medical specialists is the backbone of our institute. We have aesthetic physicians, plastic surgeons, and biomedical engineers, all leaders in research and aesthetic practice. Their expertise guarantees the quality of each program and enables us to share the latest updates in medical and beauty techniques.",
  };

  const directorGeneral: Record<Lang, Person> = {
    es: {
      name: "Jenny Aragon",
      role: "Directora General",
      photo: DirectoraImage,
      bio: "", // Bio is now rendered inline in the component
    },
    en: {
      name: "Jenny Aragon",
      role: "General Director",
      photo: DirectoraImage,
      bio: "", // Bio is now rendered inline in the component
    },
  };

  const medicalDirector: Record<Lang, Person> = {
    es: {
      name: "Dr. Carlos Alberto Ramos Corena",
      role: "Director Médico",
      photo: RamosImage,
      bio: "", // Bio is now rendered inline in the component
    },
    en: {
      name: "Dr. Carlos Alberto Ramos Corena",
      role: "Medical Director",
      photo: RamosImage,
      bio: "", // Bio is now rendered inline in the component
    },
  };

  const medicalDirectorLead: Record<Lang, string> = {
    es: "Médico y cirujano egresado de la Universidad Metropolitana de Barranquilla, Colombia.",
    en: "Medical Doctor graduated from Universidad Metropolitana de Barranquilla, Colombia.",
  };

  const medicalDirectorBio: Record<Lang, string> = {
    es: `Cuenta con especialidad en Cirugía Plástica y Estética por el Centro Universitario Redentor de Brasil.<br /><br />Ha sido condecorado por el Congreso de la República de Colombia por su destacada trayectoria, integridad y ética profesional.<br /><br />Reconocido internacionalmente en Europa, Norteamérica y Latinoamérica, el Dr. Ramos es conocido por su enfoque innovador y su compromiso con la excelencia, lo que le ha valido el reconocimiento de sus pacientes y colegas como "El cirujano de las Barbies".<br /><br />Actualmente se desempeña como Director Médico de las sedes México y Colombia del INSTITUTO MEX-COL-USA, institución referente en formación médica estética, belleza y bienestar holístico, reconocida por su alto nivel académico, calidad de ponentes y alianzas con los mejores laboratorios del mundo.`,
    en: `He holds a specialization in Plastic and Aesthetic Surgery from the Centro Universitario Redentor in Brazil.<br /><br />He has been honored by the Congress of the Republic of Colombia in recognition of his outstanding career, integrity, and professional ethics.<br /><br />Internationally recognized across Europe, North America, and Latin America, Dr. Ramos is known for his innovative approach and commitment to excellence, earning him recognition among patients and colleagues as "The Barbie Surgeon."<br /><br />He currently serves as Medical Director for the Mexico and Colombia branches of the INSTITUTO MEX-COL-USA, an institution renowned for its excellence in medical-aesthetic education, beauty, and holistic wellness, and distinguished by its high academic standards, exceptional faculty, and partnerships with leading laboratories worldwide.`,
  };

  const speakers: Record<Lang, Person[]> = {
    es: [
      {
        name: "Dr. Aldo Rubén Rendón Gutiérrez",
        role: "Médico Cirujano · Estética y Longevidad",
        photo: AldoImage,
        bio: "Médico Cirujano egresado de la Universidad Nacional Autónoma de Mexico UNAM Especialista en Estética y Longevidad egresado del Instituto de Estudios Superiores en Medicina.\n\nDirector en Laser & Body Clinic en la ciudad de Querétaro y speaker nacional para Allergan Medical Institute y Allergan Aesthetics.\n\nSpeaker y docente en Instituto Mexcol de la Ciudad de México, miembro del consenso mexicano para el manejo de eventos adversos.",
      },
      {
        name: "Dra. Carolina Carvajal",
        role: "Médico Cirujano · Estética Facial",
        photo: CarolinaImage,
        bio: "Médico Cirujano de la Universidad Central del Valle.\n\nEspecialista en estética del rostro por la Universidad COMPLUTENSE en Madrid, España.\n\nEnfocada en la atención integral del paciente, la prevención y el control de efectos adversos de procedimientos estéticos no quirúrgicos, con más de 6 años de experiencia junto a los mejores cirujanos plásticos de Colombia en ciudades como Cali, Bogotá y Medellín.",
      },
      {
        name: "Dr. Martín A. Bravo González",
        role: "Médico Cirujano · Inmunogenética y Biología Molecular",
        photo: BravoImage,
        bio: "Médico Cirujano con experiencia en medicina interna y medicina crítica, con maestría en ciencias e inmunogenética y Biología Molecular.\n\nProfesor invitado a Universidad Del Conde desde 2020, investigador clínico con 12 publicaciones nacionales y 9 internacionales y ganador de 3 premios a la investigación clínica.\n\nPonente internacional, asesor y docente, ha dictado más de 450 cursos de capacitación y alrededor de 600 pláticas científicas en congresos internacionales, nacionales y foros médicos. Cuenta con 33 años de experiencia en la industria farmacéutica (director médico de 13 laboratorios) y certificación en Medicina Regenerativa y uso de Células Madre por el International Society for Stem Cell Application (ISSCA).",
      },
      {
        name: "Dr. Alejandro Bravo",
        role: "Odontólogo · Antropólogo Forense · Experto en Ciencias Forenses",
        photo: AlejandroBravoImage,
        bio: "Profesional venezolano con formación en Odontología y Antropología Forense, especializado en el área de las Ciencias Forenses. Cuenta con un diplomado en Identificación Humana y Análisis de Restos Óseos, que respalda su experiencia en la aplicación de métodos científicos para la investigación forense y la identificación humana en contextos legales y académicos.\n\nPosee certificaciones internacionales como Phlebotomy Technician, Phlebotomy Instructor, Medical Assistant Instructor y ECG Instructor, que amplían su perfil en el ámbito clínico y docente.\n\nSu trayectoria combina la práctica forense, la salud y la educación, destacándose por su compromiso con la investigación científica, la formación de nuevos profesionales y la aplicación del conocimiento al servicio de la verdad y la justicia.",
      },
      {
        name: "Dr. Jorge Juan Herrera",
        role: "Médico Cirujano · Cirugía Estética y Docencia",
        photo: HerreraImage,
        bio: "Médico Cirujano de la Universidad Autónoma de México (UNAM).\n\nEspecialista en Medicina y Cirugía Estética por la Universidad Montpellier, Francia, con maestría en Cirugía Estética (IESM) y Doctorado en Ciencias Biomédicas por la UNAM.\n\nDoctor Honoris Causa por el Gobierno Federal de México – UNAM Claustro Nacional y por el CNHD Francia. Colaborador de protocolos clínicos de regeneración y revitalización cutánea del Hospital Shriners, docente en la Universidad La Salle, Anáhuac y Facultad de Medicina de la UNAM, y speaker en Allergan Aesthetics.",
      },
      {
        name: "Dr. Gener Alejandro Fajardo Ruiz",
        role: "Médico Cirujano · Medicina Estética y Cirugía Plástica",
        photo: GenerImage,
        bio: "Médico Cirujano de la Universidad Nacional de Colombia, especialista con maestría en medicina estética por la Universidad de las Islas Baleares, España.\n\nEspecialista en cirugía plástica, estética y reconstructiva por la Universidad de Almeida en Río de Janeiro, Brasil.\n\nActualmente ejerce su profesión y participó como jurado en el certamen de belleza Miss Colombia 2021.",
      },
    ],
    en: [
      {
        name: "Dr. Aldo Rubén Rendón Gutiérrez",
        role: "Physician and Surgeon · Aesthetic and Longevity Medicine",
        photo: AldoImage,
        bio: "Physician and Surgeon graduated from Universidad Nacional Autónoma de México (UNAM), with a specialization in Aesthetics and Longevity from Instituto de Estudios Superiores en Medicina.\n\nDirector at Laser & Body Clinic in Querétaro and national speaker for Allergan Medical Institute and Allergan Aesthetics.\n\nLecturer at Instituto MexCol in Mexico City and member of the Mexican Consensus for Adverse Event Management.",
      },
      {
        name: "Dr. Carolina Carvajal",
        role: "Physician and Surgeon · Facial Aesthetics",
        photo: CarolinaImage,
        bio: "Physician and Surgeon graduated from Universidad Central del Valle.\n\nSpecialist in facial aesthetics at Universidad Complutense in Madrid, Spain.\n\nFocused on comprehensive patient care, prevention, and management of adverse effects from non-surgical aesthetic procedures, with over 6 years of experience working alongside leading plastic surgeons in Colombia in cities such as Cali, Bogotá, and Medellín.",
      },
      {
        name: "Dr. Martín A. Bravo González",
        role: "Physician and Surgeon · Immunogenetics and Molecular Biology",
        photo: BravoImage,
        bio: "Physician and Surgeon with experience in internal and critical care medicine, holding a Master's in Immunogenetics and Molecular Biology.\n\nGuest lecturer at Universidad del Conde since 2020, clinical researcher with 12 national and 9 international publications, and recipient of 3 clinical research awards.\n\nInternational speaker, advisor, and lecturer, delivering over 450 training courses and approximately 600 scientific talks in international and national congresses and medical forums. Brings 33 years of experience in the pharmaceutical industry (Medical Director of 13 pharmaceutical laboratories) and certification in Regenerative Medicine and Stem Cell Therapy from the International Society for Stem Cell Application (ISSCA).",
      },
      {
        name: "Dr. Alejandro Bravo",
        role: "Dentist · Forensic Anthropologist · Expert in Forensic Sciences",
        photo: AlejandroBravoImage,
        bio: "Venezuelan professional with degrees in Dentistry and Forensic Anthropology, specialized in the field of Forensic Sciences. He holds a diploma in Human Identification and Bone Remains Analysis, supporting his experience in applying scientific methods to forensic investigation and human identification within legal and academic contexts.\n\nHe also holds international certifications as a Phlebotomy Technician, Phlebotomy Instructor, Medical Assistant Instructor, and ECG Instructor, enhancing his professional background in both clinical and educational fields.\n\nHis career combines forensic practice, healthcare, and education, standing out for his commitment to scientific research, the training of new professionals, and the application of knowledge in the service of truth and justice.",
      },
      {
        name: "Dr. Jorge Juan Herrera",
        role: "Physician and Surgeon · Aesthetic Surgery and Teaching",
        photo: HerreraImage,
        bio: "Physician and Surgeon graduated from Universidad Autónoma de México (UNAM).\n\nSpecialist in Aesthetic Medicine and Surgery at Université de Montpellier, France, with a Master's in Aesthetic Surgery (IESM) and a PhD in Biomedical Sciences from UNAM.\n\nHonorary Doctorate recipient from the Federal Government of Mexico – UNAM National Faculty and CNHD France. Collaborator on clinical protocols for skin regeneration and revitalization at Shriners Hospital, lecturer at Universidad La Salle, Universidad Anáhuac, and UNAM's Faculty of Medicine, and speaker at Allergan Aesthetics.",
      },
      {
        name: "Dr. Gener Alejandro Fajardo Ruiz",
        role: "Physician and Surgeon · Aesthetic Medicine and Plastic Surgery",
        photo: GenerImage,
        bio: "Physician and Surgeon graduated from Universidad Nacional de Colombia, with a Master's in Aesthetic Medicine from Universidad de las Islas Baleares, Spain.\n\nSpecialist in Plastic, Aesthetic, and Reconstructive Surgery at Universidade de Almeida in Rio de Janeiro, Brazil.\n\nCurrently practices in his field and served as a judge in the Miss Colombia 2021 beauty pageant.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {/* <section className="relative h-[calc(100vh-4rem)] overflow-hidden mb-10"> */}
      <section
        /* className="relative overflow-hidden mb-10"
        style={{ height: "458.14px" }} */
        className="relative w-full section-modern min-h-[500px] sm:min-h-[600px] md:h-screen -mt-16"
      >
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt="Staff hero"
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
            <h1 className="font-headline mt-24 text-4xl md:text-6xl font-bold tracking-tight w-full md:max-w-4xl">
              {heroTitle[lang]}
            </h1>
            <p className="text-base md:text-2xl text-white/90 font-medium md:max-w-2xl">
              {heroSubtitle[lang]}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-10 pt-20">
        {/* Introducción del equipo */}
        <section className="mb-12 text-center">
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {teamIntro[lang]}
          </p>
        </section>

        {/* Directores */}
        <section className="mb-12">
          <h2 className="font-headline text-2xl font-semibold mb-6">
            {lang === "es" ? "Directores" : "Directors"}
          </h2>
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* Director General */}
            <div className="w-full lg:max-w-4xl flex">
              <Card className="overflow-hidden w-full">
                <div className="grid grid-cols-1 sm:grid-cols-5 h-full">
                  <div className="relative h-80 sm:h-full sm:col-span-2">
                    <Image
                      src={DirectoraMovil}
                      alt={directorGeneral[lang].name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 40vw"
                      className="object-cover block md:hidden"
                    />
                    <Image
                      src={directorGeneral[lang].photo}
                      alt={directorGeneral[lang].name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 40vw"
                      className="object-cover hidden md:block"
                    />
                  </div>
                  <div className="sm:col-span-3 flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-headline">
                        {directorGeneral[lang].name}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full inline-block w-fit">
                        {directorGeneral[lang].role}
                      </span>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6 flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-teal-700 block mb-3">
                          {lang === "es"
                            ? "Administradora de Empresas especializada en Administración de la Salud"
                            : "Business Administrator specialized in Healthcare Management"}
                        </span>
                        <span className="text-muted-foreground">
                          {lang === "es"
                            ? "Directora General del Instituto Mex-Col-Usa durante 14 años, con sólida experiencia en la gestión de clínicas de medicina estética y actualmente en la educación en medicina estética. Reconocida por su trayectoria con el premio Orgullo Latino (Latin Chamber, Cámara de Comercio del Golfo de Florida, 2022) y recientemente galardonada con el primer lugar en Administración de Soporte Técnico en Medicina Estética por la Alianza Americana de Educación USA (2024–2025).\n\nComo directora General, lidera la operación y coordinación de las sedes en México, Colombia y Estados Unidos, asegurando excelencia en la gestión administrativa y en la atención al cliente. Anteriormente, se desempeñó como reina de belleza y presentadora, lo que complementa su visión estratégica y habilidades de comunicación."
                            : "General Director of INSTITUTO MEX-COL-USA for over 14 years, with extensive experience in managing aesthetic medicine clinics and currently leading education in aesthetic medicine. Recognized for her career with the Latin Pride Award (Latin Chamber of Commerce, Gulf of Florida, 2022) and recently awarded first place in Technical Support Administration in Aesthetic Medicine by the American Education Alliance USA (2024–2025).\n\nAs General Director, she oversees operations and coordination across Mexico, Colombia, and the United States, ensuring excellence in administrative management and client care. Previously a beauty queen and TV host, complementing her strategic vision and communication skills."}
                        </span>
                      </p>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>

            {/* Director Médico */}
            <div className="w-full lg:max-w-4xl flex">
              <Card className="overflow-hidden w-full">
                <div className="grid grid-cols-1 sm:grid-cols-5 h-full">
                  <div className="relative h-80 sm:h-full sm:col-span-2">
                    <Image
                      src={RamosMovil}
                      alt={medicalDirector[lang].name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 40vw"
                      className="object-cover block md:hidden"
                    />
                    <Image
                      src={medicalDirector[lang].photo}
                      alt={medicalDirector[lang].name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 40vw"
                      className="object-cover hidden md:block"
                    />
                  </div>
                  <div className="sm:col-span-3 flex flex-col">
                    <CardHeader>
                      <CardTitle className="font-headline">
                        {medicalDirector[lang].name}
                      </CardTitle>
                      <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full inline-block w-fit">
                        {medicalDirector[lang].role}
                      </span>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6 flex-1">
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-teal-700 block mb-3">
                          {medicalDirectorLead[lang]}
                        </span>
                        <div
                          className="text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: medicalDirectorBio[lang],
                          }}
                        />
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Especialistas Médicos */}
        <section>
          <h2 className="font-headline text-2xl font-semibold mb-6">
            {lang === "es" ? "Especialistas Médicos" : "Medical Specialists"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {speakers[lang].map((s, index) => {
              // Mapeo de imágenes móviles según el índice
              const mobileImages = [
                AldoMovil,
                CarolinaMovil,
                BravoMovil,
                AlejandroBravoMovil,
                HerreraMovil,
                GenerMovil,
              ];
              const mobileImage = mobileImages[index];

              return (
                <Card key={s.name} className="overflow-hidden">
                  <div className="relative h-80 sm:h-56 md:h-64 w-full">
                    {mobileImage && (
                      <Image
                        src={mobileImage}
                        alt={`${s.name} móvil`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover block md:hidden"
                      />
                    )}
                    <Image
                      src={s.photo}
                      alt={s.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover ${
                        mobileImage ? "hidden md:block" : ""
                      }`}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-lg">
                      {s.name}
                    </CardTitle>
                    <p className="text-sm text-teal-700">{s.role}</p>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6">
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {s.bio}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* SEO Content - Hidden from UI */}
        <section className="sr-only" aria-label="Medical directors and staff">
          <h2>Directores y Personal Médico</h2>
          <p>
            Instituto Mex-Col-USA cuenta con un equipo de directores y
            profesionales médicos especializados en medicina estética. Expertos
            en lifting facial, suero terapia, armonización facial y
            procedimientos no invasivos. Con más de 20 años de experiencia
            internacional en USA, México y Colombia.
          </p>
          <p>
            Nuestro equipo combina conocimiento académico, experiencia clínica y
            dedicación a la formación profesional de nuevas generaciones de
            médicos y esteticistas.
          </p>
          <ul>
            <li>Directores Médicos Certificados</li>
            <li>Especialistas en Medicina Estética</li>
            <li>Entrenadores Certificados Internacionalmente</li>
            <li>Equipo Multidisciplinario de Expertos</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
