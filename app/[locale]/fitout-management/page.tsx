import { groq } from "next-sanity";
import Image from "next/image";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { MarkdownText } from "@/components/MarkdownText";
import { BackHomeLink } from "@/components/BackHomeLink";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { FitoutProjectsGrid } from "@/components/FitoutProjectsGrid";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { FITOUT_PAGE_ID } from "@/lib/singletons";
import { sortCompletedProjects } from "@/lib/sortCompletedProjects";

const fitoutPageQuery = groq`*[_type == "fitoutPage" && _id == $id][0]`;

type ServiceItem = { title: string; text: string };
type CompletedProject = { image: any; title: string; location: string; year?: number; order?: number };

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const sanityDoc = await client.fetch(fitoutPageQuery, { id: FITOUT_PAGE_ID });
  const isEn = locale === "en";
  const title = (isEn ? sanityDoc?.titleEn : sanityDoc?.title) || dict.fitout.title;
  const text1 = (isEn ? sanityDoc?.text1En : sanityDoc?.text1) || dict.fitout.text1;
  return {
    title,
    description: text1,
    alternates: { canonical: `/${locale}/fitout-management` }
  };
}

export default async function FitoutPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const sanityDoc = await client.fetch(fitoutPageQuery, { id: FITOUT_PAGE_ID });

  const isEn = locale === "en";
  const title = (isEn ? sanityDoc?.titleEn : sanityDoc?.title) || dict.fitout.title;
  const text1 = (isEn ? sanityDoc?.text1En : sanityDoc?.text1) || dict.fitout.text1;
  const text2 = (isEn ? sanityDoc?.text2En : sanityDoc?.text2) || dict.fitout.text2;
  const subheading = (isEn ? sanityDoc?.subheadingEn : sanityDoc?.subheading) || dict.fitout.subheading;
  const services: ServiceItem[] = isEn ? sanityDoc?.servicesEn : sanityDoc?.services;
  const completedProjects: CompletedProject[] = sortCompletedProjects(sanityDoc?.completedProjects ?? []);

  return (
    <section className="section page-section">
      {sanityDoc?.heroImage && (
        <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 6", marginBottom: 40, overflow: "hidden" }}>
          <Image
            src={urlFor(sanityDoc.heroImage).width(2000).height(750).quality(85).url()}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      <div className="container">
        {/* Açıklama, altındaki hizmet kutularıyla aynı genişlikte (diğer sayfalardaki "narrow" sınırı burada yok) */}
        <div>
          <BackHomeLink locale={locale} />
          <RevealOnScroll>
            <h1>{title}</h1>
            <p>
              <MarkdownText text={text1} />
            </p>
            <p>
              <MarkdownText text={text2} />
            </p>
            <h3 className="subheading">{subheading}</h3>
          </RevealOnScroll>
        </div>

        {/* Tamamlanmış projeler: alt başlığın altında, hizmet kutularının üstünde, aynı 4'lü ızgarada */}
        {completedProjects.length > 0 && <FitoutProjectsGrid projects={completedProjects} isEn={isEn} />}

        {services && services.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 24,
              marginTop: 40,
              marginBottom: 40
            }}
          >
            {services.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 100} style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: 24 }}>
                <h4 style={{ marginTop: 0 }}>{s.title}</h4>
                <p style={{ marginBottom: 0 }}>
                  <MarkdownText text={s.text} />
                </p>
              </RevealOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
