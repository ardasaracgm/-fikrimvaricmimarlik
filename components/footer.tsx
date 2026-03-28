import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/content";

type Props = {
  locale: Locale;
};

export default function Footer({ locale }: Props) {
  const dict = getDictionary(locale);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h3>{dict.brand}</h3>
          <p>{dict.footer.text}</p>
        </div>

        <div className="footer-links">
          <Link href="https://www.instagram.com/hauzart" target="_blank">
            Instagram
          </Link>
          <Link href={`/${locale}/contact`}>{dict.nav[4].label}</Link>
        </div>
      </div>
    </footer>
  );
}
