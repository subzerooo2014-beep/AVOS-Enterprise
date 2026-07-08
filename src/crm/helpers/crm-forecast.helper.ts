export function calculateWeightedPipelineValue(items: any[]): number {
  const weights: Record<string, number> = {
    NEW: 0.05,
    CONTACTED: 0.15,
    QUALIFIED: 0.35,
    OPPORTUNITY: 0.65,
    WON: 1,
    LOST: 0,
    INACTIVE: 0,
  };

  const total = (items ?? []).reduce((sum, item) => {
    const status = String(item?.status ?? "NEW");
    const value = Number(item?.expectedValue ?? item?.total ?? 0);
    const weight = weights[status] ?? 0;
    return sum + value * weight;
  }, 0);

  return Number(total.toFixed(2));
}

export function calculateRawPipelineValue(items: any[]): number {
  const total = (items ?? []).reduce((sum, item) => {
    return sum + Number(item?.expectedValue ?? item?.total ?? 0);
  }, 0);

  return Number(total.toFixed(2));
}
