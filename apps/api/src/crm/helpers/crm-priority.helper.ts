export function calculateCrmPriority(record: any): "LOW" | "MEDIUM" | "HIGH" | "URGENT" {
  const score = Number(record?.score ?? 0);

  if (record?.status === "OPPORTUNITY" && score >= 80) return "URGENT";
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}
