export const CRM_PIPELINE_STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "OPPORTUNITY",
  "WON",
  "LOST",
  "INACTIVE",
] as const;

export function normalizePipelineStage(status: any): string {
  const value = String(status ?? "NEW").toUpperCase();
  return CRM_PIPELINE_STAGES.includes(value as any) ? value : "NEW";
}

export function groupCrmPipeline(items: any[]) {
  const grouped: Record<string, any[]> = {
    NEW: [],
    CONTACTED: [],
    QUALIFIED: [],
    OPPORTUNITY: [],
    WON: [],
    LOST: [],
    INACTIVE: [],
  };

  for (const item of items ?? []) {
    const stage = normalizePipelineStage(item?.status);
    grouped[stage].push(item);
  }

  return grouped;
}
