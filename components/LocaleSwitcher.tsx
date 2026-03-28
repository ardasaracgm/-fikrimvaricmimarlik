import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export default function LocaleSwitcher({ locale }: Props) {
  const otherLocale = locale === "tr" ? "en" : "tr";

  return (
    <div className="locale-switcher">
      <Link href={`/${locale}`}>{locale.toUpperCase()}</Link>
      <span>/</span>
      <Link href={`/${otherLocale}`}>{otherLocale.toUpperCase()}</Link>
    </div>
  );
}
