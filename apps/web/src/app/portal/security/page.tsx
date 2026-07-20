import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <>
      <header className="dashboard-header">
        <span className="eyebrow">User Portal</span>
        <h1>أمان الحساب</h1>
      </header>
      <Card>
        <p className="muted">
          هذه الواجهة تأسيسية وجاهزة للربط بخدمات AVOS الخلفية.
        </p>
      </Card>
    </>
  );
}