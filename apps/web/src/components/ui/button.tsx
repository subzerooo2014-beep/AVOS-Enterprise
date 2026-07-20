import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit';
};

export function Button({
  children,
  href,
  variant = 'primary',
  type = 'button',
}: ButtonProps) {
  const className = `button button-${variant}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type={type}>
      {children}
    </button>
  );
}