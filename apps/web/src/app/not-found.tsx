import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="state-page">
      <span className="eyebrow">404</span>
      <h1>الصفحة غير موجودة</h1>
      <Link className="button button-primary" href="/">
        العودة للرئيسية
      </Link>
    </main>
  );
}