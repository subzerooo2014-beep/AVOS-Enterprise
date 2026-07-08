export function buildBulkStatusPayload(status: string, extra: any = {}) {
  return {
    status,
    ...extra,
  };
}

export function normalizeBulkIds(ids: any): string[] {
  if (Array.isArray(ids)) {
    return ids.map((id) => String(id)).filter(Boolean);
  }

  if (typeof ids === "string") {
    return ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  return [];
}
