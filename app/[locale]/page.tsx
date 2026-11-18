import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import ProjectGrid from "@/components/ProjectGrid";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { client } from "@/sanity/lib/client";
import { publishedProjectsCountQuery } from "@/sanity/lib/queries";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.home.title,
    description: dict.home.text,
    alternates: { canonical: `/${locale}` }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const projectCount = await client.fetch<number>(publishedProjectsCountQuery);

  return (
    <>
      <section className="hero">
        <Image
          src="/hero.webp"
          alt="Hauzart interior design"
          fill
          priority
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <h1>{dict.home.title}</h1>
          <p>{dict.home.text}</p>
          <div className="hero-actions">
            <Link href={`/${locale}/projects`} className="btn btn-primary">
              {dict.home.primary}
            </Link>
            <Link href={`/${locale}/contact`} className="btn btn-secondary">
              {dict.home.secondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="section intro">
        <div className="intro-logo-bg">
          <Image
            src="/logo-mark.png"
            alt=""
            width={600}
            height={248}
            aria-hidden="true"
          />
        </div>
        {/* Metin, altındaki Hizmetler kutularıyla aynı genişlikte (narrow sınırı yok) */}
        <RevealOnScroll className="container intro-content">
          <h2>{dict.home.introTitle}</h2>
          <p>{dict.home.introText}</p>
        </RevealOnScroll>
      </section>

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <h2 className="section-title">{dict.home.servicesTitle}</h2>
          </RevealOnScroll>
          <div className="services-grid">
            {dict.home.services.map((service, i) => (
              <RevealOnScroll key={service.title} delay={i * 120} className="service-card">
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {projectCount > 0 && (
        <section className="section">
          <div className="container">
            <RevealOnScroll>
              <h2 className="section-title">{dict.home.featuredTitle}</h2>
              <p className="section-text">{dict.home.featuredText}</p>
            </RevealOnScroll>
            <ProjectGrid locale={locale} limit={3} />
            <div className="center mt-40">
              <Link href={`/${locale}/projects`} className="btn btn-primary">
                {dict.home.primary}
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="section cta-section">
        <RevealOnScroll className="container narrow center">
          <h2>{dict.home.ctaTitle}</h2>
          <p>{dict.home.ctaText}</p>
          <Link href={`/${locale}/contact`} className="btn btn-primary">
            {dict.home.secondary}
          </Link>
        </RevealOnScroll>
      </section>
    </>
  );
}
