import Image from "next/image";
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
