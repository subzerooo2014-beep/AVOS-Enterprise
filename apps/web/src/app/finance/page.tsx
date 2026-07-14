"use client";

import { useMemo, useState } from "react";
import { SiteHeader } from "../components/site-header";

export default function FinancePage() {
  const [price, setPrice] = useState(289000);
  const [downPayment, setDownPayment] = useState(50000);
  const [years, setYears] = useState(5);

  const monthly = useMemo(() => {
    const financed = Math.max(0, price - downPayment);
    return Math.round((financed * 1.032) / Math.max(1, years * 12));
  }, [price, downPayment, years]);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-3xl border bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-black">حاسبة التمويل</h1>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <input
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              className="rounded-2xl border px-4 py-3"
              type="number"
            />
            <input
              value={downPayment}
              onChange={(event) => setDownPayment(Number(event.target.value))}
              className="rounded-2xl border px-4 py-3"
              type="number"
            />
            <input
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
              className="rounded-2xl border px-4 py-3"
              type="number"
            />
          </div>

          <div className="mt-8 rounded-3xl bg-emerald-50 p-6">
            <div className="text-sm text-emerald-700">القسط الشهري المتوقع</div>
            <div className="mt-2 text-4xl font-black text-emerald-700">
              AED {monthly.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}