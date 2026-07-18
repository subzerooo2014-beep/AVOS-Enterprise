import { NotificationPanel } from "../components/notification-panel";
import { SiteHeader } from "../components/site-header";

export default function NotificationsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 text-4xl font-black">مركز الإشعارات</h1>
        <NotificationPanel />
      </div>
    </main>
  );
}