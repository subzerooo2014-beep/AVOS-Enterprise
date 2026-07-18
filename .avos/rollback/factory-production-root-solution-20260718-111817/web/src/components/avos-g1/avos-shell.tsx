import type { ReactNode } from "react";
import { AvosLogo } from "./avos-logo";

type AvosShellProps = {
  children: ReactNode;
  direction?: "rtl" | "ltr";
};

export function AvosShell({
  children,
  direction = "rtl",
}: AvosShellProps) {
  return (
    <div
      dir={direction}
      className="min-h-screen bg-[#ede5d8] text-[#1d2a36]"
    >
      <header className="border-b border-[#d8cdbe] bg-[#fffdf8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <AvosLogo />
          <nav className="flex items-center gap-5 text-sm font-semibold text-[#274961]">
            <a href="#marketplace">السوق</a>
            <a href="#experience">التجربة</a>
            <a href="#ai">عزم AI</a>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}