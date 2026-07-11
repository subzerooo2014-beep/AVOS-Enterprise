export function normalizeIdentity(value: any): string {
  return String(value ?? "").trim().toLowerCase();
}

export function buildDuplicateKey(record: any): string {
  const email = normalizeIdentity(record?.email);
  const phone = normalizeIdentity(record?.phone);
  const name = normalizeIdentity(record?.name);

  return email || phone || name;
}

export function findDuplicateGroups(items: any[]) {
  const map = new Map<string, any[]>();

  for (const item of items ?? []) {
    const key = buildDuplicateKey(item);
    if (!key) continue;

    const current = map.get(key) ?? [];
    current.push(item);
    map.set(key, current);
  }

  return Array.from(map.entries())
    .filter(([, values]) => values.length > 1)
    .map(([key, values]) => ({ key, count: values.length, items: values }));
}
