import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  return (
    <section className="auth-card">
      <span className="eyebrow">Join AVOS</span>
      <h1>إنشاء حساب</h1>
      <form className="auth-form">
        <label>
          الاسم
          <input type="text" />
        </label>
        <label>
          البريد الإلكتروني
          <input type="email" />
        </label>
        <label>
          كلمة المرور
          <input type="password" />
        </label>
        <Button type="submit">إنشاء الحساب</Button>
      </form>
      <Link href="/login">لديك حساب؟ سجل الدخول</Link>
    </section>
  );
}