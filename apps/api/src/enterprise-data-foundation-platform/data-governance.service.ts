import { Injectable } from "@nestjs/common";
import { DataCatalogService } from "./data-catalog.service";
import { DataLineageService } from "./data-lineage.service";
import { DataQualityService } from "./data-quality.service";

@Injectable()
export class DataGovernanceService {
  constructor(
    private readonly catalog: DataCatalogService,
    private readonly lineage: DataLineageService,
    private readonly quality: DataQualityService,
  ) {}

  validate() {
    const violations: {
      code: string;
      component: string;
      message: string;
    }[] = [];

    for (const asset of this.catalog.list()) {
      if (!asset.owner) {
        violations.push({
          code: "DATA_OWNER_MISSING",
          component: asset.id,
          message: "Data asset owner is missing.",
        });
      }

      if (Object.keys(asset.schema).length === 0) {
        violations.push({
          code: "DATA_SCHEMA_EMPTY",
          component: asset.id,
          message: "Data asset schema is empty.",
        });
      }
    }

    for (const link of this.lineage.list()) {
      if (link.sourceAssetId === link.targetAssetId) {
        violations.push({
          code: "DATA_LINEAGE_SELF_REFERENCE",
          component: link.id,
          message: "Data lineage cannot reference the same source and target.",
        });
      }
    }

    for (const result of this.quality.resultsList()) {
      if (!result.passed) {
        violations.push({
          code: "DATA_QUALITY_CHECK_FAILED",
          component: result.id,
          message: result.message,
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
