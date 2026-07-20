import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>AVOS Enterprise</strong>
          <p>
            بنية تشغيل رقمية وذكاء مؤسسي لمنصات التنقل المستقبلية.
          </p>
        </div>
        <div>
          <span className="footer-title">المنصة</span>
          <Link href="/platforms">المنصات</Link>
          <Link href="/technology">التقنية</Link>
          <Link href="/control-center">مركز التحكم</Link>
        </div>
        <div>
          <span className="footer-title">الثقة</span>
          <Link href="/trust">الأمان والامتثال</Link>
          <Link href="/legal/privacy">الخصوصية</Link>
          <Link href="/legal/terms">الشروط</Link>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 AVOS Enterprise. Human Final Authority.
      </div>
    </footer>
  );
}