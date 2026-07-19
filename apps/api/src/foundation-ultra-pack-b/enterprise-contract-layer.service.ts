import { Injectable } from "@nestjs/common";
import {
  ContractCompatibilityResult,
  ContractRecord,
} from "./foundation-ultra-pack-b.types";
import { FoundationUltraPackBFileStoreService } from "./foundation-ultra-pack-b-file-store.service";

@Injectable()
export class EnterpriseContractLayerService {
  constructor(
    private readonly store: FoundationUltraPackBFileStoreService,
  ) {
    this.seed();
  }

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  private seed(): void {
    if (this.list().length > 0) {
      return;
    }

    this.register({
      kind: "api",
      name: "Foundation Status Contract",
      namespace: "avos.foundation.status",
      version: "1.0.0",
      owner: "AVOS Foundation",
      description: "Canonical status response contract for AVOS foundation modules.",
      schema: {
        type: "object",
        required: ["name", "version", "status"],
        properties: {
          name: { type: "string" },
          version: { type: "string" },
          status: { type: "string" },
        },
      },
      compatibilityMode: "backward",
      lifecycle: "active",
      jurisdictionScope: ["global"],
      policies: ["FOUNDATION_FIRST", "GLOBAL_COMPLIANCE_READINESS_GATE"],
    });

    this.register({
      kind: "event",
      name: "Foundation Certified Event",
      namespace: "avos.foundation.certified",
      version: "1.0.0",
      owner: "AVOS Foundation",
      description: "Published when a foundation pack is certified by Human Final Authority.",
      schema: {
        type: "object",
        required: ["foundation", "version", "score", "approvedBy"],
        properties: {
          foundation: { type: "string" },
          version: { type: "string" },
          score: { type: "number" },
          approvedBy: { type: "string" },
        },
      },
      compatibilityMode: "backward",
      lifecycle: "active",
      jurisdictionScope: ["global"],
      policies: ["HUMAN_FINAL_AUTHORITY"],
    });

    this.register({
      kind: "capability",
      name: "Metadata Registration Capability Contract",
      namespace: "avos.capability.metadata.register",
      version: "1.0.0",
      owner: "AVOS Data Governance",
      description: "Capability contract for registering governed enterprise metadata.",
      schema: {
        input: {
          required: ["assetId", "canonicalName", "owner", "jurisdictionScope"],
        },
        output: {
          required: ["id", "status", "createdAt"],
        },
      },
      compatibilityMode: "full",
      lifecycle: "active",
      jurisdictionScope: ["global"],
      policies: ["CAPABILITY_FIRST", "BLUEPRINT_DRIVEN"],
    });
  }

  register(
    input: Omit<ContractRecord, "id" | "createdAt" | "updatedAt">,
  ): ContractRecord {
    const existing = this.list().find(
      (contract) =>
        contract.namespace === input.namespace &&
        contract.version === input.version,
    );

    if (existing) {
      return existing;
    }

    const timestamp = this.now();
    const record: ContractRecord = {
      ...input,
      id: this.id("contract"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`contracts/${record.id}.json`, record);
    return record;
  }

  list(): ContractRecord[] {
    return this.store
      .listJson<ContractRecord>("contracts")
      .sort((a, b) =>
        `${a.namespace}:${a.version}`.localeCompare(
          `${b.namespace}:${b.version}`,
        ),
      );
  }

  latest(namespace: string): ContractRecord | null {
    const candidates = this.list()
      .filter((contract) => contract.namespace === namespace)
      .sort((a, b) =>
        this.compareVersions(b.version, a.version),
      );

    return candidates[0] ?? null;
  }

  evaluateCompatibility(
    currentContractId: string,
    candidateVersion: string,
    candidateSchema: Record<string, unknown>,
  ): ContractCompatibilityResult {
    const current = this.list().find(
      (contract) => contract.id === currentContractId,
    );

    if (!current) {
      throw new Error(`Contract not found: ${currentContractId}`);
    }

    const breakingChanges: string[] = [];
    const warnings: string[] = [];

    const currentRequired = this.extractRequired(current.schema);
    const candidateRequired = this.extractRequired(candidateSchema);

    for (const field of currentRequired) {
      if (!candidateRequired.includes(field)) {
        breakingChanges.push(
          `Required field removed: ${field}`,
        );
      }
    }

    for (const field of candidateRequired) {
      if (!currentRequired.includes(field)) {
        if (
          current.compatibilityMode === "backward" ||
          current.compatibilityMode === "full"
        ) {
          breakingChanges.push(
            `New required field is not backward compatible: ${field}`,
          );
        } else {
          warnings.push(`New required field added: ${field}`);
        }
      }
    }

    if (
      this.compareVersions(candidateVersion, current.version) < 0
    ) {
      warnings.push(
        "Candidate version is lower than the current contract version.",
      );
    }

    const compatible =
      current.compatibilityMode === "none"
        ? true
        : breakingChanges.length === 0;

    const result: ContractCompatibilityResult = {
      id: this.id("compatibility"),
      currentContractId,
      candidateVersion,
      compatible,
      mode: current.compatibilityMode,
      breakingChanges,
      warnings,
      evaluatedAt: this.now(),
    };

    this.store.writeJson(
      `compatibility/${result.id}.json`,
      result,
    );

    return result;
  }

  listCompatibilityResults(): ContractCompatibilityResult[] {
    return this.store.listJson<ContractCompatibilityResult>(
      "compatibility",
    );
  }

  registerNextVersion(
    currentContractId: string,
    candidateVersion: string,
    candidateSchema: Record<string, unknown>,
  ): {
    compatibility: ContractCompatibilityResult;
    contract?: ContractRecord;
  } {
    const current = this.list().find(
      (contract) => contract.id === currentContractId,
    );

    if (!current) {
      throw new Error(`Contract not found: ${currentContractId}`);
    }

    const compatibility = this.evaluateCompatibility(
      currentContractId,
      candidateVersion,
      candidateSchema,
    );

    if (!compatibility.compatible) {
      return { compatibility };
    }

    const contract = this.register({
      kind: current.kind,
      name: current.name,
      namespace: current.namespace,
      version: candidateVersion,
      owner: current.owner,
      description: current.description,
      schema: candidateSchema,
      compatibilityMode: current.compatibilityMode,
      lifecycle: "active",
      jurisdictionScope: [...current.jurisdictionScope],
      policies: [...current.policies],
    });

    return { compatibility, contract };
  }

  private extractRequired(
    schema: Record<string, unknown>,
  ): string[] {
    const required = schema.required;
    return Array.isArray(required)
      ? required.filter(
          (value): value is string =>
            typeof value === "string",
        )
      : [];
  }

  private compareVersions(
    left: string,
    right: string,
  ): number {
    const parse = (value: string) =>
      value
        .split(".")
        .map((part) => Number.parseInt(part, 10) || 0);

    const a = parse(left);
    const b = parse(right);
    const length = Math.max(a.length, b.length);

    for (let index = 0; index < length; index += 1) {
      const difference = (a[index] ?? 0) - (b[index] ?? 0);
      if (difference !== 0) {
        return difference;
      }
    }

    return 0;
  }
}