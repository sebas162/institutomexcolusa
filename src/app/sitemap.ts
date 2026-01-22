import { MetadataRoute } from "next";
export const dynamic = "force-static";
const baseUrl = "https://www.institutomexcolusa.com";

// Course slugs for each country
const coursesByCountry = {
  usa: [
    "master-class-4-techniques",
    "intravenous-therapy-chelation",
    "phlebotomy-course",
    "mini-lifting-usa",
  ],
  mexico: [
    "facial-harmonization-course",
    "intravenous-therapy-mexico",
    "mini-lifting-techniques",
  ],
  colombia: [
    "master-class-facial-modeling",
    "intravenous-therapy-online",
    "mini-lifting-colombia",
  ],
};

export default function sitemap(): MetadataRoute.Sitemap {
  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          es: baseUrl,
          en: baseUrl,
        },
      },
    },
    {
      url: `${baseUrl}/academic-programs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs`,
          en: `${baseUrl}/academic-programs`,
        },
      },
    },
    {
      url: `${baseUrl}/online-training`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/online-training`,
          en: `${baseUrl}/online-training`,
        },
      },
    },
    {
      url: `${baseUrl}/congress`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/congress`,
          en: `${baseUrl}/congress`,
        },
      },
    },
    {
      url: `${baseUrl}/staff`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/staff`,
          en: `${baseUrl}/staff`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${baseUrl}/about`,
          en: `${baseUrl}/about`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/contact`,
          en: `${baseUrl}/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          es: `${baseUrl}/privacy`,
          en: `${baseUrl}/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          es: `${baseUrl}/terms`,
          en: `${baseUrl}/terms`,
        },
      },
    },
  ];

  // Country pages
  const countryPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/academic-programs/usa`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs/usa`,
          en: `${baseUrl}/academic-programs/usa`,
        },
      },
    },
    {
      url: `${baseUrl}/academic-programs/mexico`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs/mexico`,
          en: `${baseUrl}/academic-programs/mexico`,
        },
      },
    },
    {
      url: `${baseUrl}/academic-programs/colombia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs/colombia`,
          en: `${baseUrl}/academic-programs/colombia`,
        },
      },
    },
  ];

  // Course pages for USA
  const usaCourses: MetadataRoute.Sitemap = coursesByCountry.usa.map(
    (slug) => ({
      url: `${baseUrl}/academic-programs/usa/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs/usa/${slug}`,
          en: `${baseUrl}/academic-programs/usa/${slug}`,
        },
      },
    })
  );

  // Course pages for Mexico
  const mexicoCourses: MetadataRoute.Sitemap = coursesByCountry.mexico.map(
    (slug) => ({
      url: `${baseUrl}/academic-programs/mexico/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs/mexico/${slug}`,
          en: `${baseUrl}/academic-programs/mexico/${slug}`,
        },
      },
    })
  );

  // Course pages for Colombia
  const colombiaCourses: MetadataRoute.Sitemap = coursesByCountry.colombia.map(
    (slug) => ({
      url: `${baseUrl}/academic-programs/colombia/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          es: `${baseUrl}/academic-programs/colombia/${slug}`,
          en: `${baseUrl}/academic-programs/colombia/${slug}`,
        },
      },
    })
  );

  return [
    ...mainPages,
    ...countryPages,
    ...usaCourses,
    ...mexicoCourses,
    ...colombiaCourses,
  ];
}
