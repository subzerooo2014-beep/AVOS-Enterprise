import { Card } from '@/components/ui/card';

export default function Page() {
  return (
    <>
      <header className="dashboard-header">
        <span className="eyebrow">Enterprise Control Center</span>
        <h1>Internal Service Mesh</h1>
      </header>
      <div className="content-grid">
        <Card>
          <h3>Operational Foundation</h3>
          <p className="muted">
            Live integration foundation is ready for extended APIs.
          </p>
        </Card>
        <Card>
          <h3>Human Final Authority</h3>
          <p className="muted">
            Strategic actions remain approval-controlled.
          </p>
        </Card>
      </div>
    </>
  );
}