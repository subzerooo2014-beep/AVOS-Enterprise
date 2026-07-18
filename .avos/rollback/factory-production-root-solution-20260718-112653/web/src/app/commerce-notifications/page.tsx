import { SiteHeader } from "../components/site-header";

export default function CommerceNotificationsPage() {
  const notifications = [
    "تمت الموافقة على عرض التمويل.",
    "عرض التأمين الجديد متاح الآن.",
    "تم تأكيد موعد الورشة.",
    "تم إنشاء طلب الشحن.",
    "اكتملت عملية الدفع.",
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-4xl font-black">إشعارات الخدمات</h1>
        <div className="mt-8 grid gap-4">
          {notifications.map((item) => (
            <div key={item} className="rounded-3xl border bg-white p-5">
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}