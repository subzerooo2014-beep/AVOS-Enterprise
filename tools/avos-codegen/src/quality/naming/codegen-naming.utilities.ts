export function isKebabCase(
  value: string,
): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
    value,
  );
}

export function isPascalCase(
  value: string,
): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(
    value,
  );
}

export function isCamelCase(
  value: string,
): boolean {
  return /^[a-z][A-Za-z0-9]*$/.test(
    value,
  );
}

export function filenameWithoutExtensions(
  value: string,
): string {
  return value
    .replace(/\.d\.ts$/, "")
    .replace(/\.[^.]+$/, "");
}

export function pathFilename(
  relativePath: string,
): string {
  const normalized =
    relativePath.replaceAll(
      "\\",
      "/",
    );

  return normalized
    .split("/")
    .filter(Boolean)
    .pop() ?? "";
}
