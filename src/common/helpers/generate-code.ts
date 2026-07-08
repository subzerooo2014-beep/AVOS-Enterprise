export function generateCode(prefix: string) {
  return `${prefix}-${Date.now()}`;
}
