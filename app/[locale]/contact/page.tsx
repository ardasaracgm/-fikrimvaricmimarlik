import Link from "next/link";
import type { Metadata } from "next";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import ContactForm from "@/components/ContactForm";
import { BackHomeLink } from "@/components/BackHomeLink";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale);
  return {
    title: dict.contact.title,
    description: dict.contact.text,
    alternates: { canonical: `/${locale}/contact` }
  };
}

export default async function ContactPage({
  params
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const phone = "+90 538 378 06 03";
  const email = "info@fikrimvaricmimarlik.com";
  const instagram = "https://www.instagram.com/hauzart";

  const mailSubject =
    locale === "tr" ? "Hauzart Proje Talebi" : "Hauzart Project Inquiry";

  const bodyLabels =
    locale === "tr"
      ? { name: "Ad Soyad", phone: "Telefon", email: "E-posta", message: "Mesaj" }
      : { name: "Name", phone: "Phone", email: "Email", message: "Message" };

  return (
    <section className="section page-section">
      <div className="container">
        <BackHomeLink locale={locale} />
      </div>
      <div className="container contact-grid">
        <div>
          <h1>{dict.contact.title}</h1>
          <p>{dict.contact.text}</p>

          <ContactForm
            email={email}
            mailSubject={mailSubject}
            labels={dict.contact.form}
            bodyLabels={bodyLabels}
          />
        </div>

        <div className="contact-info">
          <p>{dict.contact.info}</p>

          <div className="contact-meta">
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Email:</strong> info@hauzart.com</p>
            <p><strong>{locale === "tr" ? "Telefon" : "Phone"}:</strong> <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a></p>
            <p><strong>Instagram:</strong> @hauzart</p>
          </div>

          <Link href={instagram} target="_blank" className="btn btn-secondary full">
            {dict.contact.instagram}
          </Link>
        </div>
      </div>
    </section>
  );
}
