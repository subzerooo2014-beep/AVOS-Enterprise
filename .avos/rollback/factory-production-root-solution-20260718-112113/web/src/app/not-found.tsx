import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <span>404</span>
      <h1>الصفحة غير موجودة</h1>
      <p>
        ربما تم حذف الإعلان أو تغيير الرابط.
      </p>
      <Link
        href="/vehicles"
        className="button button-primary button-large"
      >
        العودة إلى السيارات
      </Link>
    </main>
  );
}
