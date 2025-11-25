'use client';

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="siteFooter" aria-label="Footer">
      <div className="inner">
        
        {/* Brand / About */}
        <div className="col about">
          <div className="logo">{t("brand")}</div>
          <p className="tag">{t("tagline")}</p>

          <div className="social" aria-hidden>
            <a href="#" aria-label={t("social.facebook")} className="socialBtn">
              {renderSocial('fb')}
            </a>
            <a href="#" aria-label={t("social.instagram")} className="socialBtn">
              {renderSocial('ig')}
            </a>
            <a href="#" aria-label={t("social.telegram")} className="socialBtn">
              {renderSocial('tg')}
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="col links">
          <h4>{t("categories.title")}</h4>
          <ul>
            <li><Link href="#repair">{t("categories.repair")}</Link></li>
            <li><Link href="#electric">{t("categories.electric")}</Link></li>
            <li><Link href="#meters">{t("categories.meters")}</Link></li>
            <li><Link href="#appliances">{t("categories.appliances")}</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="col support">
          <h4>{t("support.title")}</h4>
          <ul>
            <li><Link href="/how-it-works">{t("support.howItWorks")}</Link></li>
            <li><Link href="/faq">{t("support.faq")}</Link></li>
            <li><Link href="/contacts">{t("support.contacts")}</Link></li>
            <li><Link href="/terms">{t("support.terms")}</Link></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="col subscribe">
          <h4>{t("subscribe.title")}</h4>
          <p className="small">{t("subscribe.text")}</p>

          <form
            className="newsForm"
            onSubmit={(e) => {
              e.preventDefault();
              alert(t("subscribe.success"));
            }}
          >
            <input
              aria-label={t("subscribe.placeholder")}
              placeholder={t("subscribe.placeholder")}
            />
            <button className="btn">{t("subscribe.button")}</button>
          </form>
        </div>
      </div>

      <div className="bottom">
        <div className="left">
          © {new Date().getFullYear()} {t("brand")} — {t("bottom.rights")}
        </div>
        <div className="right">
          <Link href="/privacy">{t("bottom.privacy")}</Link>
          <span className="sep">·</span>
          <Link href="/cookies">{t("bottom.cookies")}</Link>
        </div>
      </div>
    </footer>
  );
}

function renderSocial(name: string) {
  switch (name) {
    case "fb":
      return ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden> <path d="M22 12.07C22 6.48 17.52 2 11.93 2 6.33 2 1.86 6.48 1.86 12.07c0 4.98 3.66 9.12 8.44 9.88v-6.99H8.38v-2.89h1.92V9.03c0-1.9 1.13-2.96 2.86-2.96.83 0 1.69.15 1.69.15v1.86h-0.95c-.93 0-1.22.58-1.22 1.17v1.42h2.07l-.33 2.89h-1.74v6.99c4.78-.76 8.44-4.9 8.44-9.88z" fill="currentColor"/> </svg> );
    case "ig":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      );
    case "tg":
      return ( <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden> <path d="M22 3L2 12.5 7.5 14.5 9 20 12.5 14.5 21 21 22 3z" fill="currentColor"/> </svg> ); 
    default:
      return null;
  }
}
