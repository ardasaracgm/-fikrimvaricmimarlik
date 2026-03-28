import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const dict = getDictionary(locale);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${locale}`} className="logo-wrap">
          <Image src="/logo.png" alt="Hauzart logo" width={140} height={70} />
        </Link>

        <nav className="main-nav">
          {dict.nav.map((item) => (
            <Link key={item.href} href={`/${locale}${item.href}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <LocaleSwitcher locale={locale} />
      </div>
    </header>
  );
}
