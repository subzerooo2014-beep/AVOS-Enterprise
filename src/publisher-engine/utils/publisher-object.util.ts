export function safeObject(input: any) {
  return input && typeof input === "object" && !Array.isArray(input) ? input : {};
}

export function safeString(input: any, fallback = "") {
  return typeof input === "string" && input.trim().length ? input.trim() : fallback;
}
