const RESERVED_WORDS = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "yield",
]);

export function toPascalCase(value: string): string {
  const normalized = value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const safe = normalized || "GeneratedCapability";
  const prefixed = /^[0-9]/.test(safe) ? `Capability${safe}` : safe;

  return RESERVED_WORDS.has(prefixed.toLowerCase())
    ? `Generated${prefixed}`
    : prefixed;
}

export function toKebabCase(value: string): string {
  const normalized = value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return normalized || "generated-capability";
}

export function toConstantCase(value: string): string {
  const kebab = toKebabCase(value);
  const constant = kebab.replace(/-/g, "_").toUpperCase();

  return /^[0-9]/.test(constant)
    ? `CAPABILITY_${constant}`
    : constant;
}

export function assertValidTypeScriptIdentifier(
  value: string,
  label = "identifier",
): void {
  if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(value)) {
    throw new Error(`Invalid TypeScript ${label}: ${value}`);
  }

  if (RESERVED_WORDS.has(value.toLowerCase())) {
    throw new Error(`Reserved TypeScript ${label}: ${value}`);
  }
}