export default function SellPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-black">اعرض مركبتك</h1>
        <p className="mt-3 text-slate-600">أضف البيانات الأساسية وسيكمل عزم الباقي معك.</p>
        <div className="mt-8 grid gap-4">
          <input className="rounded-2xl border px-5 py-4" placeholder="نوع المركبة" />
          <input className="rounded-2xl border px-5 py-4" placeholder="الماركة والموديل" />
          <input className="rounded-2xl border px-5 py-4" placeholder="السنة" />
          <input className="rounded-2xl border px-5 py-4" placeholder="السعر المطلوب" />
          <textarea className="min-h-32 rounded-2xl border px-5 py-4" placeholder="وصف مختصر" />
          <button className="rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white">
            متابعة مع عزم
          </button>
        </div>
      </div>
    </main>
  );
}