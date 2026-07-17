import { randomUUID } from 'crypto';

export function integrationId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function integrationNow(): string {
  return new Date().toISOString();
}

export function deepCopy<T>(value: T): T {
  return structuredClone(value);
}

export function asErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}