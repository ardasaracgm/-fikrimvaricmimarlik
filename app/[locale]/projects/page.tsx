import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import ProjectGrid from "@/components/ProjectGrid";
import { BackHomeLink } from "@/components/BackHomeLink";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.projects.title,
    description: dict.projects.text,
    alternates: { canonical: `/${locale}/projects` }
  };
}

export default async function ProjectsPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <section className="section page-section">
      <div className="container">
        <BackHomeLink locale={locale} />
        <div className="narrow center">
          <h1>{dict.projects.title}</h1>
          <p>{dict.projects.text}</p>
          <span className="category-line">{dict.projects.categories}</span>
        </div>
        <div className="mt-40">
          <ProjectGrid locale={locale} />
        </div>
      </div>
    </section>
  );
}
