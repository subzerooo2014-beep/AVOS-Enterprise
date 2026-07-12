export function v4Pascal(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function v4Camel(value: string): string {
  const result = v4Pascal(value);
  return result.charAt(0).toLowerCase() + result.slice(1);
}
