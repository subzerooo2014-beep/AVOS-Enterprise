import Link from "next/link";
import { SparklesIcon } from "./icons";

const navigation = [
  { href: "/vehicles", label: "السيارات" },
  { href: "/auctions", label: "المزادات" },
  { href: "/parts", label: "قطع الغيار" },
  { href: "/rentals", label: "التأجير" },
  { href: "/plates", label: "الأرقام المميزة" },
  { href: "/services", label: "الخدمات" },
  { href: "/providers", label: "المزودون" },
  { href: "/#intelligence", label: "الذكاء الاصطناعي" },
  { href: "/seller", label: "للأعمال" },
];

export function Header({
  apiOnline,
}: {
  apiOnline: boolean;
}) {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="AVOS">
          <span className="brand-mark">
            <SparklesIcon size={20} />
          </span>
          <span className="brand-word">AVOS</span>
        </Link>

        <nav className="main-nav" aria-label="التنقل الرئيسي">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <div
            className={
              apiOnline
                ? "api-pill is-online"
                : "api-pill is-offline"
            }
          >
            <span className="status-dot" />
            {apiOnline ? "النظام متصل" : "واجهة API غير متصلة"}
          </div>
          <Link className="button button-secondary" href="/search">
            بحث شامل
          </Link>
          <Link className="button button-primary" href="/account">
            حسابي
          </Link>
        </div>
      </div>
    </header>
  );
}
