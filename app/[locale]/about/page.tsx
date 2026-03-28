import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <section className="section page-section">
      <div className="container narrow">
        <h1>{dict.about.title}</h1>
        <div className="page-text">
          {dict.about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
