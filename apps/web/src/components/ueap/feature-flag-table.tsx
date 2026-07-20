import type { FeatureFlag } from "@/lib/ueap/types";

export function FeatureFlagTable({ flags }: { flags: FeatureFlag[] }) {
  return (
    <section className="ueap-panel">
      <header>
        <div>
          <span>Runtime Release Control</span>
          <h2>Feature Flags</h2>
        </div>
      </header>
      <div className="ueap-table">
        <div className="ueap-table-row heading">
          <span>Key</span>
          <span>Scope</span>
          <span>Rollout</span>
          <span>Status</span>
        </div>
        {flags.map((flag) => (
          <div className="ueap-table-row" key={flag.key}>
            <strong>{flag.key}</strong>
            <span>{flag.scope}</span>
            <span>{flag.rolloutPercentage}%</span>
            <span>{flag.enabled ? "Enabled" : "Disabled"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
