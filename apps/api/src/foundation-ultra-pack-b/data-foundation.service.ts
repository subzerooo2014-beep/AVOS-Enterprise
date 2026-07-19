import { Injectable } from "@nestjs/common";
import {
  DataAssetRecord,
  DataLineageEdge,
  DataQualityResult,
  DataQualityRule,
  MasterDataRecord,
} from "./foundation-ultra-pack-b.types";
import { FoundationUltraPackBFileStoreService } from "./foundation-ultra-pack-b-file-store.service";

@Injectable()
export class DataFoundationService {
  constructor(
    private readonly store: FoundationUltraPackBFileStoreService,
  ) {}

  private now(): string {
    return new Date().toISOString();
  }

  private id(prefix: string): string {
    return `${prefix}:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
  }

  registerDataAsset(
    input: Omit<DataAssetRecord, "id" | "createdAt" | "updatedAt">,
  ): DataAssetRecord {
    const timestamp = this.now();
    const record: DataAssetRecord = {
      ...input,
      id: this.id("data-asset"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`data-assets/${record.id}.json`, record);
    return record;
  }

  listDataAssets(): DataAssetRecord[] {
    return this.store.listJson<DataAssetRecord>("data-assets");
  }

  addLineage(
    input: Omit<DataLineageEdge, "id" | "createdAt">,
  ): DataLineageEdge {
    const sourceExists = this.listDataAssets().some(
      (asset) => asset.id === input.fromAssetId,
    );
    const targetExists = this.listDataAssets().some(
      (asset) => asset.id === input.toAssetId,
    );

    if (!sourceExists || !targetExists) {
      throw new Error(
        "Both source and target data assets must exist before lineage is registered.",
      );
    }

    const record: DataLineageEdge = {
      ...input,
      id: this.id("lineage"),
      createdAt: this.now(),
    };

    this.store.writeJson(`lineage/${record.id}.json`, record);
    return record;
  }

  listLineage(): DataLineageEdge[] {
    return this.store.listJson<DataLineageEdge>("lineage");
  }

  createQualityRule(
    input: Omit<DataQualityRule, "id" | "createdAt" | "updatedAt">,
  ): DataQualityRule {
    const assetExists = this.listDataAssets().some(
      (asset) => asset.id === input.dataAssetId,
    );

    if (!assetExists) {
      throw new Error(`Data asset not found: ${input.dataAssetId}`);
    }

    const timestamp = this.now();
    const record: DataQualityRule = {
      ...input,
      id: this.id("quality-rule"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`quality-rules/${record.id}.json`, record);
    return record;
  }

  listQualityRules(): DataQualityRule[] {
    return this.store.listJson<DataQualityRule>("quality-rules");
  }

  evaluateQualityRule(
    ruleId: string,
    observedValue: number,
    evidence: Record<string, unknown> = {},
  ): DataQualityResult {
    const rule = this.listQualityRules().find((item) => item.id === ruleId);

    if (!rule) {
      throw new Error(`Data quality rule not found: ${ruleId}`);
    }

    const boundedObservedValue = Math.max(
      0,
      Math.min(100, observedValue),
    );
    const passed = boundedObservedValue >= rule.threshold;

    const result: DataQualityResult = {
      id: this.id("quality-result"),
      dataAssetId: rule.dataAssetId,
      ruleId: rule.id,
      passed,
      score: boundedObservedValue,
      observedValue: boundedObservedValue,
      threshold: rule.threshold,
      evidence,
      evaluatedAt: this.now(),
    };

    this.store.writeJson(`quality-results/${result.id}.json`, result);
    this.recalculateAssetQuality(rule.dataAssetId);

    return result;
  }

  listQualityResults(): DataQualityResult[] {
    return this.store.listJson<DataQualityResult>("quality-results");
  }

  createMasterRecord(
    input: Omit<MasterDataRecord, "id" | "createdAt" | "updatedAt">,
  ): MasterDataRecord {
    const duplicate = this.listMasterRecords().find(
      (record) =>
        record.entityType === input.entityType &&
        record.canonicalKey === input.canonicalKey &&
        record.status === "active",
    );

    if (duplicate) {
      throw new Error(
        `Active master record already exists for ${input.entityType}:${input.canonicalKey}`,
      );
    }

    const timestamp = this.now();
    const record: MasterDataRecord = {
      ...input,
      id: this.id("master-data"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.store.writeJson(`master-data/${record.id}.json`, record);
    return record;
  }

  listMasterRecords(): MasterDataRecord[] {
    return this.store.listJson<MasterDataRecord>("master-data");
  }

  dataGovernanceStatus(): Record<string, unknown> {
    const assets = this.listDataAssets();
    const qualityResults = this.listQualityResults();

    const averageQuality =
      assets.length === 0
        ? 0
        : Math.round(
            assets.reduce((sum, asset) => sum + asset.qualityScore, 0) /
              assets.length,
          );

    return {
      dataAssets: assets.length,
      lineageEdges: this.listLineage().length,
      qualityRules: this.listQualityRules().length,
      qualityEvaluations: qualityResults.length,
      masterDataRecords: this.listMasterRecords().length,
      averageQualityScore: averageQuality,
      jurisdictionAware: assets.every(
        (asset) => asset.jurisdictionScope.length > 0,
      ),
      retentionGoverned: assets.every(
        (asset) => asset.retentionPolicy.trim().length > 0,
      ),
    };
  }

  private recalculateAssetQuality(dataAssetId: string): void {
    const asset = this.listDataAssets().find(
      (item) => item.id === dataAssetId,
    );

    if (!asset) {
      return;
    }

    const results = this.listQualityResults().filter(
      (result) => result.dataAssetId === dataAssetId,
    );

    if (results.length === 0) {
      return;
    }

    const qualityScore = Math.round(
      results.reduce((sum, result) => sum + result.score, 0) /
        results.length,
    );

    const updated: DataAssetRecord = {
      ...asset,
      qualityScore,
      updatedAt: this.now(),
    };

    this.store.writeJson(`data-assets/${updated.id}.json`, updated);
  }
}