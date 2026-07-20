import { Suspense } from 'react';
import { RuntimeOverview } from '@/features/runtime/runtime-overview';
import { Card } from '@/components/ui/card';

export default function ControlCenterPage() {
  return (
    <>
      <header className="dashboard-header">
        <span className="eyebrow">Enterprise Control Center</span>
        <h1>نظرة موحدة على AVOS</h1>
        <p>
          حالة التشغيل، القدرات، الاعتماديات، الامتثال، والشهادات
          من واجهة واحدة.
        </p>
      </header>

      <Suspense
        fallback={
          <Card>
            <p>جاري تحميل Runtime...</p>
          </Card>
        }
      >
        <RuntimeOverview />
      </Suspense>

      <div className="content-grid dashboard-panels">
        <Card>
          <h3>Human Final Authority</h3>
          <p className="muted">Enforced across strategic decisions.</p>
        </Card>
        <Card>
          <h3>Global Compliance</h3>
          <p className="muted">
            Readiness gate integrated into certification.
          </p>
        </Card>
        <Card>
          <h3>Production Certification</h3>
          <p className="muted">
            APCP evidence and release authorization.
          </p>
        </Card>
      </div>
    </>
  );
}