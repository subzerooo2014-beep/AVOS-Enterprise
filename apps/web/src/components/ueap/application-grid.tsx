import type { RuntimeApplication } from "@/lib/ueap/types";

export function ApplicationGrid({
  applications,
}: {
  applications: RuntimeApplication[];
}) {
  return (
    <section className="ueap-app-grid">
      {applications.map((application) => (
        <a key={application.id} href={application.route} className="ueap-app-card">
          <div>
            <span>{application.category}</span>
            <strong>{application.name}</strong>
          </div>
          <p>
            v{application.version} · {application.pluginCount} plugins
          </p>
          <small>{application.health}</small>
        </a>
      ))}
    </section>
  );
}
