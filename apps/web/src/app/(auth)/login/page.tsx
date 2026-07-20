import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <section className="auth-card">
      <span className="eyebrow">Secure Access</span>
      <h1>تسجيل الدخول</h1>
      <p>واجهة تأسيسية جاهزة للربط مع Identity Platform.</p>
      <form className="auth-form">
        <label>
          البريد الإلكتروني
          <input type="email" />
        </label>
        <label>
          كلمة المرور
          <input type="password" />
        </label>
        <Button type="submit">دخول</Button>
      </form>
      <Link href="/register">إنشاء حساب جديد</Link>
    </section>
  );
}