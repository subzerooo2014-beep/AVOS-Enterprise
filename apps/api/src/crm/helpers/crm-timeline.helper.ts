export function createCrmTimelineEvent(type: string, payload: any = {}) {
  return {
    type,
    payload,
    createdAt: new Date().toISOString(),
  };
}

export function appendCrmTimeline(record: any, event: any) {
  const current = Array.isArray(record?.timeline) ? record.timeline : [];
  return [...current, event];
}
