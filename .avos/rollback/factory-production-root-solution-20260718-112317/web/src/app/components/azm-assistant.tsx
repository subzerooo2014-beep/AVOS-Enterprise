"use client";

import { useState } from "react";

export function AzmAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 left-6 z-50 rounded-full bg-emerald-600 px-6 py-4 font-black text-white shadow-xl"
      >
        عزم AI
      </button>

      {open ? (
        <div className="fixed bottom-24 left-6 z-50 w-[340px] rounded-3xl border bg-white p-5 shadow-2xl">
          <div className="text-sm text-slate-500">مساعدك الذكي</div>
          <h3 className="mt-1 text-2xl font-black">مرحبا الساع 👋</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            اكتب ما تبحث عنه وسأرتب لك أفضل الخيارات.
          </p>
          <textarea
            className="mt-4 min-h-28 w-full rounded-2xl border px-4 py-3 outline-none"
            placeholder="مثال: أريد لاندكروزر 2024 أقل من 300 ألف"
          />
          <button className="mt-3 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white">
            اسأل عزم
          </button>
        </div>
      ) : null}
    </>
  );
}