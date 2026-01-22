/**
 * Hero Image Resolver with Fallback Logic
 *
 * Resolves course hero images with multi-level fallback:
 * 1. Try course-specific image: img-hero-cursos/${slug}.webp
 * 2. Fall back to: hero-programas-academico.webp
 * 3. Final fallback: hero-home.webp
 */

import HeroProgramasAcademico from "@/assets/img-heros/hero-programas-academico.webp";
import HeroHome from "@/assets/img-heros/hero-home.webp";

// Course hero images
import MasterClassMX from "@/assets/img-heros/img-hero-cursos/master-class-mx.webp";
import SueroMX from "@/assets/img-heros/img-hero-cursos/suero-mx.webp";
import MiniLiftingMX from "@/assets/img-heros/img-hero-cursos/mini-lifting-mx.webp";

import MasterClassCol from "@/assets/img-heros/img-hero-cursos/master-class-col.webp";
import SueroCol from "@/assets/img-heros/img-hero-cursos/suero-col.webp";
import MiniLiftingCol from "@/assets/img-heros/img-hero-cursos/mini-lifting-col.webp";

import MasterClassUSA from "@/assets/img-heros/img-hero-cursos/master-class-usa.webp";
import SueroUSA from "@/assets/img-heros/img-hero-cursos/suero-usa.webp";
import MiniLiftingUSA from "@/assets/img-heros/img-hero-cursos/mini-lifting-usa.webp";
import FlebotomiaUSA from "@/assets/img-heros/img-hero-cursos/flebotomia-usa.webp";

// Slug-to-image mapping
const courseHeroMap: Record<string, any> = {
  // Mexico courses
  "facial-harmonization-course": MasterClassMX,
  "intravenous-therapy-mexico": SueroMX,
  "mini-lifting-techniques": MiniLiftingMX,

  // Colombia courses
  "master-class-facial-modeling": MasterClassCol,
  "intravenous-therapy-online": SueroCol,
  "mini-lifting-colombia": MiniLiftingCol,

  // USA courses
  "master-class-4-techniques": MasterClassUSA,
  "intravenous-therapy-chelation": SueroUSA,
  "mini-lifting-usa": MiniLiftingUSA,
  "phlebotomy-course": FlebotomiaUSA,
};

/**
 * Resolves hero image for a course slug with fallback chain
 * @param slug - Course slug identifier
 * @returns StaticImageData with guaranteed hero image
 */
export function resolveHeroImage(slug: string) {
  // 1. Try course-specific image
  if (courseHeroMap[slug]) {
    return courseHeroMap[slug];
  }

  // 2. Fall back to academic programs hero
  return HeroProgramasAcademico;

  // Note: HeroHome is available as final fallback if needed,
  // but HeroProgramasAcademico should always exist
}

/**
 * Get fallback hero for pages without specific hero
 * @returns Default academic programs hero
 */
export function getDefaultHero() {
  return HeroProgramasAcademico;
}

/**
 * Get ultimate fallback hero (home page)
 * @returns Home hero as last resort
 */
export function getUltimateFallbackHero() {
  return HeroHome;
}
