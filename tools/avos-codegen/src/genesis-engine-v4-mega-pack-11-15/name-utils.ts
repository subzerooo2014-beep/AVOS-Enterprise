export function backendKebab(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function backendPascal(value: string): string {
  return backendKebab(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function backendCamel(value: string): string {
  const result = backendPascal(value);
  return result.charAt(0).toLowerCase() + result.slice(1);
}
