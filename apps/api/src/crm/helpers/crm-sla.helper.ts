export function getCrmSlaStatus(record: any, now = new Date()): "OK" | "DUE_SOON" | "OVERDUE" | "NO_FOLLOW_UP" {
  if (!record?.nextFollowUpAt) return "NO_FOLLOW_UP";

  const followUp = new Date(record.nextFollowUpAt);

  if (Number.isNaN(followUp.getTime())) return "NO_FOLLOW_UP";

  const diffMs = followUp.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 0) return "OVERDUE";
  if (diffHours <= 24) return "DUE_SOON";

  return "OK";
}

export function enrichWithSla(record: any): any {
  if (!record) return null;

  return {
    ...record,
    slaStatus: getCrmSlaStatus(record),
  };
}
