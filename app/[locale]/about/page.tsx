import Image from "next/image";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { BackHomeLink } from "@/components/BackHomeLink";
import { RevealOnScroll } from "@/components/RevealOnScroll";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.about.title,
    description: dict.about.paragraphs[0],
    alternates: { canonical: `/${locale}/about` }
  };
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <section className="section page-section intro">
      <div className="intro-logo-bg">
        <Image
          src="/logo-mark.png"
          alt=""
          width={600}
          height={248}
          aria-hidden="true"
        />
      </div>
      <div className="container narrow intro-content">
        <BackHomeLink locale={locale} />
        <RevealOnScroll>
          <h1>{dict.about.title}</h1>
          <div className="page-text">
            {dict.about.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
