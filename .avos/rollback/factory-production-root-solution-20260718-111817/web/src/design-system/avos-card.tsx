import type { ReactNode } from "react";

export function AvosCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,143,116,0.10)] backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}