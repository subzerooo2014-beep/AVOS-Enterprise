import { apiGet } from '@/lib/api-client';
import type { RuntimeHealth } from '@/types/avos';
import { MetricCard } from '@/components/ui/metric-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';

export async function RuntimeOverview() {
  const result = await apiGet<RuntimeHealth>(
    '/avos/capability-runtime/status',
  );

  if (!result.ok || !result.data) {
    return (
      <Card>
        <div className="panel-header">
          <div>
            <span className="eyebrow">Runtime Connection</span>
            <h2>تعذر الاتصال بالـ API</h2>
          </div>
          <StatusBadge status="offline" />
        </div>
        <p className="muted">
          {result.error ?? 'Unknown connection error'}
        </p>
      </Card>
    );
  }

  const runtime = result.data;

  return (
    <>
      <div className="panel-header">
        <div>
          <span className="eyebrow">Live Runtime</span>
          <h2>{runtime.name ?? 'AVOS Capability Runtime'}</h2>
        </div>
        <StatusBadge status={runtime.status ?? 'unknown'} />
      </div>
      <div className="metrics-grid">
        <MetricCard
          label="Runtime Health"
          value={runtime.health?.score ?? '—'}
        />
        <MetricCard
          label="Capabilities"
          value={runtime.registeredCapabilities ?? '—'}
        />
        <MetricCard
          label="Healthy"
          value={runtime.health?.healthy ?? '—'}
        />
        <MetricCard
          label="Dependencies"
          value={
            runtime.dependencyValidation?.valid
              ? 'Valid'
              : 'Review'
          }
        />
      </div>
    </>
  );
}