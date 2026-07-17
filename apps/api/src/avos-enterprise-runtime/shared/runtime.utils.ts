import { randomUUID } from 'crypto';

export function createRuntimeId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function clone<T>(value: T): T {
  return structuredClone(value);
}

export function stableSort<T>(
  items: T[],
  selector: (item: T) => string,
): T[] {
  return [...items].sort((a, b) =>
    selector(a).localeCompare(selector(b)),
  );
}