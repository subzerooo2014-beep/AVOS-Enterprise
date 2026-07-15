import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { TRANSACTION_LIFECYCLE_DOMAINS } from "./transaction-lifecycle.registry";
import {
  TransactionCase,
  TransactionCommand,
  TransactionCommandResult,
  TransactionStatus,
} from "./transaction-lifecycle.types";

@Injectable()
export class TransactionLifecycleService {
  private readonly cases = new Map<string, TransactionCase>();
  private readonly executions = new Map<string, TransactionCommandResult>();

  domains() {
    return TRANSACTION_LIFECYCLE_DOMAINS.map((domain) => ({
      ...domain,
      capabilities: [...domain.capabilities],
      status: domain.enabled ? "READY" : "DISABLED",
    }));
  }

  createCase(
    input: Omit<TransactionCase, "id" | "status" | "createdAt" | "updatedAt">,
  ): TransactionCase {
    this.requireDomain(input.domain);

    if (
      !input.tenantId?.trim() ||
      !input.buyerId?.trim() ||
      !input.sellerId?.trim() ||
      !input.vehicleId?.trim()
    ) {
      throw new Error(
        "tenantId, buyerId, sellerId and vehicleId are required",
      );
    }

    if (input.amount < 0) {
      throw new Error("amount cannot be negative");
    }

    const now = new Date().toISOString();
    const transaction: TransactionCase = {
      ...input,
      id: randomUUID(),
      status: "CREATED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.cases.set(transaction.id, transaction);
    return this.cloneCase(transaction);
  }

  updateStatus(id: string, status: TransactionStatus): TransactionCase {
    const transaction = this.requireCase(id);
    transaction.status = status;
    transaction.updatedAt = new Date().toISOString();
    this.cases.set(id, transaction);
    return this.cloneCase(transaction);
  }

  caseById(id: string): TransactionCase {
    return this.cloneCase(this.requireCase(id));
  }

  casesForDomain(domain: string): TransactionCase[] {
    this.requireDomain(domain);

    return Array.from(this.cases.values())
      .filter((item) => item.domain === domain)
      .map((item) => this.cloneCase(item));
  }

  execute(command: TransactionCommand): TransactionCommandResult {
    const domain = this.requireDomain(command.domain);

    if (!domain.capabilities.includes(command.capability)) {
      throw new Error(
        `Capability ${command.capability} is not available in ${command.domain}`,
      );
    }

    if (
      !command.tenantId?.trim() ||
      !command.actorId?.trim() ||
      !command.action?.trim()
    ) {
      throw new Error("tenantId, actorId and action are required");
    }

    if (command.caseId) {
      this.requireCase(command.caseId);
    }

    const result: TransactionCommandResult = {
      id: randomUUID(),
      domain: command.domain,
      capability: command.capability,
      action: command.action,
      tenantId: command.tenantId,
      actorId: command.actorId,
      caseId: command.caseId,
      success: true,
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      output: {
        payload: command.payload ?? {},
        governed: true,
        auditable: true,
        observable: true,
        traceable: true,
      },
    };

    this.executions.set(result.id, result);
    return { ...result, output: { ...result.output } };
  }

  dashboard() {
    const cases = Array.from(this.cases.values());

    return {
      system: "AVOS Transaction & Ownership Lifecycle",
      domains: TRANSACTION_LIFECYCLE_DOMAINS.length,
      capabilities: TRANSACTION_LIFECYCLE_DOMAINS.reduce(
        (sum, domain) => sum + domain.capabilities.length,
        0,
      ),
      cases: cases.length,
      inProgress: cases.filter((item) => item.status === "IN_PROGRESS").length,
      completed: cases.filter((item) => item.status === "COMPLETED").length,
      disputed: cases.filter((item) => item.status === "DISPUTED").length,
      executions: this.executions.size,
      generatedAt: new Date().toISOString(),
    };
  }

  private requireDomain(key: string) {
    const domain = TRANSACTION_LIFECYCLE_DOMAINS.find(
      (item) => item.key === key,
    );

    if (!domain || !domain.enabled) {
      throw new Error(`Active transaction domain not found: ${key}`);
    }

    return domain;
  }

  private requireCase(id: string): TransactionCase {
    const transaction = this.cases.get(id);

    if (!transaction) {
      throw new Error(`Transaction case not found: ${id}`);
    }

    return transaction;
  }

  private cloneCase(transaction: TransactionCase): TransactionCase {
    return {
      ...transaction,
      metadata: { ...transaction.metadata },
    };
  }
}