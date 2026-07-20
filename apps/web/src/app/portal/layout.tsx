import Link from 'next/link';
import type { ReactNode } from 'react';
import { portalNavigation } from '@/lib/navigation';

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <strong>AVOS Portal</strong>
        {portalNavigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
        <Link href="/">الموقع الرئيسي</Link>
      </aside>
      <main className="portal-main">{children}</main>
    </div>
  );
}