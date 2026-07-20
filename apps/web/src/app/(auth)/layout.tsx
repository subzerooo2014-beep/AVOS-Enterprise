import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/">
        AVOS Enterprise
      </Link>
      {children}
    </main>
  );
}