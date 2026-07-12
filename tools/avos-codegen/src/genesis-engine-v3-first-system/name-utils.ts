export function kebab(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function pascal(value: string): string {
  return kebab(value)
    .split("-")
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join("");
}

export function camel(value: string): string {
  const valuePascal = pascal(value);
  return valuePascal.charAt(0).toLowerCase() + valuePascal.slice(1);
}
