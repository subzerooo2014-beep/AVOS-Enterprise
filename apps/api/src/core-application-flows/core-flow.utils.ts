import { BadRequestException, ConflictException } from "@nestjs/common";
import type { CoreFlowResult } from "./core-flow.types";

const completedOperations = new Map<string, CoreFlowResult>();

export function cleanFlowData(data: Record<string, unknown> | undefined) {
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      output[key] = value;
    }
  }
  return output;
}

export function asMoney(value: unknown, field = "amount") {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new BadRequestException(`${field} must be a valid non-negative number.`);
  }
  return amount;
}

export function requireText(value: unknown, field: string) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    throw new BadRequestException(`${field} is required.`);
  }
  return normalized;
}

export function createBusinessNumber(prefix: string) {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${stamp}-${random}`;
}

export function resolveIdempotencyKey(
  provided: unknown,
  fallbackParts: unknown[],
) {
  const explicit = String(provided ?? "").trim();
  if (explicit) return explicit;
  return fallbackParts.map((part) => String(part ?? "")).join(":");
}

export function readCompletedOperation(key: string) {
  return completedOperations.get(key);
}

export function rememberCompletedOperation<T>(
  key: string,
  flow: string,
  result: T,
): CoreFlowResult<T> {
  if (completedOperations.has(key)) {
    throw new ConflictException(`Operation '${key}' has already been completed.`);
  }

  const envelope: CoreFlowResult<T> = {
    success: true,
    flow,
    idempotencyKey: key,
    timestamp: new Date().toISOString(),
    result,
  };
  completedOperations.set(key, envelope);
  return envelope;
}

export function ensureTransition(
  current: string | undefined,
  allowed: string[],
  target: string,
) {
  if (current && !allowed.includes(current)) {
    throw new ConflictException(
      `Cannot transition from '${current}' to '${target}'.`,
    );
  }
}

export function delegateOrThrow(client: unknown, name: string) {
  const delegate = (client as Record<string, any>)[name];
  if (!delegate) {
    throw new BadRequestException(
      `Prisma delegate '${name}' is not available. Run pnpm prisma generate.`,
    );
  }
  return delegate;
}
