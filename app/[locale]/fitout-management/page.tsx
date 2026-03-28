import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import ProjectGrid from "@/components/ProjectGrid";

export default async function FitoutPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <section className="section page-section">
      <div className="container">
        <div className="narrow">
          <h1>{dict.fitout.title}</h1>
          <p>{dict.fitout.text1}</p>
          <p>{dict.fitout.text2}</p>
          <h3 className="subheading">{dict.fitout.subheading}</h3>
        </div>

        <div className="mt-40">
          <ProjectGrid />
        </div>
      </div>
    </section>
  );
}
