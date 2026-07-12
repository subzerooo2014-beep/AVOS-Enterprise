export function frontendKebab(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function frontendPascal(value: string): string {
  return frontendKebab(value)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function frontendCamel(value: string): string {
  const valuePascal = frontendPascal(value);
  return valuePascal.charAt(0).toLowerCase() + valuePascal.slice(1);
}
