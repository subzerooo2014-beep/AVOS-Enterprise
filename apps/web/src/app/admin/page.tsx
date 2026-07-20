import { MetricCard } from '@/components/ui/metric-card';
import { Card } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <main className="standalone-dashboard">
      <header className="dashboard-header">
        <span className="eyebrow">Administration</span>
        <h1>AVOS Admin Portal</h1>
        <p>
          إدارة المستخدمين، المحتوى، الصلاحيات، الإعدادات،
          الموافقات البشرية، والتكاملات.
        </p>
      </header>
      <div className="metrics-grid">
        <MetricCard label="Users" value="0" />
        <MetricCard label="Roles" value="4" />
        <MetricCard label="Approvals" value="0" />
        <MetricCard label="Alerts" value="0" />
      </div>
      <div className="content-grid">
        {[
          'User Management',
          'Role & Permission Management',
          'Content Management',
          'Human Approval Queue',
          'Feature Flags',
          'Audit Logs',
        ].map((item) => (
          <Card key={item}>
            <h3>{item}</h3>
            <p className="muted">
              Module foundation ready for backend integration.
            </p>
          </Card>
        ))}
      </div>
    </main>
  );
}