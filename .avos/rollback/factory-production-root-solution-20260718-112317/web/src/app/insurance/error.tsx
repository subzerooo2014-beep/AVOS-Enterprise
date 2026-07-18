"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-xl rounded-3xl border bg-white p-8 text-center">
        <h1 className="text-3xl font-black">Ø­Ø¯Ø« Ø®Ø·Ø£</h1>
        <p className="mt-3 text-slate-600">ØªØ¹Ø°Ø± ØªØ­Ù…ÙŠÙ„ Ø§Ù„ØµÙØ­Ø© Ø­Ø§Ù„ÙŠØ§Ù‹.</p>
        <button onClick={reset} className="mt-6 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white">
          Ø¥Ø¹Ø§Ø¯Ø© Ø§Ù„Ù…Ø­Ø§ÙˆÙ„Ø©
        </button>
      </div>
    </main>
  );
}