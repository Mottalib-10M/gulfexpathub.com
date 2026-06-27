import { SITE } from "../data/site-config";

export interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

export function buildTitle(title: string): string {
  return title;
}

export function buildCanonical(path: string): string {
  const cleanPath = path.endsWith("/") ? path : path + "/";
  return `${SITE.url}${cleanPath}`;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbs(items: BreadcrumbItem[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    logo: {
      "@type": "ImageObject",
      url: `${SITE.url}/og-default.png`,
      width: 1200,
      height: 630,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@arabiaexpat.com",
      contactType: "customer support",
      availableLanguage: "English",
    },
    sameAs: [],
    founder: {
      "@type": "Person",
      name: SITE.author.name,
      jobTitle: SITE.author.role,
      description: SITE.author.bio,
    },
  };
}

export function buildPersonSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.author.name,
    jobTitle: SITE.author.role,
    description: SITE.author.bio,
    url: `${SITE.url}/about/`,
    image: `${SITE.url}${SITE.author.image}`,
    worksFor: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "INSEAD",
    },
  };
}

export function buildWebApplicationSchema(name: string, description: string, url: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    inLanguage: "en",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: SITE.author.name,
    },
  };
}

export function buildWebSiteSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Arabia Expat",
    url: SITE.url,
    description: "Your complete guide to living in the Gulf. Visas, daily life, housing, healthcare, schools, and relocation resources for expats in the UAE, Qatar, and Saudi Arabia.",
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: "Arabia Expat",
      url: SITE.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildArticleSchema(title: string, description: string, url: string, datePublished: string, dateModified: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    datePublished: datePublished,
    dateModified: dateModified,
    inLanguage: "en",
    image: `${SITE.url}/og-default.png`,
    author: {
      "@type": "Person",
      name: "Mottalib Radif",
      jobTitle: "MBA INSEAD",
    },
    publisher: {
      "@type": "Organization",
      name: "Arabia Expat",
      url: SITE.url,
    },
  };
}
