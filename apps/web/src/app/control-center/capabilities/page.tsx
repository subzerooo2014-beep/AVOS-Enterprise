import { apiGet } from '@/lib/api-client';
import type { CapabilityRecord } from '@/types/avos';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';

export default async function CapabilitiesPage() {
  const result = await apiGet<CapabilityRecord[]>(
    '/avos/capability-runtime/capabilities',
  );

  return (
    <>
      <header className="dashboard-header">
        <span className="eyebrow">Capability Registry</span>
        <h1>القدرات المسجلة</h1>
      </header>

      {!result.ok || !result.data ? (
        <Card>
          <p className="muted">
            تعذر تحميل القدرات: {result.error}
          </p>
        </Card>
      ) : (
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>القدرة</th>
                <th>الفئة</th>
                <th>الإصدار</th>
                <th>الحالة</th>
                <th>الاعتماديات</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((capability) => (
                <tr key={capability.id}>
                  <td>
                    <strong>{capability.name}</strong>
                    <small>{capability.id}</small>
                  </td>
                  <td>{capability.category}</td>
                  <td>{capability.version}</td>
                  <td>
                    <StatusBadge status={capability.state} />
                  </td>
                  <td>
                    {capability.dependencies.join(', ') || 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}