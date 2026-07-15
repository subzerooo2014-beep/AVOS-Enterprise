import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { INDUSTRY_CAPABILITIES } from "./industry-mega-bundle-2.registry";
import {
  IndustryAsset,
  IndustryCode,
  IndustryOperation,
  IndustryRisk,
} from "./industry-mega-bundle-2.types";

@Injectable()
export class IndustryMegaBundle2Service {
  private readonly assets = new Map<string, IndustryAsset>();
  private readonly operations = new Map<string, IndustryOperation>();
  private readonly risks = new Map<string, IndustryRisk>();
  private readonly codeIndex = new Map<string, string>();

  framework() {
    return {
      system: "AVOS Industry Mega Bundle 2",
      industries: Object.keys(INDUSTRY_CAPABILITIES),
      capabilities: structuredClone(INDUSTRY_CAPABILITIES),
      status: "READY",
    };
  }

  createAsset(
    industry: IndustryCode,
    input: Omit<
      IndustryAsset,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const code = `${industry}:${input.code.trim().toUpperCase()}`;

    if (!input.name.trim()) {
      throw new Error("Asset name is required");
    }

    if (this.codeIndex.has(code)) {
      throw new Error(`Duplicate industry asset code: ${code}`);
    }

    const now = new Date().toISOString();

    const asset: IndustryAsset = {
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

    this.assets.set(asset.id, asset);
    this.codeIndex.set(code, asset.id);
    return this.cloneAsset(asset);
  }

  activateAsset(id: string) {
    const asset = this.requireAsset(id);
    asset.status = "ACTIVE";
    asset.updatedAt = new Date().toISOString();
    this.assets.set(id, asset);
    return this.cloneAsset(asset);
  }

  createOperation(
    industry: IndustryCode,
    input: Omit<
      IndustryOperation,
      "id" | "industry" | "status" | "createdAt" | "updatedAt"
    >,
  ) {
    const asset = this.requireAsset(input.assetId);

    if (asset.industry !== industry) {
      throw new Error("Asset industry does not match operation industry");
    }

    const now = new Date().toISOString();

    const operation: IndustryOperation = {
      ...input,
      id: randomUUID(),
      industry,
      status: "PLANNED",
      metadata: { ...input.metadata },
      createdAt: now,
      updatedAt: now,
    };

    this.operations.set(operation.id, operation);
    return this.cloneOperation(operation);
  }

  updateOperationStatus(
    id: string,
    status: IndustryOperation["status"],
  ) {
    const operation = this.requireOperation(id);
    const now = new Date().toISOString();

    operation.status = status;
    operation.updatedAt = now;

    if (status === "ACTIVE" && !operation.startedAt) {
      operation.startedAt = now;
    }

    if (status === "COMPLETED" && !operation.completedAt) {
      operation.completedAt = now;
    }

    this.operations.set(id, operation);
    return this.cloneOperation(operation);
  }

  createRisk(
    input: Omit<IndustryRisk, "id" | "createdAt">,
  ) {
    if (input.score < 0 || input.score > 100) {
      throw new Error("Risk score must be between 0 and 100");
    }

    const risk: IndustryRisk = {
      ...input,
      id: randomUUID(),
      factors: [...input.factors],
      createdAt: new Date().toISOString(),
    };

    this.risks.set(risk.id, risk);
    return this.cloneRisk(risk);
  }

  listAssets(industry?: IndustryCode, tenantId?: string) {
    return Array.from(this.assets.values())
      .filter((item) => !industry || item.industry === industry)
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.cloneAsset(item));
  }

  dashboard(industry?: IndustryCode) {
    const assets = Array.from(this.assets.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const operations = Array.from(this.operations.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    const risks = Array.from(this.risks.values()).filter(
      (item) => !industry || item.industry === industry,
    );

    return {
      industry: industry ?? "ALL",
      assets: assets.length,
      activeAssets: assets.filter((item) => item.status === "ACTIVE").length,
      operations: operations.length,
      activeOperations: operations.filter(
        (item) => item.status === "ACTIVE",
      ).length,
      completedOperations: operations.filter(
        (item) => item.status === "COMPLETED",
      ).length,
      risks: risks.length,
      criticalRisks: risks.filter(
        (item) => item.severity === "CRITICAL",
      ).length,
      averageRiskScore:
        risks.length === 0
          ? 0
          : Number(
              (
                risks.reduce((sum, item) => sum + item.score, 0) /
                risks.length
              ).toFixed(2),
            ),
      generatedAt: new Date().toISOString(),
    };
  }

  private requireAsset(id: string) {
    const asset = this.assets.get(id);
    if (!asset) throw new Error(`Industry asset not found: ${id}`);
    return asset;
  }

  private requireOperation(id: string) {
    const operation = this.operations.get(id);
    if (!operation) {
      throw new Error(`Industry operation not found: ${id}`);
    }
    return operation;
  }

  private cloneAsset(asset: IndustryAsset): IndustryAsset {
    return { ...asset, attributes: { ...asset.attributes } };
  }

  private cloneOperation(
    operation: IndustryOperation,
  ): IndustryOperation {
    return { ...operation, metadata: { ...operation.metadata } };
  }

  private cloneRisk(risk: IndustryRisk): IndustryRisk {
    return { ...risk, factors: [...risk.factors] };
  }
}