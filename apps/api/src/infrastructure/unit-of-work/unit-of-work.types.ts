import type { Prisma } from "@prisma/client";

export type UnitOfWorkTransactionClient = Prisma.TransactionClient;

export interface UnitOfWorkOptions {
  maxWait?: number;
  timeout?: number;
  isolationLevel?: Prisma.TransactionIsolationLevel;
}

export interface UnitOfWorkExecution<T> {
  id: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  success: boolean;
  result?: T;
  error?: string;
}

export interface UnitOfWorkHealth {
  success: boolean;
  system: string;
  status: "READY";
  activeExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
}
