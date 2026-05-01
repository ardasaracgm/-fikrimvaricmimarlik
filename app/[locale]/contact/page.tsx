import Link from "next/link";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const phone = "+9 0538 378 06 03";
  const email = "info@fikrimvaricmimarlik.com";
  const instagram = "https://www.instagram.com/hauzart";


  const mailSubject =
    locale === "tr" ? "Hauzart Proje Talebi" : "Hauzart Project Inquiry";

  const mailBody =
    locale === "tr"
      ? "Merhaba, proje detaylarını paylaşmak istiyorum."
      : "Hello, I would like to share project details.";

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  return (
    <section className="section page-section">
      <div className="container contact-grid">
        <div>
          <h1>{dict.contact.title}</h1>
          <p>{dict.contact.text}</p>

          <form
            className="contact-form"
            action={mailtoHref}
            method="post"
            encType="text/plain"
          >
            <input type="text" placeholder={dict.contact.form.name} />
            <input type="text" placeholder={dict.contact.form.phone} />
            <input type="email" placeholder={dict.contact.form.email} />
            <textarea placeholder={dict.contact.form.message} rows={6} />
            <button type="submit" className="btn btn-primary">
              {dict.contact.form.submit}
            </button>
          </form>
        </div>

        <div className="contact-info">
          <p>{dict.contact.info}</p>

          <div className="contact-meta">
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Instagram:</strong> @hauzart</p>
          </div>

          <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn btn-primary full">
            {dict.contact.whatsapp}
          </a>

          <Link href={instagram} target="_blank" className="btn btn-secondary full">
            {dict.contact.instagram}
          </Link>
        </div>
      </div>
    </section>
  );
}
