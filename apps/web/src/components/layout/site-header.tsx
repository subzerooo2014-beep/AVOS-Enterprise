import Link from 'next/link';
import { AvosMark } from '@/components/brand/avos-mark';
import { publicNavigation } from '@/lib/navigation';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="brand-link" href="/">
          <AvosMark />
          <span>
            <strong>AVOS Enterprise</strong>
            <small>The Operating System for Mobility</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {publicNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/control-center">
          مركز التحكم
        </Link>
      </div>
    </header>
  );
}