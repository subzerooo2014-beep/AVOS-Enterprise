import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { INDUSTRY_CAPABILITIES } from "./industry-mega-bundle-3.registry";
import {
  IndustryAiDecision,
  IndustryCode,
  IndustryEntity,
  IndustryTransaction,
} from "./industry-mega-bundle-3.types";

@Injectable()
export class IndustryMegaBundle3Service {
  private readonly entities = new Map<string, IndustryEntity>();
  private readonly transactions = new Map<string, IndustryTransaction>();
  private readonly decisions = new Map<string, IndustryAiDecision>();
  private readonly codeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Industry Mega Bundle 3",
      industries: Object.keys(INDUSTRY_CAPABILITIES),
      capabilities: structuredClone(INDUSTRY_CAPABILITIES),
      status: "READY",
    };
  }

  createEntity(
    industry: IndustryCode,
    input: Omit<
      IndustryEntity,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const code = `${industry}:${input.code.trim().toUpperCase()}`;

    if (!input.name.trim()) {
      throw new Error("Entity name is required");
    }

    if (this.codeIndex.has(code)) {
      throw new Error(`Duplicate industry entity code: ${code}`);
    }

    const now = new Date().toISOString();

    const entity: IndustryEntity = {
      ...input,
      id: randomUUID(),
      industry,
      code: input.code.trim().toUpperCase(),
      name: input.name.trim(),
      status: "DRAFT",
      attributes: { ...input.attributes },
      createdAt: now,
      updatedAt: now,
    };

    this.entities.set(entity.id, entity);
    this.codeIndex.set(code, entity.id);

    return this.cloneEntity(entity);
  }

  activateEntity(id: string) {
    const entity = this.requireEntity(id);
    entity.status = "ACTIVE";
    entity.updatedAt = new Date().toISOString();
    this.entities.set(id, entity);
    return this.cloneEntity(entity);
  }

  createTransaction(
    industry: IndustryCode,
    input: Omit<
      IndustryTransaction,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const entity = this.requireEntity(input.entityId);

    if (entity.industry !== industry) {
      throw new Error("Entity industry does not match transaction industry");
    }

    if (!Number.isFinite(input.amount) || input.amount < 0) {
      throw new Error("Transaction amount must be a non-negative number");
    }

    const now = new Date().toISOString();

    const transaction: IndustryTransaction = {
      ...input,
      id: randomUUID(),
      industry,
      status: "PENDING",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.transactions.set(transaction.id, transaction);
    return this.cloneTransaction(transaction);
  }

  updateTransactionStatus(
    id: string,
    status: IndustryTransaction["status"],
  ) {
    const transaction = this.requireTransaction(id);
    transaction.status = status;
    transaction.updatedAt = new Date().toISOString();
    this.transactions.set(id, transaction);
    return this.cloneTransaction(transaction);
  }

  createDecision(
    input: Omit<IndustryAiDecision, "id" | "createdAt">,
  ) {
    if (input.score < 0 || input.score > 100) {
      throw new Error("AI decision score must be between 0 and 100");
    }

    const decision: IndustryAiDecision = {
      ...input,
      id: randomUUID(),
      reasons: [...input.reasons],
      createdAt: new Date().toISOString(),
    };

    this.decisions.set(decision.id, decision);
    return this.cloneDecision(decision);
  }

  listEntities(industry?: IndustryCode, tenantId?: string) {
    return Array.from(this.entities.values())
      .filter((item) => !industry || item.industry === industry)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneEntity(item));
  }

  dashboard(industry?: IndustryCode) {
    const entities = Array.from(this.entities.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const transactions = Array.from(this.transactions.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const decisions = Array.from(this.decisions.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const settledValue = transactions
      .filter((item) => item.status === "SETTLED")
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      industry: industry ?? "ALL",
      entities: entities.length,
      activeEntities: entities.filter((item) => item.status === "ACTIVE").length,
      transactions: transactions.length,
      pendingTransactions: transactions.filter(
        (item) => item.status === "PENDING",
      ).length,
      settledTransactions: transactions.filter(
        (item) => item.status === "SETTLED",
      ).length,
      settledValue: Number(settledValue.toFixed(2)),
      aiDecisions: decisions.length,
      averageDecisionScore:
        decisions.length === 0
          ? 0
          : Number(
              (
                decisions.reduce((sum, item) => sum + item.score, 0) /
                decisions.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireEntity(id: string) {
    const entity = this.entities.get(id);
    if (!entity) throw new Error(`Industry entity not found: ${id}`);
    return entity;
  }

  private requireTransaction(id: string) {
    const transaction = this.transactions.get(id);
    if (!transaction) {
      throw new Error(`Industry transaction not found: ${id}`);
    }
    return transaction;
  }

  private cloneEntity(entity: IndustryEntity): IndustryEntity {
    return { ...entity, attributes: { ...entity.attributes } };
  }

  private cloneTransaction(
    transaction: IndustryTransaction,
  ): IndustryTransaction {
    return { ...transaction, metadata: { ...transaction.metadata } };
  }

  private cloneDecision(
    decision: IndustryAiDecision,
  ): IndustryAiDecision {
    return { ...decision, reasons: [...decision.reasons] };
  }
}