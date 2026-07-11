export function normalizeSearch(value: any): string {
  return String(value ?? "").trim().toLowerCase();
}

export function containsText(source: any, search: any): boolean {
  const src = normalizeSearch(source);
  const txt = normalizeSearch(search);

  if (!txt) return true;

  return src.includes(txt);
}
