"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { featuredPlatformSections } from "@/lib/platform-registry";

export function AvosGlobalNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = useMemo(
    () => [
      { route: "/", title: "AVOS Launcher" },
      ...featuredPlatformSections.slice(0, 7).map(({ route, title }) => ({
        route,
        title,
      })),
    ],
    [],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
            AV
          </span>
          <span>
            <span className="block text-sm font-black tracking-wide text-slate-950">
              AVOS Enterprise
            </span>
            <span className="block text-[11px] font-bold text-slate-500">
              Unified Platform
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {navigation.map((item) => {
            const active =
              item.route === "/"
                ? pathname === "/"
                : pathname.startsWith(item.route);

            return (
              <Link
                key={item.route}
                href={item.route}
                className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 sm:inline-flex">
            Platform Online
          </span>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black lg:hidden"
            aria-expanded={open}
            aria-label="فتح التنقل"
          >
            القائمة
          </button>
        </div>
      </div>

      {open ? (
        <nav className="grid gap-1 border-t border-slate-200 bg-white p-3 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.route}
              href={item.route}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-100"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
