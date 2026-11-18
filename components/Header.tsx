"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";

type Props = {
  locale: Locale;
};

export default function Header({ locale }: Props) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    const fullPath = `/${locale}${href}`;
    if (href === "/") return pathname === `/${locale}`;
    return pathname === fullPath;
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${locale}`} className="logo-wrap" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Hauzart logo" width={140} height={70} />
        </Link>

        <nav className="main-nav">
          {dict.nav.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={isActive(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          <LocaleSwitcher locale={locale} />
          <button
            type="button"
            className={`menu-toggle ${open ? "open" : ""}`}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${open ? "show" : ""}`}>
        <div className="container mobile-menu-inner">
          {dict.nav.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={isActive(item.href) ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
