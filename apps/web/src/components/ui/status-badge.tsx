type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const tone =
    normalized === 'operational' ||
    normalized === 'healthy' ||
    normalized === 'passed' ||
    normalized === 'certified'
      ? 'success'
      : normalized === 'degraded'
        ? 'warning'
        : 'neutral';

  return (
    <span className={`status-badge status-${tone}`}>
      {status}
    </span>
  );
}