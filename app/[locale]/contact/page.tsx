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

  const phone = "905555555555";
  const message = encodeURIComponent(dict.whatsappMessage);
  const whatsappHref = `https://wa.me/${phone}?text=${message}`;

  return (
    <section className="section page-section">
      <div className="container contact-grid">
        <div>
          <h1>{dict.contact.title}</h1>
          <p>{dict.contact.text}</p>

          <form className="contact-form">
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

          <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn btn-primary full">
            {dict.contact.whatsapp}
          </a>

          <Link
            href="https://www.instagram.com/hauzart"
            target="_blank"
            className="btn btn-secondary full"
          >
            {dict.contact.instagram}
          </Link>
        </div>
      </div>
    </section>
  );
}
