export function createCrmActivity(type: string, description: string, payload: any = {}) {
  return {
    id: `${type}-${Date.now()}`,
    type,
    description,
    payload,
    createdAt: new Date().toISOString(),
  };
}

export function appendCrmActivity(record: any, activity: any) {
  const current = Array.isArray(record?.activities) ? record.activities : [];
  return [...current, activity];
}
