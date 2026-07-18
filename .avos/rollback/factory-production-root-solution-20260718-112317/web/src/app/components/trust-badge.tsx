export function TrustBadge({ score }: { score: number }) {
  const label = score >= 95 ? "موثوق جداً" : score >= 90 ? "موثوق" : "قيد التقييم";

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
      <span>✓</span>
      <span>{label}</span>
      <span>{score}%</span>
    </div>
  );
}