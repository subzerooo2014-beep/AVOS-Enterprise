type MetricCardProps = {
  label: string;
  value: string | number;
  detail?: string;
};

export function MetricCard({
  label,
  value,
  detail,
}: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {detail ? (
        <span className="metric-detail">{detail}</span>
      ) : null}
    </article>
  );
}