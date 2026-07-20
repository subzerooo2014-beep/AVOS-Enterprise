"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  fetchPlatformHealth,
  type PlatformHealth,
} from "@/lib/avos-api";
import {
  platformCategories,
  platformSections,
} from "@/lib/platform-registry";

const CATEGORY_ICONS: Record<string, string> = {
  Executive: "◈",
  Intelligence: "AI",
  Workspace: "▦",
  Marketplace: "◆",
  Mobility: "◉",
  Foundation: "⬡",
  Knowledge: "◎",
  Innovation: "✦",
  Operations: "↗",
  Factory: "⚙",
  Governance: "✓",
  Industries: "▤",
  Platform: "AV",
};

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-2xl font-black text-white">
        {value ?? "—"}
      </div>
    </div>
  );
}

export function AvosLauncher() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [health, setHealth] = useState<PlatformHealth | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchPlatformHealth(controller.signal)
      .then((result) => {
        setHealth(result);
        setHealthError(null);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setHealthError(
            error instanceof Error ? error.message : "تعذر الاتصال بالـ API",
          );
        }
      });

    return () => controller.abort();
  }, []);

  const filteredSections = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return platformSections.filter((section) => {
      const matchesCategory =
        category === "All" || section.category === category;
      const matchesQuery =
        !normalized ||
        section.title.toLowerCase().includes(normalized) ||
        section.category.toLowerCase().includes(normalized) ||
        section.description.toLowerCase().includes(normalized) ||
        section.route.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const featured = filteredSections.filter((section) => section.featured);
  const remaining = filteredSections.filter((section) => !section.featured);

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <section className="overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-5 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              AVOS Unified Platform Runtime
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              مركز إطلاق AVOS الذكي
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              نقطة دخول موحدة لجميع وحدات المنصة، مع بحث مباشر، تنقل موحد،
              ومؤشرات حقيقية من AVOS API.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن قسم، قدرة، سوق، مصنع، أو مركز قيادة..."
                className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 text-white outline-none placeholder:text-slate-400 focus:border-emerald-400"
              />
              <Link
                href="/enterprise-command-center"
                className="grid min-h-14 place-items-center rounded-2xl bg-emerald-500 px-6 font-black text-slate-950 hover:bg-emerald-400"
              >
                فتح مركز القيادة
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-black text-white">
                  الحالة التشغيلية
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {health?.source ?? "AVOS API"}
                </div>
              </div>

              <div
                className={`rounded-full px-3 py-1.5 text-xs font-black ${
                  health?.status === "operational"
                    ? "bg-emerald-400/15 text-emerald-300"
                    : healthError
                      ? "bg-rose-400/15 text-rose-300"
                      : "bg-amber-400/15 text-amber-300"
                }`}
              >
                {health?.status === "operational"
                  ? "Operational"
                  : healthError
                    ? "API Offline"
                    : "Checking"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Capabilities" value={health?.capabilities} />
              <MetricCard label="Services" value={health?.services} />
              <MetricCard label="Endpoints" value={health?.endpoints} />
              <MetricCard label="Modules" value={health?.modules} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <MetricCard label="Version" value={health?.version} />
              <MetricCard
                label="Sections"
                value={platformSections.length}
              />
            </div>

            {healthError ? (
              <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-3 text-xs leading-6 text-rose-200">
                الواجهة تعمل، لكن تعذر جلب الحالة الحية من API: {healthError}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-8 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-3">
          <button
            type="button"
            onClick={() => setCategory("All")}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
              category === "All"
                ? "bg-slate-950 text-white"
                : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            جميع الأقسام
          </button>

          {platformCategories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-black ${
                category === item
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {featured.length > 0 ? (
          <section className="mt-5">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">الأقسام الرئيسية</h2>
                <p className="mt-1 text-sm text-slate-500">
                  أهم نقاط الدخول إلى منصة AVOS.
                </p>
              </div>
              <span className="text-sm font-bold text-slate-500">
                {featured.length} أقسام
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((section) => (
                <Link
                  key={section.route}
                  href={section.route}
                  className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                      {CATEGORY_ICONS[section.category] ?? "AV"}
                    </div>
                    <span className="text-xl text-slate-300 transition group-hover:translate-x-[-4px] group-hover:text-slate-950">
                      ←
                    </span>
                  </div>
                  <div className="mt-6 text-xl font-black">
                    {section.title}
                  </div>
                  <div className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                    {section.description}
                  </div>
                  <div className="mt-5 text-xs font-black uppercase tracking-wider text-emerald-700">
                    {section.category}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">جميع وحدات المنصة</h2>
              <p className="mt-1 text-sm text-slate-500">
                السجل الموحد للصفحات المكتشفة فعليًا داخل src/app.
              </p>
            </div>
            <span className="text-sm font-bold text-slate-500">
              {remaining.length} نتيجة
            </span>
          </div>

          {remaining.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {remaining.map((section) => (
                <Link
                  key={section.route}
                  href={section.route}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-700">
                      {CATEGORY_ICONS[section.category] ?? "AV"}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-black">{section.title}</div>
                      <div className="truncate text-xs font-bold text-slate-400">
                        {section.route}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              لا توجد نتائج مطابقة.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
