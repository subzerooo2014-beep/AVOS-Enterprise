export function getCrmSegment(record: any): string {
  const score = Number(record?.score ?? 0);
  const status = String(record?.status ?? "NEW");

  if (status === "WON") return "CUSTOMER";
  if (status === "OPPORTUNITY" || score >= 75) return "HOT";
  if (status === "QUALIFIED" || score >= 50) return "WARM";
  if (status === "LOST" || status === "INACTIVE") return "COLD";

  return "NEW";
}

export function groupBySegment(items: any[]) {
  const grouped: Record<string, any[]> = {
    NEW: [],
    WARM: [],
    HOT: [],
    CUSTOMER: [],
    COLD: [],
  };

  for (const item of items ?? []) {
    const segment = getCrmSegment(item);
    grouped[segment] = grouped[segment] ?? [];
    grouped[segment].push(item);
  }

  return grouped;
}
