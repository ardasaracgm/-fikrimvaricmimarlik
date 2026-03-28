import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import ProjectGrid from "@/components/ProjectGrid";

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
        <div className="narrow center">
          <h1>{dict.projects.title}</h1>
          <p>{dict.projects.text}</p>
          <span className="category-line">{dict.projects.categories}</span>
        </div>
        <div className="mt-40">
          <ProjectGrid />
        </div>
      </div>
    </section>
  );
}
