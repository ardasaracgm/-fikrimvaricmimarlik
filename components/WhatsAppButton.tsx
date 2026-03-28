import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/content";

type Props = {
  locale: Locale;
};

export default function WhatsAppButton({ locale }: Props) {
  const dict = getDictionary(locale);

  const phone = "905555555555";
  const message = encodeURIComponent(dict.whatsappMessage);
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-button"
      aria-label="WhatsApp"
    >
      WhatsApp
    </a>
  );
}
