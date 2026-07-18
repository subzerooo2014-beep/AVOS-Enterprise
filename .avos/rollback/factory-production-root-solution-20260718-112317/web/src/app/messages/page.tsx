import { SiteHeader } from "../components/site-header";

export default function MessagesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border bg-white p-5">
          <h1 className="text-2xl font-black">المحادثات</h1>
          <div className="mt-5 grid gap-3">
            {["محمد - لاندكروزر", "معرض النخبة", "خالد - نيسان باترول"].map((item) => (
              <button key={item} className="rounded-2xl border p-4 text-right font-bold">{item}</button>
            ))}
          </div>
        </aside>

        <section className="flex min-h-[560px] flex-col rounded-3xl border bg-white p-6">
          <div className="border-b pb-4">
            <div className="font-black">محمد - Toyota Land Cruiser</div>
            <div className="text-sm text-emerald-600">متصل الآن</div>
          </div>
          <div className="flex-1 space-y-4 py-6">
            <div className="ml-auto max-w-md rounded-2xl bg-slate-100 p-4">هل السيارة ما زالت متوفرة؟</div>
            <div className="mr-auto max-w-md rounded-2xl bg-emerald-100 p-4">نعم، متوفرة ويمكن ترتيب فحص اليوم.</div>
          </div>
          <div className="flex gap-3">
            <input className="flex-1 rounded-2xl border px-4 py-3" placeholder="اكتب رسالتك..." />
            <button className="rounded-2xl bg-emerald-600 px-6 font-bold text-white">إرسال</button>
          </div>
        </section>
      </div>
    </main>
  );
}