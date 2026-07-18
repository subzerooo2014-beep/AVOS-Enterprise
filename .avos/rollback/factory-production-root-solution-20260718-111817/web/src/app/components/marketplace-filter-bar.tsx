"use client";

import { useState } from "react";

export function MarketplaceFilterBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="rounded-2xl border px-4 py-3 outline-none"
          placeholder="ابحث عن مركبة..."
        />
        <select className="rounded-2xl border px-4 py-3">
          <option>كل الفئات</option>
          <option>سيارات</option>
          <option>دراجات</option>
          <option>قوارب</option>
          <option>شاحنات</option>
        </select>
        <select className="rounded-2xl border px-4 py-3">
          <option>كل الإمارات</option>
          <option>دبي</option>
          <option>أبوظبي</option>
          <option>الشارقة</option>
        </select>
        <select className="rounded-2xl border px-4 py-3">
          <option>السعر</option>
          <option>أقل من 100 ألف</option>
          <option>100–250 ألف</option>
          <option>أكثر من 250 ألف</option>
        </select>
        <select className="rounded-2xl border px-4 py-3">
          <option>الترتيب</option>
          <option>الأحدث</option>
          <option>الأقل سعراً</option>
          <option>الأعلى ثقة</option>
        </select>
        <button className="rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white">
          بحث
        </button>
      </div>

      {query ? (
        <div className="mt-3 text-sm text-slate-500">
          نتائج البحث عن: <span className="font-bold text-slate-900">{query}</span>
        </div>
      ) : null}
    </div>
  );
}