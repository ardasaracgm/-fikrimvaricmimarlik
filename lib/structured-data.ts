export const SITE_URL = "https://www.rdnsoft.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "@id": `${SITE_URL}/#organization`,
  name: "RDN Technology",
  legalName:
    "RDN Danışmanlık Yazılım Turizm Gıda Sanayi ve Dış Ticaret Limited Şirketi",
  alternateName: ["RDN", "RDN Defense", "RDN Savunma"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/rdn-logo.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/og-image.png`,
  description:
    "Defense and security technology manufacturer specializing in electronic warfare, counter-UAV systems, drone platforms, and UAV detection solutions. Based in Ankara, Türkiye.",
  slogan: "Advanced systems for mission-critical environments.",
  foundingLocation: {
    "@type": "Place",
    name: "Ankara, Türkiye",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kızılırmak Mah. Dumlupınar Bulvarı No:9A YDA Center D:158",
    addressLocality: "Çankaya",
    addressRegion: "Ankara",
    postalCode: "06510",
    addressCountry: "TR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+90-536-446-11-35",
      email: "info@rdnsoft.com",
      contactType: "sales",
      areaServed: ["TR", "Worldwide"],
      availableLanguage: ["English", "Turkish", "Russian"],
    },
  ],
  taxID: "7342274416",
  vatID: "7342274416",
  identifier: [
    {
      "@type": "PropertyValue",
      propertyID: "MERSIS",
      value: "0734227441600001",
    },
    {
      "@type": "PropertyValue",
      propertyID: "TradeRegistry",
      value: "465313",
    },
  ],
  industry: "Defense & Security Technology",
  naics: "541330",
  knowsAbout: [
    "Electronic Warfare",
    "Counter-UAV Systems",
    "RF Jamming",
    "Drone Systems",
    "Unmanned Aerial Vehicles",
    "UAV Detection",
    "Radar Systems",
    "AI Security",
    "Tactical Communications",
  ],
  areaServed: {
    "@type": "Place",
    name: "Worldwide",
  },
  sameAs: [
    // LinkedIn şirket sayfan varsa ekle:
    // "https://www.linkedin.com/company/rdn-technology",
    // Wikidata Q-item oluşturduğunda ekle:
    // "https://www.wikidata.org/wiki/Q......",
    // YouTube/X varsa ekle
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "RDN Technology",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: ["en", "ru", "tr"],
};
