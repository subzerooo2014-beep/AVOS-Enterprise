export function NotificationPanel() {
  const items = [
    "تمت مشاهدة إعلانك 24 مرة اليوم",
    "وصلتك رسالة جديدة من مشترٍ مهتم",
    "تم تحديث تقييم السعر الذكي",
  ];

  return (
    <section className="rounded-3xl border bg-white p-6">
      <h2 className="text-xl font-black">الإشعارات</h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-slate-50 p-4 text-sm">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}