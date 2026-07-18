import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-600 px-4 py-2 text-xl font-black text-white">عزم</div>
          <div className="hidden sm:block">
            <div className="font-black">AVOS</div>
            <div className="text-xs text-slate-500">Vehicle Operating System</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
          <Link href="/vehicles">المركبات</Link>
          <Link href="/sell">بيع مركبتك</Link>
          <Link href="/favorites">المفضلة</Link>
          <Link href="/messages">الرسائل</Link>
          <Link href="/dashboard">لوحتي</Link>
        </nav>

        <Link href="/sell" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white">
          أضف إعلانك
        </Link>
      </div>
    </header>
  );
}