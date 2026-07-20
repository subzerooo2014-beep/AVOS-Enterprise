import { MetricCard } from '@/components/ui/metric-card';
import { Card } from '@/components/ui/card';

export default function PortalPage() {
  return (
    <>
      <header className="dashboard-header">
        <span className="eyebrow">User Portal</span>
        <h1>مرحبًا بك في AVOS</h1>
        <p>ملخص الحساب والنشاط والطلبات والإشعارات.</p>
      </header>
      <div className="metrics-grid">
        <MetricCard label="الطلبات" value="0" />
        <MetricCard label="المفضلة" value="0" />
        <MetricCard label="الإشعارات" value="3" />
        <MetricCard label="Trust Score" value="—" />
      </div>
      <Card>
        <h2>النشاط الأخير</h2>
        <p className="muted">
          لا يوجد نشاط حقيقي بعد. الصفحة جاهزة للربط بخدمات
          الحسابات والسوق.
        </p>
      </Card>
    </>
  );
}