import {
  CodeGenJsonValue,
} from "../../core/codegen.contracts";

export function resolveTemplateValue(
  variables: Record<string, CodeGenJsonValue>,
  path: string,
): CodeGenJsonValue | undefined {
  const normalized = path.trim();

  if (
    normalized === "." ||
    normalized === "this"
  ) {
    return variables["this"];
  }

  const parts = normalized
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);

  let current: CodeGenJsonValue | undefined =
    variables;

  for (const part of parts) {
    if (
      current === null ||
      typeof current !== "object" ||
      Array.isArray(current)
    ) {
      return undefined;
    }

    current = current[part];
  }

  return current;
}

export function stringifyTemplateValue(
  value: CodeGenJsonValue | undefined,
): string {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
}

export function isTruthyTemplateValue(
  value: CodeGenJsonValue | undefined,
): boolean {
  if (
    value === undefined ||
    value === null ||
    value === false ||
    value === "" ||
    value === 0
  ) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }

  return true;
}

export function escapeHtml(
  value: string,
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function toWords(
  value: string,
): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function toPascalCase(
  value: string,
): string {
  return toWords(value)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase(),
    )
    .join("");
}

export function toCamelCase(
  value: string,
): string {
  const pascal = toPascalCase(value);

  return pascal
    ? pascal.charAt(0).toLowerCase() +
        pascal.slice(1)
    : "";
}

export function toKebabCase(
  value: string,
): string {
  return toWords(value)
    .map((word) => word.toLowerCase())
    .join("-");
}

export function toSnakeCase(
  value: string,
): string {
  return toWords(value)
    .map((word) => word.toLowerCase())
    .join("_");
}

export function toConstantCase(
  value: string,
): string {
  return toWords(value)
    .map((word) => word.toUpperCase())
    .join("_");
}

export function toTitleCase(
  value: string,
): string {
  return toWords(value)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase(),
    )
    .join(" ");
}

export function indentText(
  value: string,
  size: number,
): string {
  const spaces = " ".repeat(
    Math.max(0, size),
  );

  return value
    .split(/\r?\n/)
    .map((line) =>
      line.length > 0
        ? `${spaces}${line}`
        : line,
    )
    .join("\n");
}
