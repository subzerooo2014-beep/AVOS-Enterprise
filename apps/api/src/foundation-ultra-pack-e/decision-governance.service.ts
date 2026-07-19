import { Injectable } from "@nestjs/common";
import { DecisionRecord } from "./foundation-ultra-pack-e.types";
import { FoundationUltraPackEFileStoreService } from "./foundation-ultra-pack-e-file-store.service";

@Injectable()
export class DecisionGovernanceService {
  constructor(
    private readonly store: FoundationUltraPackEFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  propose(input: Omit<
    DecisionRecord,
    | "id"
    | "selectedOptionId"
    | "rationale"
    | "status"
    | "approvedBy"
    | "createdAt"
    | "updatedAt"
  >): DecisionRecord {
    if (input.options.length === 0) {
      throw new Error("Decision requires at least one option.");
    }

    const ranked = [...input.options].sort((a, b) => {
      const scoreA = a.valueScore + a.trustScore - a.riskScore;
      const scoreB = b.valueScore + b.trustScore - b.riskScore;
      return scoreB - scoreA;
    });

    const selected = ranked[0];

    const record: DecisionRecord = {
      ...input,
      id: this.id("decision"),
      selectedOptionId: selected.id,
      rationale: [
        `Selected ${selected.label}.`,
        `Value score: ${selected.valueScore}.`,
        `Trust score: ${selected.trustScore}.`,
        `Risk score: ${selected.riskScore}.`,
        "Selection uses value + trust - risk ranking.",
      ],
      status: "proposed",
      createdAt: this.now(),
      updatedAt: this.now(),
    };

    this.store.writeJson(`decisions/${record.id}.json`, record);
    return record;
  }

  approve(
    decisionId: string,
    approvedBy: string,
  ): DecisionRecord {
    const decision = this.list().find((item) => item.id === decisionId);

    if (!decision) {
      throw new Error(`Decision not found: ${decisionId}`);
    }

    if (
      decision.requiresHumanApproval &&
      !approvedBy.startsWith("human:")
    ) {
      throw new Error("Decision requires Human Final Authority.");
    }

    const updated: DecisionRecord = {
      ...decision,
      approvedBy,
      status: "approved",
      updatedAt: this.now(),
    };

    this.store.writeJson(`decisions/${updated.id}.json`, updated);
    return updated;
  }

  execute(decisionId: string): DecisionRecord {
    const decision = this.list().find((item) => item.id === decisionId);

    if (!decision) {
      throw new Error(`Decision not found: ${decisionId}`);
    }

    if (decision.status !== "approved") {
      throw new Error("Decision must be approved before execution.");
    }

    const updated: DecisionRecord = {
      ...decision,
      status: "executed",
      updatedAt: this.now(),
    };

    this.store.writeJson(`decisions/${updated.id}.json`, updated);
    return updated;
  }

  list(): DecisionRecord[] {
    return this.store.listJson<DecisionRecord>("decisions");
  }
}