import Link from "next/link";
import type { Locale } from "@/lib/i18n";

export function BackHomeLink({ locale }: { locale: Locale }) {
  return (
    <Link href={`/${locale}`} className="back-link">
      ← {locale === "en" ? "Home" : "Ana Sayfa"}
    </Link>
  );
}
