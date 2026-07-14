import { NotificationPanel } from "../components/notification-panel";
import { SiteHeader } from "../components/site-header";

export default function ProfilePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl border bg-white p-7">
          <div className="h-24 w-24 rounded-full bg-slate-200" />
          <h1 className="mt-5 text-3xl font-black">خليفة</h1>
          <p className="mt-2 text-slate-500">عضو موثوق منذ 2026</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">الإعلانات</div><div className="text-2xl font-black">4</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">الثقة</div><div className="text-2xl font-black">95%</div></div>
          </div>
        </section>

        <NotificationPanel />
      </div>
    </main>
  );
}