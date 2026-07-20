import Link from 'next/link';
import type { ReactNode } from 'react';
import { controlNavigation } from '@/lib/navigation';

export function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">AV</span>
          <div>
            <strong>AVOS Control</strong>
            <small>Enterprise Runtime</small>
          </div>
        </div>

        <nav>
          {controlNavigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="sidebar-back" href="/">
          العودة للموقع
        </Link>
      </aside>
      <main className="dashboard-main">{children}</main>
    </div>
  );
}